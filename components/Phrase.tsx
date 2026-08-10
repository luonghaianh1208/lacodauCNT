import { Fragment } from "react";

import type { Phrases } from "@/lib/phrases";

/**
 * Nối các cụm bằng dấu cách thường nhưng bọc mỗi cụm trong `white-space: nowrap`,
 * nên trình duyệt chỉ được xuống dòng tại ranh giới do người soạn chọn.
 * Nội dung chữ đọc lên không đổi, accessible name và test không bị ảnh hưởng.
 */
export function Phrase({ value }: { value: Phrases }) {
  return (
    <>
      {value.map((chunk, index) => (
        <Fragment key={`${index}-${chunk}`}>
          {index > 0 ? " " : null}
          <span className="ph">{chunk}</span>
        </Fragment>
      ))}
    </>
  );
}
