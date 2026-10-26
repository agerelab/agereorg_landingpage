// HTML version of a plain-text email (FE-18, PO 13 Oct 2026): the agere/org logo on top, then the text with
// its paragraphs and line breaks. The text stays the source and the fallback, so the copy lives in one place
// (the message catalogs). Email clients ignore stylesheets and SVG: styles are inline, colors are the DS ink
// on white as literals, and the logo is the PNG from scripts/build-email-logo.mjs, shown 24 px high.
// Everything is escaped; only the addresses in `links` become links, because typed text (a name, an
// organization) must never turn into one. `actions` end the email with buttons, the first one filled.

const LOGO = { path: "/email/agere-org-logo.png", width: 92, height: 24 };
const FONT = "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
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

export type EmailAction = { label: string; href: string; arrow?: boolean };

const button = (a: EmailAction, filled: boolean) => {
  const content = a.arrow ? `${escapeHtml(a.label)}&nbsp;&rarr;` : escapeHtml(a.label);
  return `<a href="${escapeHtml(a.href)}" style="display:inline-block;box-sizing:border-box;margin:0 12px 10px 0;padding:12px 24px;border:1px solid ${filled ? INK : "#e4e4e7"};border-radius:8px;font-family:${FONT};font-size:15px;font-weight:500;line-height:20px;text-decoration:none;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05);vertical-align:middle;${filled ? `background:${INK};color:#ffffff` : "background:#ffffff;color:#09090b"}">${content}</a>`;
};

export type EmailRow = { label: string; value: string; isLink?: boolean };

export type EmailHtmlOptions = {
  base: string;
  lang: string;
  links?: string[];
  actions?: EmailAction[];
  badge?: string;
  title?: string;
  subtitle?: string;
  rows?: EmailRow[];
  complianceTitle?: string;
  compliance?: string;
  note?: string;
};

export function emailHtml(text: string, opts: EmailHtmlOptions) {
  const body = text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK}">${linkify(escapeHtml(p), opts.links ?? []).replace(/\n/g, "<br>")}</p>`)
    .join("\n");

  const headerLogo = `<img src="${escapeHtml(opts.base)}${LOGO.path}" width="${LOGO.width}" height="${LOGO.height}" alt="agere/org" style="display:block;border:0;font-family:${FONT};font-size:18px;font-weight:700;letter-spacing:-0.04em;color:${INK}">`;

  const header = opts.badge
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px">
<tr>
<td align="left" style="vertical-align:middle">${headerLogo}</td>
<td align="right" style="vertical-align:middle"><span style="display:inline-block;padding:4px 10px;background:#f4f4f5;color:#52525b;border-radius:9999px;font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase">${escapeHtml(opts.badge)}</span></td>
</tr>
</table>`
    : `<div style="padding:0 0 24px">${headerLogo}</div>`;

  const headingSection = opts.title
    ? `<h1 style="margin:0 0 6px;font-family:${FONT};font-size:20px;font-weight:700;color:#09090b;letter-spacing:-0.025em;line-height:1.3">${escapeHtml(opts.title)}</h1>
${opts.subtitle ? `<p style="margin:0 0 20px;font-family:${FONT};font-size:14px;color:#71717a;line-height:1.5">${escapeHtml(opts.subtitle)}</p>` : ""}`
    : "";

  const rowsSection = opts.rows?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 20px;border-top:1px solid #f4f4f5;border-collapse:collapse">
${opts.rows
  .map(
    (r) => `<tr>
<td style="padding:10px 0;width:35%;font-family:${FONT};font-size:13px;color:#71717a;border-bottom:1px solid #f4f4f5;vertical-align:top">${escapeHtml(r.label)}</td>
<td style="padding:10px 0;width:65%;font-family:${FONT};font-size:14px;font-weight:500;color:#09090b;border-bottom:1px solid #f4f4f5;vertical-align:top">${
      r.isLink
        ? `<a href="${r.value.includes("@") ? `mailto:${escapeHtml(r.value)}` : escapeHtml(r.value)}" style="color:${INK};text-decoration:underline">${escapeHtml(r.value)}</a>`
        : escapeHtml(r.value)
    }</td>
</tr>`,
  )
  .join("\n")}
</table>`
    : "";

  const complianceSection = opts.compliance
    ? `<div style="background:#fafafa;border:1px solid #f4f4f5;border-radius:8px;padding:12px 16px;margin:20px 0;font-family:${FONT};font-size:12px;color:#71717a;line-height:1.5">
<strong style="color:#09090b;display:block;margin-bottom:4px;font-size:11px;text-transform:uppercase;letter-spacing:0.04em">${escapeHtml(opts.complianceTitle ?? "Persetujuan & Kepatuhan")}</strong>
${escapeHtml(opts.compliance)}
</div>`
    : "";

  const contentArea = opts.rows?.length ? `${headingSection}${rowsSection}${complianceSection}` : `${headingSection}${body}`;

  const actions = opts.actions?.length
    ? `<div style="margin:24px 0 0;padding-top:20px;border-top:1px solid #f4f4f5;text-align:left">
${opts.actions.map((a, i) => button(a, i === 0)).join("")}
${opts.note ? `<p style="margin:12px 0 0;font-family:${FONT};font-size:12px;color:#a1a1aa;text-align:left">${escapeHtml(opts.note)}</p>` : ""}
</div>`
    : "";

  return `<!doctype html>
<html lang="${escapeHtml(opts.lang)}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5">
<tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
<tr><td style="padding:32px 28px">
${header}
${contentArea}
${actions}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
