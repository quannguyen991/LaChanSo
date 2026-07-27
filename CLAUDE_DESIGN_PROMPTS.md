# Dùng Claude Design cho Lá Chắn Số — hướng dẫn + prompt dán sẵn

---

## ⚠️ Trước khi bấm tạo — chỉnh 2 thứ

**1. Design system: ĐỔI đi**
Đang để **"HapuHR Design System"** — đó là hệ thiết kế của dự án khác. Để nguyên thì ra giao diện phong cách HapuHR.
→ Chọn **None** (để nó tự do theo mô tả màu trong prompt), hoặc vào tab **Design systems** tạo mới tên **"Lá Chắn Số"** rồi nạp bảng màu ở Prompt 0 bên dưới.

**2. Template**
- Làm màn điện thoại → chọn **Mobile app design**
- Làm màn máy tính → chọn **None** (hoặc Wireframe nếu muốn xem bố cục trước)

**Model Opus 5** đang chọn là đúng, giữ nguyên.

---

## Thứ tự nên làm

Đừng bảo nó vẽ cả 16 màn một lượt — kết quả sẽ loãng. Làm từng cái, theo thứ tự giá trị:

1. **Trang chủ điện thoại** ← quan trọng nhất
2. **Hộp cảnh báo "Nguy hiểm cao"** ← nơi cứu người
3. **Màn kết quả kiểm tra** (3 trạng thái đỏ/vàng/xanh)
4. Trang chủ máy tính
5. Các màn còn lại

---

## PROMPT 0 — Tạo Design System (làm 1 lần, nếu muốn)

```
Tạo design system cho "Lá Chắn Số" — ứng dụng chống lừa đảo dành cho NGƯỜI CAO TUỔI Việt Nam.

Nguyên tắc: rõ ràng hơn đẹp, chữ to, tương phản cao, bấm dễ.

MÀU (OKLCH):
- Nền: oklch(97% 0.018 245) — xanh rất nhạt
- Chữ chính: oklch(20% 0.055 255) — navy đậm
- Chủ đạo: oklch(43% 0.18 255) — xanh dương tin cậy
- An toàn: xanh lá · Cảnh báo: cam · Nguy hiểm: đỏ (CHỈ dùng đỏ cho nguy hiểm thật)

CHỮ: Manrope Variable + Be Vietnam Pro (đủ dấu tiếng Việt).
Cỡ chữ nền 17px, phải hoạt động khi người dùng phóng lên 20px.
Tiếng Việt dài hơn tiếng Anh ~30% và có dấu — line-height thoáng, đừng làm nút vừa khít chữ.

KÍCH THƯỚC: vùng bấm tối thiểu 52px, nút chính 56px+.
Bo góc 12/18/24/32px. Bóng đổ nhẹ.

BẮT BUỘC: mọi cặp màu chữ/nền đạt tương phản WCAG AA 4.5:1.
Không truyền đạt trạng thái chỉ bằng màu — luôn kèm chữ và icon.
```

---

## PROMPT 1 — Trang chủ điện thoại ⭐ (làm cái này trước)

*Template: Mobile app design · khổ 375×812*

