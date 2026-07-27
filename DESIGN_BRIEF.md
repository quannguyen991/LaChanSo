# Khoan Đã — Yêu cầu thiết kế lại toàn bộ giao diện

> **Gửi cho bên thiết kế.** Tài liệu mô tả đúng sản phẩm đang chạy tại
> https://khoan-da-553138370139.asia-southeast1.run.app
> Cần thiết kế **cả bản máy tính và bản điện thoại**.

---

## 1. Sản phẩm

**Khoan Đã** — ứng dụng web giúp **người cao tuổi Việt Nam** nhận ra lừa đảo và **dừng lại** trước khi chuyển tiền.

- **Tên thương hiệu: Khoan Đã** (chốt 27/7/2026). Viết hoa chữ Đ ở logo và
  `manifest.name`; thẻ `<title>` dùng dạng thường *"Khoan đã – Dừng lại trước
  khi chuyển tiền"*.
- **Dòng dưới logo:** *"Cùng bạn an toàn trong thế giới số"*
- Tài liệu cũ có chỗ còn ghi "Lá Chắn Số" — **đó là tên đã bỏ**, đừng dùng lại.

**Cách hoạt động (1 câu):** người dùng kể tình huống (gõ / nói / chụp ảnh tin nhắn / quét QR) → nhận **1 trong 3 mức rủi ro** kèm lý do, việc cần làm và nguồn cảnh báo.

---

## 2. Người dùng — điều quan trọng nhất

> Thiết kế cho **một bác 70 tuổi, mắt kém, tay run, đang hoảng, cầm điện thoại, trong khi kẻ lừa đảo vẫn đang nói ở đầu dây bên kia.**

| Đặc điểm | Hệ quả thiết kế |
|---|---|
| Gần như 100% dùng **điện thoại** | Mobile-first thật sự, không phải thu nhỏ bản máy tính |
| Mắt kém | App có nút chỉnh cỡ chữ 3 mức (A / A+ / A++) — **mọi chữ phải phóng to được** |
| Tay run | Vùng bấm ≥ 52px (hiện tại), nút chính nên ≥ 56px |
| Đang hoảng | Lối thoát khẩn cấp phải **thấy ngay, không cần vuốt** |
| Xấu hổ, sợ bị chê ngốc | Giọng trấn an, không phán xét |
| Máy cũ, mạng 3G/4G | Trang nhẹ, **chạy được khi mất mạng** |

**Giọng văn:** gọi người dùng là **"bác"**, câu ngắn, không thuật ngữ. Giữ nguyên tinh thần này.

---

## 3. Ràng buộc KHÔNG ĐƯỢC PHÁ

### 3.1 Ba mức rủi ro — đúng chữ, đúng màu
| Mức | Chữ hiển thị (không đổi) | Màu |
|---|---|---|
| Cao | **"Nguy hiểm cao"** | Đỏ |
| Vừa | **"Nghi ngờ"** | Vàng/cam |
| Thấp | **"Chưa thấy dấu hiệu rủi ro"** | Xanh lá |

⚠️ **Tuyệt đối không đổi mức thấp thành "An toàn".** Hệ thống chỉ nói "chưa thấy dấu hiệu trong thông tin bác cung cấp" — không đảm bảo an toàn. Đây là **cam kết đạo đức**, không phải chuyện chữ nghĩa.

### 3.2 Kết quả luôn đủ 4 phần
1. Mức rủi ro (màu + chữ) · 2. **3 lý do** · 3. **3 việc cần làm** · 4. **Nguồn** (Bộ Công an / BHXH / FTC…)

Lý do: AI chỉ đọc và bật cờ; **luật cứng trong code mới quyết định** mức rủi ro. Thiết kế không được biến kết quả thành một nhãn mơ hồ.

### 3.3 Khác
- **Không truyền đạt rủi ro chỉ bằng màu** (người già tỉ lệ mù màu/đục thủy tinh thể cao) — luôn kèm chữ + icon
- **Không nướng chữ vào ảnh.** Bản trước từng làm đầu trang bằng ảnh có sẵn chữ → nút "Cỡ chữ lớn" mất tác dụng đúng ở dòng to nhất. Đã sửa, đừng lặp lại.
- Tương phản đạt **WCAG AA (4.5:1)** — hiện 24/24 cặp màu đều đạt
- Chạy **offline** (đã có service worker) · tôn trọng `prefers-reduced-motion`
- **Chữ tiếng Việt dài hơn tiếng Anh ~30%** và có dấu → đừng thiết kế nút vừa khít chữ, cần line-height thoáng

