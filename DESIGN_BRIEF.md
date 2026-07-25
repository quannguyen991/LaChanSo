# Lá Chắn Số — Bản mô tả để thiết kế lại toàn bộ giao diện

> Gửi cho designer / AI thiết kế. Tài liệu này mô tả **đúng sản phẩm đang chạy**, kèm những ràng buộc **không được phá**.
> Bản chạy thật: https://khoan-da-553138370139.asia-southeast1.run.app

---

## 1. Sản phẩm là gì

**Lá Chắn Số** — ứng dụng web (PWA) giúp **người cao tuổi Việt Nam** nhận ra lừa đảo và **dừng lại** trước khi chuyển tiền hoặc đưa thông tin.

- **Tên thương hiệu:** Lá Chắn Số
- **Câu cửa miệng:** "Khoan đã" — dùng ở tiêu đề trang và dòng dưới logo, **không phải tên sản phẩm**
- **Câu định vị:** *Khoan đã — Dừng lại trước khi chuyển tiền*

**Một câu mô tả cách hoạt động:** người dùng kể lại tình huống (gõ / nói / chụp ảnh tin nhắn / quét QR) → hệ thống trả về **1 trong 3 mức rủi ro** kèm lý do, việc cần làm và nguồn cảnh báo.

---

## 2. Người dùng — điều quan trọng nhất

Thiết kế cho **một người 70 tuổi, mắt kém, tay run, đang hoảng loạn, cầm điện thoại, trong khi kẻ lừa đảo vẫn đang nói chuyện ở đầu dây bên kia.**

| Đặc điểm | Hệ quả cho thiết kế |
|---|---|
| Gần như 100% dùng **điện thoại** | Thiết kế mobile-first thật sự, không phải thu nhỏ desktop |
| Mắt kém | Chữ to; app có nút chỉnh cỡ chữ 3 mức (A / A+ / A++) — **mọi chữ phải phóng to được** |
| Tay run | Vùng bấm tối thiểu 52px (đang dùng), nút chính nên 56px+ |
| Đang hoảng, bị thúc ép | Lối thoát khẩn cấp phải **thấy ngay không cần vuốt** |
| Xấu hổ, sợ bị chê ngốc | Giọng văn phải trấn an, không phán xét |
| Máy cũ, mạng 3G/4G | Trang phải nhẹ; hoạt động được khi **mất mạng** |

**Giọng văn hiện tại:** gọi người dùng là **"bác"**, xưng hô ấm áp, câu ngắn, không dùng từ kỹ thuật. Giữ nguyên tinh thần này.

---

## 3. Ràng buộc KHÔNG ĐƯỢC PHÁ

Đây là những thứ đã trả giá để có. Thiết kế mới phải giữ:

### 3.1 Ba mức rủi ro — đúng chữ, đúng màu
| Mức | Chữ hiển thị (không đổi) | Màu |
|---|---|---|
| Cao | **"Nguy hiểm cao"** | Đỏ |
| Vừa | **"Nghi ngờ"** | Vàng/cam |
| Thấp | **"Chưa thấy dấu hiệu rủi ro"** | Xanh lá |

⚠️ **Tuyệt đối không đổi mức thấp thành "An toàn"** — vì hệ thống chỉ nói "chưa thấy dấu hiệu trong thông tin bác cung cấp", không đảm bảo an toàn. Đây là cam kết đạo đức, không phải chữ nghĩa.

### 3.2 Kết quả luôn phải có đủ 4 phần
1. Mức rủi ro (màu + chữ)
2. **3 lý do** — vì sao kết luận vậy
3. **3 việc cần làm** — hành động cụ thể
4. **Nguồn** — trích dẫn Bộ Công an / BHXH / FTC…

→ Lý do: hệ thống được thiết kế để **giải thích được**. AI chỉ đọc và bật cờ dấu hiệu; **luật cứng trong code mới quyết định** mức rủi ro. Thiết kế không được biến kết quả thành một con số/nhãn mơ hồ.

### 3.3 Không truyền đạt rủi ro **chỉ bằng màu**
Phải luôn kèm chữ + icon (người cao tuổi có tỉ lệ mù màu và đục thủy tinh thể cao).

