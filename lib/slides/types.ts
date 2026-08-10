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
