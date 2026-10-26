// Reads a legal document, and the FAQ that ships with them, from src/content/legal (D134). Server only;
// next.config.ts traces the folder so the files ship with every route.
import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { legalDoc, type DocLang, type LegalSlug } from "./docs";
import { parseLegal, plainText, type Block } from "./markdown";

const read = (lang: DocLang, file: string) => parseLegal(readFileSync(path.join(process.cwd(), "src/content/legal", lang, file), "utf8"));

export const loadLegal = cache((slug: LegalSlug, lang: DocLang) => read(lang, legalDoc(slug).files[lang]));

/** The FAQ (legal content package v1.0): its title and each question with its answer, verbatim. */
export const loadFaq = cache((lang: DocLang) => {
  const { blocks } = read(lang, "faq.md");
  const title = blocks[0]?.kind === "h1" ? plainText([blocks[0]]) : "";
  const items: { q: string; a: string }[] = [];
  let answer: Block[] = [];
  const close = () => {
    if (items.length) items[items.length - 1].a = plainText(answer);
    answer = [];
  };
  for (const block of blocks.slice(1)) {
    if (block.kind === "h2") {
      close();
      items.push({ q: plainText([block]), a: "" });
    } else answer.push(block);
  }
  close();
  return { title, items };
});
