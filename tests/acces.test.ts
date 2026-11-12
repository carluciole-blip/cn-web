import { beforeAll, describe, expect, it } from "vitest";
import { anonyme, evenementAchat, envoyerWebhook, service, viderBase } from "./outils";

// Règle d'accès n° 2 : le rôle anonyme n'a accès à aucune table ni à aucune fonction de service.
describe("rôle anonyme", () => {
  beforeAll(async () => {
    await viderBase();
    const reponse = await envoyerWebhook(evenementAchat("acces@exemple.fr").corps);
    expect(reponse.status).toBe(200);
  });

  it.each(["purchases", "credits", "stripe_events", "email_log"])("ne lit pas %s", async (table) => {
    const { count } = await service.from(table).select("*", { count: "exact", head: true });
    expect(count).toBeGreaterThan(0);
    const { data, error } = await anonyme.from(table).select("*");
    expect(data ?? []).toEqual([]);
    expect(error).not.toBeNull();
  });

  it.each(["purchases", "credits", "stripe_events", "email_log"])("n'écrit pas dans %s", async (table) => {
    const { error } = await anonyme.from(table).delete().not("id", "is", null);
    expect(error).not.toBeNull();
  });

  it("n'appelle aucune fonction de service", async () => {
    const achat = await anonyme.rpc("traiter_evenement_stripe", { p_event_id: "evt_pirate", p_type: "x", p_achat: null });
    expect(achat.error).not.toBeNull();
    const file = await anonyme.rpc("reserver_emails", { p_quota: 100, p_lot: 100 });
    expect(file.error).not.toBeNull();
    const marque = await anonyme.rpc("marquer_email", { p_id: 1, p_succes: true });
    expect(marque.error).not.toBeNull();
    const { count } = await service.from("stripe_events").select("*", { count: "exact", head: true }).eq("id", "evt_pirate");
    expect(count).toBe(0);
  });
});
