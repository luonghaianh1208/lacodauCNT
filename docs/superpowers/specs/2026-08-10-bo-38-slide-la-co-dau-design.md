# Bộ 38 slide web — Báo cáo Lá cờ đầu 2025–2026

Ngày chốt thiết kế: 2026-08-10 · Repo: `github.com/luonghaianh1208/lacodauCNT`

## 1. Mục tiêu

Mở rộng bản demo 3 slide hiện có thành bộ trình chiếu web đầy đủ 38 slide, dựng trên một hệ thiết kế tái sử dụng được: sáu khuôn slide, một bảng token, và các quy tắc dữ liệu được kiểu TypeScript ép buộc. Người soạn thêm slide mới chỉ cần điền dữ liệu, không chạm vào CSS.

Không nằm trong phạm vi: xuất file PPTX, điều khiển từ thiết bị thứ hai, sửa nội dung báo cáo.

## 2. Nguồn dữ liệu

| Nguồn | Dùng để | Đường dẫn |
|---|---|---|
| `Noi_dung_PowerPoint_Bao_cao_Doan_truong_2025_2026.docx` | Toàn bộ chữ: tiêu đề, dòng khái quát, gạch đầu dòng, chú thích chân trang | `BÁO CÁO ĐOÀN CNT LÁ CỜ ĐẦU 25-26/` |
| `Bao_cao_La_co_dau_CNT_2025-2026_EDITABLE_KHONG_VIDEO.pptx` | 193 ảnh đã gắn đúng từng slide, rút qua `ppt/slides/_rels/slideN.xml.rels` | cùng thư mục |
| Ảnh chốt của người dùng | Thay ảnh tạm khi có | sẽ gửi sau |

Tài liệu nguồn có 31 mục, trong đó 7 mục trải 2 trang (9+10, 12+13, 16+17, 21+22, 24+25, 26+27, 31+32) → đúng 38 slide, khớp với số slide trong PPTX.

**Mâu thuẫn đã ghi nhận:** SLIDE 20 ghi tiêu đề "(2 trang)" nhưng chỉ được đánh một số. Coi là lỗi soạn thảo, giữ SLIDE 20 là một trang. Cần người dùng xác nhận.

## 3. Hệ thiết kế

### 3.1 Chữ

- Tiêu đề và con số: **Source Serif 4** (700)
- Thân bài, nhãn, chú thích: **Archivo** (400–800)
- Nạp bằng `next/font/google`, tự host khi build, có subset `vietnamese`. Không phụ thuộc mạng lúc trình chiếu.
- Instrument Serif đã bị loại vì không có bộ ký tự tiếng Việt (kiểm tra qua API Google Fonts).

### 3.2 Màu

| Token | Mã | Tương phản trên nền giấy `#f4f7fb` | Vai trò |
|---|---|---|---|
| `--navy` | `#0b315d` | 12,13 | Nền panel, chữ chính |
| `--red` | `#e32420` | 4,31 | Cột mốc, kết quả chính trị. Chỉ dùng cho số cỡ lớn |
| `--red-ink` | `#c81e1a` | 5,34 | Bản đỏ cho chữ nhỏ, đạt AA |
| `--blue` | `#006ebb` | 4,95 | Công trình, tổ chức, chuyên môn |
| `--green` | `#0e7a43` | 5,03 | Con người và sức lan tỏa |
| `--yellow` | `#ffd500` | — | Chỉ dùng trên nền navy |

Xanh lá tươi `#1f9d55` đã bị loại: tương phản 3,25, trượt AA.

### 3.3 Thang chữ và núm mật độ

Mọi cỡ chữ nội dung khai báo theo `cqw` (phần trăm chiều rộng slide) nên co giãn tuyệt đối theo màn hình, và nhân với một biến duy nhất `--s` cho mỗi slide:

```
--fs-display: calc(8.3cqw * var(--s))   /* số chủ đạo   */
--fs-h1:      calc(2.9cqw * var(--s))   /* tiêu đề      */
--fs-metric:  calc(2.6cqw * var(--s))   /* số chỉ tiêu  */
--fs-lead:    calc(1.55cqw * var(--s))  /* dòng khái quát */
--fs-body:    calc(1.42cqw * var(--s))  /* thân bài     */
--fs-label:   calc(1.25cqw * var(--s))  /* nhãn in hoa  */
--fs-cap:     calc(1.1cqw * var(--s))   /* chú thích ảnh */
```

| Mật độ | `--s` | Thân bài | Tương đương PowerPoint |
|---|---|---|---|
| `thoang` | 1,2 | 1,70% | ~21pt |
| `vua` | 1,0 | 1,42% | ~17,5pt |
| `day` | 0,87 | 1,24% | ~15pt |

