# Rà soát tài liệu 44 slide và thư mục ảnh

Ngày rà soát: 11/08/2026
Tài liệu nguồn: `Noi_dung_PowerPoint_Bao_cao_Doan_truong_2025_2026.docx` (đã đối chiếu trực tiếp với file Word, không chỉ bản markdown)
Thư mục ảnh: `(CHUẨN) ẢNH BÁO CÁO LÁ CỜ ĐẦU` — 35 thư mục, **122 ảnh + 4 video** = 126 file
Bộ web hiện tại: `web-demo-3-slides/lib/slides/data.ts` — 38 slide đánh số (1–38) + 1 trang chờ số 0

**Chưa sửa gì hết.** Báo cáo này chỉ để anh/chị duyệt. Không đụng vào `data.ts`, không đổi tên ảnh, không chèn ảnh.

---

## PHẦN 1 — TÓM TẮT: THIẾU GÌ VÀ CẦN QUYẾT GÌ

### 1.1. Bốn thư mục ảnh hoàn toàn trống

| Thư mục | Slide | Tài liệu yêu cầu ảnh gì | Tình trạng |
|---|---|---|---|
| `Trang 31+32` | 31, 32 | "Dùng infographic chỉ tiêu đạt/vượt, **không cần thêm ảnh hoạt động**" | Đúng chủ ý — không cần bổ sung |
| `Trang 33` | 33 (trang phân đoạn "CÁC MÔ HÌNH HAY") | Tài liệu **không ghi ảnh nền** | **Thiếu.** Hai trang phân đoạn kia (2 và 5) đều có ảnh nền, trang này thì không |
| `Trang 34` | 34 (Nền tảng số quản lý Đoàn) | "Ảnh giao diện trang chủ và 2–3 chức năng tiêu biểu" | **Thiếu toàn bộ ảnh chụp màn hình** |
| `Trang 35` | 35 (WebApp "Nền nếp CNT") | "Ảnh dashboard, biểu đồ thống kê và bảng xếp hạng" | **Thiếu toàn bộ ảnh chụp màn hình** |

Bộ web cũ đang có sẵn ảnh giao diện cho slide 34 và 35 (trích từ file PPTX cũ). **Cần quyết:** dùng lại ảnh giao diện cũ, hay anh/chị chụp lại màn hình mới cho hai nền tảng?

### 1.2. Bốn slide gần như trống nội dung — slide 40 đến 43

Tài liệu chỉ ghi **duy nhất tiêu đề** cho các slide này. Không có dòng khái quát, không có gạch đầu dòng, không có chú thích chân trang, không ghi ảnh chính.

| Slide | Tiêu đề trong tài liệu | Tài liệu ghi thêm | Thư mục có sẵn |
|---|---|---|---|
| 40 | 5. Mô hình Đền ơn đáp nghĩa | Video chính: Đền ơn đáp nghĩa | 3 ảnh + 1 video |
| 41 | 6. Mô hình Lớp tiếng Anh tình nguyện hè miễn phí | *(không ghi gì)* | 3 ảnh |
| 42 | 7. Mô hình CNT's day – Ngày hội Chuyên Nguyễn Trãi | *(không ghi gì)* | 4 ảnh |
| 43 | 8. Mô hình Xây dựng tình bạn đẹp, nói không với BLHĐ | Video chính: Xây dựng tình bạn đẹp | 2 ảnh + 1 video |

Anh/chị đã dặn "slide 40 đến 43 tạm thời chưa làm gì" — tôi ghi nhận và **không dựng bốn slide này**. Nhưng ảnh và video cho chúng thì đã có sẵn trong thư mục, nên khi nào anh/chị bổ sung nội dung là dựng được ngay.

### 1.3. Ba dòng tiêu đề cấp trên bị thiếu — anh/chị đã nêu, tôi xác nhận đúng

Tài liệu ghi rõ ba chỗ, kèm ghi chú `(chưa có dòng này)`:

| Slide | Dòng bị thiếu | Nằm trên tiêu đề nào |
|---|---|---|
| 6 | **1. Công tác giáo dục.** | 1.1 Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh |
| 11 | **2. Tổ chức phong trào hành động cách mạng** | 2.1. Phong trào "Thanh niên tình nguyện" |
| 21 | **3. Tổ chức các chương trình đồng hành với thanh niên** | 3.1. Đồng hành với thanh niên trong học tập |

Tôi đã đọc lại toàn bộ tài liệu, **chỉ có đúng ba ghi chú `(chưa có dòng này)` này**, không còn chỗ nào khác.

**Vấn đề kỹ thuật cần anh/chị biết:** khuôn slide hiện tại (`lib/slides/types.ts`) **không có chỗ để đặt dòng cấp trên này** — mỗi slide chỉ có một `title`. Nên phải thêm một trường mới (kiểu "dòng đề mục nhỏ in phía trên tiêu đề"). **Cần quyết:** dòng này hiển thị thế nào — chữ nhỏ màu nhạt phía trên tiêu đề, hay gộp thành dòng đầu tiên của tiêu đề?

### 1.4. Slide 36+37 và 38+39 phải tách đôi — web hiện gộp làm một

Anh/chị nêu slide 36–37 (Ký âm Sol hồng). Tôi rà thì **có hai chỗ bị gộp, không phải một**:

| Tài liệu | Web hiện tại | Phải làm |
|---|---|---|
| SLIDE 36 + 37 — Ký âm Sol hồng | slide 36, **một trang** | Tách thành 2 trang |
| SLIDE 38 + 39 — CNT Mind Challenges | slide 37, **một trang** | Tách thành 2 trang |

**Tài liệu chỉ dẫn tách bằng cách ghi hai ảnh chính riêng:**
- "Ảnh chính slide 36: Kí âm Sol Hồng" / "Ảnh chính slide 37: Trao quà Kí âm Sol Hồng"

Còn phần chữ thì tài liệu để chung một khối, không nói cắt ở đâu. Dựa vào **quy ước sẵn có trong web** cho các mục 2 trang khác (trang 2 lặp lại tiêu đề, bỏ dòng khái quát, mang phần gạch đầu dòng còn lại — xem slide 26/27 trong `data.ts`), tôi **đề xuất** cắt theo đúng hai nhóm mà tài liệu đã chia sẵn:

- **Slide 36** = nhóm "Quy mô" (4 ý) + ảnh "Kí âm Sol Hồng"
- **Slide 37** = nhóm "Giá trị mô hình" (4 ý) + ảnh "Trao quà Kí âm Sol Hồng"
- **Slide 38** = nhóm "Điểm mới" (5 ý) + **video "Đấu trường trí tuệ"**
- **Slide 39** = nhóm "Hiệu quả" (4 ý) + ảnh — nhưng **tài liệu không ghi ảnh chính cho slide 39**

