import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Demo Báo cáo Lá cờ đầu · THPT Chuyên Nguyễn Trãi",
  description: "Demo trình chiếu web 3 slide tiêu biểu của Đoàn trường.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
