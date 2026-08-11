# Bản kê ảnh — dùng để thay ảnh chốt

Ảnh lấy từ thư mục "(CHUẨN) ẢNH BÁO CÁO LÁ CỜ ĐẦU" do nhà trường chọn tay; TÊN FILE
CHÍNH LÀ CHÚ THÍCH in lên màn hình. Để bổ sung hoặc thay ảnh:

1. Đặt file mới vào `public/media/slides/` với **đúng tên file** trong bảng dưới, hoặc
2. Đổi trường `src` của ảnh tương ứng trong `lib/slides/data.ts`.

Sau khi thay, chạy lại `node scripts/audit-images.mjs` để đo lại, rồi `npm run test`
để chắc chắn không có ảnh màn hình nào lọt vào vai trò ảnh nền.

File này do `scripts/build-image-manifest.mjs` sinh tự động từ `lib/slides/data.ts` —
đừng sửa tay ở đây, sửa dữ liệu nguồn rồi chạy lại script để sinh lại.

## Hai việc cần ưu tiên khi gửi ảnh mới

### 1. Slide chưa có ảnh nào (ưu tiên cao nhất)

- Slide 35 chưa có ô ảnh nào; panel ảnh của trang này để navy trơn.

### 2. Nhiều ô ảnh đang dùng lại đúng một tấm ảnh

Trong 128 ô ảnh của 44 slide, chỉ có 126 tấm ảnh mang nội dung
file thật sự khác nhau (so khớp bằng băm md5, không theo tên file) — nghĩa là
2 ô ảnh đang dùng lại một tấm đã xuất hiện ở slide khác. Dùng chung nhiều nhất hiện nay là slide 2, 3, cùng lấy đúng 1 tấm ảnh giống hệt nhau.
Nếu chỉ gửi được một phần ảnh mới trước, nên ưu tiên các slide đang dùng ảnh
riêng (không có cờ "Dùng chung..." trong bảng dưới), để không nhân bản cùng một
lỗi ra nhiều trang.

---

## Bảng đầy đủ 128 ô ảnh

Cột "Ghi chú" đánh dấu ảnh màn hình phần mềm (đo bằng `scripts/audit-images.mjs`,
không nên dùng cho vai trò ảnh nền `nen`) và ảnh đang dùng chung với slide khác.
Slide 35 không có dòng nào ở đây vì không có ảnh nào cả — xem mục 1 ở trên.

