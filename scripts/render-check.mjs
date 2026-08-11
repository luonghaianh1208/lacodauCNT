// Chụp cả 45 slide (44 trang báo cáo + trang 0 chờ) ở 1280x720 từ bản build tĩnh để soi bằng mắt.
// Chạy sau `npm run build`, vì nó đọc thư mục out/.
//
//   node scripts/render-check.mjs            # chụp ảnh
//   node scripts/render-check.mjs --audit    # chụp ảnh + đo hình học, in cảnh báo tràn khung
//
// Hai lựa chọn kỹ thuật đáng giải thích:
//
// 1. Tự dựng máy chủ tĩnh thay vì `npx serve`: `npx --yes serve` phải tải gói về từ mạng
//    ở lần chạy đầu nên script hỏng khi không có mạng và thời gian chờ không đoán được.
//    Một máy chủ chừng ba chục dòng bằng `node:http` là đủ cho bản xuất tĩnh.
//
// 2. Điều khiển Chrome qua CDP thay vì cờ `--screenshot`: cách dùng cờ `--screenshot` kèm
//    `--virtual-time-budget` chụp ngay khi đồng hồ ảo hết, KHÔNG đợi ảnh giải mã xong.
//    Logo trường là PNG 1563x1563 nên giải mã chậm và biến mất ngẫu nhiên khỏi khoảng
//    1/3 số ảnh — ảnh chụp lúc có lúc không thì không soi được. Qua CDP thì trước mỗi lần
//    chụp còn chờ được `document.fonts.ready` và `img.decode()` của mọi ảnh, nên kết quả
//    lặp lại được. Đổi lại còn đo được hình học ngay trong trang (xem `--audit`).
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const CHROME =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const ROOT = process.cwd();
const SITE_DIR = path.join(ROOT, "out");
const OUT_DIR = path.join(ROOT, "docs", "superpowers", "references", "render-check");
const PORT = 4321;
const DEBUG_PORT = 9333;
const SLIDE_COUNT = 45;
const WIDTH = 1280;
const HEIGHT = 720;
const AUDIT = process.argv.includes("--audit");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!fs.existsSync(SITE_DIR)) {
  console.error("Chưa có thư mục out/. Chạy `npm run build` trước.");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

/** Chỉ phục vụ file nằm trong out/ — chặn mọi đường dẫn leo ra ngoài bằng "..". */
function resolveInsideSite(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = path.resolve(SITE_DIR, `.${decoded}`);
  if (candidate !== SITE_DIR && !candidate.startsWith(SITE_DIR + path.sep)) {
    return null;
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    return path.join(candidate, "index.html");
  }
  return candidate;
}

const server = http.createServer((request, response) => {
  const file = resolveInsideSite(request.url ?? "/");
  if (!file || !fs.existsSync(file)) {
    response.writeHead(404).end("404");
    return;
  }
  response.writeHead(200, {
    "content-type": MIME[path.extname(file)] ?? "application/octet-stream",
  });
  fs.createReadStream(file).pipe(response);
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(PORT, "127.0.0.1", resolve);
});

// Hồ sơ Chrome riêng: nếu không có, chrome.exe sẽ chuyển lệnh sang cửa sổ Chrome đang mở
// của người dùng rồi thoát ngay, và không có ảnh nào được chụp.
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "render-check-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${profileDir}`,
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

/** Chờ cổng gỡ lỗi mở; Chrome mất một lúc mới dựng xong endpoint. */
async function waitForDebugger() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
      return (await response.json()).webSocketDebuggerUrl;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  throw new Error("Chrome không mở cổng gỡ lỗi.");
}

/** Máy khách CDP tối giản: gửi lệnh có id, chờ đúng phản hồi của id đó. */
function connect(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  const waiters = [];
  let nextId = 1;
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id !== undefined) {
      const entry = pending.get(message.id);
      pending.delete(message.id);
      if (!entry) return;
      if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
      else entry.resolve(message.result);
      return;
    }
    for (let i = waiters.length - 1; i >= 0; i -= 1) {
      if (waiters[i].method === message.method) {
        waiters[i].resolve(message.params);
        waiters.splice(i, 1);
      }
    }
  });
  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  return {
    ready,
    send(method, params = {}, sessionId) {
      const id = nextId;
      nextId += 1;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
      });
    },
    once(method) {
      return new Promise((resolve) => waiters.push({ method, resolve }));
    },
    close() {
      socket.close();
    },
  };
}

/**
 * Chạy trong trang trước mỗi lần chụp: chờ font và MỌI ảnh giải mã xong, rồi chờ thêm hai
 * khung hình để trình duyệt vẽ lại. Không có bước này, ảnh nặng (logo trường) hay lọt lưới.
 */
const SETTLE = `(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return true;
})()`;

/**
 * Đo hình học ngay trong trang: tìm chữ tràn khỏi khung slide, caption bị cắt, và vùng đè
 * nhau giữa số trang và cụm logo. jsdom không có bố cục nên đây là nơi duy nhất đo được.
 */
