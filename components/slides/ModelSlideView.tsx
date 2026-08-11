import Image from "next/image";
import { type CSSProperties, type RefObject } from "react";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import { focusStyle } from "@/lib/image-focus";
import type { ModelSlide } from "@/lib/slides/types";

/**
 * Nhịp "dàn nhạc vào" của khuôn mô hình. Mockup `05-chuyen-dong.html` không dựng khuôn này
 * nên nhịp được suy ra theo đúng tinh thần khuôn nội dung: khung → tiêu đề → chữ dẫn →
 * nội dung chi tiết → ảnh. Riêng các danh sách chạy tiếp một mạch (bước 55ms thay vì 70ms
 * như gạch đầu dòng khuôn nội dung) vì tổng có tới chín mục; giữ 70ms thì mục cuối rơi quá
 * xa mốc ~900ms mà spec §7.1 đặt ra.
 */
const MODEL_DELAY = {
  title: 160,
  url: 230,
  lead: 300,
  listBase: 400,
  listStep: 55,
  mediaBase: 260,
  shotBase: 350,
  shotStep: 90,
} as const;

/**
 * Từ 5 mục trở lên thì danh sách xếp hai cột — dưới ngưỡng đó, hai cột để lại một cột
 * gần rỗng nên xếp một cột đọc gọn hơn. Số hàng phải tính sẵn ở đây rồi truyền xuống CSS:
 * để lưới tự đẻ hàng thì nó đẻ thêm CỘT thứ ba, mỗi cột hẹp còn một phần ba và chữ tràn.
 */
const TWO_COLUMN_MIN = 5;

/** Nhóm đầu tô xanh dương, nhóm sau tô xanh lá, rồi lặp lại — giữ đúng cặp màu cũ. */
function toneOf(index: number): "fn" | "ef" {
  return index % 2 === 0 ? "fn" : "ef";
}

/**
 * Khuôn mô hình + media — panel navy chứa video minh chứng đổi bên qua `side`,
 * văn bản (tiêu đề, URL, các nhóm ý) nằm phía đối diện.
 * Không phải slide "model" nào cũng có `videoSrc` (chỉ 2/10 slide thật có video),
 * nên khi thiếu video thì hiện ảnh dẫn dắt (`role: "chinh"`) thay thế; thiếu cả hai
 * thì panel navy để trơn.
 */
