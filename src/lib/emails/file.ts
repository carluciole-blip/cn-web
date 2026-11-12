import nodemailer, { type Transporter } from "nodemailer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { exiger } from "@/lib/env";
import { supabaseService } from "@/lib/supabase-service";
import { confirmationAchat, type Message } from "./messages";

// Aucun e-mail ne part directement : chaque envoi est une ligne « en attente » de email_log,
// vidée ici dans la limite du quota du jour. Les journaux ne contiennent ni adresse ni contenu.

interface LigneEmail {
  id: number;
  type: "confirmation_achat" | "invitation" | "relance" | "rappel" | "remerciement";
  purchase_id: string | null;
}

export interface BilanFile {
  reserves: number;
  envoyes: number;
  echecs: number;
}

export function quotaDuJour(): number {
  const quota = Number.parseInt(process.env.EMAIL_QUOTA_JOUR ?? "300", 10);
  return Number.isFinite(quota) && quota >= 0 ? quota : 300;
}

export function transportSmtp(): Transporter {
  const port = Number.parseInt(exiger("SMTP_PORT"), 10);
  const user = process.env.SMTP_USER;
  return nodemailer.createTransport({
    host: exiger("SMTP_HOST"),
    port,
    secure: port === 465,
    auth: user ? { user, pass: exiger("SMTP_PASS") } : undefined,
  });
}

async function construire(db: SupabaseClient, ligne: LigneEmail): Promise<Message> {
  if (ligne.type === "confirmation_achat" && ligne.purchase_id) {
    const { data, error } = await db.from("purchases").select("id, email").eq("id", ligne.purchase_id).single();
    if (error || !data) throw new Error("achat introuvable");
    return confirmationAchat(data);
  }
  throw new Error(`type d'e-mail non pris en charge : ${ligne.type}`);
}

export async function viderFile(options: {
  quota?: number;
  lot?: number;
  db?: SupabaseClient;
  transport?: Pick<Transporter, "sendMail">;
} = {}): Promise<BilanFile> {
  const db = options.db ?? supabaseService();
  const { data, error } = await db.rpc("reserver_emails", {
    p_quota: options.quota ?? quotaDuJour(),
    p_lot: options.lot ?? 20,
  });
  if (error) throw new Error(`réservation de la file impossible : ${error.code}`);

  const lignes = (data ?? []) as LigneEmail[];
  const bilan: BilanFile = { reserves: lignes.length, envoyes: 0, echecs: 0 };
  if (lignes.length === 0) return bilan;

  const transport = options.transport ?? transportSmtp();
  const expediteur = exiger("EMAIL_EXPEDITEUR");

  for (const ligne of lignes) {
    let succes = false;
    try {
      const message = await construire(db, ligne);
      await transport.sendMail({
        from: expediteur,
        to: message.a,
        subject: message.sujet,
        text: message.texte,
        html: message.html,
      });
      succes = true;
      bilan.envoyes += 1;
    } catch (erreur) {
      bilan.echecs += 1;
      const code = (erreur as { code?: string; responseCode?: number }).code ?? (erreur as { responseCode?: number }).responseCode ?? "inconnu";
      console.error(`email_log ${ligne.id} (${ligne.type}) : envoi en échec, code ${code}`);
    }
    const { error: erreurMarque } = await db.rpc("marquer_email", { p_id: ligne.id, p_succes: succes });
    if (erreurMarque) console.error(`email_log ${ligne.id} : marquage impossible, code ${erreurMarque.code}`);
  }
  return bilan;
}
