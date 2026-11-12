import { fr } from "@/messages/fr";
import { maison } from "@/config/maison";
import { jetonRattachement } from "@/lib/jetons";

export interface Message {
  a: string;
  sujet: string;
  texte: string;
  html: string;
}

export function echapper(texte: string): string {
  return texte
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

interface Bloc {
  titre: string;
  paragraphes: string[];
  lien?: { intro: string; url: string };
  pied: string;
}

function mettreEnPage({ titre, paragraphes, lien, pied }: Bloc): { texte: string; html: string } {
  const signature = `${fr.emails.signature}\n${maison.nom}`;
  const texte = [
    titre,
    ...paragraphes,
    ...(lien ? [`${lien.intro}\n${lien.url}`] : []),
    signature,
    pied,
  ].join("\n\n");

  const p = (contenu: string, style = "") =>
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3B2B20;${style}">${contenu}</p>`;
  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;background:#F4ECE4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4ECE4;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FBF8F2;border:1px solid #E6D9C6;font-family:Georgia,'Times New Roman',serif;"><tr><td style="padding:40px 32px;">
<p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#7A5A30;">${echapper(maison.nom)}</p>
<h1 style="margin:0 0 24px;font-size:26px;line-height:1.25;font-weight:normal;font-style:italic;color:#3B2B20;">${echapper(titre)}</h1>
${paragraphes.map((x) => p(echapper(x))).join("\n")}
${lien ? p(`${echapper(lien.intro)}<br><a href="${echapper(lien.url)}" style="color:#7A5A30;word-break:break-all;">${echapper(lien.url)}</a>`) : ""}
${p(`${echapper(fr.emails.signature)}<br>${echapper(maison.nom)}`, "font-style:italic;")}
<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #E6D9C6;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#5E4E40;">${echapper(pied)}</p>
</td></tr></table>
</td></tr></table>
</body></html>`;
  return { texte, html };
}

export function confirmationAchat(achat: { id: string; email: string }): Message {
  const m = fr.emails.confirmationAchat;
  const corps = mettreEnPage({
    titre: m.titre,
    paragraphes: m.corps(maison.dateOuverture),
    lien: { intro: m.autreAdresse, url: `${maison.siteUrl}/rattacher/${jetonRattachement(achat.id)}` },
    pied: m.pourquoi,
  });
  return { a: achat.email, sujet: m.sujet, ...corps };
}
