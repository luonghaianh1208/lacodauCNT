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

try {
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
  const shots = Object.values(result).filter((r) => r.screenshot).length;
  console.log(`Đã đo ${Object.keys(result).length} ảnh, trong đó ${shots} ảnh màn hình bị loại khỏi vai trò ảnh nền.`);
} finally {
  // Dọn file tạm, kể cả khi có lỗi
  if (fs.existsSync(page)) {
    fs.rmSync(page);
  }
}
