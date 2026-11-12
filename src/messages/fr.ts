// Tous les textes de l'interface et des e-mails. Pour ajouter l'anglais : copier ce fichier
// en en.ts, traduire, et choisir le dictionnaire selon la langue.

export const fr = {
  commun: {
    retourAccueil: "Retour à l'accueil",
    mentionsLegales: "Mentions légales",
    confidentialite: "Confidentialité",
    conditionsDeVente: "Conditions de vente",
    contact: "Contact",
    aller: "Aller au contenu",
  },
  accueil: {
    surtitre: "Les invitations",
    promesse: "De belles invitations pour vos réceptions.",
    promesseSuite: "Vos invités répondent en un geste, vous savez qui vient.",
    boutonPrincipal: "Créer mon invitation, c'est gratuit",
    ouverture: (date: string) => `Ouverture le ${date}. D'ici là, le Carnet des fêtes se réserve ci-dessous.`,
    boutonPrevente: "Réserver le Carnet des fêtes",
    exemple: {
      legende: "Exemple d'invitation",
      surtitre: "Dîner d'hiver",
      hote: "Camille vous invite",
      titre: "Un dîner au coin du feu",
      date: "Samedi 12 décembre, 20 heures",
      lieu: "12, rue des Tilleuls, Annecy",
      mot: "Venez comme vous êtes, la Maison s'occupe du reste.",
      reponses: ["Je viens", "Peut-être", "Je ne viens pas"],
    },
    avantagesTitre: "Recevoir, simplement",
    avantages: [
      {
        titre: "Belle comme un carton",
        texte: "Une page sobre, à votre nom, qui se lit aussi bien sur un téléphone que sur un papier épais.",
      },
      {
        titre: "Vos invités répondent en un geste, sans compte",
        texte: "Un lien personnel, trois réponses possibles, un mot pour vous. Rien à installer, rien à créer.",
      },
      {
        titre: "Vous savez qui vient, ce que chacun vous a écrit, et on rappelle la veille",
        texte: "Un tableau clair, le nombre de couverts, et un rappel envoyé la veille aux personnes qui viennent.",
      },
    ],
    formulesTitre: "Les formules",
    formulesIntro: "Préparer une invitation et voir son aperçu est gratuit. Le paiement se fait une fois, au moment de l'envoyer.",
    formules: {
      une_reception: {
        nom: "Une réception",
        contenu: ["Jusqu'à 30 invités", "Réponses et mots de vos invités", "Export de la liste", "Rappel la veille"],
      },
      grande_reception: {
        nom: "Grande réception",
        contenu: ["Invités sans limite", "Export de la liste", "Rappel la veille", "Mot de remerciement le lendemain"],
      },
      carnet: {
        nom: "Carnet des fêtes",
        contenu: ["3 Grandes réceptions", "Pour des invitations envoyées jusqu'au 31 janvier 2027", "Disponible dès aujourd'hui, en prévente"],
      },
    },
    ttc: "TTC, paiement unique",
    prevente: {
      titre: "Le Carnet des fêtes, en prévente",
      texte: (date: string) =>
        `Trois Grandes réceptions pour la saison : un dîner, un réveillon, une galette. Vos trois crédits vous attendent à l'ouverture, le ${date}, sur le compte créé avec l'adresse e-mail de votre paiement.`,
      renoncement:
        "Je demande que mes crédits soient disponibles dès l'ouverture, et je renonce pour cela à mon droit de rétractation de 14 jours.",
      renoncementAide: "Un crédit non utilisé reste remboursable sur simple demande, voir les conditions de vente.",
      bouton: (prix: string) => `Réserver le Carnet, ${prix}`,
      paiement: "Paiement sécurisé par Stripe. Aucun abonnement.",
    },
    faqTitre: "Questions fréquentes",
    faq: [
      {
        q: "Mes invités doivent-ils créer un compte ?",
        r: "Non. Chaque personne reçoit un lien personnel et répond en un geste. Elle peut revenir modifier sa réponse avec le même lien, jusqu'à la date limite que vous fixez.",
      },
      {
        q: "Que devient la réponse de mes invités ?",
        r: "Vous seul la lisez. Un mois après la réception, les noms, les adresses e-mail, les réponses et les mots sont effacés. Seuls des compteurs anonymes restent.",
      },
      {
        q: "Puis-je envoyer l'invitation par WhatsApp ou par SMS ?",
        r: "Oui. Après l'envoi, vous obtenez un lien par personne, à copier dans la messagerie de votre choix, depuis votre propre téléphone. La Maison n'envoie aucun SMS.",
      },
      {
        q: "Quand dois-je payer ?",
        r: "Au moment d'envoyer. Préparer l'invitation, choisir un modèle et voir l'aperçu exact ne coûte rien.",
      },
      {
        q: "Que se passe-t-il si j'invite plus de 30 personnes ?",
        r: "Rien n'est bloqué pendant la préparation. Au moment de payer, la Grande réception vous est proposée. Si vous ajoutez une 31e personne après l'envoi, vous réglez seulement la différence.",
      },
      {
        q: "Utilisez-vous des cookies publicitaires ou des outils de suivi ?",
        r: "Non. Le site ne contient aucun traceur, aucune publicité et aucune police chargée ailleurs. Il n'y a donc pas de bandeau à accepter.",
      },
    ],
  },
  merci: {
    titre: "Merci, votre Carnet est réservé",
    texte: (date: string) =>
      `Un e-mail de confirmation part vers l'adresse de votre paiement. Vos trois Grandes réceptions vous attendent à l'ouverture, le ${date}.`,
    aide: "Si le message n'arrive pas dans l'heure, regardez vos courriers indésirables, puis écrivez à la Maison.",
  },
  rattacher: {
    titre: "Votre Carnet vous attend",
    texte: (date: string) =>
      `Ce lien servira à rattacher votre Carnet des fêtes à votre compte. Il sera actif à l'ouverture, le ${date}. Gardez l'e-mail qui le contient.`,
  },
  emails: {
    signature: "La Maison",
    confirmationAchat: {
      sujet: "Vos trois réceptions vous attendent",
      titre: "Votre Carnet des fêtes est réservé",
      corps: (date: string) => [
        "La Maison a bien reçu votre paiement. Merci de votre confiance.",
        `Vos trois Grandes réceptions vous attendent. Ouverture le ${date}.`,
        "Ce jour-là, créez votre compte avec l'adresse e-mail de ce message : vos crédits y seront déjà. Ils valent pour des invitations envoyées jusqu'au 31 janvier 2027.",
      ],
      autreAdresse: "Vous préférez un compte à une autre adresse ? Ce lien, à usage unique, y rattachera votre Carnet à l'ouverture :",
      pourquoi: "Vous recevez ce message parce qu'un Carnet des fêtes a été acheté avec cette adresse.",
    },
  },
};

export type Messages = typeof fr;