```
Thiết kế màn hình chính (điện thoại 375×812) cho "Lá Chắn Số" — ứng dụng giúp NGƯỜI CAO TUỔI Việt Nam nhận ra lừa đảo và dừng lại trước khi chuyển tiền.

NGƯỜI DÙNG: bác 70 tuổi, mắt kém, tay run, ĐANG HOẢNG vì kẻ lừa đảo vẫn đang nói chuyện ở đầu dây bên kia. Không phải người rảnh rỗi ngắm giao diện.

TIÊU CHÍ DUY NHẤT: mở app ra, trong 5 GIÂY có tìm được nút cần bấm không?

NỘI DUNG MÀN HÌNH, theo đúng thứ tự này:
1. Đầu trang gọn: logo lá chắn + chữ "Lá Chắn Số", dòng nhỏ "Khoan đã · Dừng lại trước khi chuyển tiền", nút hồ sơ "Chào bác"
2. Câu hỏi lớn: "Bác đang gặp tình huống gì?"
3. Ô NHẬP CHÍNH (to, rõ) + 4 nút tròn: chụp ảnh, quét QR, nói bằng giọng, và nút "Tiếp tục"
   - Dưới ô nhập có dòng nhỏ: "Không nhập mã OTP, mật khẩu hoặc số tài khoản đầy đủ."
4. KHẨN CẤP — 2 nút đỏ TO, phải thấy được mà không cần vuốt:
   - "TÔI ĐANG BỊ THÚC ÉP" (phụ: Dừng lại 60 giây để bình tĩnh)
   - "TÔI ĐÃ CHUYỂN TIỀN" (phụ: Xem ngay các bước cần làm)
5. 4 lối tắt dạng thẻ có icon: Tin nhắn · Chuyển tiền · Cuộc gọi lạ · Link/QR
6. Thanh tab cố định dưới cùng: Trang chủ · Kiểm tra · Vụ việc · Gia đình

YÊU CẦU BẮT BUỘC:
- Vùng bấm tối thiểu 52px, nút chính 56px+
- Chữ nền 17px trở lên. KHÔNG chữ nào dưới 14px, kể cả nhãn thanh tab dưới
- TOÀN BỘ chữ phải là chữ thật, TUYỆT ĐỐI không nướng chữ vào ảnh (người dùng có nút phóng to chữ)
- Tương phản WCAG AA 4.5:1
- Đỏ CHỈ dùng cho khẩn cấp, không dùng trang trí
- Toàn trang gói trong khoảng 2 màn vuốt, đừng dài hơn

MÀU: nền xanh rất nhạt oklch(97% 0.018 245), chữ navy oklch(20% 0.055 255), chủ đạo xanh dương oklch(43% 0.18 255). Font Manrope + Be Vietnam Pro.

GIỌNG: ấm áp, gọi người dùng là "bác", câu ngắn, không thuật ngữ.

ĐỪNG: đừng nhồi nhiều thẻ trông giống nhau, đừng để nhiều lối vào cho cùng một việc, đừng thêm khối quảng cáo tự khen sản phẩm.
```

---

## PROMPT 2 — Hộp cảnh báo "Nguy hiểm cao" ⭐

```
Thiết kế hộp thoại cảnh báo toàn màn hình (điện thoại 375×812) cho ứng dụng chống lừa đảo dành cho người cao tuổi Việt Nam.

BỐI CẢNH: vừa phát hiện tình huống nguy hiểm. Người dùng 70 tuổi ĐANG bị kẻ lừa đảo ép qua điện thoại NGAY LÚC NÀY. Đây là màn hình cứu người — mọi thứ quan trọng phải thấy ngay, không được cuộn.

THỨ TỰ TỪ TRÊN XUỐNG (bắt buộc — hành động trước, giải thích sau):
1. Nhãn đỏ "Nguy hiểm cao"
2. Câu trấn an xóa xấu hổ: "Đây là chiêu giả danh công an — hàng nghìn người cũng bị gọi y hệt, bác không hề ngốc."
3. CÂU NÓI ĐỂ CÚP MÁY (chữ to, nổi bật, trong khung riêng):
   "Tôi sẽ tự tới trụ sở gặp trực tiếp. Bây giờ tôi xin dừng cuộc gọi."
4. Việc cần từ chối: "Không chuyển tiền, không đọc mã, không bấm link."
5. Đồng hồ đếm ngược 60 giây
6. 2 NÚT TO: "Gọi người thân" (chính) và "Gọi ngân hàng" (phụ)
7. Bên dưới mới đến phần giải thích: danh sách quy tắc + câu hỏi phụ

BẮT BUỘC:
- Mục 1–6 phải nằm gọn trong MỘT màn hình, không cần vuốt
- Nút gọi tối thiểu 56px
- Nền không được quá đỏ gây hoảng thêm — đỏ dùng cho nhãn và viền, nền vẫn dịu
- Chữ câu-nói-để-cúp-máy ít nhất 20px, đậm

GIỌNG: bình tĩnh, trấn an, không phán xét. Gọi người dùng là "bác".
```

