import { notFound } from "next/navigation";
import { LegalRoute, legalMetadata, type LegalSearchParams } from "@/ui/legal/legal-page";
import { SHOW_REFUND } from "@/ui/public/content";

export const generateMetadata = ({ searchParams }: { searchParams: LegalSearchParams }) => legalMetadata("refund", searchParams);

export default function Page({ searchParams }: { searchParams: LegalSearchParams }) {
  if (!SHOW_REFUND) notFound();
  return <LegalRoute slug="refund" searchParams={searchParams} />;
}
