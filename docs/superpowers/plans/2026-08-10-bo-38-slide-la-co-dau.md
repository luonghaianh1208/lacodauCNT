# Bộ 38 slide web Lá cờ đầu — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mở rộng bản demo 3 slide thành bộ trình chiếu web 38 slide dựng trên sáu khuôn tái sử dụng, với dữ liệu rút tự động từ tài liệu nguồn và ảnh rút từ file PPTX.

**Architecture:** Dữ liệu 38 slide nằm trong `lib/slides/data.ts` (sinh một lần bằng script rồi chỉnh tay, sau đó là nguồn sự thật). Mỗi khuôn là một component riêng dưới `components/slides/`, chọn qua một router theo trường `kind`. Toàn bộ cỡ chữ dùng đơn vị `cqw` nhân với một biến mật độ `--s`, nên slide co giãn tuyệt đối theo màn hình. Vị trí panel trái/phải được **tính** từ thứ tự slide nội dung, không lưu trong dữ liệu.

**Tech Stack:** Next.js 16 (static export), React 19, TypeScript, Vitest + Testing Library, Chrome headless (có sẵn tại `C:/Program Files/Google/Chrome/Application/chrome.exe`) để kiểm tra thị giác.

## Global Constraints

- Thiết kế đã chốt nằm ở `docs/superpowers/specs/2026-08-10-bo-38-slide-la-co-dau-design.md`. Mọi con số trong đó là ràng buộc, không phải gợi ý.
- Font: Source Serif 4 (tiêu đề, số) + Archivo (thân bài), nạp qua `next/font/google` với `subsets: ["latin", "vietnamese"]`.
- Màu: `--navy #0b315d`, `--red #e32420`, `--red-ink #c81e1a`, `--blue #006ebb`, `--green #0e7a43`, `--yellow #ffd500`, `--paper #f4f7fb`.
- Mọi chuỗi hiển thị là `Phrases = readonly [string, ...string[]]`, không bao giờ là `string`.
- Không cụm từ nào dài quá 36 ký tự.
- Mọi lưới lồng nhau chứa ảnh phải dùng `minmax(0, 1fr)`, không dùng `1fr` trần.
- `* { box-sizing: border-box }` phải có trong `globals.css`.
- Giữ nguyên `output: "export"` trong `next.config.ts` — bộ slide phải chạy tĩnh trên Netlify.
- Tiếng Việt cho mọi chữ hiển thị và mọi comment mới; tên biến, tên file bằng tiếng Anh.
- Không chạy `git push`. Commit thì được, push để người dùng tự làm.

---

### Task 1: Đưa mockup đã duyệt vào repo làm tài liệu tham chiếu

CSS của sáu khuôn đã được dựng và kiểm chứng bằng ảnh chụp headless, nhưng đang nằm trong `.superpowers/` vốn bị gitignore. Không đưa vào repo thì người dựng sau không có nguồn sự thật cho bố cục.

**Files:**
- Create: `docs/superpowers/references/mockups/` (5 file HTML)
- Modify: `.gitignore` (không đổi — `.superpowers/` vẫn bị bỏ qua)

- [ ] **Step 1: Sao chép 5 mockup đã kiểm chứng**

```bash
cd web-demo-3-slides
mkdir -p docs/superpowers/references/mockups
SRC=".superpowers/brainstorm/665-1786336709/content"
cp "$SRC/cover-hero.html"        docs/superpowers/references/mockups/01-bia.html
cp "$SRC/all-archetypes.html"    docs/superpowers/references/mockups/02-noi-dung-phan-muc-ket-luan.html
cp "$SRC/slides-31-34-big.html"  docs/superpowers/references/mockups/03-so-lieu-mo-hinh.html
cp "$SRC/divider-levels.html"    docs/superpowers/references/mockups/04-muc-veil-phan-muc.html
cp "$SRC/motion-mix.html"        docs/superpowers/references/mockups/05-chuyen-dong.html
ls docs/superpowers/references/mockups/
```

Kỳ vọng: 5 file được liệt kê.

- [ ] **Step 2: Thêm README giải thích các file này dùng để làm gì**

Tạo `docs/superpowers/references/mockups/README.md`:

```markdown
# Mockup đã duyệt

Năm file HTML này là bản dựng đã được người dùng duyệt từng cái một trong giai đoạn thiết kế,
và đã kiểm chứng bằng ảnh chụp Chrome headless. Chúng là nguồn sự thật cho bố cục và CSS.

| File | Nội dung |
|---|---|
| `01-bia.html` | Khuôn bìa, hai phương án ảnh nền. Bản chốt là **A · Ra mắt nền tảng số** |
| `02-noi-dung-phan-muc-ket-luan.html` | Khuôn nội dung panel phải và panel trái, khuôn phân mục, khuôn kết luận |
| `03-so-lieu-mo-hinh.html` | Khuôn số liệu và khuôn mô hình + media, thang chữ theo mật độ |
| `04-muc-veil-phan-muc.html` | Ba mức veil cho trang phân mục. Bản chốt là **mức 2** |
| `05-chuyen-dong.html` | Hệ animation chạy được, kèm quy tắc trộn chuyển cảnh theo loại slide |

Các file dùng `src="/files/…"` vì được phục vụ qua máy chủ brainstorm. Khi mở trực tiếp,
đổi thành đường dẫn tương đối hoặc chỉ đọc phần CSS.
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/references/mockups/
git commit -m "docs: luu 5 mockup da duyet lam nguon su that cho bo cuc"
```

---

### Task 2: Kiểu `Phrases` và component `<Phrase>`

**Files:**
- Create: `lib/phrases.ts`
- Create: `components/Phrase.tsx`
- Test: `tests/phrases.test.tsx`

**Interfaces:**
- Produces: `type Phrases = readonly [string, ...string[]]`; `MAX_PHRASE_LENGTH = 36`; `phrasesToText(p: Phrases): string`; `<Phrase value={...} />`

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/phrases.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Phrase } from "@/components/Phrase";
import { MAX_PHRASE_LENGTH, phrasesToText } from "@/lib/phrases";

describe("Phrase", () => {
  it("nối các cụm bằng dấu cách thường để giữ nguyên câu đọc được", () => {
    render(
      <p data-testid="dong">
        <Phrase value={["BÁO CÁO KẾT QUẢ", "ĐƠN VỊ ĐĂNG KÝ", "LÁ CỜ ĐẦU"]} />
      </p>,
    );

    expect(screen.getByTestId("dong").textContent).toBe(
      "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU",
    );
  });

  it("bọc mỗi cụm trong một span không cho ngắt dòng", () => {
    const { container } = render(<Phrase value={["ĐƠN VỊ", "ĐĂNG KÝ"]} />);
    const spans = container.querySelectorAll("span.ph");

    expect(spans).toHaveLength(2);
    expect(spans[0].textContent).toBe("ĐƠN VỊ");
  });

  it("phrasesToText ghép lại đúng chuỗi gốc", () => {
    expect(phrasesToText(["Hơn 400 ĐVTN", "tham gia thi tìm hiểu pháp luật."])).toBe(
      "Hơn 400 ĐVTN tham gia thi tìm hiểu pháp luật.",
    );
  });

  it("ngưỡng độ dài cụm là 36 ký tự", () => {
    expect(MAX_PHRASE_LENGTH).toBe(36);
  });
});
```

- [ ] **Step 2: Chạy test để chắc chắn nó thất bại**

Run: `npm run test -- tests/phrases.test.tsx`
Expected: FAIL — không tìm thấy module `@/lib/phrases` và `@/components/Phrase`.

- [ ] **Step 3: Viết `lib/phrases.ts`**

```ts
/**
 * Một dòng chữ hiển thị, tách sẵn thành các cụm không được phép ngắt giữa chừng.
 *
 * CSS ngắt dòng ở mọi dấu cách và không hiểu ranh giới từ tiếng Việt, nên nếu để
 * chuỗi thường thì trình duyệt sẵn sàng tách "ĐƠN / VỊ" hay "NGUYỄN / TRÃI".
 * Kiểu mảng ép người soạn phải tự chọn chỗ ngắt; truyền chuỗi thường sẽ lỗi biên dịch.
 */
export type Phrases = readonly [string, ...string[]];

/** Cụm dài hơn ngưỡng này không ngắt được nên sẽ tràn khung ở một bố cục nào đó. */
export const MAX_PHRASE_LENGTH = 36;

export function phrasesToText(value: Phrases): string {
  return value.join(" ");
}
```

- [ ] **Step 4: Viết `components/Phrase.tsx`**

```tsx
import { Fragment } from "react";

import type { Phrases } from "@/lib/phrases";

/**
 * Nối các cụm bằng dấu cách thường nhưng bọc mỗi cụm trong `white-space: nowrap`,
 * nên trình duyệt chỉ được xuống dòng tại ranh giới do người soạn chọn.
 * Nội dung chữ đọc lên không đổi, accessible name và test không bị ảnh hưởng.
 */
export function Phrase({ value }: { value: Phrases }) {
  return (
    <>
      {value.map((chunk, index) => (
        <Fragment key={`${index}-${chunk}`}>
          {index > 0 ? " " : null}
          <span className="ph">{chunk}</span>
        </Fragment>
      ))}
    </>
  );
}
```

- [ ] **Step 5: Thêm class `.ph` vào `app/globals.css`**

Thêm vào đầu file, ngay sau khối `:root`:

```css
* {
  box-sizing: border-box;
}

