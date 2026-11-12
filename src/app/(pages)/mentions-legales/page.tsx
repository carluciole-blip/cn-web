import type { Metadata } from "next";
import { PageTexte } from "@/components/PageTexte";
import { mentionsLegales } from "@/messages/legal-fr";

export const metadata: Metadata = { title: mentionsLegales().titre };

export default function Page() {
  return <PageTexte page={mentionsLegales()} />;
}
