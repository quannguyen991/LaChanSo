# Thiết kế lại Khoan Đã bằng Claude Design — hướng dẫn

> Cập nhật 26/7/2026. Bản trước đã lỗi thời: hộp cảnh báo và hero đã sửa xong,
> nên thứ tự ưu tiên trong tài liệu này khác hẳn.

---

## Phần 1 — Cài đặt (làm một lần)

| Ô | Chọn | Vì sao |
|---|---|---|
| **Model** | **Opus 5** | Mạnh về dựng giao diện. Fable 5 đắt gấp đôi mà không hơn ở việc này. |
| **Design system** | **None** | Xem ghi chú dưới. |
| **Template** | *Mobile app design* khi vẽ điện thoại · *None* khi vẽ máy tính | |

### Vì sao chọn "None" chứ không phải "Create using Claude Code"

Nút đó chạy `/design-sync`, một công cụ **đồng bộ thư viện component đã biên
dịch**. Khoan Đã là HTML + CSS + JS thuần, không có component nào để đồng bộ.
Và toàn bộ hệ màu của ta chỉ **106 token trong 1 file** — dán tay là xong.

⚠️ Tài khoản đang có sẵn 2 design system (**HapuHR**, **Haplo**). **Đừng chọn
nhầm** — chọn nhầm là ra giao diện của dự án khác.

---

## Phần 2 — Dán gì vào tin nhắn đầu tiên

Đúng **hai** file, không thêm:

```bash
Get-Content tokens.css | Set-Clipboard       # hệ token — 106 token, nguồn sự thật
Get-Content DESIGN_BRIEF.md | Set-Clipboard  # yêu cầu thiết kế
```

**Đừng dán** `public/styles.css` (6.543 dòng — chính thứ ta muốn vứt),
`index.html`, `app.js`, hay các file `AUDIT_*` / `IMPLEMENTATION_REPORT_*`.
Chúng dạy Claude Design đi theo bố cục cũ.

Kèm câu dẫn:

```
Đây là hệ token (tokens.css) và yêu cầu thiết kế (DESIGN_BRIEF.md) của một
ứng dụng chống lừa đảo cho NGƯỜI CAO TUỔI Việt Nam đang chạy thật.

Đọc kỹ mục "Ràng buộc bất biến" — đó là cam kết đạo đức, không phải sở thích.
Đặc biệt: mức rủi ro thấp hiển thị đúng chữ "Chưa thấy dấu hiệu rủi ro",
TUYỆT ĐỐI không được đổi thành "An toàn".

Mục "Đã sửa" liệt kê những thứ vừa xử lý xong — giữ nguyên kết quả, đừng
thiết kế lại chúng.

Ta sẽ làm TỪNG MÀN MỘT. Đừng vẽ cả 16 màn một lượt.
```

---

## Phần 3 — Thứ tự làm

Làm từng màn, theo giá trị giảm dần. **Đừng bảo nó vẽ hết một lượt** — kết quả
sẽ loãng và không màn nào dùng được.

| # | Màn | Vì sao ưu tiên | Khổ |
|---|---|---|---|
| 1 | **Trang chủ điện thoại** | ~100% người dùng ở đây; đang 2,49 màn vuốt, cần ≤2 | 375×812 |
| 2 | **Trang chủ máy tính** | Chưa từng được thiết kế bài bản | 1280×860 |
| 3 | **Màn chào 4 bước** | Trên Android 360×640 nút "Bắt đầu" bị hụt | 360×640 |
| 4 | **Màn kết quả, 3 trạng thái** | Nơi sản phẩm nói ra kết luận | 375×812 |
| 5 | Các màn còn lại | | |

**Hộp cảnh báo nguy hiểm KHÔNG có trong danh sách** — vừa sắp lại xong (1497px →
757px, hai nút gọi trên nếp gấp ở cả 3 cỡ chữ). Nếu muốn nó đẹp hơn thì đưa
riêng, kèm câu: *"giữ nguyên thứ tự 7 mục và giữ hai nút gọi trên nếp gấp ở cả
cỡ chữ A++"*.

---

## Phần 4 — Vòng lặp làm việc (đây là chỗ ăn tiền)

```
Claude Design vẽ  →  bạn đưa tôi ảnh/file  →  tôi dựng thành code thật
                                            →  npm test (130 test)
                                            →  đo bằng trình duyệt
                                            →  báo cáo bằng SỐ, không bằng cảm tính
```

Repo có sẵn hàng rào tự động. Bản thiết kế nào vi phạm sẽ **bị chặn có bằng chứng**:

