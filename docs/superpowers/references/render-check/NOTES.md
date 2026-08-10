# Kiểm tra thị giác 38 slide — Task 13

Ảnh chụp trong thư mục này sinh ra bằng `node scripts/render-check.mjs` (chạy sau
`npm run build`). Thư mục ảnh nằm trong `.gitignore`, chỉ file NOTES.md này được theo dõi.

Thêm cờ `--audit` để script đo hình học ngay trong trang và in cảnh báo:

```bash
npm run build
node scripts/render-check.mjs --audit
```

Trạng thái cuối: **0/38 slide có cảnh báo hình học**, 38/38 ảnh đã soi bằng mắt.

---

## Cách chụp

- `?slide=N` (0-based) mở thẳng một slide bất kỳ; giá trị ngoài khoảng bị kẹp về biên,
  giá trị không phải số bị bỏ qua (về trang 1).
- `?capture=1` là tham số RIÊNG cho việc chụp: bỏ lớp che "SẴN SÀNG TRÌNH CHIẾU" và tắt
  chuyển động. Tách rời khỏi `?slide=` có chủ đích — lớp che tồn tại để một cú nhấn của
  người dùng mở khoá quyền phát video kèm tiếng, nên người thuyết trình vẫn mở thẳng được
  một trang giữa bộ (`?slide=12`) mà không mất quyền đó.

---

## Lỗi đã tìm ra và đã sửa

### 1. Chữ cột giấy bị nuốt vào panel navy — slide 10, 22, 24 (nghiêm trọng)

