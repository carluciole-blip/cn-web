import { beforeEach, describe, expect, it } from "vitest";
import { evenementAchat, envoyerWebhook, service, URL_SITE, viderBase } from "./outils";

async function compter(table: string): Promise<number> {
  const { count, error } = await service.from(table).select("*", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

describe("webhook Stripe", () => {
  beforeEach(viderBase);

  it("enregistre l'achat, ses 3 crédits et l'e-mail de confirmation en attente", async () => {
    const reponse = await envoyerWebhook(evenementAchat("cliente@exemple.fr").corps);
    expect(reponse.status).toBe(200);
    expect(await reponse.json()).toEqual({ recu: true, resultat: "achat_enregistre" });

    const { data: achats } = await service.from("purchases").select("*");
    expect(achats).toHaveLength(1);
    expect(achats![0]).toMatchObject({ email: "cliente@exemple.fr", offre: "carnet", montant_centimes: 2900, statut: "paye", host_id: null });
    expect(achats![0].renoncement_retractation_le).not.toBeNull();

    const { data: credits } = await service.from("credits").select("*");
    expect(credits).toHaveLength(3);
    for (const credit of credits!) {
      expect(credit).toMatchObject({ formule: "grande_reception", origine: "achat", purchase_id: achats![0].id, utilise_le: null });
      expect(new Date(credit.expire_le).toISOString()).toBe("2027-01-31T23:00:00.000Z");
    }

    const { data: file } = await service.from("email_log").select("*");
    expect(file).toHaveLength(1);
    expect(file![0]).toMatchObject({ type: "confirmation_achat", statut: "en_attente", priorite: 1, essais: 0 });
  });

  it("ne crée pas de second crédit quand le même événement est rejoué", async () => {
    const { corps } = evenementAchat("rejeu@exemple.fr");
    expect((await envoyerWebhook(corps)).status).toBe(200);
    const rejeu = await envoyerWebhook(corps);
    expect(rejeu.status).toBe(200);
    expect(await rejeu.json()).toEqual({ recu: true, resultat: "deja_recu" });

    expect(await compter("purchases")).toBe(1);
    expect(await compter("credits")).toBe(3);
    expect(await compter("email_log")).toBe(1);
    expect(await compter("stripe_events")).toBe(1);
  });

  it("ne crée rien non plus si la même session arrive sous un autre identifiant d'événement", async () => {
    const { corps } = evenementAchat("double@exemple.fr");
    await envoyerWebhook(corps);
    const autre = JSON.parse(corps);
    autre.id = `${autre.id}_bis`;
    expect((await envoyerWebhook(JSON.stringify(autre))).status).toBe(200);
    expect(await compter("purchases")).toBe(1);
    expect(await compter("credits")).toBe(3);
    expect(await compter("stripe_events")).toBe(2);
  });

  it("refuse une signature fausse ou absente, sans rien enregistrer", async () => {
    const { corps } = evenementAchat("pirate@exemple.fr");
    expect((await envoyerWebhook(corps, "whsec_mauvais_secret")).status).toBe(400);
    const sansSignature = await fetch(`${URL_SITE}/api/stripe/webhook`, { method: "POST", body: corps });
    expect(sansSignature.status).toBe(400);
    expect(await compter("stripe_events")).toBe(0);
    expect(await compter("purchases")).toBe(0);
  });

  it("journalise un événement d'un autre type sans créer d'achat", async () => {
    const corps = JSON.stringify({ id: `evt_autre_${Date.now()}`, object: "event", type: "payment_intent.created", data: { object: {} } });
    const reponse = await envoyerWebhook(corps);
    expect(await reponse.json()).toEqual({ recu: true, resultat: "journalise" });
    expect(await compter("stripe_events")).toBe(1);
    expect(await compter("purchases")).toBe(0);
  });

  it("n'accorde rien pour une session non payée ou une offre inconnue", async () => {
    const nonPayee = await envoyerWebhook(evenementAchat("a@exemple.fr", { payment_status: "unpaid" }).corps);
    expect(await nonPayee.json()).toEqual({ recu: true, resultat: "journalise" });
    const inconnue = await envoyerWebhook(evenementAchat("b@exemple.fr", { metadata: { offre: "cadeau" } }).corps);
    expect(inconnue.status).toBe(500);
    expect(await compter("purchases")).toBe(0);
    expect(await compter("credits")).toBe(0);
  });
});

describe("prévente", () => {
  it("ne crée aucune session de paiement sans la case de renoncement", async () => {
    for (const body of [undefined, new URLSearchParams({ renoncement: "non" })]) {
      const reponse = await fetch(`${URL_SITE}/api/prevente`, { method: "POST", body, redirect: "manual" });
      expect(reponse.status).toBe(303);
      expect(reponse.headers.get("location")).toBe(`${URL_SITE}/conditions-de-vente#retractation`);
    }
  });
});
