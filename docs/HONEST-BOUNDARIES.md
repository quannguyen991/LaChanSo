# Ranh giới trung thực

> Nguồn: Phần 7 báo cáo sản phẩm v2.
>
> Kỷ luật không tuyên bố quá khả năng chỉ có giá trị nếu được trình bày **chủ
> động**. Để ban giám khảo tự phát hiện thì thành điểm trừ; chủ động đưa ra thì
> thành bằng chứng của sự nghiêm túc kỹ thuật.
>
> Câu nên nói trên sân khấu: *"Chúng em không hứa chặn được cuộc gọi lừa đảo.
> Chúng em hứa bác sẽ không chuyển tiền trong 60 giây tới."*

## Web app làm được gì, không làm được gì

| Khả năng | PWA hiện tại | Ghi chú và lộ trình |
|---|---|---|
| Nhận nội dung qua bảng Chia sẻ của hệ điều hành | Android: có · iPhone: không | Bù bằng Zalo OA cho iPhone |
| Mở thẳng vào màn hình khẩn cấp từ biểu tượng | **Có** | Chỉ là cấu hình `start_url`. Đã làm — `/#khan-cap` |
| Menu nhấn giữ biểu tượng | Android: có · iPhone: không | Đã khai `shortcuts` trong manifest; iOS bỏ qua không lỗi. Không đưa vào demo |
| Gọi điện từ trong ứng dụng | **Có** | Qua liên kết `tel:` — chạy trên mọi nền tảng |
| Đọc thành tiếng, nhận dạng giọng nói | Có | Phụ thuộc trình duyệt, phải có trạng thái dự phòng |
| Thông báo đẩy | Android: có · iPhone: cần thêm vào màn hình chính | Phải xử lý khi người dùng từ chối quyền |
| Chụp màn hình ứng dụng khác | **Không** | Đã bỏ khỏi mô tả tính năng |
| Đọc tin nhắn SMS, nhật ký cuộc gọi | **Không** | Cần app native và quyền hệ điều hành |
| Chặn cuộc gọi, hiện cảnh báo khi chuông reo | **Không** | Lộ trình giai đoạn 2 — app Android native |
| Chặn hoặc trì hoãn giao dịch ngân hàng | **Không** | Lộ trình giai đoạn 2 — cần API ngân hàng, sản phẩm B2B2C |
| Quét mã độc, gỡ ứng dụng, thu hồi quyền hệ thống | **Không** | Chỉ cung cấp hướng dẫn kiểm tra thủ công có danh sách kiểm |
| Phát hiện deepfake giọng nói chắc chắn | **Không** | Thay bằng cơ chế mã gia đình — hiệu quả hơn và trung thực hơn |

## Quy tắc ngôn ngữ bắt buộc

Đây không phải sở thích thẩm mỹ. Mỗi dòng dưới đây tương ứng một cách sản phẩm
có thể làm hại người dùng.

1. **Không dùng nhãn "An toàn".** Dùng `Chưa thấy dấu hiệu rủi ro`.
   Hệ thống chỉ nói *chưa thấy dấu hiệu trong thông tin bác cung cấp* — nó
   **không hứa** an toàn. Ba nhãn là bất biến, khoá trong `src/rule-engine.js`.
2. **Không hứa lấy lại được tiền.** Dùng *"Đây là các bước làm tăng khả năng xử lý"*.
3. **Không dùng "Hoàn thiện 100%"** nếu còn hạng mục chưa triển khai.
4. **Không ghi "đã gửi cho người thân"** nếu mới chỉ mở bảng chia sẻ của hệ
   điều hành — ứng dụng không biết người dùng có bấm gửi hay không.
5. **Không hiển thị số lượng báo cáo cộng đồng giả**, không hiển thị cảnh báo
   không có nguồn.

### Một quy tắc thứ sáu, học được ngày 7/8/2026

**Không được khẳng định một dấu hiệu cụ thể là vắng mặt.**

Bản trước độn câu *"Chưa thấy lời đe doạ, ép giữ bí mật hoặc xin mã OTP."* vào
mỗi khi chưa đủ ba lý do. Gửi lên câu *"Chị đừng báo cho ai trong nhà nhé"* —
một yêu cầu giữ bí mật rành rành — hệ thống trả về đúng câu trên. Nó không chỉ
bỏ sót, nó **chủ động phủ nhận** dấu hiệu đang nằm trong nội dung.

Nay các câu độn chỉ nói về thứ **hệ thống nhận ra**, không nói về thứ **có hay
không có trong đời**, và chỉ xuất hiện khi không có dấu hiệu thật nào.
Hàng rào: `test/no-false-reassurance.test.js`.

## Giới hạn của chốt chặn cuối

Sáu tổ hợp critical override chia làm hai loại:

- **Hai tổ hợp kích hoạt từ chính văn bản** (`tai_khoan_an_toan`,
  `dong_phi_de_lay_lai_tien`). Mô hình có bị tiêm nhiễm thế nào cũng không tắt
  được — đây là chốt chặn cuối thật sự.
- **Bốn tổ hợp cần tín hiệu từ mô hình.** Nếu mô hình bị thao túng hoàn toàn,
  lớp xác định **không cứu được**.

Con số này được `npm run eval` đếm và in ra mỗi lần chạy, không giấu.

## Ba câu hỏi chắc chắn sẽ bị hỏi

**"Có chặn được cuộc gọi không?"**
> Không. Web app không làm được, và chúng em không giả lập điều đó. Chặn cuộc
> gọi cần ứng dụng Android native và quyền hệ điều hành — đó là giai đoạn 2.
> Cái chúng em làm được ngay hôm nay là can thiệp vào phút người dùng sắp bấm
> nút chuyển tiền.

**"Khác nTrust hay Whoscall chỗ nào?"**
> Họ tra cứu đối tượng. Đối tượng đổi số, đổi tên miền, đổi tài khoản mỗi ngày.
> Chúng em đọc hành vi thao túng — thứ không đổi được vì nó chính là kịch bản
> lừa đảo. Và chúng em có sơ đồ gia đình, thứ không ai có.

**"AI sai thì sao?"**
> AI không được phép quyết định mức rủi ro. Nó chỉ trích xuất tín hiệu. Quyết
> định do một bộ luật cố định, có unit test đầy đủ. Kể cả khi AI bị tiêm nhiễm
> chỉ dẫn và báo an toàn, các tổ hợp critical override vẫn kích hoạt.
> Số liệu đánh giá: `docs/AI-EVALUATION.md`.

## Điều báo cáo chưa nói mà mã nguồn nói

- **Bộ dữ liệu đánh giá hiện là mẫu tự soạn**, chưa phải 400 mẫu thật đã gán
  nhãn đôi như mục 8.4 yêu cầu. Xem `docs/AI-EVALUATION.md`.
- **Chưa có danh bạ hotline ngân hàng dựng sẵn.** Trợ lý cuộc gọi dùng số người
  dùng tự lưu. Dựng danh bạ mà không có quy trình rà soát định kỳ là tạo ra
  đúng kịch bản hỏng tệ nhất của sản phẩm (báo cáo 9.6).
