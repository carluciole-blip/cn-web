import { createHmac, timingSafeEqual } from "node:crypto";
import { exiger } from "./env";

// Les jetons se dérivent d'un secret serveur : rien n'est gardé en base.
function signer(usage: string, identifiant: string): string {
  return createHmac("sha256", exiger("JETON_SECRET")).update(`${usage}:${identifiant}`).digest("base64url");
}

export function egalEnTempsConstant(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Lien de rattachement d'une prévente : identifiant de l'achat et signature de 256 bits. */
export function jetonRattachement(achatId: string): string {
  return `${achatId}.${signer("rattachement", achatId)}`;
}

export function lireJetonRattachement(jeton: string): string | null {
  const [achatId, signature, ...reste] = jeton.split(".");
  if (!achatId || !signature || reste.length > 0) return null;
  return egalEnTempsConstant(signature, signer("rattachement", achatId)) ? achatId : null;
}
