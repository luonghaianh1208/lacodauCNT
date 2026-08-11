import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OutroSlideView } from "@/components/slides/OutroSlideView";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SLIDES } from "@/lib/slides";
import type { OutroSlide } from "@/lib/slides/types";

/** Slide kết luận CÓ ảnh nền — dữ liệu thật chưa có ảnh nào nên phải dựng fixture. */
const outroWithBackground: OutroSlide = {
  kind: "outro",
  number: 44,
  density: "vua",
  kicker: ["KẾT LUẬN"],
  title: ["Tuổi trẻ Chuyên Nguyễn Trãi"],
  slogan: [["Bản lĩnh"]],
  lead: ["Đoàn trường hoàn thành", "toàn diện nhiệm vụ."],
  stats: [],
  background: {
    src: "/media/slides/s34_img3.jpg",
    alt: "Ảnh nền",
    caption: ["Ảnh nền"],
    role: "nen",
  },
};

/**
 * "Dàn nhạc vào" (spec §7.1) sống ở CSS `.slide-live .anim` — jsdom KHÔNG nạp
 * `app/globals.css` nên không có test nào ở đây kiểm được hình ảnh chuyển động thật (thời
 * điểm, quãng đường, độ mờ). Việc đó thuộc bước xem bằng mắt.
 *
 * Nhưng thứ ĐÃ từng thiếu và những test cũ không bắt được lại kiểm được ở đây: CSS có đủ mà
 * không component nào phát ra class nào cả, nên mỗi slide vào bằng một khối duy nhất. Bộ
 * test dưới khoá đúng điều đó — có class `anim` kèm biến thể, và có biến `--d` ở đúng những
 * phần tử phải vào so le.
 */

/** Đọc `--d` từ style nội tuyến; trả về `null` khi phần tử không đặt biến này. */
function delayOf(node: Element | null): string | null {
  const value = (node as HTMLElement | null)?.style.getPropertyValue("--d") ?? "";
  return value === "" ? null : value;
}

function firstOfKind(kind: string): number {
  const index = SLIDES.findIndex((slide) => slide.kind === kind);
  expect(index, `không có slide nào kind="${kind}"`).toBeGreaterThanOrEqual(0);
  return index;
}

function renderKind(kind: string) {
  return render(<SlideCanvas index={firstOfKind(kind)} mode="full" />).container;
}

