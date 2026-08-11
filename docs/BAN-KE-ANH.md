# Bản kê ảnh — dùng để thay ảnh chốt

Ảnh hiện tại là **ảnh tạm** rút từ file PPTX. Để thay bằng ảnh chốt:

1. Đặt file mới vào `public/media/slides/` với **đúng tên file** trong bảng dưới, hoặc
2. Đổi trường `src` của ảnh tương ứng trong `lib/slides/data.ts`.

Sau khi thay, chạy lại `node scripts/audit-images.mjs` để đo lại, rồi `npm run test`
để chắc chắn không có ảnh màn hình nào lọt vào vai trò ảnh nền.

File này do `scripts/build-image-manifest.mjs` sinh tự động từ `lib/slides/data.ts` —
đừng sửa tay ở đây, sửa dữ liệu nguồn rồi chạy lại script để sinh lại.

## Ba việc cần ưu tiên khi gửi ảnh mới

### 1. Slide chưa có ảnh nào (ưu tiên cao nhất)

Slide 25 đang để trống `images` — bộ ảnh trích từ PPTX gốc không có file `s25_*` nào tương ứng, nên panel ảnh của trang này trống trơn.

### 2. Bốn chú thích đang ghi sai nội dung ảnh thật

| Slide | File | Chú thích đang dùng | Ảnh thật vẽ gì |
|---|---|---|---|
| 9 | `s9_img3.jpg` | "Phiên tòa giả định" về phòng, chống bạo lực học đường | Băng rôn "CHƯƠNG TRÌNH NGOẠI KHÓA – XÂY DỰNG TÌNH BẠN ĐẸP, NÓI KHÔNG VỚI BẠO LỰC HỌC ĐƯỜNG" |
| 20 | `s20_img5.jpg` | Giao lưu với lực lượng vũ trang | Tranh đồ họa "Cách mạng màu" |
| 24 | `s24_img6.jpg` | Gói bánh chưng "Gói trọn vị nhà" | Poster "MỞ ĐƠN ĐĂNG KÝ CÂU LẠC BỘ – ĐỢT I (2026-2027)" |
| 36 | `s36_img4.jpg`, `s36_img5.jpg`, `s36_img6.jpg` | Khán giả tại concert / Trao biển hỗ trợ trên sân khấu / Tiết mục biểu diễn trên sân khấu concert | Lần lượt là poster gây quỹ, ảnh trao quà trong nhà dân, ảnh trao quà trong nhà dân |

Khi gửi ảnh mới cho các slide 9, 20, 24, 36, kiểm tra lại luôn cả phần chữ chú
thích đi kèm trong `lib/slides/data.ts` — đổi ảnh mà giữ nguyên chú thích cũ
(hoặc ngược lại, đổi chú thích mà giữ ảnh cũ) vẫn tiếp tục sai.

### 3. Nhiều ô ảnh đang dùng lại đúng một tấm ảnh

Trong 107 ô ảnh của 38 slide, chỉ có 82 tấm ảnh mang nội dung
file thật sự khác nhau (so khớp bằng băm md5, không theo tên file) — nghĩa là
25 ô ảnh đang dùng lại một tấm đã xuất hiện ở slide khác. Dùng chung nhiều nhất hiện nay là slide 3, 4, 29, cùng lấy đúng 3 tấm ảnh giống hệt nhau.
Nếu chỉ gửi được một phần ảnh mới trước, nên ưu tiên các slide đang dùng ảnh
riêng (không có cờ "Dùng chung..." trong bảng dưới), để không nhân bản cùng một
lỗi ra nhiều trang.

---

## Bảng đầy đủ 107 ô ảnh

Cột "Ghi chú" đánh dấu ảnh màn hình phần mềm (đo bằng `scripts/audit-images.mjs`,
không nên dùng cho vai trò ảnh nền `nen`) và ảnh đang dùng chung với slide khác.
Slide 25 không có dòng nào ở đây vì không có ảnh nào cả — xem mục 1 ở trên.

