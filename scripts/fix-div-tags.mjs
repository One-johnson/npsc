import { readFileSync, writeFileSync } from "fs";
import { globSync } from "fs";
import { join } from "path";

const root = join(import.meta.dirname, "..");
const files = globSync("components/**/*.tsx", { cwd: root });

for (const rel of files) {
  const p = join(root, rel);
  let c = readFileSync(p, "utf8");
  const before = c;
  c = c.replace(/<motion(\s|>)/g, "<div$1");
  const closeDiv = "</" + "d" + "i" + "v" + ">";
  c = c.replace(/<\/motion>(?![.\w])/g, closeDiv);
  if (c !== before) {
    writeFileSync(p, c);
    console.log("fixed", rel);
  }
}
