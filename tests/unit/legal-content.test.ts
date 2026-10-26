// FE-18 — the final legal documents (D134; legal content package v1.0, OPS-02, effective 16 Oct 2026).
// AC (package README):
//   Given a legal page, When it is opened, Then the final text shows verbatim with its version and
//     effective date, in Indonesian (binding) unless the reader picks the English translation.
//   No {{placeholders}}, no draft banner, no tax/VAT text and no vendor names in what readers see.
//   The footer of every public page links all four documents.
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { COOKIE } from "@/ui/shell/cookies";
import { DOC_LANGS, LEGAL_DOCS, docLang, legalKeys } from "@/ui/legal/docs";
import { parseInline, parseLegal, plainText } from "@/ui/legal/markdown";
import { SHOW_REFUND, VISIBLE_LEGAL_DOCS } from "@/ui/public/content";

const source = (lang: string, file: string) => readFileSync(path.join("src/content/legal", lang, file), "utf8");
const all = LEGAL_DOCS.flatMap((doc) => DOC_LANGS.map((lang) => ({ doc, lang, text: source(lang, doc.files[lang]) })));

describe("FE-18 — legal markdown", () => {
  it("reads the front matter and the blocks the documents use", () => {
    const { meta, blocks } = parseLegal(
      [
        "---",
        "title: Contoh",
        "doc: terms",
        "lang: id",
        'version: "1.0"',
        "effective_date: 2026-10-16",
        "authoritative: true",
        "---",
        "",
        "# Contoh",
        "",
        "Versi 1.0 · berlaku",
        "",
        "## Pasal 1. Satu",
        "",
        "1. **Bayar.** Pertama.",
        "2. Kedua:",
        "    - anak *miring*;",
        "    - anak `kode`.",
        "",
        "| A | B |",
        "|---|---|",
        "| a1 | b1 |",
        "",
        "- butir",
      ].join("\r\n"),
    );
    expect(meta).toEqual({ title: "Contoh", doc: "terms", lang: "id", version: "1.0", effective_date: "2026-10-16", authoritative: true });
    expect(blocks.map((b) => b.kind)).toEqual(["h1", "p", "h2", "ol", "table", "ul"]);
    const ol = blocks[3];
    expect(ol.kind === "ol" && ol.items.length).toBe(2);
    expect(ol.kind === "ol" && ol.items[1].children?.kind).toBe("ul");
    expect(blocks[4]).toEqual({ kind: "table", head: [[{ text: "A" }], [{ text: "B" }]], rows: [[[{ text: "a1" }], [{ text: "b1" }]]] });
  });

  it("marks bold, italic and code inside a line", () => {
    expect(parseInline("**Bayar.** Kata *miring* dan `kode`.")).toEqual([
      { text: "Bayar.", strong: true },
      { text: " Kata " },
      { text: "miring", em: true },
      { text: " dan " },
      { text: "kode", code: true },
      { text: "." },
    ]);
  });

  it("keeps every line of every document (verbatim)", () => {
    for (const { doc, lang, text } of all) {
      const shown = plainText(parseLegal(text).blocks);
      const body = text.replace(/\r\n/g, "\n").split("---\n").slice(2).join("---\n");
      for (const line of body.split("\n")) {
        if (!line.trim() || /^\|[-|]+\|$/.test(line)) continue;
        const cells = line.startsWith("|") ? line.slice(1, -1).split("|") : [line];
        for (const cell of cells) {
          const words = cell.replace(/^\s*(#+ |\d+\. |- )/, "").replace(/\*\*|\*|`/g, "").trim();
          expect(shown, `${doc.slug}/${lang}: ${words.slice(0, 60)}`).toContain(words);
        }
      }
    }
  });
});

describe("FE-18 — legal documents v1.0 (D134)", () => {
  it("publishes the four final documents in both languages", () => {
    expect(LEGAL_DOCS.map((d) => [d.slug, d.status])).toEqual([
      ["ketentuan", "final"],
      ["privasi", "final"],
      ["refund", "final"],
      ["early-bird", "final"],
    ]);
  });

  it("carries version 1.0 and the effective date, Indonesian binding and English a translation", () => {
    const docIds = { ketentuan: "terms", privasi: "privacy", refund: "refund", "early-bird": "early-bird" };
    for (const { doc, lang, text } of all) {
      const { meta, blocks } = parseLegal(text);
      expect(meta, `${doc.slug}/${lang}`).toMatchObject({ doc: docIds[doc.slug], lang, version: "1.0", effective_date: "2026-10-16", authoritative: lang === "id" });
      const stamp = plainText([blocks[1]]);
      expect(stamp).toBe(lang === "id" ? "Versi 1.0 · berlaku sejak 16 Oktober 2026" : "Version 1.0 · effective 16 October 2026");
    }
  });

  it("has no placeholders, no tax/VAT text and no vendor names", () => {
    const vendors = /\b(doku|openrouter|openai|anthropic|vercel|resend|sentry|neon|supabase|cloudflare|google|midtrans|xendit|aws)\b/i;
    for (const { doc, lang, text } of all) {
      expect(text, `${doc.slug}/${lang}`).not.toMatch(/\{\{/);
      expect(text, `${doc.slug}/${lang}`).not.toMatch(/\b(ppn|vat|npwp|pajak pertambahan|tax)\b/i);
      expect(text, `${doc.slug}/${lang}`).not.toMatch(vendors);
    }
  });

  it("names only cookies the app really sets (Privacy Policy §9)", () => {
    const set = new Set<string>(Object.values(COOKIE));
    for (const lang of DOC_LANGS) {
      const named = [...source(lang, LEGAL_DOCS[1].files[lang]).matchAll(/^\| `([^`]+)` \|/gm)].map((m) => m[1]);
      expect(named.length, lang).toBeGreaterThan(0);
      for (const name of named) expect(set.has(name), `${lang}: ${name}`).toBe(true);
    }
  });

  it("opens in Indonesian and switches to English only when asked", () => {
    expect(docLang(undefined)).toBe("id");
    expect(docLang("en")).toBe("en");
    expect(docLang("id")).toBe("id");
    expect(docLang("fr")).toBe("id");
    expect(docLang(["en"])).toBe("id");
  });

  it("links all four documents in the footer, the refund policy included", () => {
    expect(SHOW_REFUND).toBe(true);
    expect(VISIBLE_LEGAL_DOCS.map((d) => d.slug)).toEqual(["ketentuan", "privasi", "refund", "early-bird"]);
  });

  it("names the page chrome in both languages, with no draft wording left", () => {
    for (const k of legalKeys()) {
      expect(en, k).toHaveProperty([k]);
      expect(id, k).toHaveProperty([k]);
    }
    for (const catalog of [en, id] as Record<string, string>[]) {
      expect(Object.keys(catalog).filter((k) => /^legal\.(draft|covers|versionDraft|\w+\.(lead|p\d))/.test(k))).toEqual([]);
    }
  });
});
