// Sinh docs/BAN-KE-ANH.md: bản kê từng ô ảnh của 38 slide, dùng khi thay ảnh tạm
// (rút từ file PPTX gốc) bằng ảnh chốt thật. Đọc lib/slides/data.ts (ảnh đang dùng),
// lib/slides/image-audit.json (cờ ảnh chụp màn hình) và băm md5 từng file trong
// public/media/slides để phát hiện ảnh dùng chung giữa nhiều slide.
//
//   node scripts/build-image-manifest.mjs
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_TS = path.join(ROOT, "lib/slides/data.ts");
const AUDIT_JSON = path.join(ROOT, "lib/slides/image-audit.json");
const MEDIA_DIR = path.join(ROOT, "public/media/slides");
const OUT_MD = path.join(ROOT, "docs/BAN-KE-ANH.md");

// Bốn chú thích đã soi bằng mắt và xác nhận sai so với nội dung ảnh thật — không
// suy ra được bằng máy nên ghi tay tại đây, nguồn:
// docs/superpowers/references/render-check/NOTES.md (mục "Còn tồn đọng" > B).
const KNOWN_CAPTION_MISMATCHES = [
  {
    slide: 9,
    files: ["s9_img3.jpg"],
    captionNow: '"Phiên tòa giả định" về phòng, chống bạo lực học đường',
    actual:
      'Băng rôn "CHƯƠNG TRÌNH NGOẠI KHÓA – XÂY DỰNG TÌNH BẠN ĐẸP, NÓI KHÔNG VỚI BẠO LỰC HỌC ĐƯỜNG"',
  },
  {
    slide: 20,
    files: ["s20_img5.jpg"],
    captionNow: "Giao lưu với lực lượng vũ trang",
    actual: 'Tranh đồ họa "Cách mạng màu"',
  },
  {
    slide: 24,
    files: ["s24_img6.jpg"],
    captionNow: 'Gói bánh chưng "Gói trọn vị nhà"',
    actual: 'Poster "MỞ ĐƠN ĐĂNG KÝ CÂU LẠC BỘ – ĐỢT I (2026-2027)"',
  },
  {
    slide: 36,
    files: ["s36_img4.jpg", "s36_img5.jpg", "s36_img6.jpg"],
    captionNow:
      "Khán giả tại concert / Trao biển hỗ trợ trên sân khấu / Tiết mục biểu diễn trên sân khấu concert",
    actual: "Lần lượt là poster gây quỹ, ảnh trao quà trong nhà dân, ảnh trao quà trong nhà dân",
  },
];

/**
 * data.ts dùng cú pháp TypeScript (`as const satisfies`). Node cần cờ
 * --experimental-strip-types để `import()` thẳng file .ts. Nếu tiến trình hiện
 * tại chưa bật cờ đó, tự chạy lại chính file này kèm cờ rồi thoát — người dùng
 * vẫn chỉ cần gõ `node scripts/build-image-manifest.mjs` như bình thường.
 */
async function loadSlides() {
  try {
    return (await import(pathToFileURL(DATA_TS).href)).SLIDES;
  } catch (err) {
    const alreadyRetried = process.execArgv.includes("--experimental-strip-types");
    if (err.code !== "ERR_UNKNOWN_FILE_EXTENSION" || alreadyRetried) throw err;
    execFileSync(
      process.execPath,
      ["--experimental-strip-types", fileURLToPath(import.meta.url)],
      { stdio: "inherit" },
    );
    process.exit(0);
  }
}

function textOf(phrases) {
  return phrases.join(" ");
}

function fileNameOf(src) {
  return src.split("/").pop();
}

function escapeCell(value) {
  return value.replace(/\|/g, "\\|");
}

/** Mọi ô ảnh của một slide, theo đúng thứ tự xuất hiện trong data.ts. */
function cellsOfSlide(slide) {
  const images = "images" in slide ? slide.images : [];
  const background = "background" in slide && slide.background ? [slide.background] : [];
  return [...images, ...background];
}

