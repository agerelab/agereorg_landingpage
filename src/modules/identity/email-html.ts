// HTML version of a plain-text email (FE-18, PO 13 Oct 2026): the agere/org logo on top, then the text with
// its paragraphs and line breaks. The text stays the source and the fallback, so the copy lives in one place
// (the message catalogs). Email clients ignore stylesheets and SVG: styles are inline, colors are the DS ink
// on white as literals, and the logo is the PNG from scripts/build-email-logo.mjs, shown 24 px high.
// Everything is escaped; only the addresses in `links` become links, because typed text (a name, an
// organization) must never turn into one. `actions` end the email with buttons, the first one filled.

const LOGO = { path: "/email/agere-org-logo.png", width: 92, height: 24 };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const INK = "#0b0b0b";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function linkify(html: string, links: string[]) {
  if (!links.length) return html;
  const escaped = [...new Set(links)].map(escapeHtml).sort((a, b) => b.length - a.length);
  return html.replace(new RegExp(escaped.map(escapeRegExp).join("|"), "g"), (m) => {
    const href = m.includes("://") ? m : `mailto:${m}`;
    return `<a href="${href}" style="color:${INK};text-decoration:underline">${m}</a>`;
  });
}

const button = (a: { label: string; href: string }, filled: boolean) =>
  `<a href="${escapeHtml(a.href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 18px;border:1px solid ${INK};border-radius:6px;font-weight:600;text-decoration:none;${filled ? `background:${INK};color:#ffffff` : `background:#ffffff;color:${INK}`}">${escapeHtml(a.label)}</a>`;

export function emailHtml(text: string, opts: { base: string; lang: string; links?: string[]; actions?: { label: string; href: string }[] }) {
  const body = text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px">${linkify(escapeHtml(p), opts.links ?? []).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
  const actions = opts.actions?.length ? `\n<p style="margin:8px 0 0">${opts.actions.map((a, i) => button(a, i === 0)).join("")}</p>` : "";
  return `<!doctype html>
<html lang="${escapeHtml(opts.lang)}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
<tr><td style="padding:0 0 24px"><img src="${escapeHtml(opts.base)}${LOGO.path}" width="${LOGO.width}" height="${LOGO.height}" alt="agere/org" style="display:block;border:0"></td></tr>
<tr><td style="font-family:${FONT};font-size:15px;line-height:1.6;color:${INK}">
${body}${actions}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
