import { maison } from "@/config/maison";

// Textes des pages légales. Les passages marqués « aValider » doivent être relus par la
// fondatrice ou son conseil avant l'ouverture : ils s'affichent avec un repère visible
// tant que AFFICHER_REPERES_JURIDIQUES n'est pas mis à "non".

export interface Section {
  id?: string;
  titre: string;
  paragraphes?: string[];
  liste?: string[];
  aValider?: string;
}

export interface PageLegale {
  titre: string;
  sections: Section[];
}

export function mentionsLegales(): PageLegale {
  return {
    titre: "Mentions légales",
    sections: [
      {
        titre: "L'éditeur",
        paragraphes: [
          `${maison.produit} est un service édité par ${maison.raisonSociale}, SIRET ${maison.siret}, dont le siège est situé ${maison.adresse}.`,
          `Contact : ${maison.emailContact}.`,
          `Direction de la publication : ${process.env.DIRECTION_PUBLICATION?.trim() || "[à compléter : nom de la personne responsable de la publication]"}.`,
        ],
      },
      {
        titre: "L'hébergeur",
        paragraphes: [
          `Le site est hébergé par ${process.env.HEBERGEUR_MENTION?.trim() || "Netlify, Inc. [à compléter : adresse et contact de l'hébergeur, à lire sur son site]"}.`,
          "La base de données est hébergée par Supabase, dans une région de l'Union européenne.",
        ],
      },
      {
        titre: "Propriété intellectuelle",
        paragraphes: [
          "Les textes, les modèles d'invitation et l'identité de la Maison sont protégés. Les textes et les listes que vous saisissez restent les vôtres.",
        ],
      },
    ],
  };
}

export function confidentialite(): PageLegale {
  return {
    titre: "Politique de confidentialité",
    sections: [
      {
        titre: "L'essentiel",
        paragraphes: [
          "La Maison collecte le moins possible, ne revend rien et n'utilise aucun traceur : ni mesure d'audience tierce, ni pixel, ni publicité, ni police chargée depuis un autre serveur. Le site ne dépose aucun cookie non essentiel ; il n'y a donc pas de bandeau à accepter.",
        ],
      },
      {
        titre: "Les données et leur usage",
        liste: [
          "Votre compte : votre adresse e-mail, pour vous connecter par un lien envoyé par e-mail.",
          "Vos réceptions : titre, date, lieu, mot d'accueil, pour composer l'invitation.",
          "Vos invités : prénom, nom et adresse e-mail si vous les indiquez, pour leur adresser l'invitation et le rappel de la veille.",
          "Leurs réponses : présence, nombre de personnes et mot libre. Vous seul les lisez.",
          "Vos achats : adresse e-mail, montant, date et référence du paiement. Les données de carte sont traitées par Stripe ; la Maison ne les voit jamais.",
        ],
      },
      {
        titre: "Les durées de conservation",
        paragraphes: [
          "Trente jours après la date de la réception, les prénoms, noms, adresses e-mail, réponses et mots des invités sont effacés automatiquement. Seuls des compteurs anonymes restent (nombre d'invités, nombre de réponses).",
          "Vous pouvez supprimer votre compte à tout moment : vos réceptions, vos invités et leurs réponses sont alors effacés tout de suite. Vos achats sont conservés, détachés de votre compte, pour la durée imposée par les obligations comptables.",
        ],
        aValider: "Durée de conservation comptable des achats à confirmer (dix ans en règle générale).",
      },
      {
        titre: "Le lien personnel des invités",
        paragraphes: [
          "Chaque invité reçoit un lien personnel qui tient lieu de clé. La Maison n'en garde qu'une empreinte. Ce lien apparaît toutefois dans les journaux techniques de l'hébergeur, comme toute adresse de page consultée.",
        ],
        aValider: "Durée de conservation des journaux d'accès à lire chez l'hébergeur, puis à écrire ici.",
      },
      {
        titre: "Les sous-traitants",
        liste: [
          "Supabase : base de données et connexion, région de l'Union européenne.",
          "Stripe : paiement.",
          "Brevo : envoi des e-mails.",
          "Netlify : hébergement du site.",
        ],
        aValider: "Préciser pour chaque sous-traitant le pays et le cadre des transferts hors Union européenne.",
      },
      {
        titre: "Vos droits",
        paragraphes: [
          `Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, ou vous opposer à leur traitement en écrivant à ${maison.emailContact}. La Maison répond sous un mois. Vous pouvez aussi saisir la CNIL.`,
          "Un invité peut à tout moment demander à ne plus recevoir d'e-mail pour une réception, par le lien présent dans chaque message.",
        ],
      },
    ],
  };
}

export function conditionsDeVente(): PageLegale {
  return {
    titre: "Conditions de vente",
    sections: [
      {
        titre: "Le service",
        paragraphes: [
          `${maison.produit} permet de composer une invitation, de l'envoyer et de recevoir les réponses. Le vendeur est ${maison.raisonSociale}, SIRET ${maison.siret}, ${maison.adresse}.`,
        ],
      },
      {
        titre: "Les prix",
        paragraphes: [
          "Une réception : 9 € TTC. Grande réception : 19 € TTC. Carnet des fêtes : 29 € TTC pour trois Grandes réceptions.",
          maison.mentionTva,
          "Le paiement est unique, par carte, sur la page sécurisée de Stripe. Il n'y a aucun abonnement.",
        ],
        aValider: "Mention de TVA à écrire selon le statut de l'entreprise.",
      },
      {
        titre: "Les crédits",
        paragraphes: [
          "Un achat donne des crédits. Envoyer une invitation consomme un crédit. Les crédits du Carnet des fêtes valent pour des invitations envoyées jusqu'au 31 janvier 2027 inclus : c'est la date d'envoi qui compte, pas la date de la réception.",
        ],
      },
      {
        id: "retractation",
        titre: "Le droit de rétractation",
        paragraphes: [
          "Vous disposez en principe de quatorze jours pour vous rétracter d'un achat en ligne. Le service étant un contenu numérique fourni sans délai, il vous est demandé, avant de payer, de cocher une case par laquelle vous demandez l'exécution immédiate et renoncez à ce droit. Cette case n'est jamais cochée d'avance.",
          `Au-delà de ce que prévoit la loi, la Maison rembourse sur simple demande tout crédit non utilisé : écrivez à ${maison.emailContact}. Pour un Carnet entamé, le remboursement est d'un tiers du prix par crédit restant.`,
        ],
        aValider: "Rédaction du renoncement et règle de remboursement au prorata à faire valider.",
      },
      {
        titre: "Réclamations",
        paragraphes: [
          `Pour toute question : ${maison.emailContact}. À défaut d'accord, vous pouvez recourir gratuitement à un médiateur de la consommation.`,
        ],
        aValider: "Nom et coordonnées du médiateur de la consommation à indiquer.",
      },
    ],
  };
}
