const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const source = path.join(root, "public");
const output = path.join(root, "dist");

fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(source, output, { recursive: true });
fs.copyFileSync(path.join(root, "tokens.css"), path.join(output, "tokens.css"));

for (const required of ["index.html", "app.js", "styles.css", "tokens.css", "sw.js", "manifest.webmanifest"]) {
  if (!fs.existsSync(path.join(output, required))) {
    throw new Error(`Thiếu tệp production: ${required}`);
  }
}

console.log(`Đã tạo bản production tại ${output}`);