**Cần anh/chị quyết:** (a) xác nhận cách cắt trên có đúng ý không; (b) slide 39 lấy ảnh nào làm ảnh chính? Thư mục `Trang 38+39` có 3 ảnh: "Toàn cảnh cuộc thi Đấu trường trí tuệ", "Phần thi Đấu trường trí tuệ", "Đường đua Trí tuệ". Tôi **không tự chọn**.

### 1.5. Video — anh/chị nói chưa có, nhưng thực tế ĐÃ CÓ ĐỦ 4 FILE

Đây là điểm khác với những gì anh/chị dặn, nên tôi báo lại rõ. **Bốn video đều đã nằm sẵn trong thư mục ảnh, đều là file mp4 hợp lệ, Full HD 1920×1080:**

| Slide | Tên video trong tài liệu | File thực tế | Thời lượng | Dung lượng |
|---|---|---|---|---|
| 9 | Phiên toà giả định | `Trang 9+10/Phiên toà giả định.mp4` | 27 giây | 25,3 MB |
| 38 (hoặc 39) | Đấu trường trí tuệ | `Trang 38+39/Đấu trường trí tuệ.mp4` | 37 giây | 36,2 MB |
| 40 | Đền ơn đáp nghĩa | `Trang 40/Hoạt động đền ơn đáp nghĩa.mp4` | 21 giây | 20,6 MB |
| 43 | Xây dựng tình bạn đẹp | `Trang 43/Xây dựng tình bạn đẹp.mp4` | 35 giây | 35,0 MB |

Tổng 117 MB video. Vì cả bốn đều đã cắt ngắn dưới 40 giây, **có lẽ không cần mốc thời gian** — chỉ cần phát từ đầu. **Cần anh/chị xác nhận:** đây có đúng là bản cuối để đưa lên không, hay anh/chị vẫn định thay bằng bản khác?

**Vấn đề kỹ thuật:** slide 9 là slide nội dung thường (`kind: "content"`), mà khuôn slide nội dung hiện **chưa hỗ trợ video** — chỉ khuôn "mô hình" (`kind: "model"`) mới có trường `videoSrc`. Sẽ phải mở rộng khuôn.

### 1.6. Slide 44 là slide cuối — xác nhận đúng, nhưng có một vướng mắc

Tài liệu kết thúc ở SLIDE 44 (Kết luận). Web hiện có slide 38 là trang kết ("TUỔI TRẺ CHUYÊN NGUYỄN TRÃI") — nội dung khớp với slide 44 mới.

**Nhưng:** web còn có **trang chờ số 0** ("CHƯƠNG TRÌNH KIỂM TRA" — nhận diện Thành đoàn Hải Phòng, chiếu trước giờ khai mạc). **Tài liệu 44 slide không hề nhắc tới trang này.** Cần anh/chị quyết: giữ trang chờ hay bỏ?

Về ảnh cho slide 44: tài liệu chỉ ghi chung chung "Ảnh tập thể tiêu biểu, ảnh cờ Đoàn hoặc ảnh tổng kết năm học", **không chỉ đích danh ảnh nào**. Thư mục `Trang 44` có 5 ảnh, đều là ảnh khen thưởng/vinh danh. **Tôi không tự chọn** — cần anh/chị chỉ định ảnh nào làm ảnh nền.

### 1.7. Mâu thuẫn trong chính tài liệu — cần anh/chị sửa Word

| Chỗ | Vấn đề |
|---|---|
| **Đánh số mô hình lệch nhau** | Tiêu đề ghi "Mô hình 2 – WebApp Nền nếp CNT" nhưng chú thích chân trang ghi "**Mô hình 3**: WebApp". Tương tự: tiêu đề "Mô hình 3 – Ký âm Sol hồng" ↔ chân trang "**Mô hình 4**"; tiêu đề "Mô hình 4 – CNT Mind Challenges" ↔ chân trang "**Mô hình 5**". Lệch một đơn vị từ slide 35 trở đi. Lấy theo tiêu đề hay theo chân trang? |
| **Slide 20 ghi "(2 trang)"** | Tiêu đề "2.3. Phong trào Tuổi trẻ xung kích bảo vệ Tổ quốc **(2 trang)**" nhưng mục này chỉ đánh **một** số slide (SLIDE 20), không phải "SLIDE 20 + 21". Có định tách 2 trang không? Nếu tách thì toàn bộ số slide phía sau đội lên 1 và không còn là 44. |
| **Lỗi gõ trang bìa** | "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ **ĐÀU**" → phải là **ĐẦU** |
| **Slide 26 có dấu ba chấm** | Dòng khái quát: "...120 vận động viên điền kinh**....** tham gia các giải" — dự án có quy định cấm dấu ba chấm trong chữ hiển thị. Sẽ bỏ, trừ khi anh/chị muốn giữ |
| **Định dạng không nhất quán** | Slide 7 ghi "Ảnh chính: Khi_toi_18" và slide 43 ghi "Video chính: Xây dựng tình bạn đẹp" — hai dòng này **không in đậm** như tất cả các slide khác. Chỉ là lỗi định dạng, tôi vẫn hiểu đúng là ảnh/video chính |

### 1.8. Ảnh bị trùng và tên bị trùng

**Trùng y hệt nhau (cùng mã băm md5 — là cùng một file được copy hai lần):**
- `Trang 2/Học sinh toàn trường chào cờ đầu tuần.jpg` = `Trang 3/Học sinh toàn trường chào cờ đầu tuần.jpg` → **slide 2 và slide 3 nằm liền nhau, chiếu cùng một tấm ảnh hai lần liên tiếp**. Nên đổi một trong hai.
- `Trang 5/Doi_tuyen_HSGQG_cua_truong.jpg` = `Trang 6/Doi_tuyen_HSGQG_cua_truong.jpg` → tương tự, slide 5 và 6 liền nhau.

**Trùng tên nhưng khác ảnh (dễ nhầm khi ghép file):**
- `Đội hình tình nguyện Tiếp sức mùa thi.jpg` — có ở `Trang 11` (1080×720) và `Trang 15` (2048×1282), là hai ảnh khác nhau.
- `Dâng hương tưởng niệm các Anh hùng Liệt sỹ.jpg` — có ở `Trang 11` (1080×720) và `Trang 40` (1320×732), là hai ảnh khác nhau.

### 1.9. Chất lượng ảnh — 58/122 ảnh dưới 1600px chiều rộng

Ô ảnh chính trên màn trình chiếu rộng khoảng 1200–1600px thật. Ảnh dưới 1600px chiều rộng sẽ **hơi mờ khi phóng to**, ảnh dưới 1000px thì **mờ rõ rệt**.

| Nhóm chiều rộng | Số ảnh | Đánh giá |
|---|---|---|
| Dưới 1000px | 12 | **Mờ rõ — nên thay** |
| 1000–1279px | 8 | Mờ nhẹ nếu làm ảnh chính |
| 1280–1599px | 38 | Chấp nhận được ở ô phụ, hơi mềm ở ô chính |
| 1600–2047px | 8 | Tốt |
| 2048px trở lên | 56 | Tốt |

