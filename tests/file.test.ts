import { beforeEach, describe, expect, it } from "vitest";
import { viderFile } from "@/lib/emails/file";
import { courriers, evenementAchat, envoyerWebhook, service, texteDuCourrier, URL_SITE, viderBase, viderFileParLaRoute } from "./outils";

async function acheter(...emails: string[]): Promise<void> {
  for (const email of emails) {
    const reponse = await envoyerWebhook(evenementAchat(email).corps);
    expect(reponse.status).toBe(200);
  }
}

async function statuts(): Promise<Record<string, number>> {
  const { data } = await service.from("email_log").select("statut");
  const bilan: Record<string, number> = {};
  for (const ligne of data ?? []) bilan[ligne.statut] = (bilan[ligne.statut] ?? 0) + 1;
  return bilan;
}

/** Fait comme si les e-mails déjà envoyés l'avaient été hier. */
async function passerAuLendemain(): Promise<void> {
  const { data } = await service.from("email_log").select("id, envoye_le").eq("statut", "envoye");
  for (const ligne of data ?? []) {
    const hier = new Date(new Date(ligne.envoye_le).getTime() - 24 * 3600 * 1000).toISOString();
    await service.from("email_log").update({ envoye_le: hier }).eq("id", ligne.id);
  }
}

describe("file d'attente des e-mails", () => {
  beforeEach(viderBase);

  it("J1 : après un paiement, l'e-mail de confirmation part par la tâche programmée", async () => {
    await acheter("fondatrice@exemple.fr");
    expect(await courriers()).toHaveLength(0);

    const reponse = await viderFileParLaRoute();
    expect(reponse.status).toBe(200);
    expect(await reponse.json()).toEqual({ reserves: 1, envoyes: 1, echecs: 0 });

    const recus = await courriers();
    expect(recus).toHaveLength(1);
    expect(recus[0].To[0].Address).toBe("fondatrice@exemple.fr");
    expect(recus[0].Subject).toBe("Vos trois réceptions vous attendent");
    expect(await texteDuCourrier(recus[0].ID)).toContain("/rattacher/");
    expect(await statuts()).toEqual({ envoye: 1 });
  });

  it("n'envoie pas deux fois le même e-mail", async () => {
    await acheter("une-fois@exemple.fr");
    await viderFileParLaRoute();
    const second = await viderFileParLaRoute();
    expect(await second.json()).toEqual({ reserves: 0, envoyes: 0, echecs: 0 });
    expect(await courriers()).toHaveLength(1);
  });

  it("refuse la tâche sans le secret", async () => {
    await acheter("secret@exemple.fr");
    expect((await fetch(`${URL_SITE}/api/taches/emails`, { method: "POST" })).status).toBe(401);
    const mauvais = await fetch(`${URL_SITE}/api/taches/emails`, { method: "POST", headers: { authorization: "Bearer faux" } });
    expect(mauvais.status).toBe(401);
    expect(await courriers()).toHaveLength(0);
  });

  it("au-delà du quota du jour, les e-mails attendent, partent le lendemain, et aucun ne part deux fois", async () => {
    await acheter("a@exemple.fr", "b@exemple.fr", "c@exemple.fr", "d@exemple.fr", "e@exemple.fr");

    expect(await viderFile({ quota: 2 })).toEqual({ reserves: 2, envoyes: 2, echecs: 0 });
    expect(await viderFile({ quota: 2 })).toEqual({ reserves: 0, envoyes: 0, echecs: 0 });
    expect(await statuts()).toEqual({ envoye: 2, en_attente: 3 });
    expect(await courriers()).toHaveLength(2);

    await passerAuLendemain();
    expect(await viderFile({ quota: 2 })).toEqual({ reserves: 2, envoyes: 2, echecs: 0 });
    await passerAuLendemain();
    expect(await viderFile({ quota: 2 })).toEqual({ reserves: 1, envoyes: 1, echecs: 0 });

    const adresses = (await courriers()).map((courrier) => courrier.To[0].Address).sort();
    expect(adresses).toEqual(["a@exemple.fr", "b@exemple.fr", "c@exemple.fr", "d@exemple.fr", "e@exemple.fr"]);
    expect(await statuts()).toEqual({ envoye: 5 });
  });

  it("réessaie un envoi en échec, puis abandonne après 5 essais", async () => {
    await acheter("panne@exemple.fr");
    const enPanne = { sendMail: async () => { throw Object.assign(new Error("panne"), { code: "ECONNREFUSED" }); } };

    for (let essai = 1; essai <= 5; essai += 1) {
      expect(await viderFile({ transport: enPanne })).toEqual({ reserves: 1, envoyes: 0, echecs: 1 });
      const { data } = await service.from("email_log").select("statut, essais, prochain_essai_le").single();
      expect(data!.essais).toBe(essai);
      expect(data!.statut).toBe(essai < 5 ? "en_attente" : "echec");
      if (essai < 5) {
        expect(new Date(data!.prochain_essai_le).getTime()).toBeGreaterThan(Date.now());
        expect(await viderFile({ transport: enPanne })).toEqual({ reserves: 0, envoyes: 0, echecs: 0 });
        await service.from("email_log").update({ prochain_essai_le: new Date().toISOString() }).not("id", "is", null);
      }
    }
    expect(await viderFile()).toEqual({ reserves: 0, envoyes: 0, echecs: 0 });
    expect(await courriers()).toHaveLength(0);
  });
});
