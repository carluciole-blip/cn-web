import type { Metadata } from "next";
import { PageTexte } from "@/components/PageTexte";
import { confidentialite } from "@/messages/legal-fr";

export const metadata: Metadata = { title: confidentialite().titre };

export default function Page() {
  return <PageTexte page={confidentialite()} />;
}
