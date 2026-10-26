// FE-18 (PO, 13 Oct 2026: "Tambahkan logo"): early bird emails go out as HTML with the agere/org logo on
// top; the plain text stays as the fallback. Gmail and Outlook do not show SVG, so the logo is a PNG served
// from the site. Whatever a person typed is escaped, and only the links we name become links: an
// application can address its confirmation to anyone, so its own text must never turn into a link.
import { describe, expect, it } from "vitest";
import { emailHtml } from "@/modules/identity/email-html";

const base = "https://www.agereorg.example";

describe("FE-18 — HTML email layout", () => {
  it("puts the agere/org logo, from the site, at the top", () => {
    const html = emailHtml("Halo Rina", { base, lang: "id" });
    expect(html).toContain('<img src="https://www.agereorg.example/email/agere-org-logo.png"');
    expect(html).toContain('alt="agere/org"');
    expect(html).toMatch(/height="24"/);
    expect(html).toContain('<html lang="id">');
    expect(html.indexOf("agere-org-logo.png")).toBeLessThan(html.indexOf("Halo Rina"));
  });

  it("keeps paragraphs and line breaks of the text", () => {
    const html = emailHtml("Halo Rina,\n\nOrganisasi: Maju Jaya\nPeran: Owner", { base, lang: "id" });
    expect(html).toMatch(/<p[^>]*>Halo Rina,<\/p>/);
    expect(html).toMatch(/<p[^>]*>Organisasi: Maju Jaya<br>Peran: Owner<\/p>/);
  });

  it("escapes what people typed", () => {
    const html = emailHtml('Nama: <script>alert("x")</script> & Co', { base, lang: "id" });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; Co");
  });

  it("ends with buttons when actions are given, the first one filled", () => {
    const html = emailHtml("Pendaftaran baru", { base, lang: "id", actions: [{ label: "Undang", href: `${base}/x?d=accept&t=a` }, { label: "Tolak", href: `${base}/x?d=deny&t=a` }] });
    expect(html).toMatch(/<a href="https:\/\/www\.agereorg\.example\/x\?d=accept&amp;t=a"[^>]*background:#0b0b0b[^>]*>Undang<\/a>/);
    expect(html).toMatch(/<a href="https:\/\/www\.agereorg\.example\/x\?d=deny&amp;t=a"[^>]*>Tolak<\/a>/);
    expect(html.indexOf("Pendaftaran baru")).toBeLessThan(html.indexOf(">Undang<"));
  });

  it("links only the addresses it is given, never one inside typed text", () => {
    const terms = `${base}/early-bird?lang=en#syarat`;
    const html = emailHtml(`Organization: https://evil.example/login\nTerms: ${terms}\nWrite to support@agereorg.com.`, {
      base,
      lang: "en",
      links: [terms, "support@agereorg.com"],
    });
    expect(html).toContain('<a href="https://www.agereorg.example/early-bird?lang=en#syarat"');
    expect(html).toContain('<a href="mailto:support@agereorg.com"');
    expect(html).not.toContain('href="https://evil.example');
    expect(html).toContain("Organization: https://evil.example/login");
  });

  it("renders structured key-value table, header badge, and compliance box when specified", () => {
    const html = emailHtml("", {
      base,
      lang: "id",
      badge: "Early Bird Application",
      title: "Pendaftaran Early Bird Baru",
      subtitle: "Rincian permohonan",
      rows: [
        { label: "Nama Lengkap", value: "Rina Kartika" },
        { label: "Alamat Email", value: "rina@majujaya.co.id", isLink: true },
      ],
      compliance: "Syarat Program v1.0",
      actions: [{ label: "Terima", href: `${base}/x?d=accept&t=a` }, { label: "Tolak", href: `${base}/x?d=deny&t=a` }],
      note: "Berlaku 30 hari",
    });
    expect(html).toContain("Early Bird Application");
    expect(html).toContain("Pendaftaran Early Bird Baru");
    expect(html).toContain("Rincian permohonan");
    expect(html).toContain("Nama Lengkap");
    expect(html).toContain("Rina Kartika");
    expect(html).toContain('<a href="mailto:rina@majujaya.co.id"');
    expect(html).toContain("Persetujuan &amp; Kepatuhan");
    expect(html).toContain("Syarat Program v1.0");
    expect(html).toContain("Berlaku 30 hari");
    expect(html).toContain("max-width:580px");
  });
});
