// Node server for the same-day VPS fallback of the public site (README, Deploy; PRD-00 D163, Q-D163-1).
// Production runs on Vercel (D164, D166), which does not use this file. Started by server.cjs, or
// `npm run start:cpanel` (name kept from the retired cPanel host, D147).
import { createServer } from "http";
import { randomBytes } from "crypto";
import { parse } from "url";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import next from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);
process.env.NODE_ENV = process.env.NODE_ENV || "production";

const dev = process.env.NODE_ENV !== "production";

// Next.js refuses to start when .next/prerender-manifest.json has no preview configuration (seen on the
// cPanel build). The site uses no draft mode, so fresh random values are enough; no key lives in the repo.
const prerenderManifestPath = path.join(__dirname, ".next", "prerender-manifest.json");
const preview = () => ({
  previewModeId: randomBytes(16).toString("hex"),
  previewModeSigningKey: randomBytes(32).toString("hex"),
  previewModeEncryptionKey: randomBytes(32).toString("hex"),
});

try {
  if (fs.existsSync(prerenderManifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(prerenderManifestPath, "utf8"));
    if (!manifest.preview || !manifest.preview.previewModeId) {
      manifest.preview = preview();
      fs.writeFileSync(prerenderManifestPath, JSON.stringify(manifest, null, 2));
      console.log("> Patched preview config into .next/prerender-manifest.json");
    }
  } else if (fs.existsSync(path.join(__dirname, ".next"))) {
    const fallback = { version: 4, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: preview() };
    fs.writeFileSync(prerenderManifestPath, JSON.stringify(fallback, null, 2));
    console.log("> Created fallback .next/prerender-manifest.json");
  }
} catch (e) {
  console.warn("> Note on prerender-manifest.json check:", e.message);
}

const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        await handle(req, res, parse(req.url, true));
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });

    if (typeof PhusionPassenger !== "undefined") {
      server.listen("passenger", (err) => {
        if (err) throw err;
        console.log("> Ready via Phusion Passenger");
      });
      return;
    }
    const port = Number(process.env.PORT) || 3000;
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE" && !process.env.PORT) {
        console.warn("[server] Port 3000 is in use on the shared host; trying a random free port.");
        server.listen(0, () => {
          const addr = server.address();
          console.log(`> Ready on port: ${addr && typeof addr === "object" ? addr.port : addr}`);
        });
        return;
      }
      console.error("[server] Listen error:", err);
    });
    server.listen(port, () => console.log(`> Ready on port: ${port}`));
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
