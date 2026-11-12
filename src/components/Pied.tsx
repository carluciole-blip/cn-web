import Link from "next/link";
import { maison } from "@/config/maison";
import { fr } from "@/messages/fr";

export function Pied() {
  return (
    <footer className="pied">
      <p className="etiquette">{maison.devise}</p>
      <nav aria-label="Informations">
        <ul>
          <li>
            <a href={`mailto:${maison.emailContact}`}>{fr.commun.contact}</a>
          </li>
          <li>
            <Link href="/mentions-legales">{fr.commun.mentionsLegales}</Link>
          </li>
          <li>
            <Link href="/confidentialite">{fr.commun.confidentialite}</Link>
          </li>
          <li>
            <Link href="/conditions-de-vente">{fr.commun.conditionsDeVente}</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
