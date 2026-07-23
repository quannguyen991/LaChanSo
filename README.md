# KHOAN ĐÃ

**KHOAN ĐÃ – Dừng lại trước khi chuyển tiền.** Đây là web app hỗ trợ người cao tuổi nhận diện dấu hiệu lừa đảo, tạo khoảng dừng và kết nối đúng người hỗ trợ. Người dùng có thể kể bằng văn bản/giọng nói, dán SMS/Zalo/email/link, quét QR, hoặc gửi PNG/JPEG/WEBP/PDF tối đa khoảng 5 MB.

Gemini chỉ đọc nội dung và trích xuất tín hiệu boolean. Rule engine trong code quyết định mức rủi ro, lý do, hành động và trích dẫn tĩnh; AI không tự kết luận rủi ro hoặc tự tạo nguồn. Trạng thái thấp hiển thị là **“Chưa thấy dấu hiệu rủi ro”**, không dùng từ “an toàn” để tránh tạo cảm giác chắc chắn giả.

## Luồng chính

- **Trang chủ** (`#trang-chu`): trạng thái hệ thống, cỡ chữ, hướng dẫn giọng nói, ba lối kiểm tra và hai hành động khẩn cấp.
- **Kiểm tra tình huống** (`#kiem-tra`): văn bản, giọng nói, kéo-thả/chụp/tải ảnh hoặc PDF; có hủy, lỗi thân thiện, lớp tín hiệu, độ tin cậy và sửa nội dung AI đọc.
- **Kiểm tra chuyển khoản** (`#chuyen-khoan`) và **link/QR** (`#kiem-tra-lien-ket`): kiểm tra trước khi bấm chuyển hoặc mở đường dẫn; link redirect có chống SSRF.
- **Đang bị thúc ép**: hướng dẫn tuần tự 6 bước, đếm 60 giây, TTS, gọi người thân/ngân hàng và lưu bằng chứng.
- **Đã chuyển tiền** (`#vua-chuyen-tien`): checklist 8 bước, ghi số tiền/thời gian/kênh chuyển/OTP, xuất tóm tắt cho ngân hàng và bật bảo vệ phục hồi 72 giờ.
- **Vụ việc** (`#hanh-trinh`), **bằng chứng** (`#bang-chung`), **lịch sử** (`#lich-su`), **trợ lý báo cáo** (`#bao-cao`): lưu cục bộ, xuất file khi người dùng chủ động.
- **Gia đình** (`#gia-dinh`): tối đa 5 liên hệ, cấp quyền theo vai trò, thời hạn, thu hồi và nhật ký quyền riêng tư.
- **Người thật hỗ trợ** (`#ho-tro`), **11 bài luyện ngắn** (`#huong-dan`) và **Trung tâm quyền riêng tư** (`#quyen-rieng-tu`).

Reputation Engine (`POST /api/kiem-tra-uy-tin`) là adapter cục bộ. Khi chưa có provider thật, kết quả ghi rõ “chưa có dữ liệu xác minh”, `reportCount: null`; danh sách domain cấu hình được gắn nhãn **dữ liệu minh họa**. Không có số lượt báo cáo giả.

## Chạy dự án

Yêu cầu Node.js 20 trở lên.

```powershell
npm install
Copy-Item .env.example .env
# Điền GEMINI_API_KEY vào .env
npm start
```

Mở `http://localhost:3000`.

Không commit file `.env`. API key luôn nằm ở backend. Frontend gọi API nội bộ qua `public/services.js`; không nhúng khóa hay gọi Gemini trực tiếp.

## Kiểm thử

```powershell
npm test
npm run test:gemini
```

`npm test` chạy unit test không gọi mạng. `npm run test:gemini` gọi Gemini thật cho ba tình huống giả trong `test/scenarios.json`.

## Cấu trúc

- `src/gemini.js`: một lần gọi Gemini (văn bản/ảnh/PDF) với JSON schema cố định.
- `src/rule-engine.js`: chấm điểm deterministic, thư viện trích dẫn tĩnh và `applyRecoveryBoost` cho bảo vệ phục hồi 72h.
- `src/journey-engine.js`: suy ra giai đoạn thao túng và dự đoán bước tiếp theo cho Scam Journey, thuần luật, không gọi Gemini.
- `src/link-shield.js`: theo dõi chuỗi chuyển hướng URL, chặn SSRF và so tên miền cuối với thư viện thương hiệu tĩnh.
- `src/reputation-engine.js`: chuẩn hóa thực thể và trả kết quả uy tín có nguồn/nhãn dữ liệu minh họa rõ ràng.
- `server.js`: Express API, giới hạn request, MIME/kích thước upload, rate limit và security headers; không lưu tệp tải lên.
- `public/services.js`: ranh giới gọi API, timeout/hủy và adapter cho OCR, giọng nói, QR, gia đình, báo cáo, quyền riêng tư.
- `public/`: HTML/CSS/JS thuần, PWA manifest, font và icon vendored cục bộ.
- `test/scenarios.json`: 10 kịch bản dùng dữ liệu giả.

Liên hệ, mật khẩu gia đình, vụ việc và lịch sử chỉ lưu trong `localStorage`. Chế độ “kiểm tra một lần” không thêm kết quả mới vào lịch sử. Tệp tải lên không được lưu sau khi phân tích.

## Giao diện

Giao diện dùng nền xanh-trắng dịu mắt và Trust Blue như bản tham chiếu gốc; cam dành cho tín hiệu “khoan đã”, đỏ chỉ dành cho nguy hiểm. Token nằm tại `tokens.css`; font Nunito Sans và IconScout Unicons Line được phục vụ cục bộ. Giao diện responsive từ 320 px, vùng chạm tối thiểu 44 px, focus rõ, không truyền đạt rủi ro chỉ bằng màu và tôn trọng `prefers-reduced-motion`.
