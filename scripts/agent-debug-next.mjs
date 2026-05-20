import fs from "node:fs";
import path from "node:path";

const ENDPOINT =
  "http://127.0.0.1:7631/ingest/034f8333-181e-4022-be66-51e73d61f1ee";
const SESSION_ID = "663bde";
const LOG_PATH = path.join(process.cwd(), "debug-663bde.log");

function post(message, data, hypothesisId) {
  const payload = {
    sessionId: SESSION_ID,
    runId: "pre-fix",
    hypothesisId,
    location: "scripts/agent-debug-next.mjs:post",
    message,
    data,
    timestamp: Date.now(),
  };
  try {
    fs.appendFileSync(LOG_PATH, JSON.stringify(payload) + "\n");
  } catch {}
  return fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": SESSION_ID,
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

const projectRoot = process.cwd();
const nextFile = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "server",
  "lib",
  "router-utils",
  "instrumentation-globals.external.js"
);

const appPathsManifest = path.join(
  projectRoot,
  ".next",
  "dev",
  "server",
  "app-paths-manifest.json"
);
const pagesManifest = path.join(
  projectRoot,
  ".next",
  "dev",
  "server",
  "pages-manifest.json"
);

const swcBinary = path.join(
  projectRoot,
  "node_modules",
  "@next",
  "swc-win32-x64-msvc",
  "next-swc.win32-x64-msvc.node"
);

let nextVersion = null;
let convexVersion = null;
try {
  nextVersion = JSON.parse(
    fs.readFileSync(
      path.join(projectRoot, "node_modules", "next", "package.json"),
      "utf8"
    )
  )?.version;
} catch {}
try {
  convexVersion = JSON.parse(
    fs.readFileSync(
      path.join(projectRoot, "node_modules", "convex", "package.json"),
      "utf8"
    )
  )?.version;
} catch {}

await post(
  "node/next env + critical file existence",
  {
    node: { version: process.version, platform: process.platform, arch: process.arch },
    pkg: { next: nextVersion, convex: convexVersion },
    exists: {
      nextInstrumentationGlobals: exists(nextFile),
      swcBinary: exists(swcBinary),
      appPathsManifest: exists(appPathsManifest),
      pagesManifest: exists(pagesManifest),
    },
  },
  "H1"
);

// H2: next/dist may be incomplete even if package.json exists
await post(
  "next/dist/server/lib/router-utils directory listing (first 50)",
  (() => {
    const dir = path.dirname(nextFile);
    try {
      const items = fs.readdirSync(dir).slice(0, 50);
      return { dir, items };
    } catch (e) {
      return { dir, error: String(e?.message ?? e) };
    }
  })(),
  "H2"
);