/**
 * Trong các tập hợp slide cùng dùng một ảnh (xét theo md5), tìm tập slide có
 * SỐ ẢNH GIỐNG HỆT NHAU DÙNG CHUNG lớn nhất — ví dụ ba slide cùng dùng chung cả
 * ba tấm ảnh thì "nặng" hơn hai slide chỉ chung một tấm. Ứng viên là mọi tập
 * slide từng xuất hiện làm chủ của một md5; với mỗi ứng viên, đếm bao nhiêu md5
 * có tập slide chứa TRỌN ứng viên đó (kể cả khi ảnh đó còn được slide khác dùng).
 */
function heaviestSharedCluster(slidesByHash) {
  const candidates = new Map();
  for (const set of slidesByHash.values()) {
    if (set.size < 2) continue;
    const key = [...set].sort((a, b) => a - b).join(",");
    candidates.set(key, set);
  }

  let best = null;
  for (const candidate of candidates.values()) {
    let count = 0;
    for (const set of slidesByHash.values()) {
      if ([...candidate].every((n) => set.has(n))) count += 1;
    }
    if (!best || count > best.count || (count === best.count && candidate.size > best.slides.size)) {
      best = { slides: candidate, count };
    }
  }
  return best;
}

function renderMismatchTable() {
  const rows = KNOWN_CAPTION_MISMATCHES.map((m) => {
    const files = m.files.map((f) => `\`${f}\``).join(", ");
    return `| ${m.slide} | ${files} | ${escapeCell(m.captionNow)} | ${escapeCell(m.actual)} |`;
  });
  return [
    "| Slide | File | Chú thích đang dùng | Ảnh thật vẽ gì |",
    "|---|---|---|---|",
    ...rows,
  ].join("\n");
}

function renderManifestTable(cells) {
  const rows = cells.map((cell) => {
    const notes = [];
    if (cell.screenshot) notes.push("ẢNH MÀN HÌNH — không dùng cho vai trò `nen`");
    if (cell.sharedWith.length > 0) {
      notes.push(`Dùng chung với slide ${cell.sharedWith.join(", ")}`);
    }
    const noteText = notes.length > 0 ? notes.join("; ") : "—";
    return [
      "|",
      cell.slideNumber,
      "|",
      escapeCell(cell.slideTitle),
      "| `" + cell.file + "`",
      "| `" + cell.role + "`",
      "|",
      escapeCell(cell.caption),
      "|",
      noteText,
      "|",
    ].join(" ");
  });
  return [
    "| Slide | Tiêu đề slide | File ảnh | Vai trò | Chú thích hiện tại | Ghi chú |",
    "|---|---|---|---|---|---|",
    ...rows,
  ].join("\n");
}

