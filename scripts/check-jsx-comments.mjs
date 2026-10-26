// v7 guard: a `// …` line inside JSX children is rendered as visible text, and TypeScript accepts it.
// Found in the v7 merge (lint annotations leaked into Dialog/Sheet/Popover). Fails CI if any JsxText starts with //.
//
// Copied from @agere/design-system 7.0.0 scripts/check-jsx-comments.mjs.
// Local change: root resolved with fileURLToPath (works on Windows).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!["node_modules", "dist", "generated", ".next"].includes(e.name)) walk(p); }
    else if (/\.(tsx|jsx)$/.test(e.name)) files.push(p);
  }
})(path.join(root, "src"));
const hits = [];
for (const f of files) {
  const src = ts.createSourceFile(f, fs.readFileSync(f, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  (function visit(n) {
    if (n.kind === ts.SyntaxKind.JsxText && /^\s*\/\/|\n\s*\/\//.test(n.text)) {
      const { line } = src.getLineAndCharacterOfPosition(n.getStart());
      hits.push(`${path.relative(root, f)}:${line + 1}  ${n.text.trim().split("\n")[0].slice(0, 90)}`);
    }
    ts.forEachChild(n, visit);
  })(src);
}
hits.forEach((h) => console.log(h));
console.log(`jsx-comments: ${files.length} files, ${hits.length} comment(s) rendered as text`);
process.exit(hits.length ? 1 : 0);