**12 ảnh mờ nhất (dưới 1000px) — nên tìm bản gốc thay:**

| Thư mục | File | Kích thước | Có phải ảnh chính không |
|---|---|---|---|
| Trang 12+13 | Ủng hộ _Đông ấm vùng cao_.jpg | **720×480** | **CÓ — ảnh chính slide 12** |
| Trang 12+13 | Quyên góp, thăm hỏi nhân dân vùng lũ.jpg | 960×720 | **CÓ — ảnh chính slide 13** |
| Trang 12+13 | Đoàn viên, thanh niên hiến máu tình nguyện.jpg | 960×720 | phụ |
| Trang 20 | Hoạt động _Những cánh thư vượt sóng_(2).jpg | 960×720 | phụ |
| Trang 36+37 | Biểu diễn Kí âm Sol hồng.jpg | 960×640 | phụ |
| Trang 36+37 | Quang cảnh đêm diễn Kí âm Sol hồng.jpg | 960×640 | phụ |
| Trang 36+37 | Văn nghệ tập thể Kí âm Sol hồng.jpg | 960×640 | phụ |
| Trang 38+39 | Phần thi Đấu trường trí tuệ.jpg | 960×641 | phụ |
| Trang 38+39 | Toàn cảnh cuộc thi Đấu trường trí tuệ.jpg | 960×640 | phụ |
| Trang 38+39 | Đường đua Trí tuệ.jpg | 960×640 | phụ |
| Trang 42 | Cuộc thi Điền kinh.jpg | 960×640 | phụ |
| Trang 7 | Hoc_sinh_tham_gia_bau_cu.jpg | 960×640 | phụ |

Đáng lo nhất là **ảnh chính slide 12 chỉ 720×480** — nhỏ hơn cả ảnh thumbnail. Thư mục `Trang 12+13` có ảnh "Quyên góp Quỹ _Đông ấm vùng cao_.jpg" (1280×932) cùng chủ đề, to hơn. **Cần anh/chị quyết** có đổi sang ảnh này không (tôi không tự đổi).

**Ảnh dọc (chiều rộng nhỏ hơn chiều cao) — chỉ 1 ảnh:**
- `Trang 16+17/Hỗ trợ người cao tuổi khám sức khỏe.jpg` (1536×2048). Đặt vào ô 16:9 sẽ **cắt mất phần trên và dưới**. Nên để làm ảnh phụ, hoặc chấp nhận cắt.

**Ảnh nặng trên 2MB — 3 ảnh:**
| File | Dung lượng | Kích thước |
|---|---|---|
| Trang 41/Tổng kết, trao Giấy chứng nhận.jpg | **4,93 MB** | 6584×4940 — quá khổ, nên nén xuống ~2048px |
| Trang 9+10/Xay_dung_tinh_ban_dep.png | 2,56 MB | 1600×1068 — PNG, nên đổi sang JPG |
| Trang 7/Khi_toi_18.png | 2,08 MB | 1469×956 — PNG, nên đổi sang JPG |

Tổng dung lượng ảnh 45,5 MB, video 117 MB. Nặng nhưng vẫn chạy được.

### 1.10. Tên file cần đặt lại — tóm tắt

- **31 file còn tên không dấu** (chủ yếu ở Trang 3–10, 29, 30) → xem danh sách đề xuất đầy đủ ở **Phần 4**.
- **Không có file nào tên vô nghĩa kiểu `IMG_1234` hay `26_3`** — tin tốt, tôi đã rà toàn bộ 126 file.
- **2 tên quá dài** (trên 50 ký tự) cần rút gọn.
- **1 lỗi chính tả trong tên file**: `Trang 21+22/ngày sách và vhoa đọc.jpg` — "vhoa" phải là "văn hóa".
- **1 ký tự thừa**: `Trang 1/Chào mừng Đại lễ Kỷ niệm 80 năm Cách mạng tháng Tám].jpg` — thừa dấu `]`.
- **11 file có hậu tố `(1)`, `(2)`, `(3)`** — không dùng làm chú thích được, cần đặt tên riêng cho từng tấm.
- **5 file dùng gạch dưới thay cho ngoặc kép**: `_Đông ấm vùng cao_`, `_Ước mơ xanh_`, `_Những cánh thư vượt sóng_`, `_Ký âm Sol hồng_`, `CNT_s Day` → nên thay bằng dấu nháy “…”.

---

## PHẦN 2 — SO SÁNH VỚI BỘ 38 SLIDE CŨ

### 2.1. Bản đồ chuyển đổi số slide

Slide 1 đến 35 giữ nguyên số. Từ slide 36 trở đi thì lệch:

| Web cũ | Tài liệu mới | Ghi chú |
|---|---|---|
| 0 (trang chờ) | *(không có)* | **Tài liệu mới không nhắc — cần quyết giữ hay bỏ** |
| 1 → 35 | 1 → 35 | Số trùng khớp hoàn toàn |
| 36 (Ký âm Sol hồng) | **36 + 37** | Tách đôi |
| 37 (CNT Mind Challenges) | **38 + 39** | Tách đôi |
| *(không có)* | **40** — Mô hình Đền ơn đáp nghĩa | Slide mới |
| *(không có)* | **41** — Lớp tiếng Anh tình nguyện hè | Slide mới |
| *(không có)* | **42** — CNT's day | Slide mới |
| *(không có)* | **43** — Xây dựng tình bạn đẹp | Slide mới |
| 38 (trang kết) | **44** — Kết luận | Đổi số |

Tóm lại: **+2 do tách đôi, +4 slide mô hình hoàn toàn mới** → 38 thành 44.

### 2.2. Toàn bộ ảnh sẽ được thay mới

Ảnh trong web hiện tại được **trích tự động từ file PPTX cũ** (tên máy: `s12_img4.jpg`, `s26_img3.jpg`…), chú thích do tự suy đoán nên có chỗ sai rõ ràng — ví dụ slide 16 (Chiến dịch Hoa phượng đỏ) đang dùng ảnh chú thích "Poster dự án The unsaid của CLB Tiếng Anh".

Bộ ảnh mới trong `(CHUẨN) ẢNH BÁO CÁO LÁ CỜ ĐẦU` **do anh/chị chọn thủ công, tên file chính là chú thích**. Nên đây là thay toàn bộ, không phải sửa vá.

### 2.3. Danh sách slide bị đổi ảnh chính (điểm 8 anh/chị nêu)

**Có 24/35 slide đổi ảnh chính.** Bảng dưới đây là những chỗ khác biệt thật sự về nội dung ảnh, không chỉ khác tên file:

