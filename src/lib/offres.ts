// Le catalogue vit côté serveur seulement : le navigateur n'envoie jamais un prix.

export type Formule = "une_reception" | "grande_reception";
export type CodeOffre = "une_reception" | "grande_reception" | "carnet";

export interface Offre {
  code: CodeOffre;
  prixCentimes: number;
  creditsFormule: Formule;
  creditsNombre: number;
  /** Dernier instant où un crédit peut servir à envoyer une invitation (ISO, UTC). */
  expireLe: string | null;
  invitesMax: number | null;
}

// Le Carnet vaut jusqu'au 31 janvier 2027 inclus, heure de Paris (UTC+1 en hiver).
export const FIN_CARNET = "2027-01-31T23:00:00.000Z";

export const OFFRES: Record<CodeOffre, Offre> = {
  une_reception: {
    code: "une_reception",
    prixCentimes: 900,
    creditsFormule: "une_reception",
    creditsNombre: 1,
    expireLe: null,
    invitesMax: 30,
  },
  grande_reception: {
    code: "grande_reception",
    prixCentimes: 1900,
    creditsFormule: "grande_reception",
    creditsNombre: 1,
    expireLe: null,
    invitesMax: null,
  },
  carnet: {
    code: "carnet",
    prixCentimes: 2900,
    creditsFormule: "grande_reception",
    creditsNombre: 3,
    expireLe: FIN_CARNET,
    invitesMax: null,
  },
};

export function offreParCode(code: unknown): Offre | null {
  return typeof code === "string" && Object.hasOwn(OFFRES, code) ? OFFRES[code as CodeOffre] : null;
}

export function prixAffiche(centimes: number): string {
  const euros = centimes / 100;
  return `${Number.isInteger(euros) ? euros : euros.toFixed(2).replace(".", ",")} €`;
}
