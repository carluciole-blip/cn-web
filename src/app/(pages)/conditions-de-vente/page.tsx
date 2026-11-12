import type { Metadata } from "next";
import { PageTexte } from "@/components/PageTexte";
import { conditionsDeVente } from "@/messages/legal-fr";

export const metadata: Metadata = { title: conditionsDeVente().titre };

export default function Page() {
  return <PageTexte page={conditionsDeVente()} />;
}