---

## 4. Bản đồ màn hình (16 màn + 4 bước chào)

**Màn chào (chỉ lần đầu):** Khoan Đã → "Có điều đáng ngờ," → "Khoan Đã hướng dẫn bác" → "An toàn hơn"

**Thanh tab dưới (điện thoại):** Trang chủ · Kiểm tra · Vụ việc · Gia đình

### Nhóm A — Kiểm tra (lõi)
| Đường dẫn | Tiêu đề hiện tại | Việc |
|---|---|---|
| `#trang-chu` | *Khoan Đã, bác cần kiểm tra điều gì?* | Ô nhập chính + lối tắt + khẩn cấp |
| `#kiem-tra` | *Có đáng tin không?* | Kiểm tra tình huống (chữ/giọng nói/ảnh/PDF) |
| `#chuyen-khoan` | *Chuyển khoản này có ổn không?* | Soi giao dịch trước khi bấm xác nhận |
| `#kiem-tra-lien-ket` | *Kiểm tra link & QR* | Dán link hoặc quét QR |
| `#xac-minh` | *Hỏi những câu này trước khi làm theo* | Bộ câu hỏi dùng ngay trong cuộc gọi |

### Nhóm B — Khẩn cấp (quan trọng nhất về trải nghiệm)
| Đường dẫn | Tiêu đề | Việc |
|---|---|---|
| *(hộp thoại)* | **Nguy hiểm cao** | Đếm ngược 60s · câu nói để cúp máy · gọi người thân/ngân hàng |
| `#thoat-cuoc-goi` | *Bác có thể nói một câu này rồi tắt máy* | Câu thoát + đọc thành tiếng |
| `#vua-chuyen-tien` | *Bạn vừa chuyển tiền cho người lạ?* | Cứu hộ 8 bước + tóm tắt gửi ngân hàng |

### Nhóm C — Hồ sơ & theo dõi
`#hanh-trinh` *Vụ việc* · `#bang-chung` *Nhật ký bằng chứng* · `#lich-su` *Lịch sử kiểm tra* · `#bao-cao` *Chuẩn bị báo cáo sự việc*

### Nhóm D — Hỗ trợ & học
`#gia-dinh` *Gia đình & liên hệ an toàn* · `#ho-tro` *Tôi cần người thật hỗ trợ* · `#huong-dan` *Luyện để không bị lừa* (11 bài) · `#canh-bao` *Các hình thức lừa đảo* · `#quyen-rieng-tu` *Trung tâm quyền riêng tư*

---

## 5. Hệ thiết kế hiện tại (điểm khởi đầu, được phép thay)

- **Font:** Manrope Variable + Be Vietnam Pro (đủ dấu tiếng Việt)
- **Màu** (OKLCH, trong `tokens.css`): nền giấy xanh nhạt `oklch(97% 0.018 245)` · chữ navy `oklch(20% 0.055 255)` · chủ đạo xanh dương tin cậy `oklch(43% 0.18 255)` · trạng thái xanh lá / cam / **đỏ chỉ dành cho nguy hiểm thật**
- **Bo góc:** 12/18/24/32px + pill · **Vùng chạm:** 52px · **Thanh tab dưới:** 5.5rem

---

## 6. Vấn đề cần thiết kế mới giải quyết

> Cập nhật **27/7/2026, sau khi đã deploy lên bản thật** (revision
> `khoan-da-00014-b2w`). Các mục ✅ đã xử lý và **đang chạy** — đừng thiết kế
> lại chúng, đừng làm chúng tệ đi.

### ✅ Đã sửa — giữ nguyên kết quả, không được làm hỏng
- **Lối vào trùng nhau trên trang chủ.** Từ 11 nút cho 4 đích còn: 1 ô nhập
  chính (kèm 4 nút chụp/QR/nói/tiếp tục), 2 chip điền sẵn, 4 ô lối tắt, 2 nút
  khẩn cấp đỏ, 1 nút gọi người thân. Menu hồ sơ: 8 mục → 6 mục, 0 đích trùng.