| Slide | Tiêu đề slide | File ảnh | Vai trò | Chú thích hiện tại | Ghi chú |
|---|---|---|---|---|---|
| 1 | báo cáo kết quả đơn vị đăng ký lá cờ đầu | `Chào mừng 80 năm Cách mạng tháng Tám.jpg` | `nen` | Chào mừng 80 năm Cách mạng tháng Tám | — |
| 1 | báo cáo kết quả đơn vị đăng ký lá cờ đầu | `Chương trình “Ký âm Sol hồng”.jpg` | `phu` | Chương trình “Ký âm Sol hồng” | — |
| 1 | báo cáo kết quả đơn vị đăng ký lá cờ đầu | `Ra mắt nền tảng số quản lý Đoàn viên, thanh niên.jpg` | `phu` | Ra mắt nền tảng số quản lý Đoàn viên, thanh niên | — |
| 1 | báo cáo kết quả đơn vị đăng ký lá cờ đầu | `Đồng diễn CNT's Day.jpg` | `phu` | Đồng diễn CNT's Day | — |
| 2 | sơ lược đặc điểm, tình hình đoàn trường thpt chuyên nguyễn trãi | `Học sinh toàn trường chào cờ đầu tuần.jpg` | `nen` | Học sinh toàn trường chào cờ đầu tuần | Dùng chung với slide 3 |
| 3 | 1. tình hình đoàn viên, thanh niên | `Họp Ban Chấp hành Đoàn trường.jpg` | `chinh` | Họp Ban Chấp hành Đoàn trường | — |
| 3 | 1. tình hình đoàn viên, thanh niên | `Tổ chức Đoàn của trường.jpg` | `phu` | Tổ chức Đoàn của trường | — |
| 3 | 1. tình hình đoàn viên, thanh niên | `Học sinh toàn trường chào cờ đầu tuần.jpg` | `phu` | Học sinh toàn trường chào cờ đầu tuần | Dùng chung với slide 2 |
| 4 | 2. thuận lợi, khó khăn | `Đại hội Đoàn trường.jpg` | `chinh` | Đại hội Đoàn trường | — |
| 4 | 2. thuận lợi, khó khăn | `Hoạt động trong điều kiện cơ sở vật chất hiện có.jpg` | `phu` | Hoạt động trong điều kiện cơ sở vật chất hiện có | — |
| 4 | 2. thuận lợi, khó khăn | `Sinh hoạt Đoàn.jpg` | `phu` | Sinh hoạt Đoàn | — |
| 5 | thành tích đạt được trong năm học 2025 – 2026 | `Đội tuyển học sinh giỏi quốc gia.jpg` | `nen` | Đội tuyển học sinh giỏi quốc gia | Dùng chung với slide 6 |
| 6 | 1. công tác giáo dục 1.1. học tập và làm theo tư tưởng, đạo đức, phong cách hồ chí minh | `Sinh hoạt chi đoàn theo chủ điểm.jpg` | `chinh` | Sinh hoạt chi đoàn theo chủ điểm | — |
| 6 | 1. công tác giáo dục 1.1. học tập và làm theo tư tưởng, đạo đức, phong cách hồ chí minh | `Đội tuyển học sinh giỏi quốc gia.jpg` | `phu` | Đội tuyển học sinh giỏi quốc gia | Dùng chung với slide 5 |
| 6 | 1. công tác giáo dục 1.1. học tập và làm theo tư tưởng, đạo đức, phong cách hồ chí minh | `Tập thể học sinh toàn trường.jpg` | `phu` | Tập thể học sinh toàn trường | — |
| 6 | 1. công tác giáo dục 1.1. học tập và làm theo tư tưởng, đạo đức, phong cách hồ chí minh | `Sinh hoạt đầu tuần.jpg` | `phu` | Sinh hoạt đầu tuần | — |
| 7 | 1.2. giáo dục chính trị, tư tưởng | `Chương trình “Khi tôi 18”.png` | `chinh` | Chương trình “Khi tôi 18” | — |
| 7 | 1.2. giáo dục chính trị, tư tưởng | `Chương trình “Ánh dương soi đường”.jpg` | `phu` | Chương trình “Ánh dương soi đường” | — |
| 7 | 1.2. giáo dục chính trị, tư tưởng | `Học sinh tham gia công tác bầu cử.jpg` | `phu` | Học sinh tham gia công tác bầu cử | — |
| 7 | 1.2. giáo dục chính trị, tư tưởng | `Khát vọng cống hiến – Lẽ sống thanh niên.jpg` | `phu` | Khát vọng cống hiến – Lẽ sống thanh niên | — |
| 8 | 1.3. giáo dục truyền thống cách mạng, lòng yêu nước | `Dâng hương tại đài tưởng niệm.jpg` | `chinh` | Dâng hương tại đài tưởng niệm | — |
| 8 | 1.3. giáo dục truyền thống cách mạng, lòng yêu nước | `Cuộc thi “Dưới Ánh Sao Vàng”.jpg` | `phu` | Cuộc thi “Dưới Ánh Sao Vàng” | — |
| 8 | 1.3. giáo dục truyền thống cách mạng, lòng yêu nước | `Triển lãm tranh “Độc lập – Tự do – Hạnh phúc”.jpg` | `phu` | Triển lãm tranh “Độc lập – Tự do – Hạnh phúc” | — |
| 8 | 1.3. giáo dục truyền thống cách mạng, lòng yêu nước | `Giao lưu nhân chứng lịch sử.jpg` | `phu` | Giao lưu nhân chứng lịch sử | — |
| 9 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `Phiên tòa giả định.jpg` | `chinh` | Phiên tòa giả định | — |
| 9 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `Diễn đàn “Xây dựng tình bạn đẹp”.png` | `phu` | Diễn đàn “Xây dựng tình bạn đẹp” | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 9 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `Mỗi ngày một tin tốt, mỗi tuần một chuyện đẹp.jpg` | `phu` | Mỗi ngày một tin tốt, mỗi tuần một chuyện đẹp | — |
| 10 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `Hướng dẫn kỹ năng lái xe an toàn.jpg` | `chinh` | Hướng dẫn kỹ năng lái xe an toàn | — |
| 10 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `Ngoại khóa phòng cháy chữa cháy.jpg` | `phu` | Ngoại khóa phòng cháy chữa cháy | — |
| 10 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `Ra mắt mô hình “Trường học không ma túy”.png` | `phu` | Ra mắt mô hình “Trường học không ma túy” | — |
| 10 | 1.4. giáo dục đạo đức, lối sống văn hóa và pháp luật | `Tuyên truyền phòng, chống mua bán người.jpg` | `phu` | Tuyên truyền phòng, chống mua bán người | — |
| 11 | 2. tổ chức phong trào hành động cách mạng 2.1. phong trào "thanh niên tình nguyện" | `Đội hình tình nguyện Tiếp sức mùa thi.jpg` | `chinh` | Đội hình tình nguyện Tiếp sức mùa thi | — |
| 11 | 2. tổ chức phong trào hành động cách mạng 2.1. phong trào "thanh niên tình nguyện" | `Đội hình tình nguyện Hoa phượng đỏ.jpg` | `phu` | Đội hình tình nguyện Hoa phượng đỏ | — |
| 11 | 2. tổ chức phong trào hành động cách mạng 2.1. phong trào "thanh niên tình nguyện" | `Dâng hương tưởng niệm các Anh hùng Liệt sỹ.jpg` | `phu` | Dâng hương tưởng niệm các Anh hùng Liệt sỹ | — |
| 12 | hoạt động an sinh xã hội | `Quyên góp Quỹ “Đông ấm vùng cao”.jpg` | `chinh` | Quyên góp Quỹ “Đông ấm vùng cao” | — |
| 12 | hoạt động an sinh xã hội | `Đồng hành cùng nạn nhân chất độc da cam.jpg` | `phu` | Đồng hành cùng nạn nhân chất độc da cam | — |
| 12 | hoạt động an sinh xã hội | `Ủng hộ “Đông ấm vùng cao”.jpg` | `phu` | Ủng hộ “Đông ấm vùng cao” | — |
| 13 | hoạt động an sinh xã hội | `Quyên góp, thăm hỏi nhân dân vùng lũ.jpg` | `chinh` | Quyên góp, thăm hỏi nhân dân vùng lũ | — |
| 13 | hoạt động an sinh xã hội | `Ủng hộ đồng bào lũ lụt.jpg` | `phu` | Ủng hộ đồng bào lũ lụt | — |
| 13 | hoạt động an sinh xã hội | `Đoàn viên, thanh niên hiến máu tình nguyện.jpg` | `phu` | Đoàn viên, thanh niên hiến máu tình nguyện | — |
| 14 | các hoạt động bảo vệ môi trường | `Triển lãm tranh bảo vệ môi trường.jpg` | `chinh` | Triển lãm tranh bảo vệ môi trường | — |
| 14 | các hoạt động bảo vệ môi trường | `Ra quân Chủ nhật Xanh.jpg` | `phu` | Ra quân Chủ nhật Xanh | — |
| 14 | các hoạt động bảo vệ môi trường | `Ra quân Chủ nhật Xanh(1).jpg` | `phu` | Ra quân Chủ nhật Xanh | — |
| 14 | các hoạt động bảo vệ môi trường | `Chuỗi sự kiện “Ước mơ xanh”.jpg` | `phu` | Chuỗi sự kiện “Ước mơ xanh” | — |
| 15 | chương trình tiếp sức mùa thi | `Tình nguyện viên hỗ trợ thí sinh.jpg` | `chinh` | Tình nguyện viên hỗ trợ thí sinh | — |
| 15 | chương trình tiếp sức mùa thi | `Tình nguyện viên hỗ trợ thí sinh(1).jpg` | `phu` | Tình nguyện viên hỗ trợ thí sinh | — |
| 15 | chương trình tiếp sức mùa thi | `Tình nguyện viên hỗ trợ thí sinh(2).jpg` | `phu` | Tình nguyện viên hỗ trợ thí sinh | — |
| 15 | chương trình tiếp sức mùa thi | `Đội hình tình nguyện Tiếp sức mùa thi(1).jpg` | `phu` | Đội hình tình nguyện Tiếp sức mùa thi | — |
| 16 | chiến dịch hoa phượng đỏ | `Bữa cơm nghĩa tình.jpg` | `chinh` | Bữa cơm nghĩa tình | — |
| 16 | chiến dịch hoa phượng đỏ | `Hỗ trợ người dân định danh điện tử.jpg` | `phu` | Hỗ trợ người dân định danh điện tử | — |
| 16 | chiến dịch hoa phượng đỏ | `Lớp tiếng Anh tình nguyện hè(1).jpg` | `phu` | Lớp tiếng Anh tình nguyện hè | — |
| 16 | chiến dịch hoa phượng đỏ | `Hỗ trợ người cao tuổi khám sức khỏe.jpg` | `phu` | Hỗ trợ người cao tuổi khám sức khỏe | — |
| 17 | chiến dịch hoa phượng đỏ | `Lớp tiếng Anh tình nguyện hè.jpg` | `chinh` | Lớp tiếng Anh tình nguyện hè | — |
| 17 | chiến dịch hoa phượng đỏ | `Thăm hỏi cựu chiến binh.jpg` | `phu` | Thăm hỏi cựu chiến binh | — |
| 17 | chiến dịch hoa phượng đỏ | `Thăm hỏi cựu chiến binh(1).jpg` | `phu` | Thăm hỏi cựu chiến binh | — |
| 17 | chiến dịch hoa phượng đỏ | `Hỗ trợ thân nhân Liệt sỹ.jpg` | `phu` | Hỗ trợ thân nhân Liệt sỹ | — |
| 18 | 2.2. phong trào "tuổi trẻ sáng tạo" | `Giải Nhất Chuyển đổi số, chuyển đổi xanh.jpg` | `chinh` | Giải Nhất Chuyển đổi số, chuyển đổi xanh | — |
| 18 | 2.2. phong trào "tuổi trẻ sáng tạo" | `Dự thi Tin học trẻ cấp thành phố.jpg` | `phu` | Dự thi Tin học trẻ cấp thành phố | — |
| 18 | 2.2. phong trào "tuổi trẻ sáng tạo" | `Giao lưu Robotics.jpg` | `phu` | Giao lưu Robotics | — |
| 19 | sân chơi học thuật và sáng tạo | `Giải Nhất tuần Đường lên đỉnh Olympia.jpg` | `chinh` | Giải Nhất tuần Đường lên đỉnh Olympia | — |
| 19 | sân chơi học thuật và sáng tạo | `Cuộc thi Olympia cấp trường.jpg` | `phu` | Cuộc thi Olympia cấp trường | — |
| 19 | sân chơi học thuật và sáng tạo | `Mô hình HDMUN.jpg` | `phu` | Mô hình HDMUN | — |
| 20 | 2.3. phong trào "tuổi trẻ xung kích bảo vệ tổ quốc" | `Công trình “Những cánh thư vượt sóng”.jpg` | `chinh` | Công trình “Những cánh thư vượt sóng” | — |
| 20 | 2.3. phong trào "tuổi trẻ xung kích bảo vệ tổ quốc" | `Công trình “Những cánh thư vượt sóng”(1).jpg` | `phu` | Công trình “Những cánh thư vượt sóng” | — |
| 20 | 2.3. phong trào "tuổi trẻ xung kích bảo vệ tổ quốc" | `Công trình “Những cánh thư vượt sóng”(2).jpg` | `phu` | Công trình “Những cánh thư vượt sóng” | — |
| 20 | 2.3. phong trào "tuổi trẻ xung kích bảo vệ tổ quốc" | `Công trình “Những cánh thư vượt sóng”(3).jpg` | `phu` | Công trình “Những cánh thư vượt sóng” | — |
| 21 | 3. tổ chức các chương trình đồng hành với thanh niên 3.1. đồng hành với thanh niên trong học tập | `Trao Học bổng Sao Khuê.jpg` | `chinh` | Trao Học bổng Sao Khuê | — |
| 21 | 3. tổ chức các chương trình đồng hành với thanh niên 3.1. đồng hành với thanh niên trong học tập | `Tuyên dương “Học sinh 3 tốt”.jpg` | `phu` | Tuyên dương “Học sinh 3 tốt” | — |
| 21 | 3. tổ chức các chương trình đồng hành với thanh niên 3.1. đồng hành với thanh niên trong học tập | `Ngày Sách và Văn hóa đọc.jpg` | `phu` | Ngày Sách và Văn hóa đọc | — |
| 22 | 3.1. đồng hành với thanh niên trong học tập | `Lễ kết nạp Đảng.jpg` | `chinh` | Lễ kết nạp Đảng | — |
| 22 | 3.1. đồng hành với thanh niên trong học tập | `Trao học bổng cho học sinh.jpg` | `phu` | Trao học bổng cho học sinh | — |
| 22 | 3.1. đồng hành với thanh niên trong học tập | `Trao quà Tết cho học sinh.jpg` | `phu` | Trao quà Tết cho học sinh | — |
| 23 | 3.2. đồng hành với thanh niên khởi nghiệp, lập nghiệp | `Ngày hội Tư vấn tuyển sinh – Hướng nghiệp.jpg` | `chinh` | Ngày hội Tư vấn tuyển sinh – Hướng nghiệp | — |
| 23 | 3.2. đồng hành với thanh niên khởi nghiệp, lập nghiệp | `Ngày hội Tư vấn tuyển sinh – Hướng nghiệp(1).jpg` | `phu` | Ngày hội Tư vấn tuyển sinh – Hướng nghiệp | — |
| 23 | 3.2. đồng hành với thanh niên khởi nghiệp, lập nghiệp | `Giao lưu với đại học quốc tế.jpg` | `phu` | Giao lưu với đại học quốc tế | — |
| 23 | 3.2. đồng hành với thanh niên khởi nghiệp, lập nghiệp | `Chuyên đề tư vấn hướng nghiệp.jpg` | `phu` | Chuyên đề tư vấn hướng nghiệp | — |
| 24 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `Chương trình “Phi mã khai xuân”.jpg` | `chinh` | Chương trình “Phi mã khai xuân” | — |
| 24 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `Chào tân học sinh “New Orbit”.jpg` | `phu` | Chào tân học sinh “New Orbit” | — |
| 24 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `Hội diễn “Khúc ca tri ân”.jpg` | `phu` | Hội diễn “Khúc ca tri ân” | — |
| 24 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `Chuyên đề “Mạch nguồn di sản”.jpg` | `phu` | Chuyên đề “Mạch nguồn di sản” | — |
| 25 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `Gói bánh chưng “Gói trọn vị nhà”.jpg` | `chinh` | Gói bánh chưng “Gói trọn vị nhà” | — |
| 25 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `Hội chợ Tết.jpg` | `phu` | Hội chợ Tết | — |
| 25 | đa dạng các loại hình hoạt động văn hóa, nghệ thuật | `Ngày hội Chuyên Nguyễn Trãi.jpg` | `phu` | Ngày hội Chuyên Nguyễn Trãi | — |
| 26 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `CNT's Open Talk.jpg` | `chinh` | CNT's Open Talk | — |
| 26 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `Giải kéo co.jpg` | `phu` | Giải kéo co | — |
| 27 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `Giải bóng đá CNT Cup.jpg` | `chinh` | Giải bóng đá CNT Cup | — |
| 27 | rèn luyện thể chất, hoạt động clb và chăm sóc tinh thần | `Sinh hoạt câu lạc bộ.jpg` | `phu` | Sinh hoạt câu lạc bộ | — |
| 28 | 4. hội nhập quốc tế và phát triển ngoại ngữ | `Hùng biện tiếng Anh Young Voices.jpg` | `chinh` | Hùng biện tiếng Anh Young Voices | — |
| 28 | 4. hội nhập quốc tế và phát triển ngoại ngữ | `Sinh hoạt CLB Tiếng Anh(1).jpg` | `phu` | Sinh hoạt CLB Tiếng Anh | — |
| 28 | 4. hội nhập quốc tế và phát triển ngoại ngữ | `Sinh hoạt CLB Tiếng Anh(2).jpg` | `phu` | Sinh hoạt CLB Tiếng Anh | — |
| 29 | 5. xây dựng tổ chức đoàn vững mạnh | `Lễ kết nạp đoàn viên mới.jpg` | `chinh` | Lễ kết nạp đoàn viên mới | — |
| 29 | 5. xây dựng tổ chức đoàn vững mạnh | `Hội nghị tập huấn nâng cao năng lực số.jpg` | `phu` | Hội nghị tập huấn nâng cao năng lực số | — |
| 29 | 5. xây dựng tổ chức đoàn vững mạnh | `Đoàn viên bỏ phiếu.jpg` | `phu` | Đoàn viên bỏ phiếu | — |
| 29 | 5. xây dựng tổ chức đoàn vững mạnh | `Đại hội Đoàn trường THPT chuyên Nguyễn Trãi.jpg` | `phu` | Đại hội Đoàn trường THPT chuyên Nguyễn Trãi | — |
| 30 | đoàn tham gia xây dựng đảng | `Đoàn viên ưu tú tuyên thệ.jpg` | `chinh` | Đoàn viên ưu tú tuyên thệ | — |
| 30 | đoàn tham gia xây dựng đảng | `12 quần chúng ưu tú kết nạp Đảng đợt 1.jpg` | `phu` | 12 quần chúng ưu tú kết nạp Đảng đợt 1 | — |
| 30 | đoàn tham gia xây dựng đảng | `16 quần chúng ưu tú được kết nạp Đảng.jpg` | `phu` | 16 quần chúng ưu tú được kết nạp Đảng | — |
| 33 | một số mô hình hay, cách làm sáng tạo | `Đội hình 12 khối chuyên.jpg` | `nen` | Đội hình 12 khối chuyên tại Đấu trường trí tuệ | — |
| 34 | mô hình 1 – nền tảng số quản lý công tác đoàn khối thpt | `s34_img3.jpg` | `chinh` | Ra mắt công trình thanh niên Nền tảng số quản lý công tác Đoàn | — |
| 34 | mô hình 1 – nền tảng số quản lý công tác đoàn khối thpt | `s34_img4.png` | `phu` | Giao diện quản lý đoàn viên | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 34 | mô hình 1 – nền tảng số quản lý công tác đoàn khối thpt | `s34_img5.png` | `phu` | Giao diện trang chủ quản lý công tác Đoàn | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 36 | mô hình 3 – webapp "nền nếp cnt" | `s35_img3.png` | `chinh` | Giao diện WebApp "Nền nếp CNT" | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 36 | mô hình 3 – webapp "nền nếp cnt" | `s35_img4.png` | `phu` | Biểu đồ thống kê nền nếp | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 36 | mô hình 3 – webapp "nền nếp cnt" | `s35_img5.png` | `phu` | Bảng xếp hạng nền nếp theo lớp | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 36 | mô hình 3 – webapp "nền nếp cnt" | `s35_img6.png` | `phu` | Dashboard tổng hợp dữ liệu nền nếp | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 37 | mô hình 4 – concert "ký âm sol hồng" | `Quang cảnh đêm diễn Ký âm Sol hồng.jpg` | `chinh` | Quang cảnh đêm diễn Concert "Ký âm Sol hồng" | — |
| 37 | mô hình 4 – concert "ký âm sol hồng" | `Ký âm Sol hồng.jpg` | `phu` | Poster Concert "Ký âm Sol hồng" | — |
| 37 | mô hình 4 – concert "ký âm sol hồng" | `Biểu diễn Ký âm Sol hồng.jpg` | `phu` | Tiết mục biểu diễn tại "Ký âm Sol hồng" | — |
| 37 | mô hình 4 – concert "ký âm sol hồng" | `Văn nghệ tập thể Ký âm Sol hồng.jpg` | `phu` | Văn nghệ tập thể tại "Ký âm Sol hồng" | — |
| 38 | mô hình 4 – concert "ký âm sol hồng": nghệ thuật gắn với trách nhiệm cộng đồng | `Trao biển hỗ trợ Ký âm Sol hồng 1.jpg` | `chinh` | Trao biển hỗ trợ tại Concert "Ký âm Sol hồng" | — |
| 38 | mô hình 4 – concert "ký âm sol hồng": nghệ thuật gắn với trách nhiệm cộng đồng | `Trao biển hỗ trợ Ký âm Sol hồng 2.jpg` | `phu` | Trao biển hỗ trợ tại Concert "Ký âm Sol hồng" | — |
| 38 | mô hình 4 – concert "ký âm sol hồng": nghệ thuật gắn với trách nhiệm cộng đồng | `Trao biển hỗ trợ Ký âm Sol hồng 3.jpg` | `phu` | Trao biển hỗ trợ tại Concert "Ký âm Sol hồng" | — |
| 39 | mô hình 5 – cnt mind challenges – đấu trường trí tuệ | `Toàn cảnh cuộc thi Đấu trường trí tuệ.jpg` | `chinh` | Toàn cảnh cuộc thi Đấu trường trí tuệ | — |
| 39 | mô hình 5 – cnt mind challenges – đấu trường trí tuệ | `Đường đua Trí tuệ.jpg` | `phu` | 12 đội trên đường đua trí tuệ | — |
| 40 | mô hình 5 – cnt mind challenges: khẳng định bản sắc học thuật của trường chuyên | `Phần thi Đấu trường trí tuệ.jpg` | `chinh` | Phần thi tại Đấu trường trí tuệ | — |
| 41 | mô hình 6 – công trình thanh niên "những cánh thư vượt sóng" | `Những cánh thư vượt sóng 1.jpg` | `chinh` | ĐVTN với thư, thiệp gửi biển đảo | — |
| 41 | mô hình 6 – công trình thanh niên "những cánh thư vượt sóng" | `Những cánh thư vượt sóng 2.jpg` | `phu` | ĐVTN vẽ thiệp gửi chiến sĩ hải quân | — |
| 41 | mô hình 6 – công trình thanh niên "những cánh thư vượt sóng" | `Những cánh thư vượt sóng 5.jpg` | `phu` | Quà Tết đến với cán bộ, chiến sĩ hải quân | ẢNH MÀN HÌNH — không dùng cho vai trò `nen` |
| 41 | mô hình 6 – công trình thanh niên "những cánh thư vượt sóng" | `Những cánh thư vượt sóng 7.jpg` | `phu` | Trao thiệp tới Nhà giàn DK1 | — |
| 42 | mô hình 7 – chiến dịch "eco vision – ước mơ xanh" | `Chiến dịch Eco Vision – Ước mơ xanh (1).jpg` | `chinh` | Chiến dịch "Eco Vision – Ước mơ xanh" | — |
| 42 | mô hình 7 – chiến dịch "eco vision – ước mơ xanh" | `Chiến dịch Eco Vision – Ước mơ xanh (2).jpg` | `phu` | Chiến dịch "Eco Vision – Ước mơ xanh" | — |
| 42 | mô hình 7 – chiến dịch "eco vision – ước mơ xanh" | `Chiến dịch Eco Vision – Ước mơ xanh (3).jpg` | `phu` | Chiến dịch "Eco Vision – Ước mơ xanh" | — |
| 42 | mô hình 7 – chiến dịch "eco vision – ước mơ xanh" | `Chiến dịch Eco Vision – Ước mơ xanh (4).jpg` | `phu` | Chiến dịch "Eco Vision – Ước mơ xanh" | — |
| 43 | mô hình 8 – chuỗi hoạt động "sao tháng tám" | `Sao Tháng Tám 1.jpg` | `chinh` | Triển lãm tranh "Độc lập – Tự do – Hạnh phúc" | — |
| 43 | mô hình 8 – chuỗi hoạt động "sao tháng tám" | `Sao Tháng Tám 2.jpg` | `phu` | Tiết mục tại "Dưới Ánh Sao Vàng" | — |
| 43 | mô hình 8 – chuỗi hoạt động "sao tháng tám" | `Sao Tháng Tám 4.jpg` | `phu` | Trao giải cuộc thi vẽ tranh | — |
| 43 | mô hình 8 – chuỗi hoạt động "sao tháng tám" | `Sao Tháng Tám 6.jpg` | `phu` | Phần thi đuổi hình bắt chữ | — |
| 44 | tuổi trẻ chuyên nguyễn trãi | `Đội hình tình nguyện biểu thị quyết tâm.jpg` | `nen` | Đội hình tình nguyện biểu thị quyết tâm | — |

---

_Bảng trên có 128 dòng, khớp tổng số ô ảnh (`images` + `background`) trong
`lib/slides/data.ts` tại thời điểm sinh file này._
