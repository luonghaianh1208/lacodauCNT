/**
 * Một dòng chữ hiển thị, tách sẵn thành các cụm không được phép ngắt giữa chừng.
 *
 * CSS ngắt dòng ở mọi dấu cách và không hiểu ranh giới từ tiếng Việt, nên nếu để
 * chuỗi thường thì trình duyệt sẵn sàng tách "ĐƠN / VỊ" hay "NGUYỄN / TRÃI".
 * Kiểu mảng ép người soạn phải tự chọn chỗ ngắt; truyền chuỗi thường sẽ lỗi biên dịch.
 */
export type Phrases = readonly [string, ...string[]];

/** Cụm dài hơn ngưỡng này không ngắt được nên sẽ tràn khung ở một bố cục nào đó. */
export const MAX_PHRASE_LENGTH = 36;

export function phrasesToText(value: Phrases): string {
  return value.join(" ");
}
