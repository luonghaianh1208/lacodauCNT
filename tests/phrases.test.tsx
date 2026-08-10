import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Phrase } from "@/components/Phrase";
import { MAX_PHRASE_LENGTH, phrasesToText } from "@/lib/phrases";

describe("Phrase", () => {
  it("nối các cụm bằng dấu cách thường để giữ nguyên câu đọc được", () => {
    render(
      <p data-testid="dong">
        <Phrase value={["BÁO CÁO KẾT QUẢ", "ĐƠN VỊ ĐĂNG KÝ", "LÁ CỜ ĐẦU"]} />
      </p>,
    );

    expect(screen.getByTestId("dong").textContent).toBe(
      "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU",
    );
  });

  it("bọc mỗi cụm trong một span không cho ngắt dòng", () => {
    const { container } = render(<Phrase value={["ĐƠN VỊ", "ĐĂNG KÝ"]} />);
    const spans = container.querySelectorAll("span.ph");

    expect(spans).toHaveLength(2);
    expect(spans[0].textContent).toBe("ĐƠN VỊ");
  });

  it("phrasesToText ghép lại đúng chuỗi gốc", () => {
    expect(phrasesToText(["Hơn 400 ĐVTN", "tham gia thi tìm hiểu pháp luật."])).toBe(
      "Hơn 400 ĐVTN tham gia thi tìm hiểu pháp luật.",
    );
  });

  it("ngưỡng độ dài cụm là 36 ký tự", () => {
    expect(MAX_PHRASE_LENGTH).toBe(36);
  });
});
