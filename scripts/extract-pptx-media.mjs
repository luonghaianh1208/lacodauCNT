// Rút ảnh từ file PPTX và dựng bản đồ slide -> danh sách ảnh nội dung.
// Hai ảnh đầu của mỗi slide luôn là hai logo (lặp lại đủ 38 lần) nên bị loại.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PPTX = process.argv[2];
const OUT_DIR = "public/media/slides";
const MAP_FILE = "lib/slides/media-map.json";
const TOTAL_SLIDES = 38;

if (!PPTX || !fs.existsSync(PPTX)) {
  console.error("Cách dùng: node scripts/extract-pptx-media.mjs <đường dẫn .pptx>");
  process.exit(1);
}

const work = fs.mkdtempSync(path.join(process.cwd(), ".pptx-"));
// Giải nén slides, relationships, và media. _rels phải được nêu tường minh vì unzip không chọn thư mục con tự động.
execFileSync("unzip", ["-qo", PPTX, "ppt/slides/*", "ppt/slides/_rels/*", "ppt/media/*", "-d", work]);

// Đếm số lần mỗi ảnh xuất hiện để nhận ra logo dùng chung.
const mediaDir = path.join(work, "ppt", "media");
const hashCount = new Map();
const hashOf = new Map();
for (const file of fs.readdirSync(mediaDir)) {
  const hash = createHash("md5").update(fs.readFileSync(path.join(mediaDir, file))).digest("hex");
  hashOf.set(file, hash);
  hashCount.set(hash, (hashCount.get(hash) ?? 0) + 1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(MAP_FILE), { recursive: true });

const map = {};
for (let slide = 1; slide <= TOTAL_SLIDES; slide += 1) {
  const relPath = path.join(work, "ppt", "slides", "_rels", `slide${slide}.xml.rels`);
  const xml = fs.readFileSync(path.join(work, "ppt", "slides", `slide${slide}.xml`), "utf8");
  const rels = fs.existsSync(relPath) ? fs.readFileSync(relPath, "utf8") : "";

  const idToFile = {};
  for (const m of rels.matchAll(/Id="(rId\d+)"[^>]*Target="\.\.\/media\/([^"]+)"/g)) {
    idToFile[m[1]] = m[2];
  }

  const used = [];
  for (const m of xml.matchAll(/r:embed="(rId\d+)"/g)) {
    const file = idToFile[m[1]];
    // Ảnh xuất hiện ở gần như mọi slide là logo dùng chung, không phải ảnh nội dung.
    if (!file || used.includes(file) || hashCount.get(hashOf.get(file)) >= TOTAL_SLIDES) {
      continue;
    }
    used.push(file);
  }

  for (const file of used) {
    fs.copyFileSync(path.join(mediaDir, file), path.join(OUT_DIR, file));
  }
  map[slide] = used;
}

fs.writeFileSync(MAP_FILE, `${JSON.stringify(map, null, 2)}\n`);
fs.rmSync(work, { recursive: true, force: true });

const total = Object.values(map).reduce((sum, list) => sum + list.length, 0);
console.log(`Đã rút ${total} ảnh nội dung cho ${TOTAL_SLIDES} slide vào ${OUT_DIR}`);
for (const [slide, list] of Object.entries(map)) {
  if (list.length === 0) console.warn(`  ⚠ slide ${slide} không có ảnh nội dung nào`);
}
