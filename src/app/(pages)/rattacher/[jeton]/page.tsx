import type { Metadata } from "next";
import Link from "next/link";
import { maison } from "@/config/maison";
import { fr } from "@/messages/fr";
import { Filet } from "@/components/Filet";
import { Pied } from "@/components/Pied";

// Page d'attente jusqu'à l'ouverture. Le rattachement lui-même arrive au jalon J5 :
// d'ici là, le jeton n'est ni lu ni journalisé.
export const metadata: Metadata = { title: fr.rattacher.titre, robots: { index: false }, referrer: "no-referrer" };

export default function Rattacher() {
  return (
    <>
      <main id="contenu" className="page">
        <h1>{fr.rattacher.titre}</h1>
        <Filet />
        <p>{fr.rattacher.texte(maison.dateOuverture)}</p>
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
