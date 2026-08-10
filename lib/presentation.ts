export const CHANNEL_NAME = "cnt-presentation-demo-v1";

export type VideoCommand = "play" | "pause" | "restart";

export type PresentationState = {
  slideIndex: number;
  sequence: number;
};

export type PresentationMessage =
  | { type: "REQUEST_STATE" }
  | { type: "STATE"; slideIndex: number; sequence: number }
  | { type: "COMMAND"; command: VideoCommand; sequence: number }
  | { type: "PRESENTER_READY" };

export type PresentationAction =
  | { type: "sync"; slideIndex: number; sequence: number }
  | { type: "navigate"; slideIndex: number };

type CoverImage = {
  src: string;
  alt: string;
  caption: string;
};

type Metric = {
  value: string;
  label: string;
};

export type CoverSlide = {
  kind: "cover";
  sourceNumber: 1;
  eyebrow: string;
  title: string;
  subtitle: string;
  units: readonly string[];
  date: string;
  footer: string;
  note: string;
  images: readonly CoverImage[];
};

export type KpiSlide = {
  kind: "kpi";
  sourceNumber: 31;
  title: string;
  summary: string;
  headline: "15/15";
  headlineLabel: string;
  headlineSubline: string;
  metrics: readonly Metric[];
  footnote: string;
  note: string;
};

export type PlatformSlide = {
  kind: "platform";
  sourceNumber: 34;
  title: string;
  url: string;
  summary: string;
  functions: readonly string[];
  effects: readonly string[];
  note: string;
  footnote: string;
  hero: CoverImage;
  screenshots: readonly CoverImage[];
  videoSrc: string;
};

export type SlideDefinition = CoverSlide | KpiSlide | PlatformSlide;

export const SLIDES = [
  {
    kind: "cover",
    sourceNumber: 1,
    eyebrow: "BCH ĐOÀN TRƯỜNG THPT CHUYÊN NGUYỄN TRÃI",
    title: "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU",
    subtitle:
      "trong công tác Đoàn và phong trào thanh niên trường học năm học 2025–2026",
    units: [
      "ĐOÀN PHƯỜNG LÊ THANH NGHỊ",
      "BCH ĐOÀN TRƯỜNG THPT CHUYÊN NGUYỄN TRÃI",
    ],
    date: "P. Lê Thanh Nghị, ngày 12 tháng 8 năm 2026",
    footer: "HẢI PHÒNG · 2026",
    note:
      "Mở đầu báo cáo; nhấn vào những mô hình sáng tạo tiêu biểu trong năm học.",
    images: [
      {
        src: "/media/cover-youth-project.jpg",
        alt: "Công trình thanh niên Những cánh thư vượt sóng",
        caption: "Công trình thanh niên Những cánh thư vượt sóng",
      },
      {
        src: "/media/platform-launch.jpg",
        alt: "Ra mắt nền tảng số quản lý công tác Đoàn",
        caption: "Ra mắt nền tảng số quản lý công tác Đoàn",
      },
      {
        src: "/media/eco-vision.jpg",
        alt: "Chiến dịch Eco Vision – Ước mơ xanh",
        caption: "Chiến dịch Eco Vision – Ước mơ xanh",
      },
      {
        src: "/media/discipline-webapp.png",
        alt: "WebApp Nền nếp CNT",
        caption: "WebApp Nền nếp CNT",
      },
    ],
  },
  {
    kind: "kpi",
    sourceNumber: 31,
    title: "6. Kết quả thực hiện chỉ tiêu năm học",
    summary:
      "Đoàn trường hoàn thành 15/15 nhóm chỉ tiêu, trong đó nhiều chỉ tiêu về tình nguyện, công trình thanh niên và phát triển Đảng vượt kế hoạch.",
    headline: "15/15",
    headlineLabel: "NHÓM CHỈ TIÊU HOÀN THÀNH",
    headlineSubline: "Kết quả thực hiện chỉ tiêu năm học 2025–2026",
    metrics: [
      { value: "05 · 11", label: "05 công trình, 11 phần việc thanh niên." },
      {
        value: "Trên 1.000",
        label: "Trên 1.000 lượt ĐVTN tham gia tình nguyện.",
      },
      { value: "05", label: "05 đội hình Hoa phượng đỏ." },
      { value: "14", label: "Hỗ trợ 14 học sinh khó khăn." },
      {
        value: "03 · 01",
        label: "03 chương trình hướng nghiệp và 01 giải pháp tư vấn số.",
      },
      {
        value: "80 · 27",
        label: "Giới thiệu 80 đoàn viên ưu tú; 27 đồng chí kết nạp Đảng.",
      },
    ],
    footnote:
      "Phần B.I – Mục 6. Đánh giá kết quả thực hiện các chỉ tiêu cơ bản năm học 2025–2026.",
    note:
      "Nhấn mạnh kết quả 15/15 nhóm chỉ tiêu và các chỉ tiêu vượt nổi bật.",
  },
  {
    kind: "platform",
    sourceNumber: 34,
    title: "1. Mô hình 1 – Nền tảng số quản lý công tác Đoàn",
    url: "https://doantruong.chuyennguyentrai.edu.vn",
    summary:
      "Nền tảng tích hợp 06 nhóm chức năng, hỗ trợ quản lý tập trung và giảm đáng kể khối lượng tổng hợp thủ công.",
    functions: [
      "Quản lý nền nếp.",
      "Khen thưởng.",
      "Quản lý đoàn viên.",
      "Ngoại khóa – sự kiện.",
      "Hoạt động câu lạc bộ.",
      "Cập nhật cuộc thi, chương trình đang triển khai.",
    ],
    effects: [
      "Dữ liệu được cập nhật tập trung.",
      "Tăng tính chính xác, minh bạch.",
      "Hỗ trợ BCH theo dõi và điều hành theo thời gian thực.",
      "Có khả năng phát triển thành công cụ dùng chung cho khối THPT.",
    ],
    note:
      "Giới thiệu 06 nhóm chức năng; phát clip ngắn để minh họa giao diện và cách vận hành.",
    footnote:
      "Phần C.7. Mô hình 1: Nền tảng số quản lý công tác Đoàn khối THPT.",
    hero: {
      src: "/media/platform-launch.jpg",
      alt: "Ra mắt nền tảng số quản lý công tác Đoàn",
      caption: "Ra mắt nền tảng số quản lý công tác Đoàn",
    },
    screenshots: [
      {
        src: "/media/platform-member-management.png",
        alt: "Giao diện quản lý đoàn viên",
        caption: "Giao diện quản lý đoàn viên",
      },
      {
        src: "/media/platform-dashboard.png",
        alt: "Giao diện trang quản lý công tác Đoàn",
        caption: "Giao diện trang quản lý công tác Đoàn",
      },
    ],
    videoSrc: "/media/platform-demo.mp4",
  },
] as const satisfies readonly SlideDefinition[];

export function clampSlideIndex(index: number): number {
  return Math.min(SLIDES.length - 1, Math.max(0, index));
}

export function reducePresentationState(
  state: PresentationState,
  action: PresentationAction,
): PresentationState {
  if (action.type === "sync") {
    if (action.sequence <= state.sequence) {
      return state;
    }

    return {
      slideIndex: clampSlideIndex(action.slideIndex),
      sequence: action.sequence,
    };
  }

  return {
    slideIndex: clampSlideIndex(action.slideIndex),
    sequence: state.sequence + 1,
  };
}