Chuẩn đối chiếu: slide PowerPoint 16:9 rộng 960pt, thân bài 18–20pt tương đương 1,9–2,1% chiều rộng. Bản demo cũ để 1,02% (~10pt) nên bị đánh giá là quá nhỏ.

Thành phần khung — logo, chú thích chân trang, số trang — **không** co giãn theo `--s`, giữ cố định suốt bộ slide.

Tỷ lệ phân cấp cố định: số chủ đạo gấp 5,9 lần thân bài; số chỉ tiêu gấp 1,8 lần; tiêu đề gấp 2 lần.

## 4. Quy tắc ngắt dòng tiếng Việt

CSS ngắt dòng ở mọi dấu cách và không hiểu ranh giới từ đa âm tiết, nên nó tách "ĐƠN / VỊ", "NGUYỄN / TRÃI". `text-wrap: balance` không giải quyết được.

**Chỗ ngắt do người viết quyết định và nằm trong dữ liệu:**

```ts
export type Phrases = readonly [string, ...string[]];

title: ["BÁO CÁO KẾT QUẢ", "ĐƠN VỊ ĐĂNG KÝ", "LÁ CỜ ĐẦU"]   // ✅
title: "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU"            // ❌ lỗi TypeScript
```

Component `<Phrase>` nối các cụm bằng dấu cách thường, mỗi cụm bọc trong `white-space: nowrap`. Accessible name không đổi nên test và trình đọc màn hình không bị ảnh hưởng.

Đánh đổi: cụm đã `nowrap` thì không ngắt được, quá dài sẽ tràn khung. Kèm test chặn cụm dài hơn 36 ký tự.

## 5. Sáu khuôn slide

| Khuôn | Số slide | Slide | Mật độ |
|---|---|---|---|
| Bìa | 1 | 1 | vua |
| Trang phân mục | 3 | 2, 5, 33 | — |
| Nội dung + ảnh minh chứng | 27 | 3–4, 6–30 | theo số gạch đầu dòng, xem dưới |
| Số liệu | 2 | 31, 32 | thoang |
| Mô hình + media | 4 | 34–37 | day |
| Kết luận | 1 | 38 | vua |

> **Sửa so với bản gốc (10/08/2026).** Bốn slide mô hình dùng `day`, không phải `vua`. Khuôn này chồng nhiều khối lên cùng một cột chữ — tiêu đề, URL, dòng khái quát và hai danh sách tổng cộng tới chín mục — nên ở mức `vua` phần cuối danh sách hiệu quả đè lên chú thích chân trang.

### 5.1 Bìa

Ảnh nền tràn ba mép chiếm 64% chiều cao, veil chuyển sắc ngang. Khối chữ căn giữa dọc bên trái. Khối đơn vị và địa chỉ nằm trên tấm trắng mờ 90% có `backdrop-filter: blur`, viền trái đỏ, chữ navy. Băng ba ảnh phụ chiếm 36% dưới, mỗi ảnh rộng 382px ở khung 1280px.

Ảnh nền đã chốt: **Ra mắt nền tảng số**. Ảnh này có chữ lớn trên màn LED phía sau nên veil ở vùng tiêu đề được tăng độ đậm riêng cho slide này.

### 5.2 Trang phân mục

Nền là ảnh sự kiện để nguyên độ sáng, phủ một lớp veil ngang **mức 2**: `rgba(7,26,48,.94)` → `.90` tại 42% → `.62` tại 72% → `.46` tại 100%. Chữ cái phần (A/B/C) cỡ 11cqw màu vàng, dưới nhãn "PHẦN". Ba trang này lấy đúng cấu trúc Phần A / B / C mà chú thích chân trang của báo cáo đang dẫn.

> **Sửa so với bản gốc (10/08/2026).** Mức veil đã ghi (`.92` → `.88`@40% → `.38`@70% → `.16`@100%) không dùng được với ảnh thật: cả ba ảnh trang phân mục đều là ảnh hội nghị có băng rôn chữ lớn ("ĐẢNG CỘNG SẢN VIỆT NAM QUANG VINH MUÔN NĂM", "ĐẠI HỘI ĐẠI BIỂU"). Ở sàn `.16` băng rôn đọc rõ như một tiêu đề thứ hai chọi với tiêu đề thật của slide, rõ nhất ở slide 2. Sàn `.46` vẫn thấy được cảnh và người nhưng chữ trong ảnh chìm hẳn.

Mọi chữ khung trên khuôn này có `text-shadow` vì nền ảnh có thể sáng bất kỳ chỗ nào — gồm cả chú thích chân trang. Riêng chú thích chân trang chỉ thêm bóng mà **không** đổi sang trắng như cụm nhận diện và số trang: nó là chữ phụ, tô trắng lên là chọi ngang hàng với mục lục phần ngay phía trên.

### 5.3 Nội dung + ảnh minh chứng