| Slide | Ảnh chính CŨ (web) | Ảnh chính MỚI (tài liệu) | Tính chất thay đổi |
|---|---|---|---|
| 1 | Ra mắt nền tảng số quản lý công tác Đoàn | Chào mừng 80 năm Cách mạng tháng Tám | Đổi hẳn chủ đề |
| 2 | Tặng hoa chúc mừng BCH tại Đại hội | Học sinh toàn trường chào cờ đầu tuần | Đổi hẳn |
| 3 | Tặng hoa chúc mừng BCH tại Đại hội | Họp BCH | Đổi |
| 4 | Tặng hoa chúc mừng BCH tại Đại hội | Đại hội Đoàn | Đổi |
| 5 | Ngoại khóa tuyên truyền pháp luật | Đội tuyển HSG quốc gia của trường | Đổi hẳn — hợp với tiêu đề "Thành tích" hơn |
| 7 | Sân khấu cuộc thi tìm hiểu về Đảng | Khi tôi 18 | Đổi |
| 8 | Triển lãm tranh "Độc lập – Tự do – Hạnh phúc" | Hoạt động dâng hương | **Hoán đổi**: ảnh dâng hương đang là ảnh phụ, nay lên ảnh chính |
| 9 | *(ảnh)* Phiên tòa giả định | **Video** Phiên toà giả định | **Ảnh → Video** |
| 11 | Trao quà tại gia đình chính sách | Đội hình tình nguyện Tiếp sức mùa thi | Đổi |
| 12 | Trao quà hỗ trợ học sinh vùng lũ | Ủng hộ "Đông ấm vùng cao" | **Hoán đổi với slide 13** |
| 13 | Hiến máu tình nguyện | Quyên góp, thăm hỏi nhân dân vùng lũ | **Hoán đổi với slide 12** |
| 14 | Vệ sinh môi trường trường lớp | Triển lãm tranh bảo vệ môi trường | Đổi |
| 15 | Đoàn viên chụp ảnh chung trước sân trường | Tình nguyện viên hỗ trợ thí sinh | Đổi — ảnh cũ vốn không liên quan tới nội dung |
| 16 | Poster dự án "The unsaid" | Bữa cơm nghĩa tình | Đổi — **ảnh cũ sai chủ đề rõ rệt** |
| 17 | Hoạt động đền ơn đáp nghĩa | Lớp tiếng Anh tình nguyện hè | Đổi |
| 19 | Đường lên đỉnh Olympia cấp trường | Giải Nhất tuần Đường lên đỉnh Olympia (VTV) | Đổi — cả hai ảnh đều có trong thư mục |
| 21 | Tuyên dương "Học sinh 3 tốt" | Học bổng Sao Khuê | Đổi |
| 22 | Trao quà Tết cho học sinh | Kết nạp Đảng | Đổi hẳn |
| 24 | Chào Tân học sinh "New Orbit" | Chương trình "Phi mã khai xuân" | Đổi |
| 25 | **KHÔNG CÓ ẢNH** (web cũ bỏ trống nửa slide) | Gói bánh chưng | **Vá được lỗ hổng cũ** |
| 26 | Giải thể thao cấp trường | CNT's Open Talk | **Hoán đổi với slide 27** |
| 27 | CNT's Open Talk | Giải bóng đá CNT Cup | **Hoán đổi với slide 26** |
| 29 | Tặng hoa chúc mừng BCH tại Đại hội | Kết nạp đoàn viên | **Hoán đổi**: ảnh kết nạp đang là phụ, nay lên chính |
| 30 | Lễ kết nạp Đảng cho đoàn viên ưu tú | Đoàn viên ưu tú tuyên thệ | **Hoán đổi**: ảnh tuyên thệ đang là phụ, nay lên chính |

**Giữ nguyên ảnh chính (11 slide):** 6, 10, 18, 20, 23, 28, 31, 32, 34, 35 và trang kết. Trong đó 31/32 vốn không dùng ảnh; 34/35 dùng ảnh giao diện, còn đang thiếu file mới.

### 2.4. Thay đổi về chữ

Đối chiếu từng dòng khái quát và từng gạch đầu dòng của 35 slide chung: **nội dung chữ gần như không đổi**. Chỉ có ba khác biệt nhỏ:

1. **Slide 26** — tài liệu mới thêm dấu ba chấm: "120 vận động viên điền kinh**....** tham gia" (web cũ không có).
2. **Ba dòng đề mục cấp trên** ở slide 6, 11, 21 (mục 1.3 ở trên).
3. **Trang chờ số 0** có trong web nhưng không có trong tài liệu.

Ngoài ra không có thay đổi số liệu, không có bullet nào bị thêm hay bớt.

---

## PHẦN 3 — BẢNG CHI TIẾT 44 SLIDE

Ký hiệu: **DKQ** = có dòng khái quát · **GĐD** = số gạch đầu dòng · **CTCT** = có chú thích chân trang
Cột "Ảnh chính có trong thư mục?" — ✅ tìm thấy · ❌ không tìm thấy · — không ghi ảnh chính