const MEASURE = `(() => {
  const stage = document.querySelector(".slide-shell");
  const box = stage.getBoundingClientRect();
  const problems = [];
  const round = (value) => Math.round(value * 10) / 10;

  for (const node of stage.querySelectorAll("h1, h2, p, li, span, b, figcaption, div")) {
    if (!node.textContent.trim()) continue;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const over = {
      left: round(box.left - rect.left),
      right: round(rect.right - box.right),
      top: round(box.top - rect.top),
      bottom: round(rect.bottom - box.bottom),
    };
    const worst = Math.max(over.left, over.right, over.top, over.bottom);
    if (worst > 1) {
      problems.push({
        kind: "tran-khung",
        selector: node.className && typeof node.className === "string" ? node.className : node.tagName,
        text: node.textContent.trim().slice(0, 60),
        over,
      });
    }
  }

  /*
   * Chữ bị CẮT: so hình chữ nhật của khối chữ với khối cha gần nhất có overflow ẩn.
   * KHÔNG dùng scrollHeight - clientHeight: chỉ số đó lệch vài pixel ở mọi thẻ h1 vì
   * làm tròn line-height, nên báo động giả trên cả 45 slide.
   */
  const clipperOf = (node) => {
    for (let parent = node.parentElement; parent && parent !== stage.parentElement; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      if (style.overflowX !== "visible" || style.overflowY !== "visible") return parent;
    }
    return null;
  };
  for (const node of stage.querySelectorAll("figcaption, li, p, h1, h2, b, span.ph")) {
    if (!node.textContent.trim()) continue;
    const clipper = clipperOf(node);
    if (!clipper) continue;
    const rect = node.getBoundingClientRect();
    const frame = clipper.getBoundingClientRect();
    const cut = {
      left: round(frame.left - rect.left),
      right: round(rect.right - frame.right),
      top: round(frame.top - rect.top),
      bottom: round(rect.bottom - frame.bottom),
    };
    if (Math.max(cut.left, cut.right, cut.top, cut.bottom) > 1) {
      problems.push({
        kind: "bi-cat",
        selector: typeof node.className === "string" ? node.className : node.tagName,
        text: node.textContent.trim().slice(0, 60),
        over: cut,
      });
    }
  }

  // Chữ tràn khỏi hộp cha trực tiếp theo chiều ngang (cụm nowrap rộng hơn cột chứa nó).
  for (const node of stage.querySelectorAll("figcaption, li, p, h1, h2")) {
    if (!node.textContent.trim()) continue;
    const spill = node.scrollWidth - node.clientWidth;
    if (spill > 1) {
      problems.push({
        kind: "tran-cot",
        selector: typeof node.className === "string" ? node.className : node.tagName,
        text: node.textContent.trim().slice(0, 60),
        over: { x: spill },
      });
    }
  }

  /*
   * Chữ thân bài đè lên chú thích chân trang: cột chữ mọc từ trên xuống (align-content:
   * start) còn chú thích neo ở đáy, nên slide nào nhiều chữ là hai khối chồng lên nhau.
   */
  const foot = stage.querySelector(".slide-foot");
  if (foot) {
    // Nới vùng cấm lên trên 10px: chạm nhau đúng 0px vẫn đọc ra là dính, cần một khoảng thở.
    const raw = foot.getBoundingClientRect();
    const f = { left: raw.left, right: raw.right, top: raw.top - 10, bottom: raw.bottom };
    for (const node of stage.querySelectorAll(
      ".content-text li, .content-text p, .content-text h1, .model-lists li, .model-lists h2, .figures-cell, .outro-stat",
    )) {
      if (!node.textContent.trim()) continue;
      const rect = node.getBoundingClientRect();
      const overlapX = Math.min(rect.right, f.right) - Math.max(rect.left, f.left);
      const overlapY = Math.min(rect.bottom, f.bottom) - Math.max(rect.top, f.top);
      if (overlapX > 1 && overlapY > 1) {
        problems.push({
          kind: "de-chan-trang",
          selector: typeof node.className === "string" ? node.className : node.tagName,
          text: node.textContent.trim().slice(0, 60),
          over: { x: round(overlapX), y: round(overlapY) },
        });
      }
    }
  }

  const number = stage.querySelector(".slide-num");
  const brand = stage.querySelector(".slide-brand");
  if (number && brand) {
    const a = number.getBoundingClientRect();
    const b = brand.getBoundingClientRect();
    const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (overlapX > 0 && overlapY > 0) {
      problems.push({ kind: "so-trang-de-logo", over: { x: round(overlapX), y: round(overlapY) } });
    }
  }

  /*
   * Cụm nhận diện đè lên ẢNH trong panel: khi panel ở bên trái, cụm nhận diện nằm trên nền
   * navy của panel — chấp nhận được. Nhưng nếu ruột panel cao gần bằng slide thì ảnh dâng
   * lên tận đỉnh và chữ trắng rơi thẳng lên ảnh, vừa khó đọc vừa bôi bẩn ảnh.
   */
  if (brand) {
    const b = brand.getBoundingClientRect();
    for (const media of stage.querySelectorAll(".content-media img, .model-media img, .model-video")) {
      const m = media.getBoundingClientRect();
      const overlapX = Math.min(b.right, m.right) - Math.max(b.left, m.left);
      const overlapY = Math.min(b.bottom, m.bottom) - Math.max(b.top, m.top);
      if (overlapX > 2 && overlapY > 2) {
        problems.push({
          kind: "logo-de-anh",
          selector: media.getAttribute("alt") ?? media.className,
          over: { x: round(overlapX), y: round(overlapY) },
        });
        break;
      }
    }
  }

  /*
   * Chữ của CỘT GIẤY lấn sang panel navy: chữ ở đây tô màu tối (--ink/--muted) nên vừa
   * chạm nền navy là tàng hình, không có cảnh báo nào khác bắt được.
   */
  const panelBox = stage.querySelector(".content-media, .model-media");
  if (panelBox) {
    const p = panelBox.getBoundingClientRect();
    for (const node of stage.querySelectorAll(
      ".content-text h1, .content-text p, .content-text li, .model-head h1, .model-head p, .model-lists li, .model-lists h2",
    )) {
      if (!node.textContent.trim()) continue;
      const rect = node.getBoundingClientRect();
      const overlapX = Math.min(rect.right, p.right) - Math.max(rect.left, p.left);
      const overlapY = Math.min(rect.bottom, p.bottom) - Math.max(rect.top, p.top);
      if (overlapX > 1 && overlapY > 1) {
        problems.push({
          kind: "chu-toi-tren-navy",
          selector: typeof node.className === "string" ? node.className : node.tagName,
          text: node.textContent.trim().slice(0, 60),
          over: { x: round(overlapX) },
        });
      }
    }
  }

  const panel = panelBox;
  if (panel && number) {
    const a = number.getBoundingClientRect();
    const b = panel.getBoundingClientRect();
    const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (overlapX > 0 && overlapY > 0) {
      problems.push({ kind: "so-trang-de-panel", over: { x: round(overlapX), y: round(overlapY) } });
    }
  }

  const side = stage.querySelector("[data-side]")?.dataset.side ?? "-";
  return JSON.stringify({ side, problems });
})()`;