describe("dàn nhạc vào — cả bảy khuôn đều phát class anim", () => {
  it("mọi slide trong bộ đều có ít nhất một phần tử mang class anim", () => {
    for (let index = 0; index < SLIDES.length; index += 1) {
      const { container, unmount } = render(<SlideCanvas index={index} mode="preview" />);
      expect(
        container.querySelectorAll(".anim").length,
        `slide ${index + 1} không phát class anim nào`,
      ).toBeGreaterThan(0);
      unmount();
    }
  });

  // Thanh cờ mở màn ở MỌI khuôn. Ba khuôn bìa, kết luận và trang chờ không gọi `SlideChrome`
  // mà tự render thanh cờ, nên đây là chỗ dễ sót nhất — quét cả 45 slide chứ không chỉ một mẫu.
  it("thanh cờ của cả 45 slide đều dựng từ trên qua a-bar", () => {
    for (let index = 0; index < SLIDES.length; index += 1) {
      const { container, unmount } = render(<SlideCanvas index={index} mode="preview" />);
      const bar = container.querySelector(".slide-bar");
      expect(bar, `slide ${index + 1} không có thanh cờ`).not.toBeNull();
      expect(bar?.className, `slide ${index + 1}: thanh cờ thiếu nhịp`).toContain("a-bar");
      unmount();
    }
  });

  it("trang chờ: logo → dòng đơn vị → tiêu đề → gạch đỏ → chương trình → địa điểm/ngày tháng", () => {
    const container = renderKind("standby");

    expect(delayOf(container.querySelector(".standby-logo"))).toBe("80ms");
    expect(delayOf(container.querySelector(".standby-eyebrow"))).toBe("140ms");
    expect(delayOf(container.querySelector(".standby-title"))).toBe("200ms");
    expect(container.querySelector(".standby-rule")?.className).toContain("a-grow");
    expect(delayOf(container.querySelector(".standby-rule"))).toBe("280ms");
    expect(delayOf(container.querySelector(".standby-program"))).toBe("340ms");
    expect(delayOf(container.querySelector(".standby-place"))).toBe("400ms");
  });

  it("bìa: logo → dòng dẫn → tiêu đề → gạch đỏ → phụ đề, băng ảnh vào sau cùng", () => {
    const container = renderKind("cover");

    expect(container.querySelector(".coverpage-hero")?.className).toContain("a-media");
    expect(delayOf(container.querySelector(".coverpage-logos"))).toBe("80ms");
    expect(delayOf(container.querySelector(".coverpage-eyebrow"))).toBe("140ms");
    expect(delayOf(container.querySelector(".coverpage-title"))).toBe("200ms");
    expect(container.querySelector(".coverpage-rule")?.className).toContain("a-grow");
    expect(delayOf(container.querySelector(".coverpage-rule"))).toBe("320ms");
    expect(delayOf(container.querySelector(".coverpage-sub"))).toBe("380ms");

    const band = [...container.querySelectorAll(".coverpage-band figure")];
    expect(band).toHaveLength(3);
    expect(band.map(delayOf)).toEqual(["420ms", "510ms", "600ms"]);
    for (const figure of band) {
      expect(figure.className).toContain("a-media");
    }
  });

  it("phân mục: nhãn PHẦN, chữ cái phần, tiêu đề, gạch đỏ rồi mục lục", () => {
    const container = renderKind("divider");

    expect(container.querySelector(".divider-bg")?.className).toContain("a-media");
    expect(delayOf(container.querySelector(".divider-part span"))).toBe("200ms");
    expect(delayOf(container.querySelector(".divider-part b"))).toBe("260ms");
    expect(delayOf(container.querySelector(".divider-wrap h1"))).toBe("380ms");
    expect(delayOf(container.querySelector(".divider-rule"))).toBe("480ms");
    expect(delayOf(container.querySelector(".divider-toc"))).toBe("540ms");
  });

  it("nội dung: tiêu đề 160ms, gạch 280ms, chữ dẫn 330ms, gạch đầu dòng cách nhau 70ms", () => {
    const container = renderKind("content");

    expect(delayOf(container.querySelector(".content-title"))).toBe("160ms");
    expect(delayOf(container.querySelector(".content-rule"))).toBe("280ms");
    expect(delayOf(container.querySelector(".content-lead"))).toBe("330ms");

    const bullets = [...container.querySelectorAll(".content-bullets li")];
    expect(bullets.length).toBeGreaterThan(1);
    bullets.forEach((bullet, index) => {
      expect(bullet.className).toContain("a-rise");
      expect(delayOf(bullet)).toBe(`${400 + 70 * index}ms`);
    });

    const figures = [...container.querySelectorAll(".content-media figure")];
    expect(figures.length).toBeGreaterThan(0);
    figures.forEach((figure, index) => {
      expect(figure.className).toContain("a-media");
      expect(delayOf(figure)).toBe(`${260 + 90 * index}ms`);
    });
  });

  it("số liệu: con số chủ đạo trồi lên ở 340ms, sáu thẻ so le 60ms", () => {
    const container = renderKind("kpi");

    expect(delayOf(container.querySelector(".figures-head h1"))).toBe("160ms");
    expect(delayOf(container.querySelector(".figures-sum"))).toBe("230ms");
    expect(delayOf(container.querySelector(".figures-rule"))).toBe("300ms");
    expect(delayOf(container.querySelector(".figures-hero-value"))).toBe("340ms");
    expect(delayOf(container.querySelector(".figures-hero-txt"))).toBe("420ms");

    const cells = [...container.querySelectorAll(".figures-cell")];
    expect(cells).toHaveLength(6);
    cells.forEach((cell, index) => {
      expect(cell.className).toContain("a-rise");
      expect(delayOf(cell)).toBe(`${470 + 60 * index}ms`);
    });
  });

  it("mô hình: tiêu đề, URL, chữ dẫn rồi hai danh sách chạy tiếp một mạch", () => {
    const index = firstOfKind("model");
    const slide = SLIDES[index];
    if (slide.kind !== "model") throw new Error("fixture sai kind");
    const { container } = render(<SlideCanvas index={index} mode="full" />);

    expect(delayOf(container.querySelector(".model-head h1"))).toBe("160ms");
    expect(delayOf(container.querySelector(".model-url"))).toBe("230ms");
    expect(delayOf(container.querySelector(".model-sum"))).toBe("300ms");
    expect(delayOf(container.querySelector(".model-lists h2.fn"))).toBe("345ms");

    const functions = [...container.querySelectorAll(".model-functions li")];
    functions.forEach((item, order) => {
      expect(delayOf(item)).toBe(`${400 + 55 * order}ms`);
    });

    // Danh sách hiệu quả nối tiếp: tiêu đề nhóm đứng ngay sau mục chức năng cuối cùng.
    const headingDelay = 400 + 55 * slide.functions.length;
    expect(delayOf(container.querySelector(".model-lists h2.ef"))).toBe(`${headingDelay}ms`);
    const effects = [...container.querySelectorAll(".model-effects li")];
    effects.forEach((item, order) => {
      expect(delayOf(item)).toBe(`${headingDelay + 55 * (order + 1)}ms`);
    });

    for (const figure of container.querySelectorAll(".model-media figure")) {
      expect(figure.className).toContain("a-media");
    }
  });

  it("kết luận: dòng dẫn, tiêu đề, khẩu hiệu, chữ khái quát rồi dải chỉ số", () => {
    const container = renderKind("outro");

    // Slide kết luận của bộ 44 slide còn CHỜ ảnh nền nhà trường gửi, nên `.outro-bg` không
    // tồn tại ở dữ liệu thật — nhịp của ảnh nền kiểm riêng bằng fixture ở test dưới.
    expect(container.querySelector(".outro-bg")).toBeNull();
    expect(delayOf(container.querySelector(".outro-kicker"))).toBe("140ms");
    expect(delayOf(container.querySelector(".outro-msg h1"))).toBe("200ms");
    expect(delayOf(container.querySelector(".outro-slogan"))).toBe("300ms");
    expect(delayOf(container.querySelector(".outro-lead"))).toBe("380ms");

    const stats = [...container.querySelectorAll(".outro-stat")];
    expect(stats).toHaveLength(5);
    stats.forEach((stat, index) => {
      expect(stat.className).toContain("a-rise");
      expect(delayOf(stat)).toBe(`${460 + 70 * index}ms`);
    });
  });

  it("kết luận có ảnh nền: ảnh nền vào bằng a-media", () => {
    const { container } = render(<OutroSlideView slide={outroWithBackground} />);

    expect(container.querySelector(".outro-bg")?.className).toContain("a-media");
  });

  // Cụm nhận diện dùng chung `SlideChrome` cho bốn khuôn; số trang và chú thích chân trang
  // cố tình ĐỨNG YÊN (mockup 05 để `.snum` không có nhịp) — khoá lại để không ai thêm vào.
  it("cụm nhận diện vào ở 80ms; số trang và chú thích chân trang không có nhịp", () => {
    const container = renderKind("content");

    expect(container.querySelector(".slide-brand")?.className).toContain("a-fade");
    expect(delayOf(container.querySelector(".slide-brand"))).toBe("80ms");
    expect(container.querySelector(".slide-num")?.className).not.toContain("anim");
    expect(container.querySelector(".slide-foot")?.className).not.toContain("anim");
  });
});