- **Hộp cảnh báo "Nguy hiểm cao": 1497px → 757px.** Hai nút gọi từ y=924 (dưới
  nếp gấp) lên **y=607**; ở cỡ chữ A++ vẫn nằm trên nếp gấp (y=735). Thứ tự bắt
  buộc: nhãn đỏ → dòng trấn an → **câu để đọc rồi cúp máy** → 3 điều từ chối →
  đếm ngược 60s → 2 nút gọi → mọi giải thích nằm sau một cú chạm.
- **Hero không còn nướng chữ vào ảnh.** Là chữ thật, giãn 51→68px theo cỡ chữ.
- **Đầu trang điện thoại cũng đã hết nướng chữ.** Trước đây nó là một **lớp bấm
  vô hình** (`opacity: 0`) đè lên ảnh vẽ sẵn logo + tiêu đề thành pixel; khối
  chữ thật bị ép `1×1px` + `clip`, và `:focus-visible` chỉ nâng lên `0.12` nên
  lấy nét bàn phím làm phần tử gần như tàng hình. Nay là chữ thật, giãn
  **27,75 → 31,45 → 37px** theo cỡ chữ.
- **Sàn cỡ chữ 14px và vùng chạm 52/56px** — đã có test chặn ở **cả 3 bậc**, xem mục 6b.
- **Chạy ngoại tuyến đã sống lại.** Service worker từng chết lặng vì một mục
  404 trong `APP_SHELL` (`cache.addAll` là được-ăn-cả-ngã-về-không). Đã có test chặn.

### 🔴 Còn lại — việc thật của đợt thiết kế lại
1. **Trang chủ vẫn dài**: **2,03 màn vuốt** ở cỡ chữ mặc định (1,76 ở bậc A ·
   2,66 ở A++). Mục tiêu ≤ 2 màn ở mọi bậc. Lưu ý: con số nhích lên từ 1,89 khi
   thay ảnh bằng chữ thật — **đó là đánh đổi đúng, đừng lấy lại bằng cách nhét
   chữ vào ảnh**.
2. **Bản máy tính chưa được thiết kế bài bản** — vẫn là bố cục 2 cột mở rộng từ
   bản điện thoại. Câu hỏi cần trả lời: khoảng trống hai bên dùng làm gì cho có ích?
3. **Nhân đôi mobile/desktop trong cùng DOM** — còn 2 thanh nav dưới giống hệt
   nhau (`.bottom-nav` và `.mobile-bottom-nav`). Mobile và desktop phải là **một
   hệ**, không phải hai sản phẩm. Đây là nguyên tắc cho toàn bộ thiết kế mới.
4. Nhiều thẻ trông giống nhau → khó biết cái nào quan trọng.
5. Màn chào 4 bước hơi dài; trên Android thấp (360×640) nút "Bắt đầu" chỉ ló một phần.
6. **Widget chat nổi (MỚI, 27/7)** — trợ lý hội thoại có nhập bằng giọng nói,
   vừa thêm vào và **chưa từng được thiết kế**. Cần trả lời: nó nằm đâu trên
   điện thoại mà không che 2 nút khẩn cấp đỏ và không đè thanh tab dưới? Với bác
   70 tuổi, một bong bóng chat nổi có phải cách đúng không, hay nên là một lối
   vào rõ ràng trong luồng chính?

### 🟡 Nợ kỹ thuật (bối cảnh cho bên thiết kế)
6. `styles.css` **6.543 dòng, 52 khối `@media`** đè nhau — từng làm 4 nút biến
   mất mà không ai biết. **Thiết kế lại nên kèm dựng lại CSS sạch, không đè thêm.**
   Nêu rõ số ngưỡng màn hình, **càng ít càng tốt** (đề xuất: 3).
7. Quy mô: `index.html` 1.858 dòng · `app.js` ~3.460 dòng.
8. Ở cỡ chữ A++ trên iPhone SE đời 1 (320×568) hộp cảnh báo vẫn hụt nếp gấp 12px.

