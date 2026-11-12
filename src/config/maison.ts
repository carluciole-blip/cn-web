// Identité de la Maison et informations légales.
// Ce qui n'est pas encore connu vient de l'environnement ; tant qu'une valeur manque,
// la page l'affiche entre crochets pour qu'on ne puisse pas l'oublier.

function info(cle: string, libelle: string): string {
  const valeur = process.env[cle]?.trim();
  return valeur ? valeur : `[à compléter : ${libelle}]`;
}

export const maison = {
  nom: "Château Nerval",
  produit: "Les invitations de Château Nerval",
  devise: "ORGANISER · ANTICIPER · ENTRETENIR · SE RETROUVER",
  get siteUrl() {
    return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  },
  get emailContact() {
    return info("EMAIL_CONTACT", "e-mail de contact");
  },
  get dateOuverture() {
    return info("DATE_OUVERTURE", "date d'ouverture");
  },
  get raisonSociale() {
    return info("RAISON_SOCIALE", "raison sociale");
  },
  get siret() {
    return info("SIRET", "SIRET");
  },
  get adresse() {
    return info("ADRESSE", "adresse du siège");
  },
  get mentionTva() {
    return info("MENTION_TVA", "mention de TVA selon le statut de l'entreprise");
  },
};

export function valeursManquantes(): string[] {
  return ["SITE_URL", "EMAIL_CONTACT", "EMAIL_ADMIN", "DATE_OUVERTURE", "RAISON_SOCIALE", "SIRET", "ADRESSE", "MENTION_TVA"].filter(
    (cle) => !process.env[cle]?.trim(),
  );
}
