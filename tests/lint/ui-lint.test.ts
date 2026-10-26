// UI Lint Gate (UI-01, Agere DS 6.5, PLAN-01 §6, & Decision D32, D33, D72)
// Verifies:
// 1. Maksimal 1 tombol default per header action row (UI-01 v2.5 "Aksi & CTA").
// 2. Larangan merah solid di halaman (Agere DS linear ink rule).
// 3. Larangan placeholder di form input (D33: no placeholder in authoring fields; search only).

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

function getAllFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  try {
    const list = readdirSync(dir);
    for (const file of list) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(fullPath, extensions));
      } else if (extensions.includes(extname(fullPath))) {
        results.push(fullPath);
      }
    }
  } catch {
    // skip if directory does not exist
  }
  return results;
}

const UI_DIRS = [
  join(process.cwd(), "src", "ui"),
  join(process.cwd(), "src", "app"),
];

describe("UI Lint — Design System & Interaction Invariants", () => {
  const tsxFiles = UI_DIRS.flatMap((dir) => getAllFiles(dir, [".tsx"]));

  it("found TSX files to inspect", () => {
    expect(tsxFiles.length).toBeGreaterThan(0);
  });

  it("larangan merah solid: tidak ada background merah solid mentah (bg-red-500/600/700)", () => {
    const violations: { file: string; line: number; text: string }[] = [];
    const forbiddenClasses = ["bg-red-500", "bg-red-600", "bg-red-700", "bg-red-800", "bg-red-900"];

    for (const file of tsxFiles) {
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        // Exclude comments
        if (line.trim().startsWith("//") || line.trim().startsWith("/*")) return;
        for (const cls of forbiddenClasses) {
          if (line.includes(cls)) {
            violations.push({ file, line: idx + 1, text: line.trim() });
          }
        }
      });
    }

    expect(
      violations,
      `Ditemukan background merah solid mentah (gunakan token semantik Agere DS): ${JSON.stringify(violations, null, 2)}`
    ).toHaveLength(0);
  });

  it("larangan placeholder di form input (D33): placeholder hanya diizinkan pada input pencarian", () => {
    const violations: { file: string; line: number; text: string }[] = [];

    for (const file of tsxFiles) {
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        if (line.trim().startsWith("//") || line.trim().startsWith("/*")) return;

        // Check if line contains placeholder=
        if (line.includes("placeholder=") || line.includes("placeholder:")) {
          const surrounding = lines.slice(Math.max(0, idx - 4), Math.min(lines.length, idx + 4)).join(" ");
          const isSearchInput =
            surrounding.includes("search") ||
            surrounding.includes("Search") ||
            surrounding.includes("cari") ||
            surrounding.includes("filter") ||
            surrounding.includes("type=\"search\"") ||
            surrounding.includes("CommandInput") ||
            surrounding.includes("cmdk");

          if (!isSearchInput) {
            violations.push({ file, line: idx + 1, text: line.trim() });
          }
        }
      });
    }

    expect(
      violations,
      `Ditemukan placeholder pada form input bukan pencarian (melanggar D33): ${JSON.stringify(violations, null, 2)}`
    ).toHaveLength(0);
  });

  it("maksimal 1 tombol default per header action row (UI-01 CTA Hierarchy)", () => {
    // Scans header definitions to ensure no header defines multiple primary default buttons
    const violations: { file: string; text: string }[] = [];

    for (const file of tsxFiles) {
      const content = readFileSync(file, "utf-8");
      // Find PageHeaderActions or header blocks
      const headerMatches = content.match(/<PageHeaderActions[^>]*>([\s\S]*?)<\/PageHeaderActions>/g);
      if (headerMatches) {
        for (const headerBlock of headerMatches) {
          // Count buttons without variant or with variant="default"
          const buttons = headerBlock.match(/<Button[^>]*>/g) || [];
          let defaultBtnCount = 0;
          for (const btn of buttons) {
            if (!btn.includes("variant=") || btn.includes('variant="default"')) {
              defaultBtnCount++;
            }
          }
          if (defaultBtnCount > 1) {
            violations.push({ file, text: headerBlock });
          }
        }
      }
    }

    expect(
      violations,
      `Ditemukan lebih dari 1 tombol default per header: ${JSON.stringify(violations, null, 2)}`
    ).toHaveLength(0);
  });
});
