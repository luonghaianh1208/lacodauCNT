import type { Metadata } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Báo cáo Lá cờ đầu · THPT Chuyên Nguyễn Trãi",
  description: "Bộ trình chiếu web 38 slide báo cáo công tác Đoàn năm học 2025–2026.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={`${archivo.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
