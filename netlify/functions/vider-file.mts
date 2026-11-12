// Tâche programmée : toutes les 5 minutes, demande au site de vider la file des e-mails.
// Les tâches programmées de Netlify ne tournent que sur le déploiement publié, en UTC,
// et sont limitées à 30 secondes : la route envoie donc un petit lot à chaque passage.

declare const Netlify: { env: { get(cle: string): string | undefined } };

export default async (): Promise<void> => {
  const site = Netlify.env.get("SITE_URL") ?? Netlify.env.get("URL");
  const secret = Netlify.env.get("CRON_SECRET");
  if (!site || !secret) {
    console.error("vider-file : SITE_URL ou CRON_SECRET manquant");
    return;
  }
  const reponse = await fetch(`${site}/api/taches/emails`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}` },
  });
  console.log(`vider-file : ${reponse.status} ${reponse.ok ? await reponse.text() : ""}`);
};

export const config = {
  schedule: "*/5 * * * *",
};