Mật độ chọn theo số gạch đầu dòng, không để người soạn tự quyết: **≤ 5 dòng → `thoang`; 6–7 dòng → `vua`; ≥ 8 dòng → `day`**. Tài liệu nguồn có slide ít nhất 3 dòng, nhiều nhất 9 dòng nên cả ba mức đều được dùng.

Cột chữ rộng 43cqw, panel navy rộng 48cqw tràn mép. Trong panel: một ảnh dẫn dắt 16:9 và hai ảnh 3:2 bên dưới. Ruột panel đổi theo số ảnh: 1 ảnh thì tràn kín, 2 ảnh xếp dọc, 3 ảnh là 1 lớn + 2 nhỏ, 4 ảnh là lưới 2×2.

**Panel đổi bên xen kẽ** theo thứ tự các slide nội dung liên tiếp, **không theo số trang chẵn lẻ** — nếu theo số trang thì các trang phân mục chen vào sẽ làm hai slide liền nhau cùng panel một bên.

Khi panel nằm bên trái: thanh cờ và cụm logo **giữ nguyên vị trí**, chỉ đảo màu chữ sang trắng. **Số trang và chú thích chân trang đều đi theo cột chữ** — cả hai luôn nằm bên đối diện panel.

> **Sửa so với bản gốc (10/08/2026).** Bản gốc cho số trang giữ nguyên vị trí góc phải-trên. Giữ nguyên thì với panel bên phải, số trang rơi thẳng lên nền navy của panel; nó tô theo `--chrome-sub` (màu dành cho cụm logo ở góc panel) nên hoặc đè lên panel hoặc lẫn màu với panel. Số trang và chú thích chân trang thuộc cùng một cột chữ nên phải đi cùng nhau. Số trang neo vào mép **ngoài** của cột giấy (`right: 50cqw` khi panel bên phải), **không** phải `left: 4.6cqw` — đó là toạ độ của cụm logo, đặt vào đó là vẽ đè lên logo trường.

### 5.4 Số liệu

Con số chủ đạo nằm ngang cạnh nhãn, lưới 3×2 thẻ chỉ tiêu bên dưới. Màu số theo ngữ nghĩa mục 3.2. Số chủ đạo đếm tăng từ 0 trong 900ms.

### 5.5 Mô hình + media

Panel navy rộng 48cqw chứa video đúng tỷ lệ 16:9 (không cắt), chú thích, và các ảnh chụp màn hình bên dưới. Cột chữ đối diện chứa tiêu đề, URL màu xanh Đoàn, dòng khái quát và hai danh sách: chức năng (chấm xanh Đoàn), hiệu quả (chấm xanh lá).

> **Sửa so với bản gốc (10/08/2026).** Bản gốc ghi panel "phải" nằm bên phải, tự mâu thuẫn với §7.2: khuôn mô hình nằm trong nhóm 31 slide "có panel" chạy rèm theo nhịp xen kẽ trái–phải. Panel của khuôn này theo **đúng quy tắc xen kẽ ở §7.2** như khuôn nội dung, không cố định một bên. Nhịp xen kẽ đếm theo thứ tự các slide **có panel** liên tiếp, không theo số trang chẵn lẻ.

### 5.6 Kết luận

Ảnh nền phủ 66% trên, thông điệp kết căn giữa cỡ 5,4cqw, dải 5 chỉ số theo hệ màu ngữ nghĩa ở dưới.

## 6. Quy tắc chọn ảnh

Mỗi ảnh mang một vai trò: `nen` · `chinh` · `phu`.

**Bước 1 — máy lọc tự động.** Ảnh bị loại khỏi vai trò `nen` nếu `tỷ lệ pixel trắng > 0,25` hoặc `tỷ lệ pixel phẳng > 0,65`. Đo bằng canvas trong Chrome headless. Số liệu kiểm chứng trên 8 ảnh mẫu: ảnh chụp có trắng ≤ 0,097 và phẳng ≤ 0,504; ảnh màn hình có trắng ≥ 0,436 và phẳng ≥ 0,717. Không có vùng chồng lấn.

**Bước 2 — chọn bằng mắt** trong số ảnh còn lại, ưu tiên giảm dần:
1. Đông người trong bối cảnh sự kiện
2. Người đang hành động
3. Toàn cảnh có người

**Loại bằng mắt** (máy không bắt được): ảnh cận cảnh vật thể không có người; ảnh đã có sẵn chữ lớn choán vùng tiêu đề.

**Bước 3 — không có ảnh nào đủ điều kiện thì dùng nền navy đặc**, không ép ảnh xấu vào.

**Bước 4 — mọi ảnh nền phải render và nhìn thật trước khi chốt**, không chốt qua tên file.