| Test | Chặn |
|---|---|
| `font-size-floor.test.js` | chữ dưới 14px |
| `non-text-contrast.test.js` | viền dưới 3:1 |
| `contrast.test.js` | chữ/nền dưới 4.5:1 |
| `frontend-contract.test.js` | chữ nướng vào ảnh, nhãn rủi ro, `id` mà JS bám vào |

Cộng thêm phép đo trên trình duyệt thật: tràn ngang, **chồng lấn**, vùng chạm
<52px — ở **cả 3 cỡ chữ × 320/360/375/768/1280px**.

Nên: cứ để Claude Design đề xuất thoải mái. Chỗ nào không dựng được, tôi đưa số
đo cụ thể chứ không phán "khó làm".

---

## Prompt 1 — Trang chủ điện thoại ⭐ làm cái này trước

*Template: Mobile app design · 375×812*

```
Thiết kế lại màn hình chính (điện thoại 375×812) cho "Khoan Đã".

NGƯỜI DÙNG: bác 70 tuổi, mắt kém, tay run, ĐANG HOẢNG vì kẻ lừa đảo vẫn đang
nói ở đầu dây bên kia. Không phải người rảnh rỗi ngắm giao diện.

TIÊU CHÍ DUY NHẤT: mở app ra, trong 5 GIÂY có tìm được nút cần bấm không?

VẤN ĐỀ CẦN GIẢI: trang hiện dài 2022px = 2,49 màn vuốt. Mục tiêu ≤ 2 màn,
mà KHÔNG bỏ mất chức năng nào dưới đây.

NỘI DUNG PHẢI CÓ, theo đúng thứ tự ưu tiên này:
1. Đầu trang gọn: logo lá chắn + "Khoan Đã", dòng nhỏ "Khoan đã · Dừng lại
   trước khi chuyển tiền", nút hồ sơ
2. Câu hỏi lớn: "Bác đang gặp tình huống gì?"
3. Ô NHẬP CHÍNH (to, rõ) + 4 nút: chụp ảnh, quét QR, nói bằng giọng, "Tiếp tục"
   - dưới ô nhập có dòng nhỏ: "Không nhập mã OTP, mật khẩu hoặc số tài khoản đầy đủ."
   - 2 chip điền sẵn: "Có người gọi cho tôi" · "Tôi nhận tin nhắn lạ"
4. KHẨN CẤP — 2 nút đỏ TO, phải thấy được mà KHÔNG cần vuốt:
   - "TÔI ĐANG BỊ THÚC ÉP"  (phụ: Dừng lại 60 giây để bình tĩnh)
   - "TÔI ĐÃ CHUYỂN TIỀN"   (phụ: Xem ngay các bước cần làm)
5. 1 nút "Gọi người thân" — lối thoát một chạm, không được bỏ
6. 4 ô lối tắt: Tin nhắn · Chuyển tiền · Cuộc gọi lạ · Link/QR
7. Thanh tab cố định dưới: Trang chủ · Kiểm tra · Vụ việc · Gia đình

BẮT BUỘC (có test tự động chặn):
- Vùng bấm ≥ 52px, nút chính ≥ 56px
- Chữ nền ≥ 17px. KHÔNG chữ nào dưới 14px, kể cả nhãn thanh tab
- TOÀN BỘ là chữ thật — TUYỆT ĐỐI không nướng chữ vào ảnh (có nút phóng cỡ chữ)
- Tương phản chữ 4.5:1, viền 3:1
- Đỏ CHỈ dùng cho khẩn cấp
- Tiếng Việt dài hơn tiếng Anh ~30% và có dấu xếp cả trên lẫn dưới — line-height
  tối thiểu 1.3, đừng làm nút vừa khít chữ
- Mobile và desktop phải là MỘT hệ, không phải hai bộ component song song

MÀU/CHỮ: dùng đúng token trong tokens.css tôi đã dán. Nền xanh rất nhạt
oklch(97% 0.018 245), chữ navy oklch(20% 0.055 255), chủ đạo xanh dương
oklch(43% 0.18 255). Font Manrope + Be Vietnam Pro.

GIỌNG: ấm áp, gọi người dùng là "bác", câu ngắn, không thuật ngữ.

ĐỪNG: đừng nhồi nhiều thẻ trông giống nhau, đừng tạo nhiều lối vào cho cùng một
việc (vừa mới dọn xong), đừng thêm khối tự khen sản phẩm.

Trước khi vẽ, hãy đề xuất 3 hướng bố cục khác nhau để đạt mục tiêu ≤2 màn vuốt,
nói rõ mỗi hướng hy sinh cái gì. Tôi chọn xong bạn mới dựng.
```

---

## Prompt 2 — Trang chủ máy tính

*Template: None · 1280×860*

