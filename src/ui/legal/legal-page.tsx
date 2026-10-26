// Public legal page (FE-18, D134): the final document, verbatim, with its version and effective date. It
// opens in Indonesian, the binding version; "English" switches the document to the translation. The page
// around it (header, footer) keeps the site's language.
import type { Metadata } from "next";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { translator } from "@/i18n";
import { getLocale, getTranslator } from "@/i18n/server";
import { PublicFrame } from "@/ui/public/public-frame";
import { loadLegal } from "./content";
import { DOC_LANGS, docLang, type DocLang, type LegalSlug } from "./docs";
import type { Block, Inline } from "./markdown";

type T = ReturnType<typeof translator>;
export type LegalSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function legalMetadata(slug: LegalSlug, searchParams?: LegalSearchParams): Promise<Metadata> {
  const { meta } = loadLegal(slug, docLang((await searchParams)?.lang));
  return { title: meta.title };
}

export async function LegalRoute({ slug, searchParams }: { slug: LegalSlug; searchParams: LegalSearchParams }) {
  const [locale, t, params] = await Promise.all([getLocale(), getTranslator(), searchParams]);
  return (
    <PublicFrame t={t} locale={locale} current={`/${slug}`} width="max-w-[760px]">
      <LegalDocument t={t} slug={slug} lang={docLang(params.lang)} base={`/${slug}`} />
    </PublicFrame>
  );
}

const switchLink =
  "inline-flex h-11 items-center rounded-md md:h-8 px-2.5 text-sm font-medium text-subtle hover:bg-subtle hover:text-emphasis focus-ring aria-[current=true]:bg-subtle aria-[current=true]:text-emphasis";

/** One legal document. `level` 2 when it is a section of another page (the early bird terms under the
 *  sign-up form); `anchor` keeps the reader at that section when the language changes. */
export function LegalDocument({ t, slug, lang, base, anchor = "", level = 1 }: { t: T; slug: LegalSlug; lang: DocLang; base: string; anchor?: string; level?: 1 | 2 }) {
  const { blocks } = loadLegal(slug, lang);
  return (
    <div className="grid gap-6">
      <nav aria-label={t("legal.docLang")} className="flex flex-wrap gap-1">
        {DOC_LANGS.map((l) => (
          <Link key={l} href={`${base}${l === "id" ? "" : `?lang=${l}`}${anchor}`} aria-current={l === lang} hrefLang={l} className={switchLink}>
            {t(l === "id" ? "language.id" : "language.en")}
          </Link>
        ))}
      </nav>
      <article lang={lang} className="grid gap-4 text-[15px] leading-relaxed">
        {blocks.map((block, i) => (
          <DocBlock key={i} block={block} level={level} stamp={i === 1 && blocks[0]?.kind === "h1"} />
        ))}
      </article>
    </div>
  );
}

function DocBlock({ block, level, stamp }: { block: Block; level: 1 | 2; stamp: boolean }) {
  switch (block.kind) {
    case "h1": {
      const H = level === 1 ? "h1" : "h2";
      return <H className="type-heading-xl text-emphasis">{text(block.inline)}</H>;
    }
    case "h2": {
      const H = level === 1 ? "h2" : "h3";
      return <H className="mt-4 type-heading-sm text-emphasis">{text(block.inline)}</H>;
    }
    case "p":
      return <p className={stamp ? "-mt-2 text-sm text-subtle" : undefined}>{text(block.inline)}</p>;
    case "ol":
    case "ul": {
      const List = block.kind;
      return (
        <List className={`grid gap-2 pl-5 ${block.kind === "ol" ? "list-decimal" : "list-disc"}`}>
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              {text(item.inline)}
              {item.children && (
                <div className="mt-2">
                  <DocBlock block={item.children} level={level} stamp={false} />
                </div>
              )}
            </li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <Table containerClassName="rounded-lg border border-default" className="text-sm">
          <TableHeader>
            <TableRow>
              {block.head.map((cell, i) => (
                <TableHead key={i} className="h-auto min-w-40 whitespace-normal py-2 align-bottom">{text(cell)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {block.rows.map((row, r) => (
              <TableRow key={r}>
                {row.map((cell, c) => (
                  <TableCell key={c} className="min-w-40 whitespace-normal align-top leading-relaxed">{text(cell)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
  }
}

function text(inline: Inline[]) {
  return inline.map((part, i) =>
    part.strong ? (
      <strong key={i} className="font-semibold text-emphasis">{part.text}</strong>
    ) : part.em ? (
      <em key={i}>{part.text}</em>
    ) : part.code ? (
      <code key={i} className="rounded-sm bg-muted px-1 font-mono text-[0.9em]">{part.text}</code>
    ) : (
      part.text
    ),
  );
}