### 3.4 Chữ phải là CHỮ THẬT
**Không nướng chữ vào ảnh.** Bản trước từng làm phần đầu trang chủ bằng một tấm ảnh có sẵn chữ → nút "Cỡ chữ lớn" mất tác dụng đúng ở dòng chữ to nhất. Đã sửa, đừng lặp lại.

### 3.5 Khác
- Chạy được **offline** (đã có service worker)
- Tương phản màu đạt **WCAG AA (4.5:1)** — hiện 24/24 cặp màu đều đạt
- Tôn trọng `prefers-reduced-motion`
- Chữ tiếng Việt **dài hơn tiếng Anh ~30%** → đừng thiết kế nút vừa khít chữ
- Có dấu tiếng Việt (dấu mũ, dấu nặng) → cần line-height thoáng, tránh cắt dấu

---

## 4. Bản đồ màn hình (16 màn + màn chào)

### Màn chào (onboarding) — 4 bước, chỉ hiện lần đầu
1. **Lá Chắn Số** — chào mừng
2. **"Có điều đáng ngờ,"** — giới thiệu 4 cách kiểm tra
3. **"Lá Chắn Số hướng dẫn bác"** — demo hội thoại mẫu
4. **"An toàn hơn"** — mời thêm người thân

### Thanh tab dưới (cố định): Trang chủ · Kiểm tra · Vụ việc · Gia đình

### Nhóm A — Kiểm tra (lõi sản phẩm)
| Màn | Tiêu đề hiện tại | Việc |
|---|---|---|
| `#trang-chu` | *Lá Chắn Số, bác cần kiểm tra điều gì?* | Ô nhập chính + lối tắt + khẩn cấp |
| `#kiem-tra` | *Có đáng tin không?* | Kiểm tra tình huống (chữ/giọng nói/ảnh/PDF) |
| `#chuyen-khoan` | *Chuyển khoản này có ổn không?* | Soi giao dịch trước khi bấm xác nhận |
| `#kiem-tra-lien-ket` | *Kiểm tra link & QR* | Dán link hoặc quét QR |
| `#xac-minh` | *Hỏi những câu này trước khi làm theo* | Bộ câu hỏi dùng ngay trong cuộc gọi |

### Nhóm B — Khẩn cấp (quan trọng nhất về UX)
| Màn | Tiêu đề | Việc |
|---|---|---|
| *(hộp thoại)* | **Nguy hiểm cao** | Đếm ngược 60s, câu nói để cúp máy, gọi người thân/ngân hàng |
| `#thoat-cuoc-goi` | *Bác có thể nói một câu này rồi tắt máy* | Câu thoát khỏi cuộc gọi + đọc thành tiếng |
| `#vua-chuyen-tien` | *Bạn vừa chuyển tiền cho người lạ?* | Cứu hộ 8 bước + tóm tắt gửi ngân hàng |

### Nhóm C — Hồ sơ & theo dõi
| Màn | Tiêu đề | Việc |
|---|---|---|
| `#hanh-trinh` | *Vụ việc* | Ghép nhiều diễn biến thành 1 vụ, suy ra giai đoạn thao túng |
| `#bang-chung` | *Nhật ký bằng chứng* | Lưu số điện thoại/link/tài khoản, xuất file |
| `#lich-su` | *Lịch sử kiểm tra* | 5 lần gần nhất |
| `#bao-cao` | *Chuẩn bị báo cáo sự việc* | Soạn nội dung trình báo (không tự gửi) |

### Nhóm D — Hỗ trợ & học
| Màn | Tiêu đề | Việc |
|---|---|---|
| `#gia-dinh` | *Gia đình & liên hệ an toàn* | Tối đa 5 liên hệ, mật khẩu gia đình |
| `#ho-tro` | *Tôi cần người thật hỗ trợ* | Danh bạ hotline chính thức |
| `#huong-dan` | *Luyện để không bị lừa* | 11 bài học ngắn 2–3 phút |
| `#canh-bao` | *Các hình thức lừa đảo cần chú ý* | Bài viết tĩnh |
| `#quyen-rieng-tu` | *Trung tâm quyền riêng tư* | Dữ liệu chỉ nằm trên máy, xuất/xóa |

---

## 5. Hệ thiết kế hiện tại (điểm khởi đầu, được phép thay)

**Font:** Manrope Variable + Be Vietnam Pro (có dấu tiếng Việt đầy đủ)