```
Thiết kế màn hình chính bản MÁY TÍNH (1280×860) cho "Khoan Đã", mở rộng từ
bản điện thoại vừa chốt. Giữ nguyên nội dung và thứ tự ưu tiên.

CÂU HỎI CHÍNH CẦN TRẢ LỜI: khoảng trống hai bên dùng làm gì cho CÓ ÍCH?
Bản hiện tại để một cột phụ lặp lại nội dung tự khen — đó là lãng phí.
Đề xuất phương án tốt hơn, ví dụ:
- thu hẹp khung nội dung cho dễ đọc, hai bên để trống
- hoặc cột phụ chứa thứ thật sự hữu ích: lịch sử kiểm tra gần đây, vụ việc đang
  theo dõi, số điện thoại người thân đã lưu

BẮT BUỘC:
- Người dùng VẪN là người cao tuổi kể cả trên máy tính: chữ ≥17px, vùng bấm ≥52px
- 2 nút khẩn cấp đỏ phải thấy ngay khi mở trang, không cần cuộn
- Không dùng ảnh có chữ nướng sẵn
- Đây phải là CÙNG một hệ với bản điện thoại — cùng component, khác bố cục.
  KHÔNG tạo bộ component "desktop" riêng song song.
- Nêu rõ dùng bao nhiêu ngưỡng màn hình. Càng ít càng tốt — đề xuất đúng 3.
```

---

## Prompt 3 — Màn chào 4 bước

```
Thiết kế lại luồng chào (onboarding) 4 bước cho "Khoan Đã", khổ 360×640 —
đây là máy Android phổ thông thấp, và hiện nút "Bắt đầu" đang bị hụt khỏi màn.

4 bước hiện tại: Khoan Đã → "Có điều đáng ngờ," → "Khoan Đã hướng dẫn bác"
→ "An toàn hơn"

CÂU HỎI: 4 bước có quá dài với bác 70 tuổi không? Nếu rút còn 2 mà vẫn đủ ý thì
đề xuất luôn.

BẮT BUỘC:
- Ở 360×640, nút đi tiếp phải nằm TRỌN trong màn, không cần cuộn
- Phải có nút "Bỏ qua" rõ ràng ở mọi bước
- Chữ ≥17px, vùng bấm ≥52px
- Kiểm cả ở cỡ chữ lớn nhất (gốc 20px)
```

---

## Prompt 4 — Màn kết quả, 3 trạng thái

```
Thiết kế màn kết quả kiểm tra (375×812). Vẽ ĐỦ 3 trạng thái cạnh nhau.

Mỗi trạng thái có đúng 4 phần:
1. Mức rủi ro (màu + CHỮ + biểu tượng)
2. 3 LÝ DO — vì sao kết luận vậy
3. 3 VIỆC CẦN LÀM — hành động cụ thể
4. Nguồn cảnh báo (vd "Theo cảnh báo của Bộ Công an…")

BA TRẠNG THÁI — dùng ĐÚNG những chữ này, không được đổi một ký tự:
- ĐỎ:   "Nguy hiểm cao"
- VÀNG: "Nghi ngờ"
- XANH: "Chưa thấy dấu hiệu rủi ro"

⚠️ TUYỆT ĐỐI KHÔNG đổi trạng thái xanh thành "An toàn" hay bất kỳ biến thể nào.
Hệ thống chỉ nói "chưa thấy dấu hiệu trong thông tin bác cung cấp" — nó KHÔNG
hứa an toàn. Hứa sai ở đây là đẩy người ta vào chỗ mất tiền. Ba chuỗi này do
code sở hữu, không phải CSS.

BẮT BUỘC:
- KHÔNG truyền đạt mức rủi ro chỉ bằng màu — người cao tuổi tỉ lệ mù màu và đục
  thuỷ tinh thể cao. Luôn kèm CHỮ + BIỂU TƯỢNG.
- Chữ ≥17px
- Có nút "Nghe đọc kết quả"
- Trạng thái đỏ có thêm nút "Gọi người thân" nổi bật
```

---

## Sau khi có thiết kế — đưa tôi

Ảnh, file, hoặc link. Tôi sẽ:

1. **Đối chiếu ràng buộc** — cỡ chữ, vùng chạm, tương phản, 3 nhãn rủi ro
2. **Nói thẳng chỗ nào không dựng được** hoặc sẽ vỡ khi bật cỡ chữ lớn nhất,
   kèm số đo cụ thể
3. **Dựng thành code thật**, chạy 130 test, đo trên trình duyệt ở 3 cỡ chữ ×
   5 chiều rộng
4. Chỉ báo xong khi có **bằng chứng đo được**
