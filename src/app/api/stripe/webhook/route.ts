import type Stripe from "stripe";
import { exiger } from "@/lib/env";
import { offreParCode } from "@/lib/offres";
import { stripe } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabase-service";

// Seule source de vérité des paiements. Signature vérifiée sur le corps brut,
// traitement idempotent par la table stripe_events, chaque événement journalisé.

function achatDepuisSession(session: Stripe.Checkout.Session): Record<string, unknown> | null | "invalide" {
  if (session.payment_status !== "paid") return null;
  const offre = offreParCode(session.metadata?.offre);
  const email = session.customer_details?.email;
  if (!offre || !email || session.amount_total === null) return "invalide";
  return {
    session_id: session.id,
    payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
    email,
    offre: offre.code,
    montant_centimes: session.amount_total,
    devise: session.currency ?? "eur",
    credits_formule: offre.creditsFormule,
    credits_nombre: offre.creditsNombre,
    expire_le: offre.expireLe,
    renoncement_retractation_le: session.metadata?.renoncement_retractation_le ?? null,
  };
}

export async function POST(requete: Request): Promise<Response> {
  const signature = requete.headers.get("stripe-signature");
  const corps = await requete.text();
  if (!signature) return new Response("Signature absente", { status: 400 });

  let evenement: Stripe.Event;
  try {
    evenement = stripe().webhooks.constructEvent(corps, signature, exiger("STRIPE_WEBHOOK_SECRET"));
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  let achat: Record<string, unknown> | null = null;
  if (evenement.type === "checkout.session.completed" || evenement.type === "checkout.session.async_payment_succeeded") {
    const resultat = achatDepuisSession(evenement.data.object);
    if (resultat === "invalide") {
      // Rien n'est journalisé : Stripe réessaiera et l'anomalie reste visible dans son tableau de bord.
      console.error(`stripe ${evenement.id} : session payée sans offre connue ou sans e-mail`);
      return new Response("Session inexploitable", { status: 500 });
    }
    achat = resultat;
  }

  const { data, error } = await supabaseService().rpc("traiter_evenement_stripe", {
    p_event_id: evenement.id,
    p_type: evenement.type,
    p_achat: achat,
  });
  if (error) {
    console.error(`stripe ${evenement.id} : enregistrement impossible, code ${error.code}`);
    return new Response("Erreur", { status: 500 });
  }
  return Response.json({ recu: true, resultat: data });
}
