import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
    // Nạp trước ảnh (lib/useImagePreload.ts) tạo hơn 100 phần tử Image() mỗi lần
    // PresentationScreen/ControlDeck được mount — cộng dồn qua nhiều test file dưới tải hệ
    // thống từng khiến test có BroadcastChannel + video thật (channel-integration.test.tsx)
    // vượt mốc mặc định 5000ms dù không có lỗi logic. Nới lên 10s cho toàn bộ bộ test.
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
