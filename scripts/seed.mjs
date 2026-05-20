/**
 * Bootstrap Convex (admin user + NPSC 2026 event).
 *
 * Usage:
 *   SEED_SECRET=xxx SEED_ADMIN_EMAIL=you@org.com SEED_ADMIN_PASSWORD=yyy SEED_ADMIN_NAME="Your Name" node scripts/seed.mjs
 *
 * Requires NEXT_PUBLIC_CONVEX_URL in .env.local
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
const secret = process.env.SEED_SECRET;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminName = process.env.SEED_ADMIN_NAME;

if (!url) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL in .env.local");
  process.exit(1);
}
if (!secret || !adminPassword || !adminEmail || !adminName) {
  console.error(
    "Set SEED_SECRET, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, and SEED_ADMIN_NAME."
  );
  process.exit(1);
}

const client = new ConvexHttpClient(url);

const { api } = await import("../convex/_generated/api.js");

const result = await client.mutation(api.seed.bootstrap, {
  secret,
  adminPassword,
  adminEmail,
  adminName,
});

console.log("Bootstrap complete:", result);
