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
  /**
   * Ép vị trí cắt ảnh (CSS `object-position`) khi mặc định "lệch lên trên" (xem
   * `.slide-stage img` trong app/globals.css) không hợp cho ảnh này. Chỉ ba lựa chọn cố
   * định, không toạ độ tự do — dự án này cố ý không cho đặt vị trí tuỳ ý.
   */
  focus?: "top" | "center" | "bottom";
};

/**
 * Một ô media dạng video, dùng thay `SlideImage` đúng tại vị trí của nó trong `images` —
 * khuôn nội dung không có template riêng cho video, ô media nào cũng nhận được cả hai loại
 * (xem `MediaPanel`/`Figure` trong `ContentSlideView`). `kind: "video"` là trường phân biệt
 * duy nhất; không có trường này thì coi là `SlideImage`, nên 128 ô ảnh hiện có không phải
 * sửa gì để vẫn hợp lệ.
 */
export type SlideVideo = {
  kind: "video";
  src: string;
  /** Khung hình tĩnh hiện trước khi phát — dùng lại ảnh tĩnh cũ của ô này nếu có. */
  poster?: string;
  alt: string;
  caption: Phrases;
  role: ImageRole;
};

export type SlideMedia = SlideImage | SlideVideo;

export function isSlideVideo(media: SlideMedia): media is SlideVideo {
  return "kind" in media && media.kind === "video";
}

type BaseSlide = {
  /** Số trang thật trong báo cáo, 1–44 (riêng khuôn "standby" cố định 0). Hiện ở góc slide. */
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

/**
 * Trang bìa đứng chiếu xuyên suốt chương trình (trước giờ khai mạc, giữa các phần nghỉ) —
 * mang nhận diện của ĐƠN VỊ KIỂM TRA (Thành đoàn Hải Phòng), không phải của nhà trường,
 * nên chỉ có logo Đoàn, không có logo trường. Số trang cố định 0: không thuộc 38 trang
 * đánh số của báo cáo, không có số trang hiển thị và không có chú thích chân trang.
 */
export type StandbySlide = BaseSlide & {
  kind: "standby";
  eyebrow: Phrases;
  title: Phrases;
  program: Phrases;
  place: Phrases;
};

export type DividerSlide = BaseSlide & {
  kind: "divider";
  /** Chữ cái phần: "A", "B", "C". */
  part: string;
  title: Phrases;
  toc: readonly Phrases[];
  /** Dòng khái quát của phần; chỉ trang phân mục nào tài liệu có ghi mới đặt. */
  lead?: Phrases;
  /**
   * Các ý chi tiết của phần. Có `points` thì khuôn chuyển sang hai cột (cụm tiêu đề bên
   * trái, các ý bên phải); không có thì giữ nguyên một cột như hai trang phân mục kia.
   */
  points?: readonly Phrases[];
  background?: SlideImage;
};

export type ContentSlide = BaseSlide & {
  kind: "content";
  title: Phrases;
  lead?: Phrases;
  bullets: readonly Phrases[];
  /** Ô media là `SlideImage` hoặc `SlideVideo` — xem `isSlideVideo` để phân biệt. */
  images: readonly SlideMedia[];
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
  lead?: Phrases;
  headline: string;
  headlineLabel: Phrases;
  metrics: readonly KpiMetric[];
  /** Trang thứ hai của một mục trải 2 trang: bỏ `lead`, tiêu đề thêm "(tiếp)". */
  continued?: boolean;
};

/**
 * Một nhóm ý của khuôn mô hình: nhãn lấy nguyên từ tài liệu nguồn ("Điểm mới, sáng tạo",
 * "Hiệu quả", "Quy mô", "Kết quả nổi bật"…) kèm các gạch đầu dòng thuộc nhóm đó.
 * Nhóm rỗng (`items` không có mục nào) bị ẩn hẳn, kể cả nhãn.
 */
export type ModelGroup = {
  label: Phrases;
  items: readonly Phrases[];
};

export type ModelSlide = BaseSlide & {
  kind: "model";
  title: Phrases;
  url?: string;
  lead: Phrases;
  /**
   * Số nhóm ý là tuỳ ý, không cố định hai khối: tám mô hình mới mỗi mô hình chia nhóm một
   * kiểu (có mô hình chỉ một nhóm, có mô hình hai nhóm với nhãn hoàn toàn khác nhau) nên
   * khuôn nhận thẳng danh sách nhóm thay vì hai trường `functions`/`effects` đóng cứng.
   */
  groups: readonly ModelGroup[];
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
  | StandbySlide
  | CoverSlide
  | DividerSlide
  | ContentSlide
  | KpiSlide
  | ModelSlide
  | OutroSlide;