## 6b. Hàng rào tự động — thiết kế nào vi phạm sẽ bị chặn

Repo có **137 test** chạy bằng `npm test`. Năm trong số đó chặn thẳng vào thiết kế:

| Test | Chặn điều gì |
|---|---|
| `font-size-floor.test.js` | mọi `font-size` dưới **14px**, ở **cả 3 bậc** A/A+/A++ |
| `non-text-contrast.test.js` | viền/ranh giới dưới **3:1** (WCAG 1.4.11) |
| `contrast.test.js` | cặp màu chữ dưới **4.5:1** |
| `service-worker-shell.test.js` | file trong `APP_SHELL` không tồn tại → mất ngoại tuyến |
| `frontend-contract.test.js` | chữ nướng vào ảnh, nhãn rủi ro, các `id` mà JS bám vào |

**Nghĩa là:** bản thiết kế gửi về sẽ được kiểm bằng số đo, không bằng cảm tính.
Bên thiết kế cứ đề xuất; chỗ nào không dựng được sẽ có bằng chứng cụ thể.

---

## 7. Việc cần làm

Thiết kế lại **toàn bộ giao diện, cả máy tính và điện thoại**:
- 4 màn chào + 16 màn chính + hộp thoại khẩn cấp
- 3 trạng thái kết quả (đỏ / vàng / xanh)
- Trạng thái rỗng · đang tải · lỗi
- **Cả 3 cỡ chữ (A / A+ / A++) đều không được vỡ**

**Kích thước bắt buộc kiểm:**
`320` · `360` · `375` · `414` px (điện thoại) — `768` (máy tính bảng) — `1280` · `1440` (máy tính)

**Riêng bản máy tính** cần trả lời: dùng khoảng trống thừa để làm gì? (hiện đang để cột phụ lặp lại nội dung tiếp thị — nên thay bằng thứ có ích hoặc thu hẹp khung nội dung)

**Tiêu chí đánh giá — một câu:**
> Một bác 70 tuổi đang bị kẻ lừa đảo ép qua điện thoại, mở app ra — trong **5 giây** có tìm được nút cần bấm không?

---

## 8. Ưu tiên khi phải chọn

1. **Rõ ràng hơn đẹp** — người dùng đang hoảng, không ngắm giao diện
2. **Ít lựa chọn hơn nhiều tính năng** — 3 nút to rõ hơn 12 thẻ đẹp
3. **Trấn an hơn cảnh báo** — không dọa thêm người đã sợ sẵn
4. **Trung thực hơn trấn an giả** — không bao giờ hứa "an toàn" khi chưa chắc

---

## 9. Ghi chú kỹ thuật cho người dựng lại

- Web thuần **HTML + CSS + JavaScript, không framework**
- Backend Node/Express, gọi AI qua API nội bộ (`/api/*`)
- Điều hướng bằng hash (`#trang-chu`); mỗi màn là một `<section class="view">`
- Có sẵn: đọc thành tiếng (TTS) · nhập bằng giọng nói · quét QR · chụp/tải ảnh & PDF
- Dữ liệu người dùng **chỉ nằm trong trình duyệt** (localStorage) — không tài khoản, không máy chủ lưu
- **Giữ được `id` các phần tử hiện có thì đỡ phải sửa JavaScript**; nếu đổi, cần liệt kê để cập nhật
- Có bộ kiểm thử tự động ràng buộc một số `id`/class và quy tắc giao diện — sẽ cập nhật theo thiết kế mới

---

## 10. Bàn giao mong muốn

1. **File thiết kế** (Figma hoặc tương đương) cho cả 2 khổ: điện thoại 375px và máy tính 1280px
2. **Hệ thiết kế**: màu, chữ, khoảng cách, bo góc, trạng thái nút (thường / chạm / focus / vô hiệu)
3. **Quy tắc responsive**: mỗi khối co giãn thế nào, ẩn/hiện ở ngưỡng nào — **nêu rõ số ngưỡng, càng ít càng tốt**
4. **Trạng thái đặc biệt**: chữ cỡ lớn nhất trông thế nào · trạng thái lỗi · trạng thái rỗng