/* Mỗi cụm từ tiếng Việt là một khối không được ngắt giữa chừng. */
.ph {
  white-space: nowrap;
}
```

- [ ] **Step 6: Chạy test để xác nhận đã qua**

Run: `npm run test -- tests/phrases.test.tsx`
Expected: PASS, 4 test.

- [ ] **Step 7: Commit**

```bash
git add lib/phrases.ts components/Phrase.tsx tests/phrases.test.tsx app/globals.css
git commit -m "feat: them kieu Phrases va component Phrase cho ngat dong tieng Viet"
```

---

### Task 3: Rút ảnh và bản đồ slide→ảnh từ PPTX

**Files:**
- Create: `scripts/extract-pptx-media.mjs`
- Create: `public/media/slides/` (ảnh được rút ra)
- Create: `lib/slides/media-map.json` (bản đồ sinh ra)

**Interfaces:**
- Produces: `public/media/slides/s{N}_img{K}.{ext}` và `lib/slides/media-map.json` dạng `{ "8": ["s8_img3.jpg", "s8_img4.jpg", "s8_img5.jpg"], ... }` — chỉ chứa ảnh nội dung, đã bỏ hai logo lặp ở mọi slide.

- [ ] **Step 1: Viết script**

Tạo `scripts/extract-pptx-media.mjs`:

```js
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
execFileSync("unzip", ["-qo", PPTX, "ppt/slides/*", "ppt/media/*", "-d", work]);

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
```

- [ ] **Step 2: Chạy script trên file PPTX thật**

```bash
cd web-demo-3-slides
node scripts/extract-pptx-media.mjs "../BÁO CÁO ĐOÀN CNT LÁ CỜ ĐẦU 25-26/Bao_cao_La_co_dau_CNT_2025-2026_EDITABLE_KHONG_VIDEO.pptx"
```

Expected: in ra "Đã rút 117 ảnh nội dung cho 38 slide" (193 lượt trừ 76 lượt logo = 117). Nếu có slide nào cảnh báo không có ảnh, ghi lại số slide đó để xử lý ở Task 6.

- [ ] **Step 3: Kiểm tra kết quả**

```bash
ls public/media/slides | wc -l
node -e "const m=require('./lib/slides/media-map.json'); console.log('slide co anh:', Object.values(m).filter(a=>a.length).length, '/ 38');"
```

Expected: số file khớp với số ảnh đã rút; ít nhất 34/38 slide có ảnh.

- [ ] **Step 4: Commit**

```bash
git add scripts/extract-pptx-media.mjs public/media/slides lib/slides/media-map.json
git commit -m "feat: rut anh va ban do slide-anh tu file PPTX"
```

---

### Task 4: Đo ảnh và gắn vai trò tự động

**Files:**
- Create: `scripts/audit-images.mjs`
- Create: `lib/slides/image-audit.json`
- Test: `tests/image-audit.test.ts`

**Interfaces:**
- Produces: `lib/slides/image-audit.json` dạng `{ "s8_img3.jpg": { "flat": 0.361, "white": 0.056, "screenshot": false }, ... }`

- [ ] **Step 1: Viết script đo bằng Chrome headless**

Tạo `scripts/audit-images.mjs`:

```js
// Đo hai chỉ số để tách ảnh chụp khỏi ảnh chụp màn hình phần mềm.
// Ngưỡng lấy từ spec: trắng > 0,25 hoặc phẳng > 0,65 thì là ảnh màn hình.
// Số liệu kiểm chứng: ảnh chụp có trắng <= 0,097 và phẳng <= 0,504;
// ảnh màn hình có trắng >= 0,436 và phẳng >= 0,717. Không có vùng chồng lấn.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME = process.env.CHROME_PATH
  ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const DIR = "public/media/slides";
const OUT = "lib/slides/image-audit.json";
const WHITE_LIMIT = 0.25;
const FLAT_LIMIT = 0.65;

