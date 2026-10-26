// Public legal pages (FE-18, PRD-00 OPS-01/OPS-02, D134). The final texts are the legal content package
// v1.0 (effective 16 Oct 2026), kept verbatim in src/content/legal/<lang>/. Indonesian is the binding
// version and opens by default; English is a translation the reader can pick. No legal text is written here.
import type { MessageKey } from "@/i18n";

export type LegalSlug = "ketentuan" | "privasi" | "refund" | "early-bird";
export type DocLang = "id" | "en";
export type LegalDoc = { slug: LegalSlug; status: "draft" | "final"; title: MessageKey; files: Record<DocLang, string> };

/** Indonesian first: it is the binding version. */
export const DOC_LANGS: readonly DocLang[] = ["id", "en"];

export const LEGAL_DOCS: LegalDoc[] = [
  { slug: "ketentuan", status: "final", title: "legal.terms.title", files: { id: "ketentuan-layanan.md", en: "terms-of-service.md" } },
  { slug: "privasi", status: "final", title: "legal.privacy.title", files: { id: "kebijakan-privasi.md", en: "privacy-policy.md" } },
  { slug: "refund", status: "final", title: "legal.refund.title", files: { id: "kebijakan-pengembalian-dana.md", en: "refund-policy.md" } },
  { slug: "early-bird", status: "final", title: "legal.earlyBird.title", files: { id: "syarat-early-bird.md", en: "early-bird-terms.md" } },
];

export const legalDoc = (slug: LegalSlug) => LEGAL_DOCS.find((d) => d.slug === slug)!;

/** The document language from the address (`?lang=en`); anything else is the binding Indonesian. */
export const docLang = (value: unknown): DocLang => (value === "en" ? "en" : "id");

/** Every catalog key the legal pages use around the documents themselves. */
export function legalKeys(): MessageKey[] {
  return ["legal.nav", "legal.docLang", "language.id", "language.en", ...LEGAL_DOCS.map((d) => d.title)];
}