| # | Tiêu đề | DKQ | GĐD | Ảnh/Video chính ghi trong tài liệu | Có? | Chú thích chân trang | Thư mục | Số file |
|---|---|---|---|---|---|---|---|---|
| 1 | Trang bìa | — | 0 | Ảnh: Chào mừng Đại lễ Kỷ niệm 80 năm Cách mạng tháng Tám | ✅ | không | Trang 1 | 4 |
| 2 | SƠ LƯỢC ĐẶC ĐIỂM, TÌNH HÌNH ĐOÀN TRƯỜNG *(phân đoạn)* | — | 0 | Ảnh nền: Học sinh toàn trường chào cờ đầu tuần | ✅ | không | Trang 2 | 1 |
| 3 | 1. Tình hình đoàn viên, thanh niên | ✔ | 5 | Ảnh: Họp_BCH | ✅ | Phần A – Mục 1 | Trang 3 | 3 |
| 4 | 2. Thuận lợi, khó khăn | ✔ | 7 *(3 thuận lợi + 4 khó khăn)* | Ảnh: Dai_hoi_doan | ✅ | Phần A – Mục 2 | Trang 4 | 3 |
| 5 | THÀNH TÍCH ĐẠT ĐƯỢC TRONG NĂM HỌC *(phân đoạn)* | — | 0 | Ảnh nền: Doi_tuyen_HSGQG_cua_truong | ✅ | không | Trang 5 | 1 |
| 6 | **[1. Công tác giáo dục — THIẾU]** 1.1 Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh | ✔ | 4 | Ảnh: Sinh_hoat_chi_doan | ✅ | Phần B.I – Mục 1.1 | Trang 6 | 4 |
| 7 | 1.2. Giáo dục chính trị, tư tưởng | ✔ | 5 | Ảnh: Khi_toi_18 *(dòng không in đậm)* | ✅ | Phần B.I – Mục 1.2 | Trang 7 | 4 |
| 8 | 1.3. Giáo dục truyền thống cách mạng, lòng yêu nước | ✔ | 5 | Ảnh: Hoat_dong_dang_huong | ✅ | Phần B.I – Mục 1.3 | Trang 8 | 4 |
| 9 | 1.4. Giáo dục đạo đức, lối sống văn hóa và pháp luật | ✔ | 6 *(chung cho 9+10)* | **Video: Phiên toà giả định** | ✅ | Phần B.I – Mục 1.4 và 1.5 | Trang 9+10 | 7 ảnh + 1 video |
| 10 | 1.4. *(tiếp)* | — | *(chung)* | Ảnh: Huong_dan_ki_nang_lai_xe_an_toan | ✅ | *(như trên)* | Trang 9+10 | *(chung)* |
| 11 | **[2. Tổ chức phong trào hành động cách mạng — THIẾU]** 2.1. Phong trào "Thanh niên tình nguyện" | ✔ | 4 | Ảnh: Đội hình tình nguyện Tiếp sức mùa thi | ✅ | Phần B.I – Mục 2.1 | Trang 11 | 3 |
| 12 | * Hoạt động an sinh xã hội | ✔ | 6 *(chung cho 12+13)* | Ảnh: Ủng hộ "Đông ấm vùng cao" | ✅ ⚠️ 720×480 | Phần B.I – Mục 2.1 (An sinh xã hội) | Trang 12+13 | 6 |
| 13 | * Hoạt động an sinh xã hội *(tiếp)* | — | *(chung)* | Ảnh: Quyên góp, thăm hỏi nhân dân vùng lũ | ✅ ⚠️ 960×720 | *(như trên)* | Trang 12+13 | *(chung)* |
| 14 | * Các hoạt động bảo vệ môi trường | ✔ | 4 | Ảnh: Triển lãm tranh bảo vệ môi trường | ✅ | Phần B.I – Mục 2.1 (Môi trường và Tiếp sức mùa thi) | Trang 14 | 4 |
| 15 | * Chương trình Tiếp sức mùa thi | ✔ | 3 | Ảnh: Tình nguyện viên hỗ trợ thí sinh | ✅ *(3 bản trùng tên)* | Phần B.I – Mục 2.1 (Môi trường và Tiếp sức mùa thi) | Trang 15 | 4 |
| 16 | * Chiến dịch Hoa phượng đỏ | ✔ | 6 *(chung cho 16+17)* | Ảnh: Bữa cơm nghĩa tình | ✅ | Phần B.I – Mục 2.1 (Hoa phượng đỏ 2026) | Trang 16+17 | 8 |
| 17 | * Chiến dịch Hoa phượng đỏ *(tiếp)* | — | *(chung)* | Ảnh: Lớp tiếng Anh tình nguyện hè | ✅ *(2 bản)* | *(như trên)* | Trang 16+17 | *(chung)* |
| 18 | 2.2. Phong trào "Tuổi trẻ sáng tạo" | ✔ | 6 | Ảnh: Giải Nhất cuộc thi Chuyển đổi số, chuyển đổi xanh | ✅ | Phần B.I – Mục 2.2 | Trang 18 | 3 |
| 19 | * Sân chơi học thuật và sáng tạo | ✔ | 6 | Ảnh: Giải Nhất tuần Đường lên đỉnh Olympia | ✅ | Phần B.I – Mục 2.2 (Sân chơi học thuật) | Trang 19 | 3 |
| 20 | 2.3. Phong trào "Tuổi trẻ xung kích bảo vệ Tổ quốc" ⚠️ *ghi "(2 trang)" nhưng chỉ đánh 1 số* | ✔ | 5 | Ảnh: Những cánh thư vượt sóng | ✅ *(4 bản)* | Phần B.I – Mục 2.3 | Trang 20 | 4 |
| 21 | **[3. Tổ chức các chương trình đồng hành với thanh niên — THIẾU]** 3.1. Đồng hành với thanh niên trong học tập | ✔ | 6 *(chung cho 21+22)* | Ảnh: học bổng sao khuê | ✅ | Phần B.I – Mục 3.1 | Trang 21+22 | 6 |
| 22 | 3.1. *(tiếp)* | — | *(chung)* | Ảnh: kết nạp đảng | ✅ | *(như trên)* | Trang 21+22 | *(chung)* |
| 23 | 3.2. Đồng hành với thanh niên khởi nghiệp, lập nghiệp | ✔ | 5 | Ảnh: tư vấn tuyển sinh hướng nghiệp | ✅ *(2 bản)* | Phần B.I – Mục 3.2 | Trang 23 | 4 |
| 24 | 3.3. Đồng hành rèn luyện kỹ năng… → * Đa dạng các loại hình hoạt động văn hóa, nghệ thuật | ✔ | 6 *(chung cho 24+25)* | Ảnh: Chương trình Phi mã khai xuân | ✅ | Phần B.I – Mục 3.3 | Trang 24+25 | 7 |
| 25 | * Đa dạng các loại hình… *(tiếp)* | — | *(chung)* | Ảnh: Gói bánh chưng | ✅ | *(như trên)* | Trang 24+25 | *(chung)* |
| 26 | * Rèn luyện thể chất, hoạt động CLB và chăm sóc tinh thần | ✔ ⚠️*có "…."* | 8 *(4 thể chất + 4 tinh thần, chung cho 26+27)* | Ảnh: CNT's Open Talk | ✅ | Phần B.I – Mục 3.3 | Trang 26+27 | 4 |
| 27 | * Rèn luyện thể chất… *(tiếp)* | — | *(chung)* | Ảnh: Giải bóng đá CNT Cup | ✅ | *(như trên)* | Trang 26+27 | *(chung)* |
| 28 | 4. Hội nhập quốc tế và phát triển ngoại ngữ | ✔ | 6 | Ảnh: Cuộc thi hùng biện tiếng anh Young Voice | ✅ | Phần B.I – Mục 4 | Trang 28 | 3 |
| 29 | 5. Xây dựng tổ chức Đoàn vững mạnh → * Xây dựng tổ chức Đoàn vững mạnh | ✔ | 6 | Ảnh: Ket_nap_doan_vien | ✅ | Phần B.I – Mục 5 | Trang 29 | 4 |
| 30 | * Đoàn tham gia xây dựng Đảng | ✔ | 5 | Ảnh: Doan_vien_uu_tu_tuyen_the | ✅ | Phần B.I – Mục 5 | Trang 30 | 3 |
| 31 | 6. Kết quả thực hiện chỉ tiêu năm học | ✔ | 9 *(6 vượt + 3 đạt, chung cho 31+32)* | *"Dùng infographic, không cần ảnh"* | — | Phần B.I – Mục 6 | Trang 31+32 | **0 (đúng chủ ý)** |
| 32 | 6. *(tiếp)* | — | *(chung)* | *(như trên)* | — | *(như trên)* | Trang 31+32 | *(chung)* |
| 33 | CÁC MÔ HÌNH HAY, CÁCH LÀM SÁNG TẠO *(phân đoạn)* | — | 0 | **KHÔNG GHI** | — | không | Trang 33 | **0 — THIẾU** |
| 34 | Mô hình 1 – Nền tảng số quản lý công tác Đoàn *(có link)* | ✔ | 10 *(6 chức năng + 4 hiệu quả)* | *"Ảnh giao diện trang chủ và 2–3 chức năng"* — không nêu tên file | — | Phần B.I – Mục 7, Mô hình 1 | Trang 34 | **0 — THIẾU** |
| 35 | Mô hình 2 – WebApp "Nền nếp CNT" *(có link)* | ✔ | 8 *(5 nổi bật + 3 hiệu quả)* | *"Ảnh dashboard, biểu đồ, bảng xếp hạng"* — không nêu tên file | — | ⚠️ chân trang ghi "Mô hình **3**" | Trang 35 | **0 — THIẾU** |
| 36 | Mô hình 3 – Concert "Ký âm Sol hồng" | ✔ | 8 *(4 quy mô + 4 giá trị, chung cho 36+37)* | Ảnh: Kí âm Sol Hồng | ✅ | ⚠️ chân trang ghi "Mô hình **4**" | Trang 36+37 | 5 |
| 37 | Mô hình 3 *(tiếp)* — **web hiện chưa tách** | — | *(chung)* | Ảnh: Trao quà Kí âm Sol Hồng | ✅ | *(như trên)* | Trang 36+37 | *(chung)* |
| 38 | Mô hình 4 – CNT Mind Challenges – Đấu trường trí tuệ | ✔ | 9 *(5 điểm mới + 4 hiệu quả, chung cho 38+39)* | **Video: Đấu trường trí tuệ** | ✅ | ⚠️ chân trang ghi "Mô hình **5**" | Trang 38+39 | 3 ảnh + 1 video |
| 39 | Mô hình 4 *(tiếp)* — **web hiện chưa tách** | — | *(chung)* | **KHÔNG GHI ẢNH CHÍNH** | — | *(như trên)* | Trang 38+39 | *(chung)* |
| 40 | 5. Mô hình Đền ơn đáp nghĩa | ✖ | 0 | **Video: Đền ơn đáp nghĩa** | ✅ | không | Trang 40 | 3 ảnh + 1 video |
| 41 | 6. Mô hình Lớp tiếng Anh tình nguyện hè miễn phí | ✖ | 0 | **KHÔNG GHI** | — | không | Trang 41 | 3 |
| 42 | 7. Mô hình CNT's day – Ngày hội Chuyên Nguyễn Trãi | ✖ | 0 | **KHÔNG GHI** | — | không | Trang 42 | 4 |
| 43 | 8. Mô hình Xây dựng tình bạn đẹp, nói không với bạo lực học đường | ✖ | 0 | **Video: Xây dựng tình bạn đẹp** *(dòng không in đậm)* | ✅ | không | Trang 43 | 2 ảnh + 1 video |
| 44 | Kết luận | ✔ | 6 + thông điệp kết thúc | *"Ảnh tập thể tiêu biểu, ảnh cờ Đoàn hoặc ảnh tổng kết"* — không nêu tên file | — | Kết luận Báo cáo | Trang 44 | 5 |

