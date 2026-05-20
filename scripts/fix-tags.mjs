import { readFileSync, writeFileSync } from "fs";

const files = process.argv.slice(2);
const openDiv = "<" + "div";
const closeDiv = "</" + "div" + ">";

for (const p of files) {
  let c = readFileSync(p, "utf8");
  c = c.replace(/<\/motion>(?![.\w])/g, closeDiv);
  c = c.replace(/<motion className=/g, openDiv + " className=");
  c = c.replace(/<motionclassName=/g, openDiv + "className=");
  writeFileSync(p, c);
  console.log("fixed", p);
}