const audit = [];

try {
  const client = connect(await waitForDebugger());
  await client.ready;
  const { targetId } = await client.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await client.send("Target.attachToTarget", { targetId, flatten: true });
  await client.send("Page.enable", {}, sessionId);
  await client.send(
    "Emulation.setDeviceMetricsOverride",
    { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false },
    sessionId,
  );

  for (let index = 0; index < SLIDE_COUNT; index += 1) {
    const loaded = client.once("Page.loadEventFired");
    await client.send(
      "Page.navigate",
      { url: `http://127.0.0.1:${PORT}/present/?slide=${index}&capture=1` },
      sessionId,
    );
    await loaded;
    await client.send(
      "Runtime.evaluate",
      { expression: SETTLE, awaitPromise: true },
      sessionId,
    );

    if (AUDIT) {
      const measured = await client.send(
        "Runtime.evaluate",
        { expression: MEASURE, returnByValue: true },
        sessionId,
      );
      audit.push({ slide: index + 1, ...JSON.parse(measured.result.value) });
    }

    const shot = await client.send(
      "Page.captureScreenshot",
      { format: "png", captureBeyondViewport: false },
      sessionId,
    );
    // Đường dẫn PHẢI tuyệt đối trên Windows, đường dẫn tương đối hay bị "Access is denied".
    const file = path.join(OUT_DIR, `slide-${String(index + 1).padStart(2, "0")}.png`);
    fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
    process.stdout.write(`\rĐã chụp ${index + 1}/${SLIDE_COUNT}`);
  }

  console.log(`\nẢnh nằm ở ${path.relative(ROOT, OUT_DIR)}`);
  client.close();
} finally {
  chrome.kill();
  server.close();
  // Chrome còn giữ file trong hồ sơ một nhịp sau khi thoát; xoá lỗi thì bỏ qua.
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch {
    /* thư mục tạm, để hệ điều hành dọn */
  }
}

if (AUDIT) {
  const dirty = audit.filter((entry) => entry.problems.length > 0);
  console.log(`\n=== Đo hình học: ${dirty.length}/${SLIDE_COUNT} slide có cảnh báo ===`);
  for (const entry of dirty) {
    console.log(`\n--- Slide ${entry.slide} (panel: ${entry.side}) ---`);
    for (const problem of entry.problems) {
      console.log(`  [${problem.kind}] ${problem.selector ?? ""} ${JSON.stringify(problem.over)}`);
      if (problem.text) console.log(`      "${problem.text}"`);
    }
  }
}
