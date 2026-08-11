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
  lead?: Phrases;
  headline: string;
  headlineLabel: Phrases;
  metrics: readonly KpiMetric[];
  /** Trang thứ hai của một mục trải 2 trang: bỏ `lead`, tiêu đề thêm "(tiếp)". */
  continued?: boolean;
};

export type ModelSlide = BaseSlide & {
  kind: "model";
  title: Phrases;
  url?: string;
  lead: Phrases;
  /**
   * Nhãn nhóm ý thứ nhất. Bỏ trống thì lấy "CÁC CHỨC NĂNG CHÍNH" — đúng cho ba mô hình
   * nền tảng số, nhưng năm mô hình còn lại (concert, cuộc thi, công trình, chiến dịch)
   * gọi nhóm này là "Điểm mới, sáng tạo" nên phải đặt nhãn riêng.
   */
  functionsLabel?: Phrases;
  functions: readonly Phrases[];
  /** Nhãn nhóm ý thứ hai; bỏ trống thì lấy "HIỆU QUẢ". Nhóm rỗng thì cả khối bị ẩn. */
  effectsLabel?: Phrases;
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
  | StandbySlide
  | CoverSlide
  | DividerSlide
  | ContentSlide
  | KpiSlide
  | ModelSlide
  | OutroSlide;