---

## PROMPT 3 — Màn kết quả, 3 trạng thái

```
Thiết kế màn hình kết quả kiểm tra (điện thoại 375×812) cho ứng dụng chống lừa đảo cho người cao tuổi Việt Nam. Vẽ ĐỦ 3 trạng thái cạnh nhau.

Mỗi trạng thái đều có đúng 4 phần:
1. Mức rủi ro (màu + chữ + icon)
2. 3 LÝ DO — vì sao kết luận vậy
3. 3 VIỆC CẦN LÀM — hành động cụ thể
4. Nguồn cảnh báo (vd "Theo cảnh báo của Bộ Công an...")

BA TRẠNG THÁI — dùng ĐÚNG những chữ này, không được đổi:
- ĐỎ: "Nguy hiểm cao"
- VÀNG: "Nghi ngờ"
- XANH: "Chưa thấy dấu hiệu rủi ro"

⚠️ TUYỆT ĐỐI KHÔNG đổi trạng thái xanh thành "An toàn" hay "Bạn an toàn".
Hệ thống chỉ nói "chưa thấy dấu hiệu trong thông tin đã cung cấp" — không hứa an toàn. Đây là cam kết đạo đức của sản phẩm.

BẮT BUỘC:
- Không truyền đạt mức rủi ro chỉ bằng màu — luôn kèm chữ và icon
- Chữ tối thiểu 17px
- Có nút "Nghe đọc kết quả" (đọc thành tiếng)
- Trạng thái đỏ có thêm nút "Gọi người thân" nổi bật
```

---

## PROMPT 4 — Trang chủ máy tính

```
Thiết kế màn hình chính bản MÁY TÍNH (1280×860) cho "Lá Chắn Số" — ứng dụng chống lừa đảo cho người cao tuổi Việt Nam.

Đây là bản mở rộng của màn điện thoại đã có, giữ nguyên nội dung và thứ tự ưu tiên, nhưng dùng khoảng trống cho hợp lý.

CÂU HỎI CẦN TRẢ LỜI: khoảng trống hai bên dùng làm gì cho CÓ ÍCH?
Hiện tại đang để một cột phụ lặp lại nội dung tự khen sản phẩm — đó là lãng phí. Hãy đề xuất phương án tốt hơn, ví dụ:
- Thu hẹp khung nội dung cho dễ đọc, hai bên để trống
- Hoặc cột phụ chứa thứ thật sự hữu ích: lịch sử kiểm tra gần đây, vụ việc đang theo dõi, số điện thoại người thân đã lưu

NỘI DUNG: đầu trang (logo + menu), câu hỏi lớn, ô nhập chính, 2 nút khẩn cấp đỏ, 4 lối tắt, chân trang.

BẮT BUỘC:
- Chữ nền 17px+, vùng bấm 52px+ (người dùng vẫn là người cao tuổi, kể cả trên máy tính)
- Tương phản WCAG AA
- 2 nút khẩn cấp phải thấy ngay khi mở trang, không cần cuộn
- Không dùng ảnh có chữ nướng sẵn

MÀU: nền xanh rất nhạt, chữ navy, chủ đạo xanh dương tin cậy. Font Manrope + Be Vietnam Pro.
```

---

## Sau khi có thiết kế — nói tôi biết

Đưa tôi ảnh hoặc file, tôi sẽ:
1. Đối chiếu với ràng buộc (cỡ chữ, vùng bấm, tương phản, chữ 3 mức rủi ro)
2. Nói thẳng chỗ nào **không dựng được** hoặc sẽ vỡ khi bật cỡ chữ lớn
3. Dựng thành code thật và kiểm bằng số đo trên trình duyệt