| Slide | Tiêu đề slide | File ảnh | Vai trò | Chú thích hiện tại | Ghi chú |
|---|---|---|---|---|---|
| 1 | báo cáo kết quả đơn vị đăng ký lá cờ đầu | `s1_img4.jpg` | `nen` | Ra mắt công trình thanh niên Nền tảng số quản lý công tác Đoàn | Dùng chung với slide 34 |
| 1 | báo cáo kết quả đơn vị đăng ký lá cờ đầu | `s1_img3.jpg` | `phu` | Công trình thanh niên Những cánh thư vượt sóng | — |
| 1 | báo cáo kết quả đơn vị đăng ký lá cờ đầu | `s1_img5.jpg` | `phu` | Trao tặng công trình thanh niên "Tủ sách cho em" | Dùng chung với slide 33 |
| 1 | báo cáo kết quả đơn vị đăng ký lá cờ đầu | `s1_img6.png` | `phu` | Giao diện WebApp "Nền nếp CNT" | ẢNH MÀN HÌNH — không dùng cho vai trò `nen`; Dùng chung với slide 35 |
| 2 | sơ lược đặc điểm, tình hình đoàn trường thpt chuyên nguyễn trãi | `s2_img3.jpg` | `nen` | Tặng hoa chúc mừng BCH Đoàn trường tại Đại hội đại biểu nhiệm kỳ 2025 – 2026 | Dùng chung với slide 3, 4, 29 |
| 3 | 1. tình hình đoàn viên, thanh niên | `s3_img3.jpg` | `chinh` | Tặng hoa chúc mừng BCH Đoàn trường tại Đại hội đại biểu nhiệm kỳ 2025 – 2026 | Dùng chung với slide 2, 4, 29 |
| 3 | 1. tình hình đoàn viên, thanh niên | `s3_img4.jpg` | `phu` | Hội nghị tập huấn nghiệp vụ công tác Đoàn cho cán bộ chi đoàn | Dùng chung với slide 4, 29 |
| 3 | 1. tình hình đoàn viên, thanh niên | `s3_img5.jpg` | `phu` | Tập huấn nâng cao nghiệp vụ công tác Đoàn năm học 2025 – 2026 | Dùng chung với slide 4, 29 |
| 4 | 2. thuận lợi, khó khăn | `s4_img3.jpg` | `chinh` | Tặng hoa chúc mừng BCH Đoàn trường tại Đại hội đại biểu nhiệm kỳ 2025 – 2026 | Dùng chung với slide 2, 3, 29 |
| 4 | 2. thuận lợi, khó khăn | `s4_img4.jpg` | `phu` | Hội nghị tập huấn nghiệp vụ công tác Đoàn cho cán bộ chi đoàn | Dùng chung với slide 3, 29 |
| 4 | 2. thuận lợi, khó khăn | `s4_img5.jpg` | `phu` | Tập huấn nâng cao nghiệp vụ công tác Đoàn năm học 2025 – 2026 | Dùng chung với slide 3, 29 |
| 5 | thành tích đạt được trong năm học 2025 – 2026 | `s5_img4.jpg` | `nen` | Ngoại khóa tuyên truyền pháp luật cho đoàn viên, thanh niên toàn trường | — |
| 6 | 1.1. học tập và làm theo tư tưởng, đạo đức, phong cách hồ chí minh | `s6_img3.jpg` | `chinh` | Sinh hoạt chi đoàn theo chủ điểm | — |
| 6 | 1.1. học tập và làm theo tư tưởng, đạo đức, phong cách hồ chí minh | `s6_img4.jpg` | `phu` | Đoàn viên dự buổi học tập, quán triệt nghị quyết | Dùng chung với slide 7 |
| 6 | 1.1. học tập và làm theo tư tưởng, đạo đức, phong cách hồ chí minh | `s6_img5.jpg` | `phu` | Giới thiệu sách về Chủ tịch Hồ Chí Minh | — |
| 7 | 1.2. giáo dục chính trị, tư tưởng | `s7_img3.jpg` | `chinh` | Sân khấu cuộc thi tìm hiểu về Đảng | — |
| 7 | 1.2. giáo dục chính trị, tư tưởng | `s7_img4.jpg` | `phu` | Đoàn viên dự buổi học tập, quán triệt nghị quyết | Dùng chung với slide 6 |
| 8 | 1.3. giáo dục truyền thống cách mạng, lòng yêu nước | `s8_img3.jpg` | `chinh` | Triển lãm tranh chủ đề "Độc lập – Tự do – Hạnh phúc" | — |
| 8 | 1.3. giáo dục truyền thống cách mạng, lòng yêu nước | `s8_img4.jpg` | `phu` | Giao lưu nhân chứng lịch sử | — |
| 8 | 1.3. giáo dục truyền thống cách mạng, lòng yêu nước | `s8_img5.jpg` | `phu` | Hoạt động dâng hương tại đài tưởng niệm | — |
| 9 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `s9_img3.jpg` | `chinh` | "Phiên tòa giả định" về phòng, chống bạo lực học đường | — |
| 9 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `s9_img4.jpg` | `phu` | Ngoại khóa hướng dẫn kỹ năng lái xe gắn máy an toàn | Dùng chung với slide 10 |
| 9 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `s9_img5.jpg` | `phu` | Thực hành phòng cháy, chữa cháy và cứu nạn cứu hộ | Dùng chung với slide 10 |
| 10 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `s10_img3.jpg` | `chinh` | Ngoại khóa hướng dẫn kỹ năng lái xe gắn máy an toàn | Dùng chung với slide 9 |
| 10 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `s10_img4.jpg` | `phu` | Lễ ra mắt mô hình "Trường học không ma túy" | — |
| 10 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `s10_img5.jpg` | `phu` | Thực hành phòng cháy, chữa cháy và cứu nạn cứu hộ | Dùng chung với slide 9 |
| 10 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `s10_img6.jpg` | `phu` | Đội tuyên truyền phòng, chống mua bán người | — |
| 11 | 2.1. phong trào "thanh niên tình nguyện" | `s11_img3.jpg` | `chinh` | Đoàn viên thanh niên trao quà tại gia đình chính sách | Dùng chung với slide 13, 16, 17 |
| 11 | 2.1. phong trào "thanh niên tình nguyện" | `s11_img4.jpg` | `phu` | Tình nguyện viên hỗ trợ người cao tuổi làm thủ tục | Dùng chung với slide 13, 17 |
| 11 | 2.1. phong trào "thanh niên tình nguyện" | `s11_img5.jpg` | `phu` | Hướng dẫn người dân sử dụng điện thoại thông minh | Dùng chung với slide 16 |
| 11 | 2.1. phong trào "thanh niên tình nguyện" | `s11_img6.jpg` | `phu` | Đoàn viên thanh niên chụp ảnh chung trước sân trường | Dùng chung với slide 15 |
| 12 | hoạt động an sinh xã hội | `s12_img3.jpg` | `chinh` | Trao quà hỗ trợ học sinh vùng lũ | — |
| 12 | hoạt động an sinh xã hội | `s12_img4.jpg` | `phu` | Trao tặng hiện vật trị giá 25 triệu đồng cho Trung tâm Bảo trợ xã hội Hải Phòng | Dùng chung với slide 13 |
| 12 | hoạt động an sinh xã hội | `s12_img5.jpg` | `phu` | Trao "Đông ấm vùng cao" cho phường | — |
| 13 | hoạt động an sinh xã hội | `s13_img3.jpg` | `chinh` | Hiến máu tình nguyện | — |
| 13 | hoạt động an sinh xã hội | `s13_img4.jpg` | `phu` | Đoàn viên thanh niên trao quà tại gia đình chính sách | Dùng chung với slide 11, 16, 17 |
| 13 | hoạt động an sinh xã hội | `s13_img5.jpg` | `phu` | Tình nguyện viên hỗ trợ người cao tuổi làm thủ tục | Dùng chung với slide 11, 17 |
| 13 | hoạt động an sinh xã hội | `s13_img6.jpg` | `phu` | Trao tặng hiện vật trị giá 25 triệu đồng cho Trung tâm Bảo trợ xã hội Hải Phòng | Dùng chung với slide 12 |
| 14 | các hoạt động bảo vệ môi trường | `s14_img3.jpg` | `chinh` | Vệ sinh môi trường trường lớp, cảnh quan | — |
| 14 | các hoạt động bảo vệ môi trường | `s14_img4.jpg` | `phu` | Triển lãm ảnh môi trường | — |
| 14 | các hoạt động bảo vệ môi trường | `s14_img5.jpg` | `phu` | Vệ sinh môi trường trong Ngày Chủ nhật xanh | — |
| 14 | các hoạt động bảo vệ môi trường | `s14_img6.jpg` | `phu` | Triển lãm ảnh môi trường của học sinh | — |
| 15 | chương trình tiếp sức mùa thi | `s15_img3.jpg` | `chinh` | Đoàn viên thanh niên chụp ảnh chung trước sân trường | Dùng chung với slide 11 |
| 15 | chương trình tiếp sức mùa thi | `s15_img4.jpg` | `phu` | Chương trình hỗ trợ kỳ thi tuyển sinh lớp 10 | — |
| 15 | chương trình tiếp sức mùa thi | `s15_img5.jpg` | `phu` | Chương trình hỗ trợ Kỳ thi tốt nghiệp THPT | — |
| 16 | chiến dịch hoa phượng đỏ | `s16_img3.jpg` | `chinh` | Poster dự án "The unsaid" của CLB Tiếng Anh Nguyễn Trãi | Dùng chung với slide 28 |
| 16 | chiến dịch hoa phượng đỏ | `s16_img4.jpg` | `phu` | Đoàn viên thanh niên trao quà tại gia đình chính sách | Dùng chung với slide 11, 13, 17 |
| 16 | chiến dịch hoa phượng đỏ | `s16_img5.jpg` | `phu` | Hướng dẫn người dân sử dụng điện thoại thông minh | Dùng chung với slide 11 |
| 17 | chiến dịch hoa phượng đỏ | `s17_img3.jpg` | `chinh` | Hoạt động đền ơn đáp nghĩa | — |
| 17 | chiến dịch hoa phượng đỏ | `s17_img4.jpg` | `phu` | Tình nguyện viên hỗ trợ người cao tuổi làm thủ tục | Dùng chung với slide 11, 13 |
| 17 | chiến dịch hoa phượng đỏ | `s17_img5.jpg` | `phu` | Đoàn viên thanh niên trao quà tại gia đình chính sách | Dùng chung với slide 11, 13, 16 |
| 18 | 2.2. phong trào "tuổi trẻ sáng tạo" | `s18_img3.jpg` | `chinh` | Trao giải chung kết cuộc thi Thanh niên Hải Phòng với chuyển đổi số, chuyển đổi xanh | Dùng chung với slide 19 |
| 18 | 2.2. phong trào "tuổi trẻ sáng tạo" | `s18_img4.jpg` | `phu` | Sản phẩm Hội thi Tin học trẻ | — |
| 18 | 2.2. phong trào "tuổi trẻ sáng tạo" | `s18_img5.jpg` | `phu` | Lớp Robotics của nhà trường | — |
| 18 | 2.2. phong trào "tuổi trẻ sáng tạo" | `s18_img6.jpg` | `phu` | Học sinh nhận giấy chứng nhận cuộc thi khoa học, công nghệ | Dùng chung với slide 19 |
| 19 | sân chơi học thuật và sáng tạo | `s19_img3.jpg` | `chinh` | Đường lên đỉnh Olympia cấp trường | — |
| 19 | sân chơi học thuật và sáng tạo | `s19_img4.jpg` | `phu` | Hội nghị mô phỏng Liên Hợp Quốc HDMUN | — |
| 19 | sân chơi học thuật và sáng tạo | `s19_img5.jpg` | `phu` | Học sinh nhận giấy chứng nhận cuộc thi khoa học, công nghệ | Dùng chung với slide 18 |
| 19 | sân chơi học thuật và sáng tạo | `s19_img6.jpg` | `phu` | Trao giải chung kết cuộc thi Thanh niên Hải Phòng với chuyển đổi số, chuyển đổi xanh | Dùng chung với slide 18 |
| 20 | 2.3. phong trào "tuổi trẻ xung kích bảo vệ tổ quốc" | `s20_img3.jpg` | `chinh` | Thư, thiệp của đoàn viên gửi tới các đảo | — |
| 20 | 2.3. phong trào "tuổi trẻ xung kích bảo vệ tổ quốc" | `s20_img4.jpg` | `phu` | Cây đào gửi ra đảo và nhà giàn DK1 | — |
| 20 | 2.3. phong trào "tuổi trẻ xung kích bảo vệ tổ quốc" | `s20_img5.jpg` | `phu` | Giao lưu với lực lượng vũ trang | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 21 | 3.1. đồng hành với thanh niên trong học tập | `s21_img3.jpg` | `chinh` | Tuyên dương "Học sinh 3 tốt" cấp trường | — |
| 21 | 3.1. đồng hành với thanh niên trong học tập | `s21_img4.jpg` | `phu` | Trao học bổng cho học sinh | — |
| 21 | 3.1. đồng hành với thanh niên trong học tập | `s21_img5.jpg` | `phu` | Lễ kết nạp Đảng cho đoàn viên ưu tú | — |
| 22 | 3.1. đồng hành với thanh niên trong học tập | `s22_img3.jpg` | `chinh` | Trao quà tặng dịp Tết cho học sinh | — |
| 23 | 3.2. đồng hành với thanh niên khởi nghiệp, lập nghiệp | `s23_img3.jpg` | `chinh` | Ngày hội Tư vấn tuyển sinh – Hướng nghiệp | — |
| 23 | 3.2. đồng hành với thanh niên khởi nghiệp, lập nghiệp | `s23_img4.jpg` | `phu` | Giao lưu với trường đại học quốc tế | — |
| 23 | 3.2. đồng hành với thanh niên khởi nghiệp, lập nghiệp | `s23_img5.jpg` | `phu` | Thuyết trình tại cuộc thi Business Case | — |
| 23 | 3.2. đồng hành với thanh niên khởi nghiệp, lập nghiệp | `s23_img6.jpg` | `phu` | Chương trình tư vấn hướng nghiệp cho học sinh | — |
| 24 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `s24_img3.jpg` | `chinh` | Chương trình chào Tân học sinh "New Orbit" | — |
| 24 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `s24_img4.jpg` | `phu` | Tiết mục nghệ thuật Chèo trong "Mạch nguồn di sản" | — |
| 24 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `s24_img5.jpg` | `phu` | Hội trại truyền thống của học sinh | — |
| 24 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `s24_img6.jpg` | `phu` | Gói bánh chưng "Gói trọn vị nhà" | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 26 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `s26_img3.jpg` | `chinh` | Giải thể thao cấp trường | — |
| 26 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `s26_img4.jpg` | `phu` | Giải kéo co trong ngày hội thể thao | — |
| 26 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `s26_img5.jpg` | `phu` | Chương trình đối thoại "CNT's Open Talk" | Dùng chung với slide 27 |
| 27 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `s27_img3.jpg` | `chinh` | Chương trình đối thoại "CNT's Open Talk" | Dùng chung với slide 26 |
| 27 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `s27_img4.jpg` | `phu` | Chương trình đối thoại học sinh – nhà trường | — |
| 28 | 4. hội nhập quốc tế và phát triển ngoại ngữ | `s28_img3.jpg` | `chinh` | Học sinh thi hùng biện tiếng Anh | — |
| 28 | 4. hội nhập quốc tế và phát triển ngoại ngữ | `s28_img4.jpg` | `phu` | Workshop ngôn ngữ của câu lạc bộ | — |
| 28 | 4. hội nhập quốc tế và phát triển ngoại ngữ | `s28_img5.jpg` | `phu` | Poster dự án "The unsaid" của CLB Tiếng Anh Nguyễn Trãi | Dùng chung với slide 16 |
| 28 | 4. hội nhập quốc tế và phát triển ngoại ngữ | `s28_img6.jpg` | `phu` | Đại biểu mô phỏng hội nghị quốc tế | — |
| 29 | 5. xây dựng tổ chức đoàn vững mạnh | `s29_img3.jpg` | `chinh` | Tặng hoa chúc mừng BCH Đoàn trường tại Đại hội đại biểu nhiệm kỳ 2025 – 2026 | Dùng chung với slide 2, 3, 4 |
| 29 | 5. xây dựng tổ chức đoàn vững mạnh | `s29_img4.jpg` | `phu` | Hội nghị tập huấn nghiệp vụ công tác Đoàn cho cán bộ chi đoàn | Dùng chung với slide 3, 4 |
| 29 | 5. xây dựng tổ chức đoàn vững mạnh | `s29_img5.jpg` | `phu` | Lễ kết nạp đoàn viên mới | — |
| 29 | 5. xây dựng tổ chức đoàn vững mạnh | `s29_img6.jpg` | `phu` | Tập huấn nâng cao nghiệp vụ công tác Đoàn năm học 2025 – 2026 | Dùng chung với slide 3, 4 |
| 30 | đoàn tham gia xây dựng đảng | `s30_img3.jpg` | `chinh` | Lễ kết nạp Đảng cho đoàn viên ưu tú | — |
| 30 | đoàn tham gia xây dựng đảng | `s30_img4.jpg` | `phu` | Đoàn viên ưu tú tuyên thệ | — |
| 30 | đoàn tham gia xây dựng đảng | `s30_img5.jpg` | `phu` | Họp Ban Chấp hành giới thiệu nguồn kết nạp | — |
| 33 | các mô hình hay, cách làm sáng tạo | `s33_img5.jpg` | `nen` | Trao tặng công trình thanh niên "Tủ sách cho em" | Dùng chung với slide 1 |
| 34 | mô hình 1 – nền tảng số quản lý công tác đoàn | `s34_img3.jpg` | `chinh` | Ra mắt công trình thanh niên Nền tảng số quản lý công tác Đoàn | Dùng chung với slide 1 |
| 34 | mô hình 1 – nền tảng số quản lý công tác đoàn | `s34_img4.png` | `phu` | Giao diện quản lý đoàn viên | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 34 | mô hình 1 – nền tảng số quản lý công tác đoàn | `s34_img5.png` | `phu` | Giao diện trang chủ quản lý công tác Đoàn | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 35 | mô hình 2 – webapp "nền nếp cnt" | `s35_img3.png` | `chinh` | Giao diện WebApp "Nền nếp CNT" | ẢNH MÀN HÌNH — không dùng cho vai trò `nen`; Dùng chung với slide 1 |
| 35 | mô hình 2 – webapp "nền nếp cnt" | `s35_img4.png` | `phu` | Biểu đồ thống kê nền nếp | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 35 | mô hình 2 – webapp "nền nếp cnt" | `s35_img5.png` | `phu` | Bảng xếp hạng nền nếp theo lớp | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 35 | mô hình 2 – webapp "nền nếp cnt" | `s35_img6.png` | `phu` | Dashboard tổng hợp dữ liệu nền nếp | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 36 | mô hình 3 – concert "ký âm sol hồng" | `s36_img3.jpg` | `chinh` | Toàn cảnh sân khấu concert "Ký âm Sol hồng" | — |
| 36 | mô hình 3 – concert "ký âm sol hồng" | `s36_img4.jpg` | `phu` | Khán giả tại concert | — |
| 36 | mô hình 3 – concert "ký âm sol hồng" | `s36_img5.jpg` | `phu` | Trao biển hỗ trợ trên sân khấu | — |
| 36 | mô hình 3 – concert "ký âm sol hồng" | `s36_img6.jpg` | `phu` | Tiết mục biểu diễn trên sân khấu concert | — |
| 37 | mô hình 4 – cnt mind challenges – đấu trường trí tuệ | `s37_img3.jpg` | `chinh` | Toàn cảnh 12 đội thi đại diện 12 khối chuyên | — |
| 37 | mô hình 4 – cnt mind challenges – đấu trường trí tuệ | `s37_img4.jpg` | `phu` | Đường đua trí tuệ trên sân khấu | — |
| 37 | mô hình 4 – cnt mind challenges – đấu trường trí tuệ | `s37_img5.jpg` | `phu` | Cờ của các khối chuyên | — |
| 37 | mô hình 4 – cnt mind challenges – đấu trường trí tuệ | `s37_img6.jpg` | `phu` | Vòng cứu trợ có giáo viên tham gia | — |
| 38 | tuổi trẻ chuyên nguyễn trãi | `s38_img3.jpg` | `nen` | Tổng kết công tác Đoàn – Hội – Đội và khen thưởng tập thể, cá nhân | — |

---

_Bảng trên có 107 dòng, khớp tổng số ô ảnh (`images` + `background`) trong
`lib/slides/data.ts` tại thời điểm sinh file này._
