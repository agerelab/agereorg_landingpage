import type { NextConfig } from "next";

const config: NextConfig = {
  // The legal documents are read from disk at request time (D134); ship them with every route.
  outputFileTracingIncludes: { "/*": ["src/content/legal/**/*.md"] },
};

export default config;