**Tổng kết đối chiếu ảnh:**
- Ảnh chính ghi trong tài liệu và **tìm thấy trong thư mục: 30/30** — không sót tấm nào. Việc khớp tên có dấu ↔ không dấu đều thành công.
- **Không có trường hợp nào** ảnh chính ghi trong tài liệu mà không tìm thấy file.
- **7 slide không ghi ảnh chính**: 33, 34, 35, 39, 41, 42, 44 *(slide 31/32 cố ý không dùng ảnh nên không tính)*.
- **4 thư mục trống**: Trang 31+32 *(đúng chủ ý)*, Trang 33, Trang 34, Trang 35.

---

## PHẦN 4 — ĐỀ XUẤT ĐẶT LẠI TÊN FILE

Tên file sẽ **in trực tiếp lên màn hình** làm chú thích ảnh, nên phải đúng chính tả, viết hoa đúng, không gạch dưới.

**Lưu ý:** những chỗ tôi đánh dấu ❓ là **tôi đoán theo ngữ cảnh slide, chưa chắc đúng nội dung ảnh** — anh/chị mở ảnh xem rồi sửa lại.

### 4.1. File còn tên không dấu (31 file)

| Thư mục | Tên hiện tại | Đề xuất |
|---|---|---|
| Trang 3 | To_chuc_Doan_cua_truong.jpg | Tổ chức Đoàn của trường ❓ |
| Trang 3 | Họp_BCH.jpg | Họp Ban Chấp hành Đoàn trường |
| Trang 4 | Dai_hoi_doan.jpg | Đại hội Đoàn trường |
| Trang 4 | Hoat_dong_trong_dieu_kien_co_so_thuc_te.jpg | Hoạt động trong điều kiện cơ sở vật chất hiện có |
| Trang 4 | Sinh_hoat_doan.jpg | Sinh hoạt Đoàn |
| Trang 5, 6 | Doi_tuyen_HSGQG_cua_truong.jpg | Đội tuyển học sinh giỏi quốc gia |
| Trang 6 | Anh_tap_the_hoc_sinh_toan_truong.jpg | Tập thể học sinh toàn trường |
| Trang 6 | Sinh_hoat_chi_doan.jpg | Sinh hoạt chi đoàn theo chủ điểm |
| Trang 6 | Thay_co.jpg | Chi đoàn giáo viên nhà trường ❓ |
| Trang 7 | Anh_Duong_Soi_Duong.jpg | Chương trình "Ánh dương soi đường" ❓ |
| Trang 7 | Hoc_sinh_tham_gia_bau_cu.jpg | Học sinh tham gia công tác bầu cử |
| Trang 7 | Khat_vong_cong_hien_Le_song_thanh_nien.jpg | Khát vọng cống hiến – Lẽ sống thanh niên *(chú ý: "Lẽ sống", không phải "Lê")* |
| Trang 7 | Khi_toi_18.png | Chương trình "Khi tôi 18" |
| Trang 8 | Duoi_Anh_Sao_Vang.jpg | Cuộc thi "Dưới Ánh Sao Vàng" |
| Trang 8 | Hoat_dong_dang_huong.jpg | Dâng hương tại đài tưởng niệm *(tránh trùng tên với Trang 11 và Trang 40)* |
| Trang 8 | Nhan_chung_lich_su.jpg | Giao lưu nhân chứng lịch sử |
| Trang 8 | Trien_lam_tranh.jpg | Triển lãm tranh "Độc lập – Tự do – Hạnh phúc" |
| Trang 9+10 | Huong_dan_ki_nang_lai_xe_an_toan.jpg | Hướng dẫn kỹ năng lái xe an toàn |
| Trang 9+10 | Moi_ngay_mot_tin_tot_moi_tuan_mot_cau_chuyen_dep.jpg | Mỗi ngày một tin tốt, mỗi tuần một chuyện đẹp |
| Trang 9+10 | Mo_hinh_truong_hoc_khong_ma_tuy.png | Ra mắt mô hình "Trường học không ma túy" |
| Trang 9+10 | Phien_toa_gia_dinh.jpg | Phiên tòa giả định *(tên cũ dễ đọc nhầm thành "gia đình")* |
| Trang 9+10 | Phong_chay_chua_chay.jpg | Ngoại khóa phòng cháy chữa cháy |
| Trang 9+10 | Phong_chong_mua_ban_nguoi.jpg | Tuyên truyền phòng, chống mua bán người |
| Trang 9+10 | Xay_dung_tinh_ban_dep.png | Diễn đàn "Xây dựng tình bạn đẹp" |
| Trang 29 | Doan_vien_bo_phieu.jpg | Đoàn viên bỏ phiếu |
| Trang 29 | Hoi_nghi_tap_huan_nang_cao_nang_luc_so.jpg | Hội nghị tập huấn nâng cao năng lực số |
| Trang 29 | Ket_nap_doan_vien.jpg | Lễ kết nạp đoàn viên mới |
| Trang 30 | 12_quan_chung_uu_tu_ket_nap_dot_1.jpg | 12 quần chúng ưu tú kết nạp Đảng đợt 1 |
| Trang 30 | 16_quan_chung_uu_tu_duoc_ket_nap_vao_dang.jpg | 16 quần chúng ưu tú được kết nạp Đảng |
| Trang 30 | Doan_vien_uu_tu_tuyen_the.jpg | Đoàn viên ưu tú tuyên thệ |

