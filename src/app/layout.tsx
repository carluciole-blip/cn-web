import type { Metadata, Viewport } from "next";
import "@fontsource/spectral/latin-300-italic.css";
import "@fontsource/spectral/latin-400.css";
import "@fontsource/spectral/latin-400-italic.css";
import "@fontsource/spectral/latin-500.css";
import "@fontsource/hanken-grotesk/latin-500.css";
import "./globals.css";
import { maison } from "@/config/maison";
import { fr } from "@/messages/fr";

export const metadata: Metadata = {
  metadataBase: new URL(maison.siteUrl),
  title: { default: maison.produit, template: `%s · ${maison.nom}` },
  description: `${fr.accueil.promesse} ${fr.accueil.promesseSuite}`,
};

export const viewport: Viewport = { themeColor: "#F4ECE4" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a className="evitement" href="#contenu">
          {fr.commun.aller}
        </a>
        {children}
      </body>
    </html>
  );
}
