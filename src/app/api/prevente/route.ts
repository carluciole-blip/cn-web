import { maison } from "@/config/maison";
import { fr } from "@/messages/fr";
import { OFFRES } from "@/lib/offres";
import { stripe } from "@/lib/stripe";

// Prévente du Carnet des fêtes : crée la session Stripe Checkout et y redirige.
// Le prix vient du catalogue serveur ; le formulaire n'envoie que la case de renoncement.
export async function POST(requete: Request): Promise<Response> {
  const formulaire = await requete.formData().catch(() => null);
  if (formulaire?.get("renoncement") !== "oui") {
    return Response.redirect(`${maison.siteUrl}/conditions-de-vente#retractation`, 303);
  }

  const offre = OFFRES.carnet;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: offre.prixCentimes,
            product_data: {
              name: `${fr.accueil.formules.carnet.nom}, ${maison.nom}`,
              description: fr.accueil.formules.carnet.contenu.slice(0, 2).join(". "),
            },
          },
        },
      ],
      allow_promotion_codes: true,
      metadata: {
        offre: offre.code,
        renoncement_retractation_le: new Date().toISOString(),
      },
      success_url: `${maison.siteUrl}/merci`,
      cancel_url: `${maison.siteUrl}/#carnet`,
    });
    if (!session.url) throw new Error("session sans adresse");
    return Response.redirect(session.url, 303);
  } catch (erreur) {
    console.error("prévente : création de la session impossible,", (erreur as { type?: string }).type ?? "erreur");
    return new Response("Le paiement est momentanément indisponible. Merci de réessayer dans un instant.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
