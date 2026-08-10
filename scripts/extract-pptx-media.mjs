// Rút ảnh từ file PPTX và dựng bản đồ slide -> danh sách ảnh nội dung.
// Hai ảnh đầu của mỗi slide luôn là hai logo (s{N}_img1 và s{N}_img2) nên bị loại.
import { execFileSync } from "node:child_process";
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
execFileSync("unzip", ["-qo", PPTX, "ppt/media/*", "-d", work]);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(MAP_FILE), { recursive: true });

const mediaDir = path.join(work, "ppt", "media");
const map = {};

// Tìm tất cả ảnh, nhóm theo slide
const imagesBySlide = new Map();
for (const file of fs.readdirSync(mediaDir)) {
  const match = file.match(/^s(\d+)_img(\d+)\./);
  if (!match) continue;

  const slideNum = parseInt(match[1], 10);
  const imgIndex = parseInt(match[2], 10);

  if (!imagesBySlide.has(slideNum)) {
    imagesBySlide.set(slideNum, []);
  }
  imagesBySlide.get(slideNum).push({ imgIndex, file });
}

// Xử lý từng slide: lấy tất cả ảnh trừ img1 và img2 (hai logo)
for (let slide = 1; slide <= TOTAL_SLIDES; slide += 1) {
  const images = imagesBySlide.get(slide) || [];
  const contentImages = images
    .filter(img => img.imgIndex > 2) // Bỏ logo
    .sort((a, b) => a.imgIndex - b.imgIndex)
    .map(img => img.file);

  for (const file of contentImages) {
    fs.copyFileSync(path.join(mediaDir, file), path.join(OUT_DIR, file));
  }
  map[slide] = contentImages;
}

fs.writeFileSync(MAP_FILE, `${JSON.stringify(map, null, 2)}\n`);
fs.rmSync(work, { recursive: true, force: true });

const total = Object.values(map).reduce((sum, list) => sum + list.length, 0);
console.log(`Đã rút ${total} ảnh nội dung cho ${TOTAL_SLIDES} slide vào ${OUT_DIR}`);
for (const [slide, list] of Object.entries(map)) {
  if (list.length === 0) console.warn(`  ⚠ slide ${slide} không có ảnh nội dung nào`);
}
