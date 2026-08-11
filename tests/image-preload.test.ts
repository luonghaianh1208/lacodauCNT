import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { collectImagePaths, useImagePreload } from "@/lib/useImagePreload";
import { SLIDES } from "@/lib/slides";
import type { Slide } from "@/lib/slides/types";

/**
 * Ảnh giả điều khiển được từ test: `onload`/`onerror` chỉ gọi khi test gọi tay, mô phỏng
 * đúng cách trình duyệt nạp ảnh bất đồng bộ (jsdom không thật sự tải ảnh nên không tự bắn
 * sự kiện — xem NOTES trong lib/useImagePreload.ts).
 */
class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  decode = vi.fn(() => Promise.resolve());
  #src = "";

  static instances: FakeImage[] = [];

  constructor() {
    FakeImage.instances.push(this);
  }

  set src(value: string) {
    this.#src = value;
  }

  get src() {
    return this.#src;
  }
}

/**
 * Ảnh giả có `decode()` CHỜ TAY (không tự resolve) — dùng riêng cho test kiểm tra
 * "onload xong không có nghĩa là đã xong": phải gọi `resolveDecode()` mới tính là xong.
 * `FakeImage` ở trên resolve `decode()` ngay lập tức nên không tách được hai mốc onload
 * và giải mã xong khỏi nhau qua `act()` — `act(async () => {...})` tự xả hết microtask
 * đang chờ trước khi trả về, nên một `decode()` resolve ngay sẽ luôn "xong" trong cùng
 * lượt act, kể cả khi test chưa chủ định chờ nó.
 */
class FakeImageManualDecode {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  decodeCalls = 0;
  #src = "";
  #resolveDecode: (() => void) | null = null;

  static instances: FakeImageManualDecode[] = [];

  constructor() {
    FakeImageManualDecode.instances.push(this);
  }

  set src(value: string) {
    this.#src = value;
  }

  get src() {
    return this.#src;
  }

  decode() {
    this.decodeCalls += 1;
    return new Promise<void>((resolve) => {
      this.#resolveDecode = resolve;
    });
  }

  resolveDecode() {
    this.#resolveDecode?.();
  }
}

/** Ảnh giả KHÔNG có `decode()` — mô phỏng trình duyệt cũ, phải rơi về chỉ `onload`. */
class FakeImageWithoutDecode {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  #src = "";

  static instances: FakeImageWithoutDecode[] = [];

  constructor() {
    FakeImageWithoutDecode.instances.push(this);
  }

  set src(value: string) {
    this.#src = value;
  }

  get src() {
    return this.#src;
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  FakeImage.instances.length = 0;
  FakeImageManualDecode.instances.length = 0;
  FakeImageWithoutDecode.instances.length = 0;
});

describe("collectImagePaths", () => {
  it("gom ảnh trong images lẫn background của mọi khuôn", () => {
    const slides = [
      {
        kind: "content",
        number: 1,
        density: "vua",
        title: ["T"],
        bullets: [],
        images: [
          { src: "/a.jpg", alt: "a", caption: ["a"], role: "chinh" },
          { src: "/b.jpg", alt: "b", caption: ["b"], role: "phu" },
        ],
      },
      {
        kind: "divider",
        number: 2,
        density: "vua",
        part: "A",
        title: ["T"],
        toc: [],
        background: { src: "/c.jpg", alt: "c", caption: ["c"], role: "nen" },
      },
    ] as unknown as readonly Slide[];

    expect(collectImagePaths(slides)).toEqual(["/a.jpg", "/b.jpg", "/c.jpg"]);
  });

  it("bỏ trùng đường dẫn ảnh lặp lại", () => {
    const slides = [
      {
        kind: "content",
        number: 1,
        density: "vua",
        title: ["T"],
        bullets: [],
        images: [
          { src: "/a.jpg", alt: "a", caption: ["a"], role: "chinh" },
          { src: "/a.jpg", alt: "a", caption: ["a"], role: "chinh" },
        ],
      },
    ] as unknown as readonly Slide[];

    expect(collectImagePaths(slides)).toEqual(["/a.jpg"]);
  });

  it("khuôn không có ảnh (kpi) không góp đường dẫn nào", () => {
    const slides = [
      {
        kind: "kpi",
        number: 1,
        density: "vua",
        title: ["T"],
        headline: "1/1",
        headlineLabel: ["L"],
        metrics: [],
      },
    ] as unknown as readonly Slide[];

    expect(collectImagePaths(slides)).toEqual([]);
  });

  it("gom đủ ảnh của toàn bộ 38 slide thật, không rỗng", () => {
    // Neo an toàn: nếu ai đó lỡ tay sửa collectImagePaths làm nó trả về rỗng cho dữ liệu
    // thật, bộ nạp trước sẽ coi như "đã xong" ngay lập tức và mất hết tác dụng bảo vệ.
    expect(collectImagePaths(SLIDES).length).toBeGreaterThan(0);
  });
});

