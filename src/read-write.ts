import fs from "node:fs";
import path from "node:path";

export function readTxtFromFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

const OUT_DIR_NAME = "files-output";

export function writeHtmlToFile(html: string, withCss = true) {
  if (withCss) {
    const css = readTxtFromFile(path.resolve(process.cwd(), "src/card.css"));
    html = `${html}<style>${css}</style>`;
  }

  const outDir = path.resolve(process.cwd(), OUT_DIR_NAME);
  fs.mkdirSync(outDir, { recursive: true });

  // 以标题中的英文标识或默认文件名保存
  const idMatch = html.match(/<h5 id="([^"]+)">/);
  const fileName = idMatch ? `${idMatch[1]}.html` : "monster.html";

  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, html, "utf8");
  console.log(`Wrote: ${path.relative(process.cwd(), filePath)}`);
}
