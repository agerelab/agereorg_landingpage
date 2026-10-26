// Enforces the statically checkable MUST/NEVER rules from AGENTS.md across src/.
// Each rule cites the AGENTS.md section it comes from. Rules that need a DOM (accessible names,
// focus management, live regions) are covered by the component test suite instead.
// Suppress a single line with: // agere-guidelines-ignore G0X <reason>
//
// Copied from @agere/design-system 7.0.0 scripts/lint-guidelines.mjs (rules: src/components/AGENTS.md).
// Local changes: root resolved with fileURLToPath (works on Windows); scans src/ only (no examples/storybook here).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['src'];
const ROOT_FILES = [];
const EXT = /\.(tsx?|jsx?|css|html)$/;

const RULES = [
  { id: 'G01', section: 'Animation', text: 'NEVER transition: all; list properties explicitly',
    test: (l) => /transition:\s*all\b|\btransition-all\b/.test(l) },
  { id: 'G02', section: 'Animation', text: 'NEVER animate layout properties (top, left, width, height)',
    test: (l) => /transition-\[[^\]]*\b(width|height|top|left)\b|transition(-property)?:[^;]*\b(width|height|top|left)\b/.test(l) },
  { id: 'G03', section: 'Interactions / Keyboard', text: 'NEVER outline: none without a visible focus replacement',
    // focus-ring / focus-ring-inset / focus-ring-field are agere's focus replacements (tailwind.preset.ts).
    // Context-aware: cva class lists span lines, so the replacement may sit up to 4 lines away.
    // tabIndex={-1} marks a programmatic focus target (headings after route changes); recharts layers are not focusable.
    context: 4,
    test: (l, ctx) => (/\boutline-none\b/.test(l) && !/focus-visible[:\]]|focus-within[:\]]|focus:|\bfocus-ring(-inset|-field)?\b|group-focus|peer-focus|tabIndex=\{-1\}|recharts|ring-2/.test(ctx)) ||
      (/outline:\s*(none|0)\b/.test(l) && !/:focus:not\(:focus-visible\)/.test(l)) },
  { id: 'G04', section: 'Content & Accessibility', text: 'MUST use the ellipsis character … instead of ...',
    test: (l) => /[\p{L}\p{N}]\.\.\.(?=["'`<\s)}]|$)/u.test(l) },
  { id: 'G05', section: 'Targets & Input', text: 'NEVER disable browser zoom',
    test: (l) => /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(?![.\d])/.test(l) },
  { id: 'G06', section: 'State & Navigation', text: 'NEVER put click handlers on <div>/<span>; use <button> or <a>',
    test: (l) => /<(div|span|li)\b[^>]*\bonClick=/.test(l) },
  { id: 'G07', section: 'Forms', text: 'NEVER block paste',
    test: (l) => /onPaste=\{[^}]*preventDefault/.test(l) },
  { id: 'G08', section: 'Forms', text: 'Search placeholders end with … (authoring fields get no placeholder at all — G12)',
    // Only search fields: an ellipsis after an example value ("you@company.com…") reads as if the value continues.
    test: (l) => /placeholder=["'][^"']+(?<!…)["']/.test(l) && /[Ss]earch|[Cc]ari|type=["']search|SearchInput|Command(Input)?|Combobox|filter|Filter/.test(l) },
  { id: 'G12', severity: 'warn', section: 'Forms (agere 6.4 guideline)', text: 'Placeholders only in search fields; authoring fields get a visible label and helper text',
    test: (l) => /\bplaceholder=["'{]/.test(l) && !/[Ss]earch|[Cc]ari|type=["']search|SearchInput|Command(Input)?|Combobox|filter|Filter/.test(l) },
  { id: 'G09', section: 'Performance', text: 'MUST set explicit width and height on <img> (no CLS)',
    test: (l) => /<img\b/.test(l) && !(/\bwidth=/.test(l) && /\bheight=/.test(l)) },
  { id: 'G11', section: 'Content & Accessibility', text: 'MUST glue numbers to units with a no-break space (10\u00a0MB) in visible text',
    // Unit must end the token: "200 px-4" is a class list, "6 px radius" is prose.
    test: (l) => /\b\d+ (px|ms|MB|KB|GB|TB|detik|menit)(?![-\w\]:])/.test(l) },
  { id: 'G10', section: 'Brand', text: 'Brand is lowercase "agere" in visible copy ("Agere Lab" is retired; the legal name PT Agere Teknologi Indonesia keeps its casing)',
    test: (l) => /Agere Lab/.test(l) || /("[^"]*\bAgere\b[^"]*"|>[^<>{}]*\bAgere\b[^<>{}]*<|`[^`]*\bAgere\b[^`]*`)/.test(l.replace(/Agere Teknologi/g, '')) },
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['node_modules', 'dist', '.next', 'generated', 'storybook-static'].includes(e.name)) walk(p, out); }
    else if (EXT.test(e.name) && !/\.test\./.test(e.name) && !/tokens\.(light|dark)\.css$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = [...DIRS.flatMap((d) => walk(path.join(root, d))), ...ROOT_FILES.map((f) => path.join(root, f)).filter((f) => fs.existsSync(f))];
const problems = [];
const warnings = [];
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line)) return; // comments describe code, they don't render
    const prev = lines[i - 1] ?? '';
    for (const r of RULES) {
      const ctx = r.context ? lines.slice(Math.max(0, i - r.context), i + r.context + 1).join('\n') : line;
      if (!r.test(line, ctx)) continue;
      const ignore = new RegExp(`agere-guidelines-ignore ${r.id}\\b`);
      if (ignore.test(line) || ignore.test(prev)) continue;
      const msg = `${path.relative(root, f)}:${i + 1}  ${r.id}  ${r.text}  [AGENTS.md: ${r.section}]`;
      (r.severity === 'warn' ? warnings : problems).push(msg);
    }
  });
}
problems.forEach((p) => console.log(p));
if (process.argv.includes('--warnings')) warnings.forEach((w) => console.log('warn ' + w));
console.log(`guidelines: ${files.length} files, ${RULES.length} rules, ${problems.length} problem(s), ${warnings.length} warning(s) (review backlog; --warnings to list)`);
process.exit(problems.length ? 1 : 0);
