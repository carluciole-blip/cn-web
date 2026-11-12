import type { Metadata } from "next";
import Link from "next/link";
import { maison } from "@/config/maison";
import { fr } from "@/messages/fr";
import { Filet } from "@/components/Filet";
import { Pied } from "@/components/Pied";

export const metadata: Metadata = { title: fr.merci.titre, robots: { index: false } };

export default function Merci() {
  return (
    <>
      <main id="contenu" className="page">
        <h1>{fr.merci.titre}</h1>
        <Filet />
        <p>{fr.merci.texte(maison.dateOuverture)}</p>
        <p className="note">
          {fr.merci.aide} <a href={`mailto:${maison.emailContact}`}>{maison.emailContact}</a>
        </p>
        <p>
          <Link className="retour" href="/">
            {fr.commun.retourAccueil}
          </Link>
        </p>
      </main>
      <Pied />
    </>
  );
}