*(`Trang 26+27/CNT's Open Talk.jpg` cũng không có dấu tiếng Việt nhưng là tên chương trình tiếng Anh — giữ nguyên.)*

### 4.2. File có dấu nhưng chưa chuẩn để in lên màn hình

| Thư mục | Tên hiện tại | Vấn đề | Đề xuất |
|---|---|---|---|
| Trang 1 | Chào mừng Đại lễ Kỷ niệm 80 năm Cách mạng tháng Tám].jpg | Thừa `]`, 52 ký tự | Chào mừng 80 năm Cách mạng tháng Tám |
| Trang 1 | Đồng diễn CNT_s Day 2023.jpg | Gạch dưới thay dấu nháy; ảnh năm **2023**, không thuộc năm học 2025–2026 ⚠️ | Đồng diễn CNT's Day |
| Trang 1 | Chương trình _Ký âm Sol hồng_.jpg | Gạch dưới thay ngoặc kép | Chương trình "Ký âm Sol hồng" |
| Trang 12+13 | Ủng hộ _Đông ấm vùng cao_.jpg | Gạch dưới | Ủng hộ "Đông ấm vùng cao" |
| Trang 12+13 | Quyên góp Quỹ _Đông ấm vùng cao_.jpg | Gạch dưới | Quyên góp Quỹ "Đông ấm vùng cao" |
| Trang 14 | Chuỗi sự kiện _Ước mơ xanh_.jpg | Gạch dưới | Chuỗi sự kiện "Ước mơ xanh" |
| Trang 20 | Hoạt động _Những cánh thư vượt sóng_.jpg *(và bản (1)(2)(3))* | Gạch dưới | Công trình "Những cánh thư vượt sóng" |
| Trang 21+22 | hs 3 tốt.jpg | Viết tắt, chữ thường | Tuyên dương "Học sinh 3 tốt" |
| Trang 21+22 | học bổng sao khuê.jpg | Chữ thường, tên riêng | Trao Học bổng Sao Khuê |
| Trang 21+22 | học bổng.jpg | Chữ thường, quá chung | Trao học bổng cho học sinh |
| Trang 21+22 | kết nạp đảng.jpg | Chữ thường | Lễ kết nạp Đảng |
| Trang 21+22 | ngày sách và vhoa đọc.jpg | **Sai chính tả "vhoa"** | Ngày Sách và Văn hóa đọc |
| Trang 21+22 | quà tặng dịp tết.jpg | Chữ thường | Trao quà Tết cho học sinh |
| Trang 23 | giao lưu đại học qte.jpg | Viết tắt "qte" | Giao lưu với đại học quốc tế |
| Trang 23 | tư vấn tuyển sinh hướng nghiệp.jpg *(và bản (1))* | Chữ thường | Ngày hội Tư vấn tuyển sinh – Hướng nghiệp |
| Trang 23 | Tư vấn hướng nghiệp.jpg | Trùng ý với file trên | Chuyên đề tư vấn hướng nghiệp |
| Trang 24+25 | hội chợ tết.jpg | Chữ thường | Hội chợ Tết |
| Trang 24+25 | khúc ca tri ân.jpg | Chữ thường | Hội diễn "Khúc ca tri ân" |
| Trang 26+27 | sinh hoạt clb.jpg | Chữ thường, viết tắt | Sinh hoạt câu lạc bộ |
| Trang 28 | Cuộc thi hùng biện tiếng anh Young Voice.jpg | "anh" phải hoa; tài liệu ghi "Young **Voices**" | Cuộc thi hùng biện tiếng Anh Young Voices |
| Trang 28 | Sinh hoạt CLB tiếng anh (1).jpg, (2).jpg | "anh" phải hoa; hậu tố (1)(2) | Sinh hoạt CLB Tiếng Anh — cần 2 tên riêng |
| Trang 36+37 | Kí âm sol Hồng.jpg | Không nhất quán với tài liệu ("Ký âm Sol hồng") | Chương trình "Ký âm Sol hồng" |
| Trang 36+37 | Biểu diễn / Quang cảnh đêm diễn / Văn nghệ tập thể / Trao quà **Kí âm** Sol hồng | Cả 5 file dùng "Kí" thay vì "Ký"; chữ "Hồng"/"hồng" lúc hoa lúc thường | Thống nhất **"Ký âm Sol hồng"** |
| Trang 40 | Trò chuyện cùng CCB.jpg | Viết tắt | Trò chuyện cùng cựu chiến binh |
| Trang 40 | Trao tặng quà cho Cựu TNXP.jpg | Viết tắt | Trao quà cho cựu thanh niên xung phong |
| Trang 43 | Ngoại khoá Xây dựng tình bạn đẹp.jpg | "khoá" — nên thống nhất "khóa" | Ngoại khóa "Xây dựng tình bạn đẹp" |
| Trang 43 | Phiên toà giả định Phòng, chống Bạo lực học đường.jpg | "toà" → "tòa" | Phiên tòa giả định phòng, chống bạo lực học đường |
| Trang 9+10 | Phiên toà giả định.mp4 | "toà" → "tòa" | Phiên tòa giả định |
| Trang 44 | khen thưởng của Đoàn phường Lê Thanh Nghị.jpg | Chữ thường đầu câu | Khen thưởng của Đoàn phường Lê Thanh Nghị |
| Trang 44 | được vinh danh tại Hội nghị điển hình tiên tiến MTTQ VN và các tổ chức CT-XH Thành phố.jpg | **86 ký tự — quá dài**, viết tắt | Vinh danh tại Hội nghị điển hình tiên tiến Thành phố |

