"use client";

import { useEffect, useState } from "react";

import { SLIDES } from "@/lib/slides";
import { isSlideVideo, type Slide } from "@/lib/slides/types";

export type ImagePreloadProgress = {
  /** Số ảnh đã nạp xong — kể cả ảnh lỗi, để tiến độ không treo mãi. */
  loaded: number;
  /** Tổng số ảnh cần nạp trước. */
  total: number;
  /** Đã xong khi `loaded === total`, hoặc ngay từ đầu nếu không có ảnh nào. */
  done: boolean;
};

/**
 * Gom mọi đường dẫn ảnh khai trong `SLIDES`: trường `images` (khuôn bìa/nội dung/mô hình)
 * và `background` (khuôn phân mục/kết luận). Loại trùng vì nhiều slide dùng lại cùng ảnh.
 */
export function collectImagePaths(slides: readonly Slide[]): string[] {
  const paths = new Set<string>();
  for (const slide of slides) {
    if ("images" in slide) {
      for (const media of slide.images) {
        // Ô video không nạp trước bằng `new Image()` — không phải ảnh, trình duyệt sẽ báo
        // lỗi giải mã. Chỉ nạp trước khung hình tĩnh (`poster`) nếu ô đó có khai.
        if (isSlideVideo(media)) {
          if (media.poster) paths.add(media.poster);
          continue;
        }
        paths.add(media.src);
      }
    }
    if ("background" in slide && slide.background) {
      paths.add(slide.background.src);
    }
  }
  return [...paths];
}

// Tính một lần ở module scope: cùng một mảng cho mọi lần gọi `useImagePreload()` không
// truyền `sources`, nên effect bên dưới chỉ chạy đúng một lần khi màn trình chiếu mount
// thay vì chạy lại mỗi lần render vì nhận một mảng mới cùng nội dung nhưng khác tham chiếu.
const DEFAULT_SOURCES = collectImagePaths(SLIDES);

/**
 * Nạp trước danh sách ảnh và chờ trình duyệt GIẢI MÃ xong, không chỉ tải xong byte.
 * `onload` chỉ báo tải xong dữ liệu — ảnh có thể chưa giải mã, nên khung hình đầu tiên lúc
 * trình chiếu vẫn có thể trắng một nhịp. `decode()` chờ đến khi ảnh sẵn sàng vẽ ngay lập
 * tức. Trình duyệt không hỗ trợ `decode()` thì rơi về chỉ `onload`.
 *
 * Ảnh lỗi (404, hỏng) vẫn tính là "đã xong" để tiến độ không treo mãi — chỉ ghi tên ra
 * console để biết đường sửa.
 */
export function useImagePreload(
  sources: readonly string[] = DEFAULT_SOURCES,
): ImagePreloadProgress {
  const [loaded, setLoaded] = useState(0);
  const total = sources.length;

  useEffect(() => {
    let cancelled = false;

    const markOne = () => {
      if (!cancelled) {
        setLoaded((count) => count + 1);
      }
    };

    for (const src of sources) {
      const image = new Image();
      image.onload = () => {
        if (typeof image.decode === "function") {
          image.decode().then(markOne, markOne);
        } else {
          markOne();
        }
      };
      image.onerror = () => {
        console.error(`Nạp trước lỗi ảnh: ${src}`);
        markOne();
      };
      image.src = src;
    }

    return () => {
      cancelled = true;
    };
    // `sources` phụ thuộc theo NỘI DUNG (nối chuỗi), không theo tham chiếu mảng: gọi
    // `useImagePreload()` không truyền tham số luôn nhận cùng `DEFAULT_SOURCES` nên vẫn ổn,
    // nhưng nơi gọi truyền literal mảng mới mỗi lần render (ví dụ test) sẽ tạo tham chiếu
    // khác nhau dù nội dung giống hệt — nếu phụ thuộc theo tham chiếu, mỗi lần `setLoaded`
    // kích hoạt render lại sẽ bị hiểu nhầm là danh sách ảnh đổi, huỷ tiến độ đang đếm dở
    // rồi nạp lại từ đầu, có thể lặp vô hạn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources.join(" ")]);

  return { loaded, total, done: total === 0 || loaded >= total };
}
