import { maison } from "@/config/maison";
import { fr } from "@/messages/fr";
import { OFFRES, prixAffiche, type CodeOffre } from "@/lib/offres";
import { Filet } from "@/components/Filet";
import { Pied } from "@/components/Pied";

const t = fr.accueil;
const ordre: CodeOffre[] = ["une_reception", "grande_reception", "carnet"];

export default function Accueil() {
  return (
    <>
      <main id="contenu">
        <section className="hero">
          <div className="hero-texte">
            <p className="etiquette">
              {maison.nom} · {t.surtitre}
            </p>
            <h1>
              {t.promesse} <span>{t.promesseSuite}</span>
            </h1>
            <Filet />
            <p>
              <a className="bouton" href="#carnet">
                {t.boutonPrevente}
              </a>
            </p>
            <p className="note">{t.ouverture(maison.dateOuverture)}</p>
          </div>

          <figure className="carton" aria-label={t.exemple.legende}>
            <div className="carton-arche">
              <p className="etiquette">{t.exemple.surtitre}</p>
              <p className="carton-hote">{t.exemple.hote}</p>
              <p className="carton-titre">{t.exemple.titre}</p>
              <Filet />
              <p>{t.exemple.date}</p>
              <p>{t.exemple.lieu}</p>
              <p className="carton-mot">{t.exemple.mot}</p>
              <ul className="carton-reponses" aria-hidden="true">
                {t.exemple.reponses.map((reponse, i) => (
                  <li key={reponse} className={i === 0 ? "choisie" : undefined}>
                    {reponse}
                  </li>
                ))}
              </ul>
            </div>
            <figcaption className="etiquette">{t.exemple.legende}</figcaption>
          </figure>
        </section>

        <section className="bloc" aria-labelledby="avantages">
          <h2 id="avantages">{t.avantagesTitre}</h2>
          <Filet />
          <ul className="avantages">
            {t.avantages.map((avantage) => (
              <li key={avantage.titre}>
                <h3>{avantage.titre}</h3>
                <p>{avantage.texte}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bloc bloc-papier" aria-labelledby="formules">
          <h2 id="formules">{t.formulesTitre}</h2>
          <Filet />
          <p className="intro">{t.formulesIntro}</p>
          <ul className="formules">
            {ordre.map((code) => (
              <li key={code}>
                <h3>{t.formules[code].nom}</h3>
                <p className="prix">{prixAffiche(OFFRES[code].prixCentimes)}</p>
                <p className="etiquette">{t.ttc}</p>
                <ul>
                  {t.formules[code].contenu.map((ligne) => (
                    <li key={ligne}>{ligne}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className="bloc" id="carnet" aria-labelledby="titre-carnet">
          <h2 id="titre-carnet">{t.prevente.titre}</h2>
          <Filet />
          <p className="intro">{t.prevente.texte(maison.dateOuverture)}</p>
          <form className="prevente" method="post" action="/api/prevente">
            <label className="case">
              <input type="checkbox" name="renoncement" value="oui" required />
              <span>{t.prevente.renoncement}</span>
            </label>
            <p className="note">
              {t.prevente.renoncementAide} <a href="/conditions-de-vente#retractation">{fr.commun.conditionsDeVente}</a>
            </p>
            <button className="bouton" type="submit">
              {t.prevente.bouton(prixAffiche(OFFRES.carnet.prixCentimes))}
            </button>
            <p className="note">{t.prevente.paiement}</p>
          </form>
        </section>

        <section className="bloc bloc-papier" aria-labelledby="faq">
          <h2 id="faq">{t.faqTitre}</h2>
          <Filet />
          <div className="faq">
            {t.faq.map((question) => (
              <details key={question.q}>
                <summary>{question.q}</summary>
                <p>{question.r}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Pied />
    </>
  );
}
