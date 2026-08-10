# Demo web 3 slide — Báo cáo Lá cờ đầu

Website Next.js tĩnh gồm ba slide tiêu biểu của BCH Đoàn Trường THPT Chuyên Nguyễn Trãi:

- Slide 1: trang bìa báo cáo.
- Slide 31: kết quả hoàn thành `15/15` nhóm chỉ tiêu.
- Slide 34: nền tảng số quản lý công tác Đoàn, kèm clip 25 giây.

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

## Build tĩnh

```powershell
npm run test
npm run lint
npm run build
```

Kết quả nằm trong thư mục `out` và không cần Node.js/server khi phục vụ.

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