export function ModelSlideView({
  slide,
  side = "right",
  videoRef,
  videoBlocked = false,
  onVideoFallback,
}: {
  slide: ModelSlide;
  side?: "left" | "right";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
}) {
  const hero = slide.images.find((image) => image.role === "chinh");
  const shots = slide.images.filter((image) => image.role !== "chinh");

  /*
   * Cả cụm nhóm ý chạy trên MỘT dòng thời gian liên tục: mỗi nhãn nhóm ăn một bước, rồi
   * đến các mục của nhóm đó. Chỗ đứng của một nhóm vì thế là tổng (1 nhãn + số mục) của
   * các nhóm trước nó; nhãn lùi lại một bước để nhãn đầu tiên rơi đúng mốc 345ms như bản
   * hai danh sách cố định trước đây, còn mục đầu tiên vẫn ở 400ms.
   */
  const visibleGroups = slide.groups.filter((group) => group.items.length > 0);
  const groups = visibleGroups.map((group, index) => {
    const stepsBefore = visibleGroups
      .slice(0, index)
      .reduce((total, earlier) => total + earlier.items.length + 1, 0);
    return {
      ...group,
      labelDelay: MODEL_DELAY.listBase + MODEL_DELAY.listStep * (stepsBefore - 1),
      itemBase: MODEL_DELAY.listBase + MODEL_DELAY.listStep * stepsBefore,
    };
  });

  return (
    <div
      className="slide-stage model-stage"
      data-density={slide.density}
      data-side={side}
      data-on-dark={side === "left" ? "true" : "false"}
    >
      <div className="model-media">
        {/* Slide 35 cố ý không có ảnh (người thuyết trình mở website thật để demo): không
            dựng khung video rỗng, để panel navy trơn như khuôn nội dung khi thiếu ảnh. */}
        {slide.videoSrc || hero ? (
          <figure className="anim a-media" style={animDelay(MODEL_DELAY.mediaBase)}>
            {/* `data-fit` chỉ có ý nghĩa khi hiện ảnh (video không có trường `fit`) — CSS bắt
                thuộc tính này để chuyển ảnh sang object-fit: contain, không cắt. */}
            <div className="model-video" data-fit={hero?.fit === "contain" ? "contain" : undefined}>
              {slide.videoSrc ? (
                <video
                  ref={videoRef}
                  data-testid="model-video"
                  src={slide.videoSrc}
                  poster={hero?.src}
                  preload="metadata"
                  playsInline
                />
              ) : hero ? (
                <Image
                  src={hero.src}
                  alt={hero.alt}
                  width={1280}
                  height={720}
                  style={focusStyle(hero)}
                />
              ) : null}
              {slide.videoSrc && videoBlocked ? (
                <button className="video-fallback" type="button" onClick={onVideoFallback}>
                  <span className="play-triangle" aria-hidden="true" />
                  NHẤN ĐỂ PHÁT VIDEO
                </button>
              ) : null}
            </div>
            {hero ? (
              <figcaption>
                <Phrase value={hero.caption} />
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        {/* `data-count` để CSS xếp ba ảnh phụ thành một hàng ba cột; hai cột sẽ thành hai
            hàng, làm ruột panel cao hơn slide và cắt mất chú thích hàng dưới. */}
        {shots.length > 0 ? (
          <div className="model-shots" data-count={shots.length}>
            {shots.map((image, index) => (
              <figure
                key={image.src}
                className="anim a-media"
                style={animDelay(MODEL_DELAY.shotBase + MODEL_DELAY.shotStep * index)}
              >
                <div>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1280}
                    height={720}
                    style={focusStyle(image)}
                  />
                </div>
                <figcaption>
                  <Phrase value={image.caption} />
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
      <SlideChrome slide={slide} side={side} />
      {/* Cột chữ chảy một mạch: hai danh sách nằm NGAY DƯỚI cụm đầu trang chứ không neo ở
          một mốc `top` cố định. Neo cố định thì mô hình nào có tiêu đề ba dòng kèm địa chỉ
          web là đè lên nhau, mô hình nào tiêu đề ngắn lại thừa một khoảng trống lớn. */}
      <div className="model-col">
        <div className="model-head">
          <h1 className="serif anim a-rise" style={animDelay(MODEL_DELAY.title)}>
            <Phrase value={slide.title} />
          </h1>
          {slide.url ? (
            <p className="model-url anim a-rise" style={animDelay(MODEL_DELAY.url)}>
              {slide.url}
            </p>
          ) : null}
          <p className="model-sum anim a-rise" style={animDelay(MODEL_DELAY.lead)}>
            <Phrase value={slide.lead} />
          </p>
        </div>
        {/* Nhóm rỗng đã bị lọc bỏ ở trên: không để lại một nhãn nhóm treo lơ lửng trên
            danh sách không có mục nào. */}
        <div className="model-lists">
          {groups.map((group, index) => {
            const twoColumns = group.items.length >= TWO_COLUMN_MIN;
            return (
              <section key={`${index}-${group.label[0]}`}>
                <h2
                  className={`${toneOf(index)} anim a-rise`}
                  style={animDelay(group.labelDelay)}
                >
                  <Phrase value={group.label} />
                </h2>
                <ul
                  className="model-group"
                  data-tone={toneOf(index)}
                  data-columns={twoColumns ? 2 : 1}
                  style={
                    twoColumns
                      ? ({
                          "--rows": Math.ceil(group.items.length / 2),
                        } as CSSProperties)
                      : undefined
                  }
                >
                  {group.items.map((item, order) => (
                    <li
                      key={`${order}-${item[0]}`}
                      className="anim a-rise"
                      style={animDelay(group.itemBase + MODEL_DELAY.listStep * order)}
                      data-testid="model-item"
                    >
                      <Phrase value={item} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
