import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function env(cle: string): string {
  const valeur = process.env[cle];
  if (!valeur) throw new Error(`${cle} manquante : lancer les tests par « npm test »`);
  return valeur;
}

export const URL_SITE = env("SITE_URL");
export const MAILPIT = env("MAILPIT_URL");

export const service = createClient(env("SUPABASE_URL"), env("SUPABASE_SECRET_KEY"), { auth: { persistSession: false } });
export const anonyme = createClient(env("SUPABASE_URL"), env("SUPABASE_PUBLISHABLE_KEY"), { auth: { persistSession: false } });

export async function viderBase(): Promise<void> {
  for (const [table, colonne] of [["email_log", "id"], ["credits", "id"], ["purchases", "id"], ["stripe_events", "id"]] as const) {
    const { error } = await service.from(table).delete().not(colonne, "is", null);
    if (error) throw new Error(`vidage de ${table} : ${error.message}`);
  }
  await fetch(`${MAILPIT}/api/v1/messages`, { method: "DELETE" });
}

interface Courrier {
  To: { Address: string }[];
  Subject: string;
  ID: string;
}

export async function courriers(): Promise<Courrier[]> {
  const reponse = await fetch(`${MAILPIT}/api/v1/messages`);
  return ((await reponse.json()) as { messages: Courrier[] }).messages;
}

export async function texteDuCourrier(id: string): Promise<string> {
  const reponse = await fetch(`${MAILPIT}/api/v1/message/${id}`);
  return ((await reponse.json()) as { Text: string }).Text;
}

let compteur = 0;

/** Un événement « checkout.session.completed » tel que Stripe l'envoie, pour le Carnet des fêtes. */
export function evenementAchat(email: string, surcharge: Record<string, unknown> = {}): { id: string; corps: string } {
  compteur += 1;
  const suffixe = `${Date.now()}_${compteur}`;
  const id = `evt_test_${suffixe}`;
  const corps = JSON.stringify({
    id,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_test_${suffixe}`,
        object: "checkout.session",
        payment_status: "paid",
        payment_intent: `pi_test_${suffixe}`,
        amount_total: 2900,
        currency: "eur",
        customer_details: { email },
        metadata: { offre: "carnet", renoncement_retractation_le: new Date().toISOString() },
        ...surcharge,
      },
    },
  });
  return { id, corps };
}

/** Envoie un corps signé avec le secret de test à la vraie route du webhook. */
export async function envoyerWebhook(corps: string, secret = env("STRIPE_WEBHOOK_SECRET")): Promise<Response> {
  const signature = new Stripe("sk_test_factice").webhooks.generateTestHeaderString({ payload: corps, secret });
  return fetch(`${URL_SITE}/api/stripe/webhook`, {
    method: "POST",
    headers: { "content-type": "application/json", "stripe-signature": signature },
    body: corps,
  });
}

export async function viderFileParLaRoute(): Promise<Response> {
  return fetch(`${URL_SITE}/api/taches/emails`, {
    method: "POST",
    headers: { authorization: `Bearer ${env("CRON_SECRET")}` },
  });
}