**Màu** (định dạng OKLCH, file `tokens.css`):
- Nền giấy xanh nhạt `oklch(97% 0.018 245)`, chữ navy đậm `oklch(20% 0.055 255)`
- Chủ đạo: **xanh dương tin cậy** `oklch(43% 0.18 255)`
- Trạng thái: xanh lá (an toàn) · cam (chú ý) · **đỏ chỉ dành cho nguy hiểm thật**

**Bo góc:** 12 / 18 / 24 / 32px + pill · **Vùng chạm:** 52px · **Thanh tab dưới:** 5.5rem

---

## 6. Vấn đề cần thiết kế mới giải quyết

Đây là những chỗ **đo được** trên bản hiện tại:

### 🔴 Nặng
1. **Trang chủ dài ~3100px ≈ 5 màn vuốt** trên điện thoại. Quá dài, quá nhiều lựa chọn.
2. **Quá nhiều lối vào cùng chức năng** — ô nhập + chip gợi ý + thẻ hub + lưới thẻ, tất cả đều để "bắt đầu kiểm tra". Người già bị rối. **Cần gom lại còn 1–2 lối rõ ràng.**
3. **Khối khẩn cấp** tuy đã kéo lên 0.8 màn nhưng vẫn nằm trong dòng chảy trang — nên cân nhắc **luôn nhìn thấy** (nút nổi hoặc 1 ô trong thanh tab dưới).

### 🟠 Vừa
4. **Hộp cảnh báo nguy hiểm dài 1759px** trên màn 812px — người đang hoảng phải cuộn.
5. Khối giới thiệu/quảng cáo "An tâm mỗi ngày" chiếm **686px** — nhiều hơn cả phần chức năng.
6. **Màn chào 4 bước** hơi dài với người già; bước 1 trên máy 360×640 bị tràn nhẹ.
7. Nhiều thẻ trông giống nhau → khó phân biệt cái nào quan trọng.

### 🟡 Nợ kỹ thuật (nói để designer biết bối cảnh)
8. `styles.css` đã **6800 dòng, 23 ngưỡng màn hình**, nhiều khối đè nhau — từng làm 4 nút biến mất khỏi giao diện mà không ai biết. **Thiết kế lại nên kèm dọn sạch, không đè thêm.**

---

## 7. Việc cần làm

Thiết kế lại **toàn bộ giao diện**, mobile-first, cho:
- 4 màn chào + 16 màn chính + hộp thoại khẩn cấp
- 3 trạng thái kết quả (đỏ / vàng / xanh)
- Trạng thái rỗng, đang tải, lỗi
- Cả 3 cỡ chữ (A / A+ / A++) đều không được vỡ

**Kích thước phải kiểm:** 320 · 360 · 375 · 414 px (điện thoại) · 768 (máy tính bảng) · 1280 (desktop)

**Tiêu chí đánh giá — một câu:**
> Một bác 70 tuổi, đang bị kẻ lừa đảo ép qua điện thoại, mở app ra — trong **5 giây** có tìm được nút cần bấm không?

---

## 8. Ưu tiên nếu phải chọn

1. **Rõ ràng hơn đẹp** — người dùng đang hoảng, không ngắm giao diện
2. **Ít lựa chọn hơn nhiều tính năng** — thà 3 nút to rõ còn hơn 12 thẻ đẹp
3. **Trấn an hơn cảnh báo** — không dọa thêm người đã sợ sẵn
4. **Trung thực hơn trấn an giả** — không bao giờ hứa "an toàn" khi chưa chắc

---

## 9. Ghi chú kỹ thuật cho người dựng lại

- Web thuần: HTML + CSS + JavaScript, **không framework**
- Backend Node/Express, gọi AI qua API nội bộ (`/api/*`)
- Điều hướng bằng hash (`#trang-chu`), mỗi màn là một `<section class="view">`
- Có sẵn: đọc thành tiếng (TTS), nhập bằng giọng nói (STT), quét QR, chụp/tải ảnh & PDF
- Dữ liệu người dùng **chỉ nằm trong trình duyệt** (localStorage) — không tài khoản, không máy chủ lưu
- Giữ được `id` các phần tử hiện có thì đỡ phải sửa JavaScript; nếu đổi, cần báo để cập nhật
