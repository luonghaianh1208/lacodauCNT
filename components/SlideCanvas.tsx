"use client";

import Image from "next/image";
import { type CSSProperties, type RefObject } from "react";

import { SLIDES, type CoverSlide, type KpiSlide, type PlatformSlide } from "@/lib/presentation";

type SlideCanvasProps = {
  index: number;
  mode: "full" | "preview";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
};

function BrandLockup({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand-lockup ${light ? "brand-lockup--light" : ""}`}>
      <div className="brand-logos">
        <Image
          src="/media/school-logo.png"
          alt="Logo Trường THPT Chuyên Nguyễn Trãi"
          width={120}
          height={120}
          priority
        />
        <Image
          src="/media/youth-union-logo.png"
          alt="Logo Đoàn TNCS Hồ Chí Minh"
          width={120}
          height={120}
          priority
        />
      </div>
      <div className="brand-copy">
        <strong>ĐOÀN TRƯỜNG THPT CHUYÊN NGUYỄN TRÃI</strong>
        <span>Năm học 2025–2026</span>
      </div>
    </div>
  );
}

function Cover({ slide }: { slide: CoverSlide }) {
  return (
    <article className="slide-frame cover-slide">
      <div className="cover-stripe" />
      <div className="cover-orbit cover-orbit--top" />
      <div className="cover-orbit cover-orbit--bottom" />
      <section className="cover-copy">
        <div className="cover-logos" aria-label="Nhận diện đơn vị">
          <Image
            src="/media/school-logo.png"
            alt="Logo Trường THPT Chuyên Nguyễn Trãi"
            width={120}
            height={120}
            priority
          />
          <Image
            src="/media/youth-union-logo.png"
            alt="Logo Đoàn TNCS Hồ Chí Minh"
            width={120}
            height={120}
            priority
          />
        </div>
        <p className="cover-eyebrow">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <div className="cover-rule" />
        <p className="cover-subtitle">{slide.subtitle}</p>
        <div className="cover-meta">
          {slide.units.map((unit) => (
            <p key={unit}>{unit}</p>
          ))}
          <p>{slide.date}</p>
        </div>
        <p className="cover-footer">{slide.footer}</p>
      </section>
      <section className="cover-gallery" aria-label="Các mô hình tiêu biểu">
        {slide.images.map((image, position) => (
          <figure key={image.src} style={{ "--order": position } as CSSProperties}>
            <div className="cover-image-wrap">
              <Image src={image.src} alt={image.alt} width={640} height={360} />
            </div>
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </section>
    </article>
  );
}

function CountUpHeadline() {
  return (
    <>
      <span className="kpi-count" aria-hidden="true" />
      <span className="sr-only">15/15</span>
    </>
  );
}

function Kpi({ slide }: { slide: KpiSlide }) {
  return (
    <article className="slide-frame light-slide kpi-slide">
      <BrandLockup />
      <header className="kpi-header">
        <h1>{slide.title}</h1>
        <p>{slide.summary}</p>
      </header>
      <section className="kpi-banner" aria-label="Kết quả tổng hợp">
        <div className="kpi-headline">
          <CountUpHeadline />
        </div>
        <div>
          <h2>{slide.headlineLabel}</h2>
          <p>{slide.headlineSubline}</p>
        </div>
      </section>
      <section className="metric-grid" aria-label="Các chỉ tiêu vượt nổi bật">
        {slide.metrics.map((metric, position) => (
          <article
            className="metric-card"
            data-testid="metric-card"
            key={metric.value}
            style={{ "--order": position } as CSSProperties}
          >
            <strong>{metric.value}</strong>
            <p>{metric.label}</p>
          </article>
        ))}
      </section>
      <p className="slide-footnote">{slide.footnote}</p>
      <span className="slide-number">31</span>
    </article>
  );
}

function Platform({
  slide,
  videoRef,
  videoBlocked,
  onVideoFallback,
}: {
  slide: PlatformSlide;
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
}) {
  return (
    <article className="slide-frame light-slide platform-slide">
      <BrandLockup />
      <header className="platform-header">
        <h1>{slide.title}</h1>
        <p className="platform-url">{slide.url}</p>
        <p className="platform-summary">{slide.summary}</p>
      </header>
      <section className="platform-copy">
        <div>
          <h2>Các chức năng chính:</h2>
          <ul>
            {slide.functions.map((item) => (
              <li key={item} data-testid="platform-function">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Hiệu quả:</h2>
          <ul>
            {slide.effects.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="platform-media" aria-label="Minh chứng nền tảng số">
        <figure className="platform-hero">
          <div className="platform-video-wrap">
            <video
              ref={videoRef}
              data-testid="platform-video"
              src={slide.videoSrc}
              poster={slide.hero.src}
              preload="metadata"
              playsInline
            />
            {videoBlocked ? (
              <button className="video-fallback" type="button" onClick={onVideoFallback}>
                <span className="play-triangle" aria-hidden="true" />
                NHẤN ĐỂ PHÁT VIDEO
              </button>
            ) : null}
          </div>
          <figcaption>{slide.hero.caption}</figcaption>
        </figure>
        <div className="platform-shots">
          {slide.screenshots.map((image) => (
            <figure key={image.src}>
              <div>
                <Image src={image.src} alt={image.alt} width={640} height={360} />
              </div>
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <p className="slide-footnote">{slide.footnote}</p>
      <span className="slide-number">34</span>
    </article>
  );
}

export function SlideCanvas({
  index,
  mode,
  videoRef,
  videoBlocked = false,
  onVideoFallback,
}: SlideCanvasProps) {
  const slide = SLIDES[Math.min(SLIDES.length - 1, Math.max(0, index))];

  return (
    <div
      className={`slide-shell slide-shell--${mode}`}
      data-slide-index={index}
      aria-label={`Slide ${slide.sourceNumber}`}
    >
      {slide.kind === "cover" ? <Cover slide={slide} /> : null}
      {slide.kind === "kpi" ? <Kpi slide={slide} /> : null}
      {slide.kind === "platform" ? (
        <Platform
          slide={slide}
          videoRef={videoRef}
          videoBlocked={videoBlocked}
          onVideoFallback={onVideoFallback}
        />
      ) : null}
    </div>
  );
}
