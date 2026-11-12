export function exiger(cle: string): string {
  const valeur = process.env[cle];
  if (!valeur) {
    throw new Error(`Variable d'environnement manquante : ${cle}`);
  }
  return valeur;
}
