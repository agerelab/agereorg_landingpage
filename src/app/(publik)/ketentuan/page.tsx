import { LegalRoute, legalMetadata, type LegalSearchParams } from "@/ui/legal/legal-page";

export const generateMetadata = ({ searchParams }: { searchParams: LegalSearchParams }) => legalMetadata("ketentuan", searchParams);

export default function Page({ searchParams }: { searchParams: LegalSearchParams }) {
  return <LegalRoute slug="ketentuan" searchParams={searchParams} />;
}
