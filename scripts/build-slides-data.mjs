// Sinh bản nháp lib/slides/data.ts từ tài liệu nguồn đã chuyển sang markdown.
// Chạy MỘT LẦN. Sau đó data.ts là nguồn sự thật và được chỉnh tay.
import fs from "node:fs";

const MD = ".tmp/noidung.md";
const MEDIA = JSON.parse(fs.readFileSync("lib/slides/media-map.json", "utf8"));
const AUDIT = JSON.parse(fs.readFileSync("lib/slides/image-audit.json", "utf8"));
const OUT = "lib/slides/data.ts";
const MAX = 30;

/** Tách một câu thành các cụm không quá MAX ký tự, ưu tiên cắt ở dấu câu. */
function toPhrases(text) {
  const words = text.trim().replace(/\s+/g, " ").split(" ");
  const out = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    // Cắt khi vượt ngưỡng, hoặc khi cụm hiện tại vừa kết thúc bằng dấu câu.
    if (cur && (next.length > MAX || /[,;:.]$/.test(cur))) {
      out.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) out.push(cur);
  return out.length ? out : [text];
}

const lines = fs.readFileSync(MD, "utf8").split(/\r?\n/);
const HEAD = /^#?\s*\*{0,2}S(?:LIDE|ILDE)\s*([\d\s+]+)/i;

const sections = [];
let cur = null;
for (const raw of lines) {
  const l = raw.trim();
  const head = l.match(HEAD);
  if (head) {
    // Chỉ lấy số nằm ngay sau chữ "SLIDE"; tiêu đề cùng dòng có thể chứa năm học.
    const nums = (head[1].match(/\d+/g) ?? []).map(Number);
    cur = { numbers: nums, title: "", lead: "", bullets: [], footnote: "", imageHint: "" };
    sections.push(cur);
    continue;
  }
  if (!cur) continue;
  const plain = l.replace(/\*/g, "").replace(/^#\s*/, "").trim();
  if (/^#\s+\S/.test(raw) && !cur.title) cur.title = plain.replace(/\s*\(\d+\s*TRANG\)|\s*\(1 trang riêng\)/i, "");
  else if (plain.startsWith("Dòng khái quát:")) cur.lead = plain.slice("Dòng khái quát:".length).trim();
  else if (plain.startsWith("Hình ảnh minh chứng:")) cur.imageHint = plain.slice("Hình ảnh minh chứng:".length).trim();
  else if (plain.startsWith("Chú thích chân trang:")) cur.footnote = plain.slice("Chú thích chân trang:".length).trim();
  else if (/^-\s/.test(l)) cur.bullets.push(plain.replace(/^-\s*/, ""));
}

function densityFor(count) {
  if (count <= 5) return "thoang";
  if (count <= 7) return "vua";
  return "day";
}

function imagesFor(slideNumber, role) {
  const files = MEDIA[String(slideNumber)] ?? [];
  return files.map((src, i) => ({
    src: `/media/slides/${src}`,
    alt: "",
    caption: ["Chờ chú thích"],
    role: i === 0 ? role : "phu",
    screenshot: AUDIT[src]?.screenshot ?? false,
  }));
}

const slides = [];
for (const s of sections) {
  const pages = s.numbers.length > 1 ? s.numbers : [s.numbers[0]];
  pages.forEach((number, pageIndex) => {
    const half = Math.ceil(s.bullets.length / pages.length);
    const bullets = pages.length > 1
      ? s.bullets.slice(pageIndex * half, (pageIndex + 1) * half)
      : s.bullets;
    slides.push({
      kind: s.bullets.length === 0 ? "divider" : "content",
      number,
      density: densityFor(bullets.length),
      title: toPhrases(s.title),
      lead: pageIndex === 0 && s.lead ? toPhrases(s.lead) : undefined,
      bullets: bullets.map(toPhrases),
      footnote: s.footnote ? toPhrases(s.footnote) : undefined,
      note: s.imageHint ? toPhrases(s.imageHint) : undefined,
      continued: pageIndex > 0 || undefined,
      images: imagesFor(number, "chinh"),
    });
  });
}

slides.sort((a, b) => a.number - b.number);

const body = slides.map((s) => JSON.stringify(s, null, 2)).join(",\n");
fs.writeFileSync(OUT, `import type { Slide } from "@/lib/slides/types";

/**
 * Dữ liệu 38 slide. Sinh một lần từ tài liệu nguồn bằng
 * scripts/build-slides-data.mjs, sau đó chỉnh tay và là nguồn sự thật.
 * KHÔNG chạy lại script lên file này.
 */
export const SLIDES = [
${body}
] as const satisfies readonly Slide[];
`);

console.log(`Đã sinh ${slides.length} slide vào ${OUT}`);
const missing = slides.filter((s) => s.images.length === 0).map((s) => s.number);
if (missing.length) console.warn("Slide chưa có ảnh:", missing.join(", "));
