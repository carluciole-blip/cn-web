import { describe, expect, it } from "vitest";
import { OFFRES, offreParCode, prixAffiche } from "@/lib/offres";
import { jetonRattachement, lireJetonRattachement } from "@/lib/jetons";
import { confirmationAchat, echapper } from "@/lib/emails/messages";
import { fr } from "@/messages/fr";
import { conditionsDeVente, confidentialite, mentionsLegales } from "@/messages/legal-fr";

describe("catalogue", () => {
  it("porte les prix de l'offre", () => {
    expect(OFFRES.une_reception.prixCentimes).toBe(900);
    expect(OFFRES.grande_reception.prixCentimes).toBe(1900);
    expect(OFFRES.carnet.prixCentimes).toBe(2900);
    expect(OFFRES.carnet.creditsNombre).toBe(3);
    expect(OFFRES.carnet.creditsFormule).toBe("grande_reception");
  });
  it("fait expirer le Carnet à la fin du 31 janvier 2027, heure de Paris", () => {
    const fin = new Date(OFFRES.carnet.expireLe!);
    expect(fin.toLocaleString("fr-FR", { timeZone: "Europe/Paris" })).toBe("01/02/2027 00:00:00");
  });
  it("refuse un code inconnu, y compris un nom hérité d'Object", () => {
    expect(offreParCode("gratuit")).toBeNull();
    expect(offreParCode("constructor")).toBeNull();
    expect(offreParCode(undefined)).toBeNull();
    expect(offreParCode("carnet")?.code).toBe("carnet");
  });
  it("affiche les prix à la française", () => {
    expect(prixAffiche(2900)).toBe("29 €");
    expect(prixAffiche(950)).toBe("9,50 €");
  });
});

describe("jeton de rattachement", () => {
  const achat = "5b0c1d6e-0000-4000-8000-000000000001";
  it("se relit, et porte une signature de 256 bits", () => {
    const jeton = jetonRattachement(achat);
    expect(lireJetonRattachement(jeton)).toBe(achat);
    expect(Buffer.from(jeton.split(".")[1], "base64url")).toHaveLength(32);
  });
  it("refuse une signature fausse ou un autre achat", () => {
    const jeton = jetonRattachement(achat);
    expect(lireJetonRattachement(jeton.slice(0, -2) + "AA")).toBeNull();
    expect(lireJetonRattachement(jeton.replace("0001.", "0002."))).toBeNull();
    expect(lireJetonRattachement("n'importe quoi")).toBeNull();
  });
});

describe("e-mail de confirmation", () => {
  it("s'adresse à l'acheteur et contient le lien de rattachement", () => {
    const message = confirmationAchat({ id: "5b0c1d6e-0000-4000-8000-000000000001", email: "a@exemple.fr" });
    expect(message.a).toBe("a@exemple.fr");
    expect(message.texte).toContain("/rattacher/5b0c1d6e-0000-4000-8000-000000000001.");
    expect(message.html).toContain("Vos trois Grandes réceptions vous attendent");
  });
  it("échappe le HTML", () => {
    expect(echapper(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  });
});

describe("ton de la Maison", () => {
  function textes(valeur: unknown): string[] {
    if (typeof valeur === "string") return [valeur];
    if (typeof valeur === "function") return textes((valeur as (x: string) => unknown)("1er décembre"));
    if (Array.isArray(valeur)) return valeur.flatMap(textes);
    if (valeur && typeof valeur === "object") return Object.values(valeur).flatMap(textes);
    return [];
  }
  const tous = textes([fr, mentionsLegales(), confidentialite(), conditionsDeVente()]);

  it("n'emploie ni tiret long, ni tiret moyen, ni point d'exclamation", () => {
    expect(tous.length).toBeGreaterThan(60);
    expect(tous.filter((texte) => /[—–!]/.test(texte))).toEqual([]);
  });
  it("ne tutoie jamais", () => {
    expect(tous.filter((texte) => /(?<!\p{L})(tu|toi|ton|ta|tes)(?!\p{L})/iu.test(texte))).toEqual([]);
  });
});