const files = fs.readdirSync(DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
const page = path.join(process.cwd(), DIR, "__audit.html");

fs.writeFileSync(page, `<!doctype html><meta charset="utf-8"><pre id="o"></pre><script>
const files = ${JSON.stringify(files)};
function stats(img) {
  const W = 220, H = Math.round(W * img.naturalHeight / img.naturalWidth);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0, W, H);
  const d = x.getImageData(0, 0, W, H).data;
  let flat = 0, pairs = 0, white = 0;
  for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) {
    const p = (y * W + i) * 4, r = d[p], g = d[p+1], b = d[p+2];
    if (Math.min(r, g, b) > 232) white++;
    if (i < W - 1) { const q = p + 4; pairs++;
      if (Math.abs(d[q]-r) < 3 && Math.abs(d[q+1]-g) < 3 && Math.abs(d[q+2]-b) < 3) flat++; }
  }
  return { flat: +(flat / pairs).toFixed(3), white: +(white / (W * H)).toFixed(3) };
}
const out = {}; let done = 0;
files.forEach((f) => {
  const im = new Image();
  im.onload = im.onerror = () => {
    out[f] = im.naturalWidth ? stats(im) : { flat: -1, white: -1 };
    if (++done === files.length) document.getElementById('o').textContent = 'JSON:' + JSON.stringify(out);
  };
  im.src = f;
});
</script>`);

const dom = execFileSync(CHROME, [
  "--headless", "--disable-gpu", "--allow-file-access-from-files",
  "--virtual-time-budget=60000", "--dump-dom",
  `file:///${path.join(process.cwd(), DIR, "__audit.html").replace(/\\/g, "/")}`,
], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const raw = dom.match(/JSON:(\{.*?\})<\/pre>/s);
if (!raw) {
  console.error("Không đọc được kết quả đo. Kiểm tra đường dẫn Chrome.");
  process.exit(1);
}

const measured = JSON.parse(raw[1]);
const result = {};
for (const [file, m] of Object.entries(measured)) {
  result[file] = { ...m, screenshot: m.white > WHITE_LIMIT || m.flat > FLAT_LIMIT };
}

fs.writeFileSync(OUT, `${JSON.stringify(result, null, 2)}\n`);
fs.rmSync(page);
const shots = Object.values(result).filter((r) => r.screenshot).length;
console.log(`Đã đo ${Object.keys(result).length} ảnh, trong đó ${shots} ảnh màn hình bị loại khỏi vai trò ảnh nền.`);
```

- [ ] **Step 2: Chạy script**

```bash
node scripts/audit-images.mjs
```

Expected: in ra số ảnh đã đo và số ảnh màn hình. File `lib/slides/image-audit.json` được tạo.

- [ ] **Step 3: Viết test khóa ngưỡng**

Tạo `tests/image-audit.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import audit from "@/lib/slides/image-audit.json";

describe("bộ lọc ảnh màn hình", () => {
  it("mọi ảnh đều đo được, không ảnh nào lỗi giải mã", () => {
    for (const [file, m] of Object.entries(audit)) {
      expect(m.flat, `${file} không giải mã được`).toBeGreaterThanOrEqual(0);
      expect(m.white, `${file} không giải mã được`).toBeGreaterThanOrEqual(0);
    }
  });

  it("cờ screenshot khớp đúng ngưỡng đã chốt trong spec", () => {
    for (const [file, m] of Object.entries(audit)) {
      const expected = m.white > 0.25 || m.flat > 0.65;
      expect(m.screenshot, `${file} gắn cờ sai`).toBe(expected);
    }
  });
});
```

- [ ] **Step 4: Chạy test**

Run: `npm run test -- tests/image-audit.test.ts`
Expected: PASS, 2 test.

- [ ] **Step 5: Commit**

```bash
git add scripts/audit-images.mjs lib/slides/image-audit.json tests/image-audit.test.ts
git commit -m "feat: do anh tu dong de loai anh man hinh khoi vai tro anh nen"
```

---

### Task 5: Kiểu dữ liệu slide

**Files:**
- Create: `lib/slides/types.ts`
- Test: `tests/slides-types.test.ts`

**Interfaces:**
- Produces: `Density`, `ImageRole`, `SlideImage`, `CoverSlide`, `DividerSlide`, `ContentSlide`, `KpiSlide`, `ModelSlide`, `OutroSlide`, `Slide`

- [ ] **Step 1: Viết `lib/slides/types.ts`**

```ts
import type { Phrases } from "@/lib/phrases";

/** Núm điều khiển thang chữ. Chọn theo số gạch đầu dòng, xem `densityForBullets`. */
export type Density = "thoang" | "vua" | "day";

/** `nen` = ảnh tràn viền có chữ đè lên; `chinh` = ảnh dẫn dắt; `phu` = ảnh nhỏ. */
export type ImageRole = "nen" | "chinh" | "phu";

export type SlideImage = {
  src: string;
  alt: string;
  caption: Phrases;
  role: ImageRole;
};

type BaseSlide = {
  /** Số trang thật trong báo cáo, 1–38. Hiện ở góc slide. */
  number: number;
  density: Density;
  footnote?: Phrases;
  /** Ghi chú cho người thuyết trình. Thiếu thì màn điều khiển hiển thị `lead`. */
  note?: Phrases;
};

export type CoverSlide = BaseSlide & {
  kind: "cover";
  eyebrow: Phrases;
  title: Phrases;
  subtitle: Phrases;
  units: readonly Phrases[];
  date: Phrases;
  footer: Phrases;
  images: readonly SlideImage[];
};

export type DividerSlide = BaseSlide & {
  kind: "divider";
  /** Chữ cái phần: "A", "B", "C". */
  part: string;
  title: Phrases;
  toc: readonly Phrases[];
  background?: SlideImage;
};

export type ContentSlide = BaseSlide & {
  kind: "content";
  title: Phrases;
  lead?: Phrases;
  bullets: readonly Phrases[];
  images: readonly SlideImage[];
  /** Trang thứ hai của một mục trải 2 trang: bỏ `lead`, tiêu đề thêm "(tiếp)". */
  continued?: boolean;
};

export type KpiMetric = {
  value: string;
  label: Phrases;
  tone: "red" | "blue" | "green";
};

export type KpiSlide = BaseSlide & {
  kind: "kpi";
  title: Phrases;
  lead: Phrases;
  headline: string;
  headlineLabel: Phrases;
  metrics: readonly KpiMetric[];
};

export type ModelSlide = BaseSlide & {
  kind: "model";
  title: Phrases;
  url?: string;
  lead: Phrases;
  functions: readonly Phrases[];
  effects: readonly Phrases[];
  images: readonly SlideImage[];
  videoSrc?: string;
};

export type OutroSlide = BaseSlide & {
  kind: "outro";
  kicker: Phrases;
  title: Phrases;
  slogan: readonly Phrases[];
  lead: Phrases;
  stats: readonly KpiMetric[];
  background?: SlideImage;
};

export type Slide =
  | CoverSlide
  | DividerSlide
  | ContentSlide
  | KpiSlide
  | ModelSlide
  | OutroSlide;
```

- [ ] **Step 2: Viết test kiểm tra kiểu chặn được chuỗi thường**

Tạo `tests/slides-types.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import type { ContentSlide } from "@/lib/slides/types";

describe("kiểu dữ liệu slide", () => {
  it("chấp nhận mảng cụm từ cho mọi trường chữ", () => {
    const slide: ContentSlide = {
      kind: "content",
      number: 8,
      density: "thoang",
      title: ["1.3. Giáo dục truyền thống", "cách mạng, lòng yêu nước"],
      lead: ["Đoàn trường tổ chức nhiều hoạt động."],
      bullets: [["Cuộc thi kiến thức", "\"Dưới Ánh Sao Vàng\"."]],
      images: [],
    };

    expect(slide.title).toHaveLength(2);
    expect(slide.bullets[0]).toHaveLength(2);
  });

  it("từ chối chuỗi thường ở trường tiêu đề", () => {
    // @ts-expect-error tiêu đề phải là mảng cụm từ, không phải chuỗi
    const sai: ContentSlide["title"] = "1.3. Giáo dục truyền thống cách mạng";
    expect(typeof sai).toBe("string");
  });
});
```

- [ ] **Step 3: Chạy test và kiểm tra kiểu**

Run: `npm run test -- tests/slides-types.test.ts && npx tsc --noEmit`
Expected: test PASS; `tsc` không báo lỗi. Nếu `@ts-expect-error` bị báo "unused", nghĩa là kiểu đang cho phép chuỗi thường — sửa lại `Phrases`.

- [ ] **Step 4: Commit**

```bash
git add lib/slides/types.ts tests/slides-types.test.ts
git commit -m "feat: dinh nghia kieu du lieu cho sau khuon slide"
```

---

### Task 6: Sinh dữ liệu 38 slide từ tài liệu nguồn

**Files:**
- Create: `scripts/build-slides-data.mjs`
- Create: `lib/slides/data.ts` (sinh một lần, sau đó chỉnh tay và là nguồn sự thật)
- Test: `tests/slides-data.test.ts`

**Interfaces:**
- Produces: `export const SLIDES: readonly Slide[]` trong `lib/slides/data.ts`, đúng 38 phần tử, `number` chạy 1–38.

- [ ] **Step 1: Chuyển tài liệu nguồn sang markdown**

```bash
cd web-demo-3-slides
mkdir -p .tmp
pandoc "../BÁO CÁO ĐOÀN CNT LÁ CỜ ĐẦU 25-26/Noi_dung_PowerPoint_Bao_cao_Doan_truong_2025_2026.docx" \
  -t markdown --wrap=none -o .tmp/noidung.md
grep -c "Dòng khái quát" .tmp/noidung.md
```

Expected: in ra `27`.

- [ ] **Step 2: Viết script sinh dữ liệu**

Tạo `scripts/build-slides-data.mjs`. Script tách cụm từ tự động theo dấu câu và giới hạn 30 ký tự; kết quả là **bản nháp** cần người đọc lại.

```js
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
const isHead = (l) => /^#?\s*\*{0,2}S(?:LIDE|ILDE)\s*\d/i.test(l);

const sections = [];
let cur = null;
for (const raw of lines) {
  const l = raw.trim();
  if (isHead(l)) {
    const nums = (l.match(/\d+/g) ?? []).map(Number);
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
```

- [ ] **Step 3: Chạy script và xem kết quả**

```bash
node scripts/build-slides-data.mjs
node -e "const s=require('fs').readFileSync('lib/slides/data.ts','utf8'); console.log('so slide:', (s.match(/\"number\":/g)||[]).length);"
```

Expected: "Đã sinh 38 slide". Số `"number":` đếm được là 38.

- [ ] **Step 4: Chỉnh tay bản nháp**

Đây là bước dài nhất và **không tự động hóa được**. Mở `lib/slides/data.ts` và với từng slide:

1. Đổi `kind` cho các slide đặc biệt: slide 1 → `cover`; slide 2, 5, 33 → `divider`; slide 31, 32 → `kpi`; slide 34–37 → `model`; slide 38 → `outro`. Điền các trường riêng của từng khuôn theo `lib/slides/types.ts`.
2. Đọc lại từng mảng cụm từ. Script cắt theo dấu câu và độ dài, nên sẽ có chỗ cắt giữa cụm có nghĩa. Sửa cho đúng ranh giới từ tiếng Việt. Đây chính là quy tắc ở mục 4 của spec.
3. Điền `alt` và `caption` cho từng ảnh dựa trên trường `note` (vốn là gợi ý "Hình ảnh minh chứng" của tài liệu nguồn).
4. Với mỗi slide, chọn ảnh nào làm `nen` nếu khuôn cần: bỏ qua mọi ảnh có `screenshot: true`, rồi ưu tiên ảnh đông người trong bối cảnh sự kiện. Xóa trường tạm `screenshot` khỏi dữ liệu sau khi chọn xong.
5. Slide 1 dùng ảnh nền đã chốt là **Ra mắt nền tảng số**.

- [ ] **Step 5: Viết test khóa dữ liệu**

Tạo `tests/slides-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { MAX_PHRASE_LENGTH, type Phrases } from "@/lib/phrases";
import { SLIDES } from "@/lib/slides/data";

function allPhrases(value: unknown): Phrases[] {
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) return [value as unknown as Phrases];
    return value.flatMap(allPhrases);
  }
  if (value && typeof value === "object") return Object.values(value).flatMap(allPhrases);
  return [];
}

describe("dữ liệu 38 slide", () => {
  it("có đúng 38 slide, số trang chạy liên tục 1 đến 38", () => {
    expect(SLIDES).toHaveLength(38);
    expect(SLIDES.map((s) => s.number)).toEqual(
      Array.from({ length: 38 }, (_, i) => i + 1),
    );
  });

  it("không cụm từ nào dài quá ngưỡng", () => {
    for (const slide of SLIDES) {
      for (const phrases of allPhrases(slide)) {
        for (const chunk of phrases) {
          expect(
            chunk.length,
            `slide ${slide.number}: cụm "${chunk}" dài ${chunk.length} ký tự`,
          ).toBeLessThanOrEqual(MAX_PHRASE_LENGTH);
        }
      }
    }
  });

  it("không cụm từ nào rỗng", () => {
    for (const slide of SLIDES) {
      for (const phrases of allPhrases(slide)) {
        for (const chunk of phrases) {
          expect(chunk.trim().length, `slide ${slide.number} có cụm rỗng`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("mọi ảnh đóng vai trò nền đều không phải ảnh màn hình", async () => {
    const audit = (await import("@/lib/slides/image-audit.json")).default as Record<
      string,
      { screenshot: boolean }
    >;

    for (const slide of SLIDES) {
      const images = "images" in slide ? slide.images : [];
      for (const image of images) {
        if (image.role !== "nen") continue;
        const file = image.src.split("/").pop() as string;
        expect(
          audit[file]?.screenshot,
          `slide ${slide.number}: ${file} là ảnh màn hình, không được làm ảnh nền`,
        ).toBe(false);
      }
    }
  });

  it("mỗi slide có ảnh đều có alt và caption thật", () => {
    for (const slide of SLIDES) {
      const images = "images" in slide ? slide.images : [];
      for (const image of images) {
        expect(image.alt.trim(), `slide ${slide.number}: thiếu alt`).not.toBe("");
        expect(image.caption[0], `slide ${slide.number}: caption chưa điền`).not.toBe(
          "Chờ chú thích",
        );
      }
    }
  });
});
```

- [ ] **Step 6: Chạy test, sửa dữ liệu cho đến khi qua**

Run: `npm run test -- tests/slides-data.test.ts`
Expected: PASS, 5 test. Test thứ 2 và thứ 5 sẽ chỉ đúng tên slide đang sai để sửa.

- [ ] **Step 7: Commit**

```bash
git add scripts/build-slides-data.mjs lib/slides/data.ts tests/slides-data.test.ts
git commit -m "feat: du lieu 38 slide rut tu tai lieu nguon"
```

---

### Task 7: Helper thứ tự và vị trí panel

**Files:**
- Create: `lib/slides/index.ts`
- Test: `tests/slides-index.test.ts`

**Interfaces:**
- Produces: `SLIDES` (tái xuất), `panelSideFor(index: number): "left" | "right"`, `densityForBullets(count: number): Density`, `slideAt(index: number): Slide`, `clampIndex(index: number): number`

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/slides-index.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { SLIDES, clampIndex, densityForBullets, panelSideFor } from "@/lib/slides";

describe("helper slide", () => {
  it("mật độ chọn theo số gạch đầu dòng đúng ngưỡng spec", () => {
    expect(densityForBullets(3)).toBe("thoang");
    expect(densityForBullets(5)).toBe("thoang");
    expect(densityForBullets(6)).toBe("vua");
    expect(densityForBullets(7)).toBe("vua");
    expect(densityForBullets(8)).toBe("day");
    expect(densityForBullets(9)).toBe("day");
  });

  it("panel xen kẽ theo thứ tự slide có panel, không theo số trang chẵn lẻ", () => {
    const withPanel = SLIDES.map((s, i) => ({ s, i })).filter(
      ({ s }) => s.kind === "content" || s.kind === "model",
    );

    const sides = withPanel.map(({ i }) => panelSideFor(i));
    expect(sides[0]).toBe("right");
    expect(sides[1]).toBe("left");
    expect(sides[2]).toBe("right");

    // Không có hai slide có panel liền nhau nào cùng bên.
    for (let k = 1; k < sides.length; k += 1) {
      expect(sides[k], `slide thứ ${k} trùng bên với slide trước`).not.toBe(sides[k - 1]);
    }
  });

  it("clampIndex giữ chỉ số trong khoảng hợp lệ", () => {
    expect(clampIndex(-5)).toBe(0);
    expect(clampIndex(999)).toBe(SLIDES.length - 1);
    expect(clampIndex(7)).toBe(7);
  });
});
```

- [ ] **Step 2: Chạy test để chắc chắn nó thất bại**

Run: `npm run test -- tests/slides-index.test.ts`
Expected: FAIL — không tìm thấy module `@/lib/slides`.

- [ ] **Step 3: Viết `lib/slides/index.ts`**

```ts
import { SLIDES } from "@/lib/slides/data";
import type { Density, Slide } from "@/lib/slides/types";

export { SLIDES };
export type { Slide };

/** Slide có panel ảnh: khuôn nội dung và khuôn mô hình. */
function hasPanel(slide: Slide): boolean {
  return slide.kind === "content" || slide.kind === "model";
}

/**
 * Panel đổi bên theo thứ tự các slide CÓ PANEL liên tiếp, không theo số trang
 * chẵn lẻ — nếu theo số trang thì ba trang phân mục chen vào sẽ làm hai slide
 * có panel liền nhau rơi cùng một bên.
 */
export function panelSideFor(index: number): "left" | "right" {
  let count = 0;
  for (let i = 0; i < index; i += 1) {
    if (hasPanel(SLIDES[i])) count += 1;
  }
  return count % 2 === 0 ? "right" : "left";
}

export function densityForBullets(count: number): Density {
  if (count <= 5) return "thoang";
  if (count <= 7) return "vua";
  return "day";
}

export function clampIndex(index: number): number {
  return Math.min(SLIDES.length - 1, Math.max(0, index));
}

export function slideAt(index: number): Slide {
  return SLIDES[clampIndex(index)];
}
```

- [ ] **Step 4: Chạy test để xác nhận đã qua**

Run: `npm run test -- tests/slides-index.test.ts`
Expected: PASS, 3 test.

- [ ] **Step 5: Commit**

```bash
git add lib/slides/index.ts tests/slides-index.test.ts
git commit -m "feat: helper mat do va vi tri panel xen ke"
```

---

### Task 8: Font, token CSS và khung chung

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css` (thay toàn bộ phần token và khuôn slide)
- Create: `components/SlideChrome.tsx`
- Test: `tests/chrome.test.tsx`

**Interfaces:**
- Consumes: `Phrase` (Task 2), `Slide` (Task 5)
- Produces: `<SlideChrome slide={...} onDark={boolean} />` render thanh cờ, cụm logo, số trang, chú thích chân trang.

- [ ] **Step 1: Nạp font trong `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Báo cáo Lá cờ đầu · THPT Chuyên Nguyễn Trãi",
  description: "Bộ trình chiếu web 38 slide báo cáo công tác Đoàn năm học 2025–2026.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={`${archivo.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Thay khối token trong `app/globals.css`**

Thay khối `:root` hiện có (dòng 1–12) bằng:

```css
:root {
  --navy: #0b315d;
  --navy-deep: #071a30;
  --paper: #f4f7fb;
  --line: #c4d5e5;
  --ink: #0b315d;
  --muted: #52708c;
  --red: #e32420;
  --red-ink: #c81e1a;
  --blue: #006ebb;
  --green: #0e7a43;
  --yellow: #ffd500;
}

* {
  box-sizing: border-box;
}

.ph {
  white-space: nowrap;
}

.slide-stage {
  container-type: inline-size;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans), Arial, sans-serif;

  /* Núm mật độ: chỉ biến này đổi giữa các slide. */
  --s: 1;

  --fs-display: calc(8.3cqw * var(--s));
  --fs-h1: calc(2.9cqw * var(--s));
  --fs-metric: calc(2.6cqw * var(--s));
  --fs-lead: calc(1.55cqw * var(--s));
  --fs-body: calc(1.42cqw * var(--s));
  --fs-label: calc(1.25cqw * var(--s));
  --fs-cap: calc(1.1cqw * var(--s));

  /* Khung không co giãn theo mật độ, giữ ổn định suốt bộ slide. */
  --fs-brand: 1.15cqw;
  --fs-brandsub: 0.95cqw;
  --fs-foot: 1cqw;
  --fs-num: 1.15cqw;

  --chrome-ink: var(--navy);
  --chrome-sub: var(--muted);
}

.slide-stage[data-density="thoang"] { --s: 1.2; }
.slide-stage[data-density="vua"] { --s: 1; }
.slide-stage[data-density="day"] { --s: 0.87; }

.slide-stage[data-on-dark="true"] {
  --chrome-ink: #fff;
  --chrome-sub: #a9c6de;
}

.slide-stage img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.serif {
  font-family: var(--font-serif), Georgia, serif;
}

.slide-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 8;
  width: 1.5cqw;
  background: var(--red);
  box-shadow: 0.5cqw 0 0 var(--yellow);
  transform-origin: top;
}

.slide-brand {
  position: absolute;
  top: 2.6cqw;
  left: 4.6cqw;
  z-index: 7;
  display: flex;
  height: 3.6cqw;
  align-items: center;
  gap: 0.9cqw;
  color: var(--chrome-ink);
}

.slide-brand img { width: auto; height: 100%; object-fit: contain; }
.slide-brand div { display: flex; flex-direction: column; gap: 0.2cqw; }
.slide-brand strong { font-size: var(--fs-brand); letter-spacing: 0.07em; }
.slide-brand span { font-size: var(--fs-brandsub); color: var(--chrome-sub); }

.slide-num {
  position: absolute;
  right: 3.4cqw;
  top: 3.1cqw;
  z-index: 7;
  color: var(--chrome-sub);
  font-size: var(--fs-num);
  font-weight: 700;
  letter-spacing: 0.1em;
}

.slide-foot {
  position: absolute;
  left: 4.6cqw;
  bottom: 1.8cqw;
  z-index: 7;
  max-width: 44cqw;
  margin: 0;
  color: var(--chrome-sub);
  font-size: var(--fs-foot);
}

/* Chữ khung nằm trên ảnh thì phải có bóng, vì ảnh có thể sáng bất kỳ chỗ nào. */
.slide-stage[data-over-photo="true"] .slide-brand strong,
.slide-stage[data-over-photo="true"] .slide-brand span,
.slide-stage[data-over-photo="true"] .slide-num {
  color: #fff;
  text-shadow: 0 0.1cqw 0.45cqw rgba(3, 14, 28, 0.85);
}
```

- [ ] **Step 3: Viết `components/SlideChrome.tsx`**

```tsx
import Image from "next/image";

import { Phrase } from "@/components/Phrase";
import type { Slide } from "@/lib/slides/types";

/** Thanh cờ, cụm nhận diện, số trang và chú thích chân trang — giống nhau ở mọi khuôn. */
export function SlideChrome({
  slide,
  footAlign = "left",
}: {
  slide: Slide;
  footAlign?: "left" | "right";
}) {
  return (
    <>
      <div className="slide-bar" />
      <div className="slide-brand">
        <Image
          src="/media/school-logo.png"
          alt="Logo Trường THPT Chuyên Nguyễn Trãi"
          width={120}
          height={120}
          priority
        />
        <Image
          src="/media/youth-union-logo.png"
          alt="Logo Đoàn TNCS Hồ Chí Minh"
          width={120}
          height={120}
          priority
        />
        <div>
          <strong>
            <Phrase value={["ĐOÀN TRƯỜNG THPT CHUYÊN NGUYỄN TRÃI"]} />
          </strong>
          <span>Năm học 2025–2026</span>
        </div>
      </div>
      <div className="slide-num">{slide.number}</div>
      {slide.footnote ? (
        <p
          className="slide-foot"
          style={
            footAlign === "right"
              ? { left: "auto", right: "3.4cqw", textAlign: "right" }
              : undefined
          }
        >
          <Phrase value={slide.footnote} />
        </p>
      ) : null}
    </>
  );
}
```

- [ ] **Step 4: Viết test**

Tạo `tests/chrome.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlideChrome } from "@/components/SlideChrome";
import type { ContentSlide } from "@/lib/slides/types";

const slide: ContentSlide = {
  kind: "content",
  number: 8,
  density: "thoang",
  title: ["Tiêu đề"],
  bullets: [["Một dòng"]],
  images: [],
  footnote: ["Phần B.I – Mục 1.3."],
};

describe("SlideChrome", () => {
  it("hiện số trang, hai logo và chú thích chân trang", () => {
    render(<SlideChrome slide={slide} />);

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByAltText("Logo Trường THPT Chuyên Nguyễn Trãi")).toBeInTheDocument();
    expect(screen.getByAltText("Logo Đoàn TNCS Hồ Chí Minh")).toBeInTheDocument();
    expect(screen.getByText("Phần B.I – Mục 1.3.")).toBeInTheDocument();
  });

  it("không render chú thích khi slide không có", () => {
    render(<SlideChrome slide={{ ...slide, footnote: undefined }} />);
    expect(screen.queryByText(/Phần B.I/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Chạy test**

Run: `npm run test -- tests/chrome.test.tsx`
Expected: PASS, 2 test.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css components/SlideChrome.tsx tests/chrome.test.tsx
git commit -m "feat: nap font Viet, token thang chu va khung chung cho slide"
```

---

### Task 9: Khuôn nội dung — khuôn quan trọng nhất, 27/38 slide

**Files:**
- Create: `components/slides/ContentSlideView.tsx`
- Modify: `app/globals.css` (thêm CSS khuôn nội dung)
- Test: `tests/content-slide.test.tsx`

**Interfaces:**
- Consumes: `SlideChrome` (Task 8), `Phrase` (Task 2), `panelSideFor` (Task 7)
- Produces: `<ContentSlideView slide={ContentSlide} side={"left" | "right"} />`

CSS chính xác lấy từ `docs/superpowers/references/mockups/02-noi-dung-phan-muc-ket-luan.html`.

- [ ] **Step 1: Thêm CSS khuôn nội dung vào `app/globals.css`**

```css
.content-text {
  position: absolute;
  top: 8.4cqw;
  z-index: 5;
  display: grid;
  width: 43cqw;
  align-content: start;
  gap: 1.5cqw;
}

.content-media {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  display: grid;
  width: 48cqw;
  align-content: center;
  gap: 1.4cqw;
  padding: 0 3cqw;
  color: #fff;
  background: var(--navy);
}

.slide-stage[data-side="right"] .content-text { left: 4.6cqw; }
.slide-stage[data-side="right"] .content-media { right: 0; }
.slide-stage[data-side="left"] .content-text { right: 3.4cqw; }
.slide-stage[data-side="left"] .content-media { left: 0; padding-left: 4.6cqw; }

.content-title {
  margin: 0;
  font-size: var(--fs-h1);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.08;
}

.content-rule {
  width: 7cqw;
  height: 0.42cqw;
  border-radius: 99px;
  background: var(--red);
  transform-origin: left;
}

.content-lead {
  margin: 0;
  color: var(--muted);
  font-size: var(--fs-lead);
  line-height: 1.42;
}

.content-lead b { font-weight: 700; }
.content-lead b.tone-blue { color: var(--blue); }
.content-lead b.tone-green { color: var(--green); }
.content-lead b.tone-red { color: var(--red-ink); }

.content-bullets {
  display: grid;
  margin: 0;
  padding: 0;
  gap: 0.55cqw;
  list-style: none;
}

.content-bullets li {
  position: relative;
  padding-left: 1.35cqw;
  font-size: var(--fs-body);
  line-height: 1.34;
}

.content-bullets li::before {
  position: absolute;
  top: 0.5em;
  left: 0;
  width: 0.46cqw;
  height: 0.46cqw;
  border-radius: 50%;
  background: var(--blue);
  content: "";
}

.content-media figure { min-width: 0; margin: 0; }

.content-media figcaption {
  padding-top: 0.6cqw;
  color: #d6e6f4;
  font-size: var(--fs-cap);
  line-height: 1.3;
}

.media-lead > div {
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border-top: 0.3cqw solid var(--red);
}

.media-pair { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1.3cqw; }
.media-pair figure > div { overflow: hidden; aspect-ratio: 3 / 2; border-top: 0.3cqw solid var(--blue); }
.media-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1.3cqw; }
.media-grid figure > div { overflow: hidden; aspect-ratio: 3 / 2; border-top: 0.3cqw solid var(--blue); }
.media-solo > div { overflow: hidden; aspect-ratio: 4 / 3; border-top: 0.3cqw solid var(--red); }
```

- [ ] **Step 2: Viết test thất bại**

Tạo `tests/content-slide.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentSlideView } from "@/components/slides/ContentSlideView";
import type { ContentSlide } from "@/lib/slides/types";

const slide: ContentSlide = {
  kind: "content",
  number: 8,
  density: "thoang",
  title: ["1.3. Giáo dục truyền thống", "cách mạng, lòng yêu nước"],
  lead: ["Đoàn trường tổ chức", "nhiều hoạt động lịch sử."],
  bullets: [
    ["Cuộc thi kiến thức", "\"Dưới Ánh Sao Vàng\"."],
    ["Phim ngắn", "\"Mùa gió ngược\"."],
  ],
  images: [
    { src: "/media/slides/s8_img3.jpg", alt: "Triển lãm tranh", caption: ["Triển lãm tranh"], role: "chinh" },
    { src: "/media/slides/s8_img4.jpg", alt: "Giao lưu", caption: ["Giao lưu"], role: "phu" },
    { src: "/media/slides/s8_img5.jpg", alt: "Dâng hương", caption: ["Dâng hương"], role: "phu" },
  ],
  footnote: ["Phần B.I – Mục 1.3."],
};

describe("ContentSlideView", () => {
  it("render tiêu đề, dòng khái quát, đủ gạch đầu dòng và đủ ảnh", () => {
    render(<ContentSlideView slide={slide} side="right" />);

    expect(
      screen.getByRole("heading", {
        name: "1.3. Giáo dục truyền thống cách mạng, lòng yêu nước",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Đoàn trường tổ chức/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("figure")).toHaveLength(3);
  });

  it("gắn thuộc tính bên panel và mật độ lên khung slide", () => {
    const { container } = render(<ContentSlideView slide={slide} side="left" />);
    const stage = container.querySelector(".slide-stage") as HTMLElement;

    expect(stage.dataset.side).toBe("left");
    expect(stage.dataset.density).toBe("thoang");
    expect(stage.dataset.onDark).toBe("true");
  });

  it("thêm dấu (tiếp) và bỏ dòng khái quát ở trang thứ hai", () => {
    render(<ContentSlideView slide={{ ...slide, continued: true }} side="right" />);

    expect(screen.getByRole("heading", { name: /\(tiếp\)$/ })).toBeInTheDocument();
    expect(screen.queryByText(/Đoàn trường tổ chức/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Chạy test để chắc chắn nó thất bại**

Run: `npm run test -- tests/content-slide.test.tsx`
Expected: FAIL — không tìm thấy `@/components/slides/ContentSlideView`.

- [ ] **Step 4: Viết component**

```tsx
import Image from "next/image";

import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { ContentSlide, SlideImage } from "@/lib/slides/types";

function Figure({ image, className }: { image: SlideImage; className?: string }) {
  return (
    <figure className={className}>
      <div>
        <Image src={image.src} alt={image.alt} width={1280} height={720} />
      </div>
      <figcaption>
        <Phrase value={image.caption} />
      </figcaption>
    </figure>
  );
}

/**
 * Ruột panel đổi theo số ảnh: 1 ảnh tràn kín, 2 ảnh xếp dọc,
 * 3 ảnh là 1 lớn + 2 nhỏ, từ 4 ảnh trở lên là lưới 2 cột.
 */
function MediaPanel({ images }: { images: readonly SlideImage[] }) {
  if (images.length === 0) return <div className="content-media" />;
  if (images.length === 1) {
    return (
      <div className="content-media">
        <Figure image={images[0]} className="media-solo" />
      </div>
    );
  }
  if (images.length === 2) {
    return (
      <div className="content-media">
        <Figure image={images[0]} className="media-lead" />
        <Figure image={images[1]} className="media-lead" />
      </div>
    );
  }
  if (images.length === 3) {
    return (
      <div className="content-media">
        <Figure image={images[0]} className="media-lead" />
        <div className="media-pair">
          <Figure image={images[1]} />
          <Figure image={images[2]} />
        </div>
      </div>
    );
  }
  return (
    <div className="content-media">
      <div className="media-grid">
        {images.slice(0, 4).map((image) => (
          <Figure key={image.src} image={image} />
        ))}
      </div>
    </div>
  );
}

export function ContentSlideView({
  slide,
  side,
}: {
  slide: ContentSlide;
  side: "left" | "right";
}) {
  return (
    <div
      className="slide-stage"
      data-density={slide.density}
      data-side={side}
      data-on-dark={side === "left" ? "true" : "false"}
    >
      <MediaPanel images={slide.images} />
      <SlideChrome slide={slide} footAlign={side === "left" ? "right" : "left"} />
      <div className="content-text">
        <h1 className="content-title serif">
          <Phrase value={slide.title} />
          {slide.continued ? " (tiếp)" : null}
        </h1>
        <div className="content-rule" />
        {!slide.continued && slide.lead ? (
          <p className="content-lead">
            <Phrase value={slide.lead} />
          </p>
        ) : null}
        <ul className="content-bullets">
          {slide.bullets.map((bullet, index) => (
            <li key={`${index}-${bullet[0]}`}>
              <Phrase value={bullet} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Chạy test để xác nhận đã qua**

Run: `npm run test -- tests/content-slide.test.tsx`
Expected: PASS, 3 test.

- [ ] **Step 6: Commit**

```bash
git add components/slides/ContentSlideView.tsx tests/content-slide.test.tsx app/globals.css
git commit -m "feat: khuon noi dung voi panel anh doi ben"
```

---

### Task 10: Năm khuôn còn lại

**Files:**
- Create: `components/slides/CoverSlideView.tsx`
- Create: `components/slides/DividerSlideView.tsx`
- Create: `components/slides/KpiSlideView.tsx`
- Create: `components/slides/ModelSlideView.tsx`
- Create: `components/slides/OutroSlideView.tsx`
- Modify: `app/globals.css`
- Test: `tests/other-slides.test.tsx`

**Interfaces:**
- Consumes: `SlideChrome`, `Phrase`
- Produces: năm component nhận đúng một prop `slide` của kiểu tương ứng.

CSS chính xác lấy từ các mockup: bìa ở `01-bia.html` (bản A), phân mục ở `04-muc-veil-phan-muc.html` (mức 2), số liệu và mô hình ở `03-so-lieu-mo-hinh.html`, kết luận ở `02-noi-dung-phan-muc-ket-luan.html`.

- [ ] **Step 1: Viết test cho cả năm khuôn**

Tạo `tests/other-slides.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CoverSlideView } from "@/components/slides/CoverSlideView";
import { DividerSlideView } from "@/components/slides/DividerSlideView";
import { KpiSlideView } from "@/components/slides/KpiSlideView";
import { ModelSlideView } from "@/components/slides/ModelSlideView";
import { OutroSlideView } from "@/components/slides/OutroSlideView";
import type {
  CoverSlide,
  DividerSlide,
  KpiSlide,
  ModelSlide,
  OutroSlide,
} from "@/lib/slides/types";

const cover: CoverSlide = {
  kind: "cover", number: 1, density: "vua",
  eyebrow: ["BCH ĐOÀN TRƯỜNG", "THPT CHUYÊN NGUYỄN TRÃI"],
  title: ["BÁO CÁO KẾT QUẢ", "ĐƠN VỊ ĐĂNG KÝ", "LÁ CỜ ĐẦU"],
  subtitle: ["trong công tác Đoàn"],
  units: [["ĐOÀN PHƯỜNG LÊ THANH NGHỊ"]],
  date: ["P. Lê Thanh Nghị,", "ngày 12 tháng 8 năm 2026"],
  footer: ["HẢI PHÒNG · 2026"],
  images: [
    { src: "/media/slides/a.jpg", alt: "Nền", caption: ["Nền"], role: "nen" },
    { src: "/media/slides/b.jpg", alt: "Phụ 1", caption: ["Phụ 1"], role: "phu" },
    { src: "/media/slides/c.jpg", alt: "Phụ 2", caption: ["Phụ 2"], role: "phu" },
    { src: "/media/slides/d.jpg", alt: "Phụ 3", caption: ["Phụ 3"], role: "phu" },
  ],
};

const divider: DividerSlide = {
  kind: "divider", number: 5, density: "vua", part: "B",
  title: ["THÀNH TÍCH ĐẠT ĐƯỢC", "TRONG NĂM HỌC 2025–2026"],
  toc: [["Công tác giáo dục"], ["Hội nhập quốc tế"]],
  background: { src: "/media/slides/e.jpg", alt: "Nền", caption: ["Nền"], role: "nen" },
};

const kpi: KpiSlide = {
  kind: "kpi", number: 31, density: "thoang",
  title: ["6. Kết quả thực hiện", "chỉ tiêu năm học"],
  lead: ["Đoàn trường hoàn thành", "15/15 nhóm chỉ tiêu."],
  headline: "15/15",
  headlineLabel: ["NHÓM CHỈ TIÊU HOÀN THÀNH"],
  metrics: [
    { value: "05 · 11", label: ["05 công trình."], tone: "blue" },
    { value: "80 · 27", label: ["27 kết nạp Đảng."], tone: "red" },
  ],
};

const model: ModelSlide = {
  kind: "model", number: 34, density: "vua",
  title: ["1. Mô hình 1 – Nền tảng số"],
  url: "https://doantruong.chuyennguyentrai.edu.vn",
  lead: ["Nền tảng tích hợp", "06 nhóm chức năng."],
  functions: [["Quản lý nền nếp."], ["Khen thưởng."]],
  effects: [["Dữ liệu tập trung."]],
  images: [{ src: "/media/slides/f.png", alt: "Giao diện", caption: ["Giao diện"], role: "phu" }],
  videoSrc: "/media/platform-demo.mp4",
};

const outro: OutroSlide = {
  kind: "outro", number: 38, density: "vua",
  kicker: ["KẾT LUẬN"],
  title: ["Tuổi trẻ Chuyên Nguyễn Trãi"],
  slogan: [["Bản lĩnh"], ["Trí tuệ"], ["Sáng tạo"], ["Cống hiến"]],
  lead: ["Đoàn trường hoàn thành", "toàn diện nhiệm vụ."],
  stats: [{ value: "37", label: ["chi đoàn"], tone: "blue" }],
};

describe("năm khuôn còn lại", () => {
  it("bìa render tiêu đề và đủ bốn ảnh", () => {
    render(<CoverSlideView slide={cover} />);
    expect(
      screen.getByRole("heading", { name: "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(3);
    expect(screen.getByText("HẢI PHÒNG · 2026")).toBeInTheDocument();
  });

  it("trang phân mục render chữ cái phần và nhãn PHẦN", () => {
    render(<DividerSlideView slide={divider} />);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("PHẦN")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "THÀNH TÍCH ĐẠT ĐƯỢC TRONG NĂM HỌC 2025–2026" }),
    ).toBeInTheDocument();
  });

  it("khuôn số liệu render con số chủ đạo và đúng số thẻ", () => {
    render(<KpiSlideView slide={kpi} />);
    expect(screen.getByText("15/15")).toBeInTheDocument();
    expect(screen.getAllByTestId("kpi-metric")).toHaveLength(2);
  });

  it("khuôn mô hình render URL, danh sách và thẻ video", () => {
    render(<ModelSlideView slide={model} />);
    expect(screen.getByText("https://doantruong.chuyennguyentrai.edu.vn")).toBeInTheDocument();
    expect(screen.getAllByTestId("model-function")).toHaveLength(2);
    expect(screen.getByTestId("model-video")).toHaveAttribute("src", "/media/platform-demo.mp4");
  });

  it("khuôn kết luận render thông điệp và dải chỉ số", () => {
    render(<OutroSlideView slide={outro} />);
    expect(screen.getByRole("heading", { name: "Tuổi trẻ Chuyên Nguyễn Trãi" })).toBeInTheDocument();
    expect(screen.getAllByTestId("outro-stat")).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Chạy test để chắc chắn nó thất bại**

Run: `npm run test -- tests/other-slides.test.tsx`
Expected: FAIL — chưa có component nào.

- [ ] **Step 3: Viết `components/slides/DividerSlideView.tsx` làm mẫu cho bốn cái còn lại**

```tsx
import Image from "next/image";

import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { DividerSlide } from "@/lib/slides/types";

export function DividerSlideView({ slide }: { slide: DividerSlide }) {
  return (
    <div
      className="slide-stage divider-stage"
      data-density={slide.density}
      data-on-dark="true"
      data-over-photo={slide.background ? "true" : "false"}
    >
      {slide.background ? (
        <>
          <div className="divider-bg">
            <Image
              src={slide.background.src}
              alt={slide.background.alt}
              width={1280}
              height={720}
            />
          </div>
          <div className="divider-veil" />
        </>
      ) : null}
      <SlideChrome slide={slide} />
      <div className="divider-wrap">
        <div className="divider-part">
          <span>
            <Phrase value={["PHẦN"]} />
          </span>
          <b className="serif">{slide.part}</b>
        </div>
        <h1 className="serif">
          <Phrase value={slide.title} />
        </h1>
        <div className="divider-rule" />
        <p className="divider-toc">
          {slide.toc.map((entry, index) => (
            <span key={`${index}-${entry[0]}`}>
              {index > 0 ? " · " : null}
              <Phrase value={entry} />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
```

CSS tương ứng, thêm vào `app/globals.css`:

```css
.divider-stage { color: #fff; background: var(--navy); }
.divider-bg { position: absolute; inset: 0; }
/* Ảnh nền KHÔNG giảm opacity — chỉ một lớp veil, nếu không ảnh sẽ tối gấp đôi. */
.divider-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(7, 26, 48, 0.92) 0%, rgba(7, 26, 48, 0.88) 40%, rgba(7, 26, 48, 0.38) 70%, rgba(7, 26, 48, 0.16) 100%);
}
.divider-wrap {
  position: absolute;
  inset: 0 8cqw 0 4.6cqw;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.divider-part { display: flex; flex-direction: column; align-items: flex-start; gap: 0.6cqw; }
.divider-part span { color: #e4eef8; font-size: 1.5cqw; font-weight: 800; letter-spacing: 0.28em; text-shadow: 0 0.1cqw 0.45cqw rgba(3, 14, 28, 0.7); }
.divider-part b { color: var(--yellow); font-size: 11cqw; font-weight: 700; line-height: 0.8; text-shadow: 0 0.2cqw 0.9cqw rgba(3, 14, 28, 0.6); }
.divider-wrap h1 { max-width: 62cqw; margin: 2.4cqw 0 0; font-size: 4.4cqw; font-weight: 700; line-height: 1.06; text-shadow: 0 0.12cqw 0.5cqw rgba(3, 14, 28, 0.55); }
.divider-rule { width: 9cqw; height: 0.5cqw; margin: 2.4cqw 0 1.8cqw; border-radius: 99px; background: var(--red); }
.divider-toc { max-width: 58cqw; margin: 0; color: #d4e4f2; font-size: 1.7cqw; line-height: 1.5; text-shadow: 0 0.1cqw 0.4cqw rgba(3, 14, 28, 0.6); }
```

- [ ] **Step 4: Viết bốn component còn lại theo đúng khuôn mẫu trên**

`CoverSlideView`, `KpiSlideView`, `ModelSlideView`, `OutroSlideView` dùng cùng cấu trúc: bọc trong `div.slide-stage` có `data-density`, gọi `SlideChrome`, mọi chuỗi đi qua `Phrase`. Cấu trúc DOM và giá trị CSS lấy nguyên từ mockup đã commit ở Task 1.

**Chữ ký prop phải khớp với chỗ gọi ở Task 11 — hai prop dưới đây là tuỳ chọn:**

```tsx
export function KpiSlideView({ slide, animate = false }: { slide: KpiSlide; animate?: boolean }) {}
export function ModelSlideView({
  slide, side = "right", videoRef, videoBlocked = false, onVideoFallback,
}: {
  slide: ModelSlide;
  side?: "left" | "right";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
}) {}
```

`animate` bật hiệu ứng đếm số của khuôn số liệu; khi `false` thì hiện thẳng giá trị cuối để ô xem trước ở màn điều khiển không nhấp nháy.

Ràng buộc cụ thể phải giữ đúng:
- **Bìa**: `data-over-photo="true"`. Ảnh `role: "nen"` phủ `inset: 0 0 36% 0`, veil `linear-gradient(95deg, rgba(7,26,48,.96) 0%, rgba(7,26,48,.9) 40%, rgba(7,26,48,.3) 72%, rgba(7,26,48,.15) 100%)`. Ảnh nền của slide 1 có chữ lớn trên màn LED nên veil vùng tiêu đề tăng lên `.97` và `.93`. Băng ba ảnh phụ dùng lưới `grid-template-rows: minmax(0, 1fr)` cho băng và `minmax(0, 1fr) auto` cho từng figure. Khối đơn vị trên tấm `rgba(255,255,255,.9)` có `backdrop-filter: blur(.8cqw)`, viền trái `.34cqw solid var(--red)`, chữ `var(--navy)`.
- **Phân mục**: `data-over-photo="true"`, `data-on-dark="true"`. Veil mức 2: `linear-gradient(90deg, rgba(7,26,48,.92) 0%, rgba(7,26,48,.88) 40%, rgba(7,26,48,.38) 70%, rgba(7,26,48,.16) 100%)`. Ảnh nền **không** giảm opacity. Chữ cái phần cỡ `11cqw` màu `var(--yellow)`, nhãn "PHẦN" nằm **trên** chữ cái.
- **Số liệu**: con số chủ đạo nằm ngang cạnh nhãn, lưới thẻ `repeat(3, minmax(0, 1fr))` × `repeat(2, minmax(0, 1fr))`. Mỗi thẻ có `data-testid="kpi-metric"`, viền trái và màu số theo `tone`.
- **Mô hình**: panel navy phải rộng 48cqw, `align-content: center`. Video trong khung `aspect-ratio: 16/9` **không** dùng `object-fit: cover` để không cắt hình. Thẻ `<video data-testid="model-video">` nhận `ref` từ bên ngoài qua prop tuỳ chọn `videoRef`. Danh sách chức năng dùng `grid-auto-flow: column` với `grid-template-rows: repeat(3, auto)` để đọc dọc theo cột. Mỗi mục chức năng có `data-testid="model-function"`.
- **Kết luận**: ảnh nền phủ `inset: 0 0 34% 0`, thông điệp căn giữa cỡ `5.4cqw`, dải chỉ số `repeat(5, minmax(0, 1fr))`, mỗi ô có `data-testid="outro-stat"`.

- [ ] **Step 5: Chạy test để xác nhận đã qua**

Run: `npm run test -- tests/other-slides.test.tsx`
Expected: PASS, 5 test.

- [ ] **Step 6: Commit**

```bash
git add components/slides/ tests/other-slides.test.tsx app/globals.css
git commit -m "feat: nam khuon bia, phan muc, so lieu, mo hinh, ket luan"
```

---

### Task 11: Router khuôn và hệ animation

**Files:**
- Modify: `components/SlideCanvas.tsx` (viết lại)
- Create: `lib/motion.ts`
- Modify: `app/globals.css` (thêm hệ animation)
- Test: `tests/slide-canvas.test.tsx`

**Interfaces:**
- Consumes: sáu component khuôn (Task 9, 10), `panelSideFor` (Task 7)
- Produces: `<SlideCanvas index={number} mode="full" | "preview" videoRef? />`; `transitionKindFor(slide: Slide): "slide" | "depth" | "curtain"`; `type MotionMode = "force" | "auto" | "off"`

- [ ] **Step 1: Viết test thất bại**

Tạo `tests/slide-canvas.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlideCanvas } from "@/components/SlideCanvas";
import { transitionKindFor } from "@/lib/motion";
import { SLIDES } from "@/lib/slides";

describe("SlideCanvas", () => {
  it("render được cả 38 slide mà không văng lỗi", () => {
    for (let index = 0; index < SLIDES.length; index += 1) {
      const { unmount } = render(<SlideCanvas index={index} mode="preview" />);
      unmount();
    }
    expect(SLIDES).toHaveLength(38);
  });

  it("slide đầu tiên là bìa và hiện đúng tiêu đề báo cáo", () => {
    render(<SlideCanvas index={0} mode="full" />);
    expect(
      screen.getByRole("heading", { name: /BÁO CÁO KẾT QUẢ/ }),
    ).toBeInTheDocument();
  });
});

describe("transitionKindFor", () => {
  it("trang phân mục dùng chiều sâu, slide có panel dùng rèm, còn lại dùng trượt", () => {
    const kinds = SLIDES.map(transitionKindFor);
    const count = (k: string) => kinds.filter((x) => x === k).length;

    expect(count("depth")).toBe(3);
    expect(count("curtain")).toBe(31);
    expect(count("slide")).toBe(4);
  });
});
```

- [ ] **Step 2: Chạy test để chắc chắn nó thất bại**

Run: `npm run test -- tests/slide-canvas.test.tsx`
Expected: FAIL — chưa có `@/lib/motion`.

- [ ] **Step 3: Viết `lib/motion.ts`**

```ts
import type { Slide } from "@/lib/slides/types";

export type MotionMode = "force" | "auto" | "off";
export type TransitionKind = "slide" | "depth" | "curtain";

/**
 * Kiểu chuyển cảnh buộc vào loại slide, không trộn ngẫu nhiên: người xem sẽ đọc
 * sự ngẫu nhiên thành ý nghĩa rồi không tìm ra ý. Cú phóng sâu chỉ dùng cho ba
 * trang phân mục nên nó giữ được nghĩa "sắp sang phần mới".
 */
export function transitionKindFor(slide: Slide): TransitionKind {
  if (slide.kind === "divider") return "depth";
  if (slide.kind === "content" || slide.kind === "model") return "curtain";
  return "slide";
}

export const MOTION_STORAGE_KEY = "cnt-motion-mode";

export function readMotionMode(): MotionMode {
  if (typeof window === "undefined") return "force";
  const saved = window.localStorage.getItem(MOTION_STORAGE_KEY);
  return saved === "auto" || saved === "off" ? saved : "force";
}
```

- [ ] **Step 4: Thêm hệ animation vào `app/globals.css`**

```css
/* ===== Dàn nhạc vào ===== */
.slide-live .anim {
  animation-delay: var(--d, 0ms);
  animation-duration: 520ms;
  animation-timing-function: cubic-bezier(0.22, 0.85, 0.26, 1);
  animation-fill-mode: both;
}

.slide-live .a-rise { animation-name: cnt-rise; }
.slide-live .a-fade { animation-name: cnt-fade; }
.slide-live .a-grow { animation-name: cnt-grow; animation-duration: 420ms; }
.slide-live .a-bar { animation-name: cnt-bar; animation-duration: 420ms; }
.slide-live .a-media { animation-name: cnt-media; animation-duration: 640ms; }

@keyframes cnt-rise { from { opacity: 0; transform: translateY(1.1cqw); } to { opacity: 1; transform: none; } }
@keyframes cnt-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cnt-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes cnt-bar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes cnt-media { from { opacity: 0; transform: scale(1.035); } to { opacity: 1; transform: none; } }

/* ===== Chuyển cảnh theo loại slide ===== */
@keyframes cnt-tr-slide { from { opacity: 0; transform: translateX(var(--dir, 4cqw)); } to { opacity: 1; transform: none; } }
@keyframes cnt-tr-depth { from { opacity: 0; transform: scale(1.045); } to { opacity: 1; transform: none; } }
@keyframes cnt-tr-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cnt-tr-curtain { from { transform: translateX(var(--from, 100%)); } to { transform: none; } }

.slide-live[data-transition="slide"] { animation: cnt-tr-slide 520ms cubic-bezier(0.22, 0.85, 0.26, 1) both; }
.slide-live[data-transition="depth"] { animation: cnt-tr-depth 620ms cubic-bezier(0.22, 0.85, 0.26, 1) both; }
.slide-live[data-transition="curtain"] { animation: cnt-tr-fade 440ms ease both; }
.slide-live[data-transition="curtain"] .content-media { animation: cnt-tr-curtain 560ms cubic-bezier(0.3, 0.9, 0.25, 1) both; }
.slide-stage[data-side="left"] .content-media { --from: -100%; }

/* ===== Công tắc chuyển động =====
   Mặc định BẬT vì đây là công cụ chạy trên máy người thuyết trình; nhiều máy tắt
   hiệu ứng Windows để chạy nhẹ chứ không phải vì nhạy cảm tiền đình. Ai cần thì
   chuyển về "auto" để tôn trọng thiết lập hệ điều hành. */
@media (prefers-reduced-motion: reduce) {
  [data-motion="auto"] * { animation-duration: 1ms !important; animation-delay: 0ms !important; }
}

[data-motion="off"] * { animation: none !important; }
```

- [ ] **Step 5: Viết lại `components/SlideCanvas.tsx`**

```tsx
"use client";

import { type RefObject } from "react";

import { ContentSlideView } from "@/components/slides/ContentSlideView";
import { CoverSlideView } from "@/components/slides/CoverSlideView";
import { DividerSlideView } from "@/components/slides/DividerSlideView";
import { KpiSlideView } from "@/components/slides/KpiSlideView";
import { ModelSlideView } from "@/components/slides/ModelSlideView";
import { OutroSlideView } from "@/components/slides/OutroSlideView";
import { clampIndex, panelSideFor, SLIDES } from "@/lib/slides";

type SlideCanvasProps = {
  index: number;
  mode: "full" | "preview";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
};

export function SlideCanvas({
  index,
  mode,
  videoRef,
  videoBlocked = false,
  onVideoFallback,
}: SlideCanvasProps) {
  const safeIndex = clampIndex(index);
  const slide = SLIDES[safeIndex];

  return (
    <div className={`slide-shell slide-shell--${mode}`} data-slide-index={safeIndex}>
      {slide.kind === "cover" ? <CoverSlideView slide={slide} /> : null}
      {slide.kind === "divider" ? <DividerSlideView slide={slide} /> : null}
      {slide.kind === "content" ? (
        <ContentSlideView slide={slide} side={panelSideFor(safeIndex)} />
      ) : null}
      {slide.kind === "kpi" ? <KpiSlideView slide={slide} animate={mode === "full"} /> : null}
      {slide.kind === "model" ? (
        <ModelSlideView
          slide={slide}
          side={panelSideFor(safeIndex)}
          videoRef={videoRef}
          videoBlocked={videoBlocked}
          onVideoFallback={onVideoFallback}
        />
      ) : null}
      {slide.kind === "outro" ? <OutroSlideView slide={slide} /> : null}
    </div>
  );
}
```

- [ ] **Step 6: Chạy test để xác nhận đã qua**

Run: `npm run test -- tests/slide-canvas.test.tsx`
Expected: PASS, 3 test. Nếu số đếm chuyển cảnh sai, kiểm tra lại `kind` của các slide trong `data.ts`.

- [ ] **Step 7: Commit**

```bash
git add components/SlideCanvas.tsx lib/motion.ts app/globals.css tests/slide-canvas.test.tsx
git commit -m "feat: router khuon va he chuyen dong theo loai slide"
```

---

### Task 12: Màn trình chiếu và màn điều khiển cho 38 slide

**Files:**
- Modify: `components/PresentationScreen.tsx`
- Modify: `components/ControlDeck.tsx`
- Modify: `lib/presentation.ts` (rút gọn còn phần kênh truyền, chuyển dữ liệu sang `lib/slides`)
- Modify: `tests/render.test.tsx`, `tests/presentation.test.ts`, `tests/channel-integration.test.tsx`

**Interfaces:**
- Consumes: `SLIDES`, `clampIndex` (Task 7), `transitionKindFor`, `readMotionMode` (Task 11)

- [ ] **Step 1: Rút gọn `lib/presentation.ts`**

Xóa hằng `SLIDES` và các kiểu slide cũ (dòng 20–188), giữ lại `CHANNEL_NAME`, `VideoCommand`, `PresentationState`, `PresentationMessage`, `PresentationAction`, `reducePresentationState`. Đổi `clampSlideIndex` thành tái xuất từ `@/lib/slides`:

```ts
export { clampIndex as clampSlideIndex } from "@/lib/slides";
```

- [ ] **Step 2: Sửa `ControlDeck.tsx` cho 38 slide**

Bốn thay đổi:

1. Dòng 95: `SLIDE {state.slideIndex + 1} / 3` → `SLIDE {state.slideIndex + 1} / {SLIDES.length}`.
2. Dòng 83: `const videoEnabled = state.slideIndex === 2;` → lấy từ dữ liệu:
   ```tsx
   const videoEnabled = slide.kind === "model" && Boolean(slide.videoSrc);
   ```
3. Dòng 70: phím cách chỉ phát video khi slide hiện tại có video:
   ```tsx
   if (event.key === " " && videoEnabled) {
   ```
   `videoEnabled` phải được tính trước `useEffect` và thêm vào mảng phụ thuộc.
4. Dòng 115 và 125: `slide.sourceNumber` → `slide.number`. Dòng 143: `slide.note` → ghi chú có thể thiếu:
   ```tsx
   <p>{slide.note ? phrasesToText(slide.note) : slide.kind === "content" && slide.lead ? phrasesToText(slide.lead) : "—"}</p>
   ```
5. Dòng 92: `Báo cáo Lá cờ đầu · Demo 3 slide` → `Báo cáo Lá cờ đầu · 38 slide`.

- [ ] **Step 3: Thêm công tắc chuyển động vào `ControlDeck.tsx`**

Thêm state và nút, đặt cạnh nút mở màn hình trình chiếu:

```tsx
const [motion, setMotion] = useState<MotionMode>("force");

useEffect(() => {
  setMotion(readMotionMode());
}, []);

const cycleMotion = () => {
  const order: MotionMode[] = ["force", "auto", "off"];
  const next = order[(order.indexOf(motion) + 1) % order.length];
  setMotion(next);
  window.localStorage.setItem(MOTION_STORAGE_KEY, next);
  postMotion(next);
};
```

Nhãn nút: `force` → "CHUYỂN ĐỘNG: BẬT", `auto` → "CHUYỂN ĐỘNG: THEO MÁY", `off` → "CHUYỂN ĐỘNG: TẮT". `postMotion` là hàm mới trong `usePresentationChannel` gửi thông điệp `{ type: "MOTION", mode }`; thêm biến thể này vào `PresentationMessage` và xử lý ở phía `present`.

- [ ] **Step 4: Sửa `PresentationScreen.tsx`**

Gắn `data-motion` và `data-transition` lên khung, và bỏ hardcode `incoming.slideIndex !== 2`:

```tsx
const slide = SLIDES[view.slideIndex];
const hasVideo = slide.kind === "model" && Boolean(slide.videoSrc);

// trong applyState
if (!hasVideo) {
  setVideoBlocked(false);
}
```

Khung ngoài:

```tsx
<main className="presentation-page" data-motion={motion}>
  <div
    className={`projector-stage slide-live`}
    data-transition={transitionKindFor(slide)}
    style={{ "--dir": view.direction === "forward" ? "4cqw" : "-4cqw" } as CSSProperties}
    key={`${view.slideIndex}-${view.sequence}`}
  >
```

Xóa hai class `projector-stage--forward` / `projector-stage--backward` và hai keyframes `slide-forward` / `slide-backward` cũ trong `globals.css` — chúng đã được thay bằng hệ chuyển cảnh mới.

- [ ] **Step 5: Cập nhật ba file test cũ**

Trong `tests/render.test.tsx`: đổi `"SLIDE 1 / 3"` thành `"SLIDE 1 / 38"`; đổi hai lần bấm "Tiếp" để tới slide có video thành điều hướng tới đúng chỉ số của slide 34 (`SLIDES.findIndex((s) => s.kind === "model")`); bỏ các assertion về `getAllByRole("figure")).toHaveLength(4)` của bìa nếu số ảnh bìa đã đổi, thay bằng số thật trong `data.ts`.

Trong `tests/presentation.test.ts`: đổi mọi tham chiếu `SLIDES` sang `@/lib/slides`; kiểm tra `clampSlideIndex(999) === 37`.

Trong `tests/channel-integration.test.tsx`: thêm test cho thông điệp `MOTION`:

```tsx
it("truyền chế độ chuyển động từ màn điều khiển sang màn trình chiếu", async () => {
  const control = render(<ControlDeck />);
  const projector = render(<PresentationScreen />);

  const page = projector.container.querySelector(".presentation-page") as HTMLElement;
  expect(page.dataset.motion).toBe("force");

  // Bấm một lần: force → auto
  fireEvent.click(control.getByRole("button", { name: "Chế độ chuyển động" }));

  await waitFor(() => {
    expect(page.dataset.motion).toBe("auto");
  });

  expect(window.localStorage.getItem("cnt-motion-mode")).toBe("auto");
});
```

Nút công tắc trong `ControlDeck` phải có `aria-label="Chế độ chuyển động"` để test này bắt được. `PresentationScreen` khởi tạo `motion` bằng `"force"` và cập nhật khi nhận thông điệp `MOTION`.

- [ ] **Step 6: Chạy toàn bộ test**

Run: `npm run test`
Expected: tất cả PASS. Sửa cho đến khi sạch.

- [ ] **Step 7: Commit**

```bash
git add components/PresentationScreen.tsx components/ControlDeck.tsx lib/presentation.ts lib/usePresentationChannel.ts tests/
git commit -m "feat: man trinh chieu va man dieu khien cho 38 slide"
```

---

### Task 13: Kiểm tra thị giác cả 38 slide

**Files:**
- Create: `scripts/render-check.mjs`
- Create: `docs/superpowers/references/render-check/` (ảnh chụp sinh ra, gitignore)
- Modify: `.gitignore`

- [ ] **Step 1: Thêm thư mục ảnh chụp vào `.gitignore`**

```
docs/superpowers/references/render-check/
```

- [ ] **Step 2: Viết script chụp cả 38 slide**

Tạo `scripts/render-check.mjs`:

```js
// Chụp cả 38 slide ở 1280x720 từ bản build tĩnh để soi bằng mắt.
// Chạy sau `npm run build`, vì nó đọc thư mục out/.
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME = process.env.CHROME_PATH
  ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT_DIR = "docs/superpowers/references/render-check";
const PORT = 4321;

if (!fs.existsSync("out")) {
  console.error("Chưa có thư mục out/. Chạy `npm run build` trước.");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const server = spawn("npx", ["--yes", "serve", "-s", "out", "-l", String(PORT)], {
  stdio: "ignore", shell: true, detached: false,
});

await new Promise((resolve) => setTimeout(resolve, 4000));

try {
  for (let i = 0; i < 38; i += 1) {
    const file = path.join(process.cwd(), OUT_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`);
    execFileSync(CHROME, [
      "--headless", "--disable-gpu", "--hide-scrollbars",
      "--force-device-scale-factor=1", "--window-size=1280,720",
      "--virtual-time-budget=8000", `--screenshot=${file}`,
      `http://localhost:${PORT}/present/?slide=${i}`,
    ], { stdio: "ignore" });
    process.stdout.write(`\rĐã chụp ${i + 1}/38`);
  }
  console.log(`\nẢnh nằm ở ${OUT_DIR}`);
} finally {
  server.kill();
}
```

- [ ] **Step 3: Thêm hỗ trợ tham số `?slide=` vào `app/present/page.tsx`**

Màn trình chiếu cần mở thẳng một slide bất kỳ để chụp. Đọc `slide` từ `location.search` khi khởi tạo state, mặc định 0. Vì đang xuất tĩnh nên phải đọc phía client trong `useEffect`, không dùng `searchParams` của server.

- [ ] **Step 4: Build và chụp**

```bash
npm run build
node scripts/render-check.mjs
```

Expected: 38 file PNG.

- [ ] **Step 5: Soi từng ảnh và ghi lại lỗi**

Mở lần lượt 38 ảnh. Với mỗi ảnh kiểm tra: chữ có bị tràn khung không; caption ảnh có bị cắt không; có chỗ nào chữ tối nằm trên nền navy không; ảnh nền có chữ lớn đè lên tiêu đề không; cụm từ có bị ngắt sai chỗ không.

Ghi mọi lỗi tìm được vào `docs/superpowers/references/render-check/NOTES.md`, sửa, rồi chụp lại cho đến khi sạch.

- [ ] **Step 6: Commit**

```bash
git add scripts/render-check.mjs .gitignore app/present/page.tsx
git commit -m "feat: script chup 38 slide de kiem tra thi giac"
```

---

### Task 14: Bản kê thay ảnh và cập nhật tài liệu

**Files:**
- Create: `docs/BAN-KE-ANH.md`
- Modify: `README.md`

- [ ] **Step 1: Sinh bản kê ảnh**

Tạo `scripts/build-image-manifest.mjs` in ra bảng markdown gồm: số slide, tiêu đề slide, tên file ảnh hiện dùng, vai trò, và cờ ảnh màn hình. Ghi kết quả vào `docs/BAN-KE-ANH.md` kèm phần mở đầu:

```markdown
# Bản kê ảnh — dùng để thay ảnh chốt

Ảnh hiện tại là **ảnh tạm** rút từ file PPTX. Để thay bằng ảnh chốt:

1. Đặt file mới vào `public/media/slides/` với **đúng tên file** trong bảng dưới, hoặc
2. Đổi trường `src` của ảnh tương ứng trong `lib/slides/data.ts`.

Sau khi thay, chạy lại `node scripts/audit-images.mjs` để đo lại, rồi `npm run test`
để chắc chắn không có ảnh màn hình nào lọt vào vai trò ảnh nền.
```

- [ ] **Step 2: Cập nhật `README.md`**

Đổi phần mô tả từ "ba slide tiêu biểu" thành bộ 38 slide; thêm mục về công tắc chuyển động; thêm mục về quy tắc ngắt dòng cụm từ cho người soạn slide mới; giữ nguyên phần hướng dẫn Netlify.

- [ ] **Step 3: Chạy toàn bộ kiểm tra lần cuối**

```bash
npm run test
npm run lint
npm run build
```

Expected: cả ba sạch.

- [ ] **Step 4: Commit**

```bash
git add docs/BAN-KE-ANH.md scripts/build-image-manifest.mjs README.md
git commit -m "docs: ban ke thay anh va cap nhat README cho bo 38 slide"
```
