// CommonJS wrapper for Phusion Passenger in cPanel / CloudLinux.
const path = require("path");

process.chdir(__dirname);
process.env.NODE_ENV = process.env.NODE_ENV || "production";

async function main() {
  await import("./server.js");
}

main().catch((err) => {
  console.error("Failed to start application:", err);
  process.exit(1);
});



