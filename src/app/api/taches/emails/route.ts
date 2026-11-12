import { egalEnTempsConstant } from "@/lib/jetons";
import { viderFile } from "@/lib/emails/file";

// Appelée par la tâche programmée de l'hébergeur (netlify/functions/vider-file.mts).
export async function POST(requete: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  const recu = requete.headers.get("authorization") ?? "";
  if (!secret || !egalEnTempsConstant(recu, `Bearer ${secret}`)) {
    return new Response("Non autorisé", { status: 401 });
  }
  try {
    return Response.json(await viderFile());
  } catch (erreur) {
    console.error("file des e-mails :", (erreur as Error).message);
    return new Response("Erreur", { status: 500 });
  }
}
