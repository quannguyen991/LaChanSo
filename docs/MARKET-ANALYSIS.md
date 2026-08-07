# Phân tích cạnh tranh và hào bảo vệ

> Nguồn: Phần 1 và Phần 2 báo cáo sản phẩm v2.

> ## ⚠️ Bắt buộc đọc trước khi dùng tài liệu này
>
> Thị trường công cụ chống lừa đảo tại Việt Nam thay đổi rất nhanh. **Toàn bộ
> thông tin đối thủ dưới đây phải được kiểm chứng lại trực tiếp trên ứng dụng
> và trang chủ của họ trước khi đưa vào bài thuyết trình.**
>
> Không trích dẫn số liệu người dùng hoặc tính năng của đối thủ nếu chưa tự
> kiểm tra. Một con số sai trong lĩnh vực này phá huỷ toàn bộ uy tín.

## 1. Vấn đề thật không nằm ở chỗ nhận biết

Phần lớn nạn nhân cao tuổi, khi được hỏi lại sau sự việc, đều nói rằng họ *"có
thấy hơi lạ"*. Vấn đề không phải họ không nhận ra dấu hiệu. Vấn đề là ba thứ:

1. **Không có thời gian.** Kẻ lừa đảo thiết kế toàn bộ kịch bản quanh việc ép ra
   quyết định trong vài phút.
2. **Bị cô lập.** Yêu cầu giữ bí mật với gia đình là bước bắt buộc trong hầu hết
   kịch bản.
3. **Không biết làm gì tiếp.** Biết là lừa đảo nhưng không biết gọi cho ai, gọi
   số nào, nói gì.

Ba vấn đề này **không giải được bằng một công cụ tra cứu**.

## 2. Danh mục sản phẩm

| | Cách hiểu cũ | Cách định vị của Khoan Đã |
|---|---|---|
| Danh mục | Ứng dụng kiểm tra lừa đảo | Phanh an toàn tài chính cho gia đình |
| Lợi ích bán ra | Phân tích rủi ro bằng AI | 60 giây để gọi cho con, trước khi mất 200 triệu |
| Người quyết định cài | Người cao tuổi | Người con đang lo cho bố mẹ |
| Thời điểm sử dụng | Khi rảnh, khi muốn tra cứu | Khi đang bị thúc ép, tim đập nhanh, có người đang chờ trên điện thoại |

## 3. Bảng so sánh năng lực

**Chưa kiểm chứng lại — xem cảnh báo đầu tài liệu.**

| Năng lực | nTrust | Whoscall | chongluadao.vn | Khoan Đã |
|---|---|---|---|---|
| Tra cứu số điện thoại / link / tài khoản | Có | Có | Có | Có |
| Chặn cuộc gọi ở cấp hệ điều hành | Có (native) | Có (native) | Không | **Không** — cần app native, lộ trình giai đoạn 2 |
| Hiểu chuỗi vụ việc xuyên kênh | Không | Không | Không | Có — *Nhớ cả vụ việc* |
| Vòng tròn gia đình, quy tắc do con cái đặt | Không | Không | Không | Có — **hào bảo vệ chính** |
| Đồng hành qua cuộc gọi ngân hàng sau khi mất tiền | Không | Một chạm tới hotline | Không | Có — *Trợ lý cuộc gọi* mang theo toàn bộ số liệu giao dịch |
| Giải thích được vì sao ra kết luận | Hạn chế | Hạn chế | Hạn chế | Có — *Phiếu tin cậy* |
| Hoạt động khi đối tượng chưa có trong danh sách đen | Yếu | Yếu | Yếu | Có — phân tích hành vi thao túng |

## 4. Khoảng trống thị trường

Toàn bộ đối thủ đều là **công cụ tra cứu dựa trên danh sách đen**. Mô hình đó có
một điểm mù cấu trúc: kẻ lừa đảo đổi số điện thoại, đổi tên miền, đổi tài khoản
nhận tiền liên tục. Một đối tượng mới tinh sẽ luôn cho kết quả *"không tìm thấy"*.

Khoan Đã **không tra đối tượng**. Khoan Đã đọc **hành vi**: gây sợ hãi, ép thời
gian, yêu cầu giữ bí mật với gia đình, yêu cầu OTP, yêu cầu chuyển vào "tài
khoản an toàn". Những hành vi này không đổi được, vì chúng **chính là** kịch bản
lừa đảo.

Cụ thể trong mã nguồn: `src/critical-override.js` mã hoá sáu tổ hợp hành vi, và
hai trong số đó kích hoạt từ chính văn bản, không cần bất kỳ danh sách đen nào.

## 5. Hào bảo vệ, xếp theo độ bền

1. **Sơ đồ gia đình (bền nhất).** Khi một gia đình đã thiết lập vòng tròn người
   thân, đặt mã gia đình và cấu hình quy tắc, chi phí chuyển sang sản phẩm khác
   là rất cao. Đối thủ không có gì tương đương.
2. **Bộ nhớ vụ việc.** Lịch sử vụ việc nằm trong sản phẩm. Càng dùng lâu, khả
   năng nối tình huống mới vào vụ việc cũ càng chính xác.
3. **Bộ dữ liệu chuỗi lừa đảo Việt Nam (dài hạn).** Có giá trị hơn danh sách
   đen, **nhưng hiện chưa có dữ liệu**. Không trình bày đây là hào bảo vệ hiện
   hữu — trình bày là hệ quả của việc vận hành, sẽ hình thành sau 6–12 tháng.

## 6. Thông điệp theo từng đối tượng

| Đối tượng | Thông điệp |
|---|---|
| Người cao tuổi | *"Khi có ai đó giục bác quyết định ngay, bác bấm vào đây. Khoan Đã sẽ gọi cho con bác."* |
| Người con (30–50) | *"Bạn không thể ngồi cạnh bố mẹ 24 giờ. Nhưng bạn có thể đặt sẵn một quy tắc — và Khoan Đã sẽ nhắc bố mẹ bằng chính tên bạn."* |
| Ngân hàng / đối tác | *"Mỗi vụ tra soát thành công là chi phí. Mỗi bài báo về khách hàng bị lừa là khủng hoảng truyền thông. Chúng tôi can thiệp trước khi lệnh chuyển tiền được bấm."* |
| Ban giám khảo | *"AI trong sản phẩm này không được phép quyết định mức rủi ro. Nó chỉ trích xuất tín hiệu. Quyết định thuộc về một bộ luật cố định, kiểm thử được, giải thích được cho người dùng 70 tuổi."* |

## 7. Rủi ro cạnh tranh

| Rủi ro | Mức | Cách giảm thiểu |
|---|---|---|
| Đối thủ lớn sao chép tính năng | Thấp | Hào bảo vệ là sơ đồ gia đình và bộ nhớ vụ việc — cần thời gian tích luỹ, không sao chép nhanh được |
| Bị hiểu là hứa quá khả năng | Trung bình | Chủ động trình bày `docs/HONEST-BOUNDARIES.md` ngay trong bài thuyết trình |
| Người dùng không mở ứng dụng đúng lúc bị lừa | **Cao** | Chia sẻ là xong + Zalo OA + Màn hình một câu hỏi + mẹo hằng ngày giữ tên thương hiệu trong đầu |
| Người cao tuổi không tự cài được | **Cao** | Luồng con cài cho bố mẹ, quét QR một lần |