### 4.3. File có hậu tố (1) (2) (3) — cần đặt tên riêng cho từng tấm (11 file)

Những tấm này khác nhau về nội dung nhưng dùng chung một tên, nên khi in chú thích lên màn hình sẽ trùng nhau:

- `Trang 14` — Ra quân Chủ nhật Xanh.jpg + Ra quân Chủ nhật Xanh(1).jpg
- `Trang 15` — Tình nguyện viên hỗ trợ thí sinh.jpg + (1) + (2) *(3 tấm)*
- `Trang 16+17` — Lớp tiếng Anh tình nguyện hè.jpg + (1); Thăm hỏi Cựu chiến binh.jpg + (1)
- `Trang 20` — Hoạt động "Những cánh thư vượt sóng".jpg + (1) + (2) + (3) *(4 tấm)*
- `Trang 23` — tư vấn tuyển sinh hướng nghiệp.jpg + (1)
- `Trang 28` — Sinh hoạt CLB tiếng anh (1) + (2)

**Cần anh/chị mở từng tấm và đặt tên mô tả riêng** (ví dụ: "Tình nguyện viên hướng dẫn thí sinh vào phòng thi", "Tình nguyện viên phát nước cho thí sinh"…). Tôi không xem được nội dung ảnh nên không đề xuất được.

### 4.4. Tên vô nghĩa kiểu IMG_1234

**Không có file nào.** Đã rà toàn bộ 126 file — không tấm nào mang tên máy ảnh hoặc tên số vô nghĩa. Hai file bắt đầu bằng số ở `Trang 30` (`12_quan_chung...`, `16_quan_chung...`) thực chất là chú thích có nghĩa, chỉ cần thêm dấu.

---

## PHẦN 5 — DANH SÁCH VIỆC CẦN ANH/CHỊ QUYẾT

| # | Việc | Mức độ |
|---|---|---|
| 1 | Bổ sung ảnh chụp màn hình cho slide 34 (Nền tảng số) và slide 35 (WebApp Nền nếp CNT), hoặc đồng ý dùng lại ảnh cũ | **Chặn tiến độ** |
| 2 | Chọn ảnh nền cho slide 33 (trang phân đoạn "Các mô hình hay") | **Chặn tiến độ** |
| 3 | Chọn ảnh chính cho slide 39 và slide 44 | **Chặn tiến độ** |
| 4 | Xác nhận cách tách slide 36/37 và 38/39 theo đề xuất ở mục 1.4 | **Chặn tiến độ** |
| 5 | Xác nhận 4 video đã sẵn sàng dùng (không cần mốc thời gian vì đều dưới 40 giây) | Cao |
| 6 | Quyết giữ hay bỏ trang chờ số 0 ("CHƯƠNG TRÌNH KIỂM TRA") | Cao |
| 7 | Sửa lệch đánh số mô hình trong Word (tiêu đề vs chân trang, từ slide 35 trở đi) | Cao |
| 8 | Quyết slide 20 có tách 2 trang hay không *(nếu tách thì không còn là 44 slide)* | Cao |
| 9 | Quyết cách hiển thị 3 dòng đề mục cấp trên ở slide 6, 11, 21 | Cao |
| 10 | Đổi tên 31 file không dấu + 30 file tên chưa chuẩn theo bảng Phần 4 | Trung bình |
| 11 | Đặt tên riêng cho 11 file có hậu tố (1)(2)(3) | Trung bình |
| 12 | Đổi ảnh trùng: slide 2 vs 3 (chào cờ), slide 5 vs 6 (đội tuyển HSGQG) | Trung bình |
| 13 | Thay ảnh chính slide 12 (720×480 quá mờ) — có thể dùng "Quyên góp Quỹ Đông ấm vùng cao" 1280×932 thay | Trung bình |
| 14 | Tìm bản gốc cho 12 ảnh dưới 1000px | Thấp |
| 15 | Nén ảnh `Trang 41/Tổng kết, trao Giấy chứng nhận.jpg` (6584×4940, 4,93 MB) | Thấp |
| 16 | Sửa lỗi gõ "LÁ CỜ ĐÀU" → "LÁ CỜ ĐẦU" trên trang bìa | Thấp |
| 17 | Bổ sung nội dung cho slide 40–43 *(anh/chị đã nói tạm hoãn)* | Hoãn |

---

## PHỤ LỤC — Những chỗ tôi phải phán đoán

Ghi rõ để anh/chị kiểm lại, không tự quyết im lặng:

1. **Cách tách slide 36/37 và 38/39** — tài liệu chỉ ghi hai ảnh chính riêng, không nói cắt chữ ở đâu. Tôi suy theo hai nhóm sẵn có trong tài liệu ("Quy mô"/"Giá trị mô hình", "Điểm mới"/"Hiệu quả") và theo quy ước 2 trang đã dùng cho slide 26/27 trong web.
2. **Video slide 38 hay 39** — tài liệu ghi "Video chính: Đấu trường trí tuệ" cho cả khối 38+39, không nói đặt ở trang nào. Tôi giả định đặt ở trang đầu (slide 38), như cách slide 9+10 ghi rõ "Video chính slide 9".
3. **Tên tiếng Việt đề xuất có dấu ❓** — tôi suy từ ngữ cảnh slide chứ không xem được nội dung ảnh. Cụ thể: `To_chuc_Doan_cua_truong`, `Thay_co`, `Anh_Duong_Soi_Duong`.
4. **Khớp tên "Kí âm Sol Hồng" ↔ file "Kí âm sol Hồng.jpg"** — khác nhau ở chữ hoa/thường, tôi coi là một.
5. **Khớp "Video chính: Đền ơn đáp nghĩa" ↔ file "Hoạt động đền ơn đáp nghĩa.mp4"** — tên file dài hơn tài liệu một chữ, tôi coi là một.
6. **Khớp "Những cánh thư vượt sóng" ↔ file "Hoạt động _Những cánh thư vượt sóng_.jpg"** — có 4 bản (bản gốc + 3 bản đánh số), tôi coi bản không có hậu tố là ảnh chính.
7. **Ảnh chính slide 15 "Tình nguyện viên hỗ trợ thí sinh"** — có 3 tấm cùng tên, tôi coi bản không có hậu tố là ảnh chính.
8. **Số gạch đầu dòng cho các mục 2 trang** — tài liệu để chung một danh sách, tôi đếm tổng cho cả cụm chứ không chia sẵn cho từng trang.