describe("useImagePreload", () => {
  it("tổng số khớp số ảnh truyền vào, tiến độ ban đầu là 0", () => {
    const { result } = renderHook(() => useImagePreload(["/a.jpg", "/b.jpg", "/c.jpg"]));

    expect(result.current.total).toBe(3);
    expect(result.current.loaded).toBe(0);
    expect(result.current.done).toBe(false);
  });

  it("0 ảnh thì coi như đã xong ngay", () => {
    const { result } = renderHook(() => useImagePreload([]));

    expect(result.current).toEqual({ loaded: 0, total: 0, done: true });
  });

  it("chỉ onload thôi chưa tính là xong — phải chờ decode() giải mã xong", async () => {
    vi.stubGlobal("Image", FakeImageManualDecode);
    const { result } = renderHook(() => useImagePreload(["/a.jpg"]));

    await act(async () => {
      FakeImageManualDecode.instances[0].onload?.();
    });
    expect(FakeImageManualDecode.instances[0].decodeCalls).toBe(1);
    expect(result.current.loaded).toBe(0);

    await act(async () => {
      FakeImageManualDecode.instances[0].resolveDecode();
    });
    expect(result.current.loaded).toBe(1);
    expect(result.current.done).toBe(true);
  });

  it("đếm tiến độ tăng dần khi từng ảnh nạp xong, done khi đủ tổng", async () => {
    vi.stubGlobal("Image", FakeImage);
    const { result } = renderHook(() =>
      useImagePreload(["/a.jpg", "/b.jpg", "/c.jpg"]),
    );

    await act(async () => {
      FakeImage.instances[0].onload?.();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.loaded).toBe(1);
    expect(result.current.done).toBe(false);

    await act(async () => {
      FakeImage.instances[1].onload?.();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.loaded).toBe(2);
    expect(result.current.done).toBe(false);

    await act(async () => {
      FakeImage.instances[2].onload?.();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(result.current.loaded).toBe(3);
    expect(result.current.done).toBe(true);
  });

  it("ảnh lỗi (404/hỏng) vẫn tính là đã xong, không treo tiến độ, và ghi console.error", async () => {
    vi.stubGlobal("Image", FakeImage);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { result } = renderHook(() => useImagePreload(["/a.jpg", "/broken.jpg"]));

    await act(async () => {
      FakeImage.instances[0].onload?.();
      FakeImage.instances[1].onerror?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.loaded).toBe(2);
    expect(result.current.done).toBe(true);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("/broken.jpg"));
  });

  it("trình duyệt không có decode() thì rơi về chỉ onload, không lỗi, không treo", async () => {
    vi.stubGlobal("Image", FakeImageWithoutDecode);
    const { result } = renderHook(() => useImagePreload(["/a.jpg"]));

    await act(async () => {
      FakeImageWithoutDecode.instances[0].onload?.();
      await Promise.resolve();
    });

    expect(result.current.loaded).toBe(1);
    expect(result.current.done).toBe(true);
  });
});