async function main() {
  const SLIDES = await loadSlides();
  const audit = JSON.parse(fs.readFileSync(AUDIT_JSON, "utf8"));

  const cells = [];
  for (const slide of SLIDES) {
    const slideTitle = textOf(slide.title).toLowerCase();
    for (const image of cellsOfSlide(slide)) {
      cells.push({
        slideNumber: slide.number,
        slideTitle,
        file: fileNameOf(image.src),
        role: image.role,
        caption: textOf(image.caption),
      });
    }
  }

  const hashCache = new Map();
  function hashOf(file) {
    if (!hashCache.has(file)) {
      const buffer = fs.readFileSync(path.join(MEDIA_DIR, file));
      hashCache.set(file, createHash("md5").update(buffer).digest("hex"));
    }
    return hashCache.get(file);
  }

  const slidesByHash = new Map();
  for (const cell of cells) {
    cell.hash = hashOf(cell.file);
    const set = slidesByHash.get(cell.hash) ?? new Set();
    set.add(cell.slideNumber);
    slidesByHash.set(cell.hash, set);
  }

  for (const cell of cells) {
    cell.sharedWith = [...slidesByHash.get(cell.hash)]
      .filter((n) => n !== cell.slideNumber)
      .sort((a, b) => a - b);
    cell.screenshot = audit[cell.file]?.screenshot === true;
  }

  // Slide có khả năng chứa ảnh (mọi loại trừ "kpi") nhưng không góp ô ảnh nào —
  // tính động thay vì ghi cứng số 25, để bản kê tự cập nhật nếu dữ liệu đổi.
  const slidesWithCells = new Set(cells.map((c) => c.slideNumber));
  const slidesWithNoImages = SLIDES.filter(
    (s) => s.kind !== "kpi" && !slidesWithCells.has(s.number),
  ).map((s) => s.number);

  const uniqueHashes = slidesByHash.size;
  const reusedCells = cells.length - uniqueHashes;
  const heaviest = heaviestSharedCluster(slidesByHash);

  const noImageSection = slidesWithNoImages
    .map(
      (n) =>
        `Slide ${n} đang để trống \`images\` — bộ ảnh trích từ PPTX gốc không có file ` +
        `\`s${n}_*\` nào tương ứng, nên panel ảnh của trang này trống trơn.`,
    )
    .join("\n");

  const heaviestText = heaviest
    ? `Dùng chung nhiều nhất hiện nay là slide ${[...heaviest.slides]
        .sort((a, b) => a - b)
        .join(", ")}, cùng lấy đúng ${heaviest.count} tấm ảnh giống hệt nhau.`
    : "Hiện không có slide nào dùng chung ảnh với slide khác.";

  const md = `# Bản kê ảnh — dùng để thay ảnh chốt

Ảnh hiện tại là **ảnh tạm** rút từ file PPTX. Để thay bằng ảnh chốt:

1. Đặt file mới vào \`public/media/slides/\` với **đúng tên file** trong bảng dưới, hoặc
2. Đổi trường \`src\` của ảnh tương ứng trong \`lib/slides/data.ts\`.

Sau khi thay, chạy lại \`node scripts/audit-images.mjs\` để đo lại, rồi \`npm run test\`
để chắc chắn không có ảnh màn hình nào lọt vào vai trò ảnh nền.

File này do \`scripts/build-image-manifest.mjs\` sinh tự động từ \`lib/slides/data.ts\` —
đừng sửa tay ở đây, sửa dữ liệu nguồn rồi chạy lại script để sinh lại.

## Ba việc cần ưu tiên khi gửi ảnh mới

### 1. Slide chưa có ảnh nào (ưu tiên cao nhất)

${noImageSection || "Hiện mọi slide đều có ít nhất một ảnh."}

### 2. Bốn chú thích đang ghi sai nội dung ảnh thật

${renderMismatchTable()}

Khi gửi ảnh mới cho các slide 9, 20, 24, 36, kiểm tra lại luôn cả phần chữ chú
thích đi kèm trong \`lib/slides/data.ts\` — đổi ảnh mà giữ nguyên chú thích cũ
(hoặc ngược lại, đổi chú thích mà giữ ảnh cũ) vẫn tiếp tục sai.

### 3. Nhiều ô ảnh đang dùng lại đúng một tấm ảnh

Trong ${cells.length} ô ảnh của 38 slide, chỉ có ${uniqueHashes} tấm ảnh mang nội dung
file thật sự khác nhau (so khớp bằng băm md5, không theo tên file) — nghĩa là
${reusedCells} ô ảnh đang dùng lại một tấm đã xuất hiện ở slide khác. ${heaviestText}
Nếu chỉ gửi được một phần ảnh mới trước, nên ưu tiên các slide đang dùng ảnh
riêng (không có cờ "Dùng chung..." trong bảng dưới), để không nhân bản cùng một
lỗi ra nhiều trang.

---

## Bảng đầy đủ ${cells.length} ô ảnh

Cột "Ghi chú" đánh dấu ảnh màn hình phần mềm (đo bằng \`scripts/audit-images.mjs\`,
không nên dùng cho vai trò ảnh nền \`nen\`) và ảnh đang dùng chung với slide khác.
${
  slidesWithNoImages.length > 0
    ? `Slide ${slidesWithNoImages.join(", ")} không có dòng nào ở đây vì không có ảnh nào cả — xem mục 1 ở trên.`
    : ""
}

${renderManifestTable(cells)}

---

_Bảng trên có ${cells.length} dòng, khớp tổng số ô ảnh (\`images\` + \`background\`) trong
\`lib/slides/data.ts\` tại thời điểm sinh file này._
`;

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md);
  console.log(`Đã ghi ${path.relative(ROOT, OUT_MD)} — ${cells.length} dòng ô ảnh.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
