// The Markdown the legal documents use (D134; legal content package v1.0): front matter, "#" and "##"
// headings, paragraphs, numbered and bulleted lists (one nested bullet level), tables, and **bold**,
// *italic* and `code` inside a line. Nothing else is read, so the text renders exactly as written.

export type Inline = { text: string; strong?: true; em?: true; code?: true };
export type ListItem = { inline: Inline[]; children?: Block };
export type Block =
  | { kind: "h1" | "h2" | "p"; inline: Inline[] }
  | { kind: "ol" | "ul"; items: ListItem[] }
  | { kind: "table"; head: Inline[][]; rows: Inline[][][] };
export type FrontMatter = { title: string; doc: string; lang: string; version: string; effective_date: string; authoritative: boolean };

const MARK = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/;

/** One line's text, with bold, italic and code marked. */
export function parseInline(text: string): Inline[] {
  return text
    .split(MARK)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("**")
        ? { text: part.slice(2, -2), strong: true as const }
        : part.startsWith("`")
          ? { text: part.slice(1, -1), code: true as const }
          : part.startsWith("*") && part.length > 2
            ? { text: part.slice(1, -1), em: true as const }
            : { text: part },
    );
}

const cells = (line: string) => line.trim().slice(1, -1).split("|").map((c) => parseInline(c.trim()));

function readFrontMatter(lines: string[]): [FrontMatter, number] {
  if (lines[0] !== "---") throw new Error("A legal document starts with front matter");
  const end = lines.indexOf("---", 1);
  const fields = Object.fromEntries(
    lines.slice(1, end).map((l) => {
      const at = l.indexOf(":");
      return [l.slice(0, at).trim(), l.slice(at + 1).trim().replace(/^"(.*)"$/, "$1")];
    }),
  );
  const meta = { ...fields, authoritative: fields.authoritative === "true" } as FrontMatter;
  return [meta, end + 1];
}

/** A legal document: its front matter and its blocks, in order. */
export function parseLegal(source: string): { meta: FrontMatter; blocks: Block[] } {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const [meta, start] = readFrontMatter(lines);
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ kind: "p", inline: parseInline(para.join(" ")) });
    para = [];
  };
  const last = () => blocks[blocks.length - 1];

  for (const line of lines.slice(start)) {
    const nested = line.match(/^\s{2,}- (.*)$/);
    const numbered = line.match(/^\d+\. (.*)$/);
    const bullet = line.match(/^- (.*)$/);
    if (!line.trim()) flush();
    else if (line.startsWith("#")) {
      flush();
      const h2 = line.startsWith("## ");
      blocks.push({ kind: h2 ? "h2" : "h1", inline: parseInline(line.slice(h2 ? 3 : 2)) });
    } else if (line.startsWith("|")) {
      flush();
      const table = last();
      if (/^\|[-|\s]+\|$/.test(line.trim())) continue;
      if (table?.kind === "table") table.rows.push(cells(line));
      else blocks.push({ kind: "table", head: cells(line), rows: [] });
    } else if (nested) {
      const list = last();
      if (list?.kind !== "ol" && list?.kind !== "ul") throw new Error(`A nested item needs a list: ${line}`);
      const parent = list.items[list.items.length - 1];
      parent.children ??= { kind: "ul", items: [] };
      if (parent.children.kind === "ul") parent.children.items.push({ inline: parseInline(nested[1]) });
    } else if (numbered || bullet) {
      flush();
      const kind = numbered ? "ol" : "ul";
      const list = last();
      const item = { inline: parseInline((numbered ?? bullet)![1]) };
      if (list?.kind === kind) list.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else para.push(line.trim());
  }
  flush();
  return { meta, blocks };
}

const join = (inline: Inline[]) => inline.map((i) => i.text).join("");

/** The words a reader sees, one block, item or cell per line (tests and search). */
export function plainText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      if ("head" in b) return [b.head, ...b.rows].map((row) => row.map(join).join("\n")).join("\n");
      if ("items" in b) return b.items.map((i) => [join(i.inline), i.children ? plainText([i.children]) : ""].filter(Boolean).join("\n")).join("\n");
      return join(b.inline);
    })
    .join("\n");
}