Trong lúc chờ ảnh chốt của người dùng, dùng ảnh rút từ PPTX làm ảnh tạm; kèm một bản kê slide → ô ảnh để thay file khi có ảnh mới.

## 7. Hệ chuyển động

### 7.1 Dàn nhạc vào (giống nhau ở mọi slide)

Thanh cờ dựng từ trên 420ms → cụm logo hiện (delay 80ms) → tiêu đề trồi lên (160ms) → gạch đỏ kéo ngang (280ms) → dòng khái quát (330ms) → từng gạch đầu dòng cách nhau 70ms → ảnh hiện kèm thu từ 103,5%. Tổng khoảng 900ms.

### 7.2 Chuyển cảnh — buộc vào loại slide

| Loại slide | Kiểu | Số lần | Lý do |
|---|---|---|---|
| Trang phân mục | Chiều sâu (scale 1,045 → 1) | 3 | Báo hiệu đổi chương |
| Nội dung / mô hình có panel | Rèm panel (panel trượt vào từ chính phía của nó) | 31 | Nhịp xen kẽ trái–phải thành chuyển động thấy được |
| Bìa, số liệu, kết luận | Trượt & mờ 4cqw | 4 | Không có panel để kéo rèm |

Tổng: 31 + 3 + 4 = 38.

Không trộn ngẫu nhiên: người xem sẽ đọc sự ngẫu nhiên thành ý nghĩa rồi không tìm ra ý.

### 7.3 Công tắc animation

Ba trạng thái, **mặc định BẬT**: `force` (bật bất chấp hệ điều hành) · `auto` (theo `prefers-reduced-motion`) · `off`.

Lý do đảo mặc định so với thông lệ web: đây là công cụ chạy trên máy người thuyết trình. Đã đo trên máy người dùng — Windows đang tắt hiệu ứng chuyển động (`SPI_GETCLIENTAREAANIMATION = False`), khiến `animation-duration` bị ép xuống 0,001s và toàn bộ animation CSS biến mất. Lựa chọn được lưu lại giữa các phiên.

## 8. Mô hình dữ liệu

```ts
type Density = "thoang" | "vua" | "day";
type ImageRole = "nen" | "chinh" | "phu";
type Phrases = readonly [string, ...string[]];

type SlideImage = {
  src: string;
  alt: string;
  caption: Phrases;
  role: ImageRole;
};

type BaseSlide = {
  number: number;          // số trang thật, 1–38
  density: Density;
  footnote?: Phrases;
};

type ContentSlide = BaseSlide & {
  kind: "content";
  title: Phrases;
  lead: Phrases;
  bullets: readonly Phrases[];
  images: readonly SlideImage[];
  continued?: boolean;     // trang thứ hai của một mục trải 2 trang
};
```

Vị trí panel **không** nằm trong dữ liệu — nó được tính từ thứ tự các slide nội dung liên tiếp, để không ai phải nhớ đặt tay.

## 9. Mục trải hai trang — cần xác nhận

Bảy mục trải 2 trang. Đề xuất: trang đầu giữ tiêu đề, dòng khái quát và nửa đầu gạch đầu dòng; trang sau giữ nguyên tiêu đề kèm dấu "(tiếp)", bỏ dòng khái quát, chứa nửa sau gạch đầu dòng và bộ ảnh khác. **Cần người dùng xác nhận cách chia này trước khi dựng.**

## 10. Kiểm thử và nghiệm thu

1. Test nội dung: mỗi slide render đúng tiêu đề, đủ số gạch đầu dòng, đủ số ảnh, đúng chú thích chân trang.
2. Test ngắt dòng: không cụm nào dài quá 36 ký tự.
3. Test kiểu: mọi chuỗi hiển thị là `Phrases`, không phải `string`.
4. Test bộ lọc ảnh: không ảnh nào có `role: "nen"` mà vượt ngưỡng ảnh màn hình.
5. Kiểm tra thị giác: render cả 38 slide ở 1280×720 bằng Chrome headless, xem từng ảnh, xác nhận không tràn khung, không chữ chồng, không caption bị cắt.
6. `npm run test`, `npm run lint`, `npm run build` phải sạch.

## 11. Bẫy kỹ thuật đã gặp, ghi lại để không lặp

- Hàng lưới `1fr` có mức tối thiểu ngầm là `min-content`; `min-content` của `<img>` là chiều cao gốc của file ảnh. Phải dùng `minmax(0, 1fr)` ở **mọi cấp lưới lồng nhau**, nếu không hàng ảnh phình ra và đẩy caption khỏi khung.
- Thiếu `box-sizing: border-box` khiến panel có `padding` phình thêm chiều rộng và nuốt đuôi các dòng chữ dài.
- Chữ tối đè lên panel navy sẽ tàng hình chứ không báo lỗi. Mọi vùng chữ phải nằm trong cột giấy của nó.
