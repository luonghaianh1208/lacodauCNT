# Demo web 38 slide — Báo cáo Lá cờ đầu

Website Next.js tĩnh trình chiếu trọn bộ 38 slide báo cáo kết quả công tác Đoàn và
phong trào thanh niên trường học năm học 2025 – 2026 của BCH Đoàn Trường THPT
Chuyên Nguyễn Trãi, chia làm ba phần:

- **Phần A** (slide 2–4): sơ lược đặc điểm, tình hình Đoàn trường.
- **Phần B** (slide 5–32): thành tích đạt được trong năm học, sáu mục lớn — từ
  công tác giáo dục, tổ chức phong trào, đồng hành với thanh niên, hội nhập quốc
  tế, xây dựng tổ chức Đoàn đến slide 31–32 tổng kết `15/15` nhóm chỉ tiêu hoàn
  thành.
- **Phần C** (slide 33–38): bốn mô hình hay, cách làm sáng tạo tiêu biểu — trong
  đó slide 34 giới thiệu nền tảng số quản lý công tác Đoàn kèm clip 25 giây.

Slide 1 là trang bìa báo cáo, slide 38 là trang kết luận.

Website có hai giao diện:

- `/` hoặc `/control/`: màn hình dành cho người bấm máy.
- `/present/`: màn hình trình chiếu 16:9.

## Chạy trên máy

Yêu cầu Node.js 22.

```powershell
npm install
npm run dev
```

Mở `http://localhost:3000/`, sau đó bấm **MỞ MÀN HÌNH TRÌNH CHIẾU**. Đưa cửa sổ `/present/` sang màn hình thứ hai và bấm **SẴN SÀNG TRÌNH CHIẾU** một lần.

Phím tắt tại màn hình điều khiển:

- `←` / `→`: lùi hoặc chuyển slide.
- `Space`: phát video khi đang ở slide 34.

## Công tắc chuyển động

Màn hình điều khiển có nút bấm ba trạng thái, đổi vòng theo thứ tự **BẬT → THEO
MÁY → TẮT** mỗi lần bấm, lưu lại vào trình duyệt và đồng bộ ngay sang màn hình
trình chiếu:

- **BẬT** (`force`) — mặc định. Luôn chạy hiệu ứng chuyển cảnh, bất kể máy đang
  đặt gì.
- **THEO MÁY** (`auto`) — tôn trọng thiết lập `prefers-reduced-motion` của hệ
  điều hành: máy tắt hiệu ứng thì web cũng tắt.
- **TẮT** (`off`) — luôn tắt hiệu ứng.

Mặc định chọn **BẬT** thay vì tôn trọng cài đặt hệ điều hành như thông lệ web,
vì đây là công cụ chạy trên máy của người thuyết trình: nhiều máy tắt hiệu ứng
của Windows chỉ để chạy nhẹ hơn, không phải vì lý do nhạy cảm tiền đình — tắt
hiệu ứng theo mặc định sẽ làm mất chuyển cảnh mà không ai chủ động yêu cầu điều
đó. Ai thực sự cần tôn trọng cài đặt hệ điều hành thì chuyển sang **THEO MÁY**.

## Build tĩnh

```powershell
npm run test
npm run lint
npm run build
```

Kết quả nằm trong thư mục `out` và không cần Node.js/server khi phục vụ.

## Kiểm tra thị giác

`scripts/render-check.mjs` chụp ảnh cả 38 slide ở độ phân giải 1280×720 từ bản
build tĩnh, để soi lỗi bố cục bằng mắt trước khi trình chiếu thật:

```powershell
npm run build
node scripts/render-check.mjs
```

Thêm cờ `--audit` để script đo hình học ngay trong trang (chữ tràn khung, số
trang đè lên logo/panel...) và in cảnh báo ra console, không chỉ dựa vào mắt:

```powershell
node scripts/render-check.mjs --audit
```

Ảnh chụp ra nằm trong `docs/superpowers/references/render-check/` — thư mục ảnh
nằm trong `.gitignore`, chỉ `NOTES.md` (lịch sử lỗi đã tìm ra và đã sửa) được
theo dõi trong git.

## Soạn slide mới: quy tắc ngắt dòng cụm từ

Mọi chuỗi hiển thị trong `lib/slides/data.ts` (tiêu đề, gạch đầu dòng, chú
thích...) đều là kiểu `Phrases` — một **mảng cụm từ**, không phải một chuỗi
thường (`lib/phrases.ts`). Lý do: CSS ngắt dòng ở mọi dấu cách và không hiểu
ranh giới từ tiếng Việt, nên nếu để chuỗi thường thì trình duyệt sẵn sàng tách
đôi "ĐƠN / VỊ" hay "NGUYỄN / TRÃI" giữa chừng. Kiểu mảng ép người soạn phải tự
chọn chỗ ngắt hợp lý; truyền một chuỗi thường vào sẽ báo lỗi biên dịch TypeScript.

Khi thêm hoặc sửa nội dung:

- Mỗi cụm (mỗi phần tử trong mảng) phải **dưới 36 ký tự** (`MAX_PHRASE_LENGTH`)
  — cụm dài hơn ngưỡng này không ngắt được nên sẽ tràn khung ở một bố cục nào đó.
- Chỗ ngắt phải là chỗ người Việt tự nhiên ngắt hơi khi đọc to.
- **Không** tách đôi từ ghép, tên riêng, hay cụm số + đơn vị (ví dụ không tách
  "994 đoàn viên" thành hai cụm khác nhau).

## Đưa lên GitHub và Netlify

Mã nguồn nằm ở gốc repo `lacodauCNT`. Khi tạo site từ GitHub trên Netlify, đặt:

- **Base directory:** để trống (gốc repo).
- **Build command:** `npm run build`
- **Publish directory:** `out`

File `netlify.toml` ở gốc repo đã chứa cùng cấu hình và đặt Node.js 22. Không cần biến môi trường, database, Netlify Function hoặc Next.js server runtime.

## Lưu ý hai màn hình

Hai cửa sổ đồng bộ bằng `BroadcastChannel`, vì vậy chúng phải:

- mở từ cùng một địa chỉ website;
- nằm trong cùng trình duyệt và cùng profile;
- chạy trên cùng một máy.

Giải pháp này phù hợp khi một laptop cắm máy chiếu. Nếu cần điều khiển từ điện thoại hoặc máy thứ hai thì phải bổ sung một dịch vụ realtime, không nằm trong phạm vi demo này.

## Nguồn nội dung và tài nguyên

Toàn bộ chữ, số liệu, logo, ảnh và video được lấy từ dự án PPT `bao_cao_la_co_dau_25_26_ppt169_20260809`. Clip web được cắt từ `asset-220.mp4`, dài 25 giây, 1280×720, mã hóa H.264/AAC và tối ưu `faststart` để tải nhanh trên Netlify.

Ảnh trong `public/media/slides/` hiện là **ảnh tạm** rút thẳng từ file PPTX gốc. Xem `docs/BAN-KE-ANH.md` — bản kê đủ từng ô ảnh của 38 slide — để biết cách thay bằng ảnh chốt, kể cả những chỗ cần ưu tiên (slide chưa có ảnh, chú thích ghi sai nội dung ảnh). File đó do `node scripts/build-image-manifest.mjs` sinh ra, chạy lại script này sau khi sửa `lib/slides/data.ts` để cập nhật bảng.