Chữ tô màu `--ink` (#0b315d) trườn lên panel navy (#0b315d) nên **tàng hình hoàn toàn**.
Trên slide 22 mất đuôi của tiêu đề và của hai gạch đầu dòng ("tham gia đội tuyể|n",
"doanh nghiệp, ngân hàn|g").

Nguyên nhân: `.content-text` là lưới, cột ngầm của nó mặc định là `auto`, mà `auto` lấy
min-content của ô rộng nhất làm sàn. Cụm `.ph` mang `white-space: nowrap` không ngắt được
nên min-content của tiêu đề chính là bề rộng cả cụm → cột phình quá `width: 43cqw` và kéo
theo cả đoạn dẫn lẫn gạch đầu dòng.

Sửa: thêm `grid-template-columns: minmax(0, 1fr)` cho `.content-text` (`app/globals.css`).

### 2. Chữ bị cắt cụt ở mép phải slide — slide 9, 21, 23, 25 (nghiêm trọng)

Cùng nguyên nhân với mục 1, nhưng panel ở bên trái nên cột chữ neo theo mép phải: phần
phình chạy hẳn ra ngoài slide rồi bị `overflow: hidden` của `.slide-shell` cắt. Đo được
+11,5px (slide 9), +34,9px (21, 23), +42,3px (25).

Sửa: cùng một dòng CSS ở mục 1, cộng thêm việc tách cụm ở mục 3.

### 3. Cụm từ dài hơn cột chữ — slide 8, 9, 10, 16, 17, 21, 22, 23, 24, 25, 3 (nghiêm trọng)

Sau khi khoá bề rộng cột, cụm nowrap quá dài vẫn tự tràn khỏi hộp của nó. Đã tách lại các
cụm trong `lib/slides/data.ts`; **chữ hiển thị không đổi**, chỉ thêm chỗ được phép ngắt:

| Cụm cũ | Cụm mới |
|---|---|
| `"1.3. Giáo dục truyền thống", "cách mạng, lòng yêu nước"` | `"1.3. Giáo dục", "truyền thống cách mạng,", "lòng yêu nước"` |
| `"1.4. Giáo dục đạo đức,", "lối sống văn hóa và pháp luật"` | `…, "lối sống văn hóa", "và pháp luật"` |
| `["Chiến dịch Hoa phượng đỏ"]` | `["Chiến dịch", "Hoa phượng đỏ"]` |
| `"3.1. Đồng hành với thanh niên", "trong học tập"` | `"3.1. Đồng hành", "với thanh niên", "trong học tập"` |
| `"3.2. Đồng hành với thanh niên", "khởi nghiệp, lập nghiệp"` | `"3.2. Đồng hành", "với thanh niên", …` |
| `"Đa dạng các loại hình", "hoạt động văn hóa, nghệ thuật"` | `…, "hoạt động văn hóa,", "nghệ thuật"` |
| `"Tập huấn nâng cao nghiệp vụ", "công tác Đoàn năm học 2025 – 2026"` | `…, "công tác Đoàn", "năm học 2025 – 2026"` |
| `"Thực hành phòng cháy, chữa cháy", "và cứu nạn cứu hộ"` | `"Thực hành phòng cháy,", "chữa cháy", …` |

Không cụm nào bị tách sai chỗ: "đơn vị", "Nguyễn Trãi", "thanh niên", "đoàn viên" đều còn
nguyên khối (đã soi lại bằng mắt cả 38 ảnh).

### 4. Ruột panel mô hình cao hơn slide, chú thích hàng dưới bị cắt — slide 35, 36, 37 (nghiêm trọng)

Ba ảnh phụ xếp hai cột thành hai hàng → ruột panel cao ~739px trong khung 720px, `align-content:
center` đẩy tràn cả hai đầu: chú thích hàng dưới bị cắt ngang chữ (+9,5px) và ảnh hàng trên
dâng lên đè cụm nhận diện.

Sửa: `ModelSlideView` gắn `data-count` cho `.model-shots`; CSS xếp một hàng ba cột khi có ba
ảnh phụ.

### 5. Cụm nhận diện đè lên ảnh trong panel — slide 7, 27, 36 (nghiêm trọng)

Panel bên trái + hai ảnh 16:9 xếp dọc (cao ~676px) → ảnh dâng tới đỉnh slide, chữ trắng của
cụm nhận diện rơi thẳng lên băng rôn đỏ/trắng trong ảnh, gần như không đọc được và làm bẩn ảnh.

Sửa: thêm khuôn `.content-media--duo` — chừa khoảng an toàn phía trên cho cụm nhận diện rồi
chia đôi chiều cao còn lại, cho ảnh lấp đầy ô (đúng cách băng ba ảnh trang bìa đang làm).
Slide 36 được sửa kèm theo mục 4.

### 6. Gạch đầu dòng cuối đè / chạm chú thích chân trang — slide 8, 23 (nghiêm trọng)

Lộ ra sau khi tiêu đề dài được tách thành ba dòng: cột chữ mọc từ trên xuống còn chú thích
neo ở đáy. Slide 23 chồng hẳn 14px, slide 8 chạm sát.

Sửa: hạ mật độ hai trang này từ `thoang` xuống `vua`. `densityForBullets` chỉ đếm gạch đầu
dòng nên không thấy được tiêu đề ba dòng và đoạn dẫn ba–bốn dòng; hai trang này ghi rõ lý do
ngay tại chỗ trong `data.ts`.

### 7. Ảnh nền có chữ lớn chọi với tiêu đề — slide 1, 2, 33, 38 (vừa)

- Slide 2: băng rôn "ĐẢNG CỘNG SẢN VIỆT NAM QUANG VINH MUÔN NĂM !" và phông "ĐẠI HỘI ĐẠI
  BIỂU" hiện rõ như một tiêu đề thứ hai, cắt ngang ngay sau tiêu đề thật.
- Slide 38: dòng "TỔNG KẾT … PHONG TRÀO THANH THIẾU NHI" hiện rõ ngay sau
  "TUỔI TRẺ CHUYÊN NGUYỄN TRÃI".
- Slide 1: dòng "CÔNG TRÌNH THANH NIÊN / NỀN TẢNG SỐ QUẢN LÝ CÔNG TÁC ĐOÀN KHỐI THPT" trên
  màn LED lọt vào đúng dải tiêu đề.
- Slide 33: nhẹ hơn, cùng loại.

Sửa: kéo đậm thêm lớp veil — `.divider-veil` sàn phải 0,16 → 0,46; `.outro-veil` chặn trên
0,55 → 0,8; `.coverpage-veil` giữ mức đậm tới 56% (đúng mép khối copy) thay vì 40%.

### 8. Số trang trắng gần như không đọc được trên ảnh nền sáng — slide 2, 5, 33 (vừa)

Số trang ở góc phải-trên của trang phân mục rơi đúng vùng trần nhà / tường trắng, một lớp
bóng nhạt không đủ tách chữ trắng khỏi nền trắng.

Sửa: `.slide-stage[data-over-photo="true"] .slide-num` dùng hai lớp `text-shadow` đậm hơn.

### 9. Tiêu đề trang phân mục vượt `max-width` — slide 2 (+20px), slide 5 (+13px) (nhẹ)

Cụm "THPT CHUYÊN NGUYỄN TRÃI" và "TRONG NĂM HỌC 2025 – 2026" ở cỡ 4,4cqw rộng hơn 62cqw.
Sửa: nới `.divider-wrap h1` lên 66cqw — vừa đủ chứa chữ mà tiêu đề vẫn giữ ba dòng.

### 10. Logo trường biến mất khỏi ~1/3 ảnh chụp (lỗi của khâu chụp, không phải của slide)

Bản đầu của script dùng cờ `--screenshot` kèm `--virtual-time-budget`: Chrome chụp ngay khi
đồng hồ ảo hết, KHÔNG đợi ảnh giải mã xong. `school-logo.png` là PNG 1563×1563 (~1MB) nên
giải mã chậm và rụng ngẫu nhiên khỏi 12–16 trong 38 ảnh — mỗi lần chạy lại rụng ở một tập
slide khác. Cờ `--run-all-compositor-stages-before-draw` giảm nhưng không hết.

Sửa: script chuyển sang điều khiển Chrome qua CDP, trước mỗi lần chụp còn chờ
`document.fonts.ready` và `img.decode()` của mọi ảnh. Từ đó ảnh chụp lặp lại được.

---

## Đã kiểm và ĐẠT

- Panel ảnh luân phiên trái–phải đúng qua mọi slide nội dung liên tiếp: 3 phải, 4 trái,
  6 phải, 7 trái, … 30 phải, rồi 34 trái, 35 phải, 36 trái, 37 phải. Ba trang phân mục
  (2, 5, 33) và hai trang số liệu (31, 32) chen vào không làm lệch nhịp.
- Số trang không đè lên cụm logo ở bất kỳ slide nào (đo `.slide-num` × `.slide-brand`).
- Số trang không rơi lên panel navy ở bất kỳ slide nào (đo `.slide-num` × panel).
- Không còn chú thích ảnh nào bị cắt hoặc rộng hơn cột chứa nó.

---

## Còn tồn đọng — cần người phụ trách nội dung quyết

Những mục dưới đây là **sai lệch nội dung**, không phải lỗi bố cục. Không tự sửa vì không
xác minh được đâu mới là dữ liệu đúng.

### A. Slide 25 — panel navy trống trơn nửa slide

Bộ ảnh trích từ PPTX không có file `s25_*` nào, nên `images: []`. Panel navy chiếm nửa
slide mà không có gì bên trong.

Đã thử chuyển tấm `s24_img6.jpg` (chú thích "Gói bánh chưng 'Gói trọn vị nhà'", trùng đúng
gạch đầu dòng của slide 25) sang đây rồi **hoàn tác**: xem mục B, chính tấm ảnh đó đang
mang chú thích sai, đưa lên ô ảnh chính sẽ phóng to lỗi lên.

Cần: một ảnh thật cho trang này, hoặc gộp trang 24–25 lại.

### B. Chú thích không khớp nội dung ảnh

| Ảnh | Chú thích đang dùng | Ảnh thật vẽ gì |
|---|---|---|
| `s24_img6.jpg` (slide 24) | "Gói bánh chưng 'Gói trọn vị nhà'" | Poster "MỞ ĐƠN ĐĂNG KÝ CÂU LẠC BỘ – ĐỢT I (2026-2027)" |
| ảnh 3 slide 20 | "Giao lưu với lực lượng vũ trang" | Tranh đồ họa "Cách mạng màu" |
| ảnh 1 slide 9 | "'Phiên tòa giả định' về phòng, chống bạo lực học đường" | Băng rôn "CHƯƠNG TRÌNH NGOẠI KHÓA – XÂY DỰNG TÌNH BẠN ĐẸP, NÓI KHÔNG VỚI BẠO LỰC HỌC ĐƯỜNG" |
| ba ảnh phụ slide 36 | "Khán giả tại concert" / "Trao biển hỗ trợ trên sân khấu" / "Tiết mục biểu diễn trên sân khấu concert" | Lần lượt là poster gây quỹ, ảnh trao quà trong nhà dân, ảnh trao quà trong nhà dân |

Bộ test hiện có (`tests/slides-data.test.ts`) chỉ bắt được trường hợp một tấm ảnh mang hai
chú thích khác nhau, không bắt được chú thích sai so với nội dung ảnh.

### C. Slide 32 — nửa dưới trống

Khuôn số liệu dựng lưới 3 cột × 2 hàng cho 6 thẻ chỉ tiêu, nhưng slide 32 chỉ còn 2 thẻ nên
hàng dưới trống hẳn. Không phải lỗi bố cục (không cắt, không đè), nhưng nhìn mất cân. Cần
quyết định về nội dung: gộp vào slide 31, hay bổ sung chỉ tiêu.

### D. Đoạn dẫn ngắt dòng lồi lõm (nhẹ, cố hữu của cơ chế cụm từ)

Ví dụ slide 3: "…hoạt động / trên quy mô toàn trường / với địa bàn cư trú…" — dòng giữa
ngắn hơn hẳn hai dòng kề. Đây là hệ quả trực tiếp của việc mỗi cụm là một khối không ngắt
được: người soạn chọn chỗ ngắt, trình duyệt chỉ được xuống dòng ở đó. Muốn đều hơn thì phải
chia lại cụm cho từng đoạn dẫn, việc này thuộc về khâu biên tập nội dung.

### E. Logo trường nặng bất thường

`public/media/school-logo.png` là 1563×1563 (~1MB) cho một ô hiển thị 46px. Không gây lỗi
hiển thị nhưng làm chậm giải mã (chính là thứ đã phá khâu chụp ảnh, mục 10). Nên xuất lại
bản nhỏ.
