import Link from "next/link";
import type { PageLegale } from "@/messages/legal-fr";
import { fr } from "@/messages/fr";
import { Filet } from "./Filet";
import { Pied } from "./Pied";

const reperes = process.env.AFFICHER_REPERES_JURIDIQUES !== "non";

export function PageTexte({ page }: { page: PageLegale }) {
  return (
    <>
      <main id="contenu" className="page">
        <Link className="retour" href="/">
          {fr.commun.retourAccueil}
        </Link>
        <h1>{page.titre}</h1>
        <Filet />
        {page.sections.map((section) => (
          <section key={section.titre} id={section.id}>
            <h2>{section.titre}</h2>
            {section.paragraphes?.map((paragraphe) => <p key={paragraphe}>{paragraphe}</p>)}
            {section.liste && (
              <ul>
                {section.liste.map((ligne) => (
                  <li key={ligne}>{ligne}</li>
                ))}
              </ul>
            )}
            {reperes && section.aValider && <p className="a-valider">{`À valider avant l'ouverture : ${section.aValider}`}</p>}
          </section>
        ))}
      </main>
      <Pied />
    </>
  );
}
