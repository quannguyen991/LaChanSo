# Chỉ số

> Nguồn: Phần 12 báo cáo sản phẩm v2.

## Vì sao không dùng số người dùng hoạt động hằng ngày

Một sản phẩm an toàn tốt **không phải** là sản phẩm được mở mỗi ngày. Nếu người
dùng mở Khoan Đã hằng ngày, điều đó nghĩa là họ đang bị lừa hằng ngày.

Đo bằng chỉ số tương tác sẽ dẫn tới các quyết định sản phẩm sai — thêm thông
báo, thêm trò chơi hoá, thêm thứ gây nghiện. Với nhóm người dùng này, đó là làm
hại.

## Chỉ số Bắc Đẩu

**Số lần người dùng dừng lại trước một quyết định nguy hiểm**, và
**số tiền ước tính đã được ngăn chặn (VNĐ)**.

Chỉ số thứ hai vừa là thước đo vận hành, vừa là vũ khí truyền thông, vừa là luận
điểm bán hàng cho đối tác ngân hàng.

**Cách đo:** đếm số lần vào mức can thiệp từ Cao trở lên rồi người dùng chọn
không tiếp tục; nhân với số tiền đã khai trong luồng chuyển tiền.

## Bảng chỉ số đầy đủ

| Tầng | Chỉ số | Cách đo | Trạng thái |
|---|---|---|---|
| **Bắc Đẩu** | Số lần dừng lại trước quyết định nguy hiểm · Số tiền ước tính đã ngăn chặn | Đếm lần vào mức Cao trở lên rồi dừng; nhân số tiền đã khai | Chưa nối |
| **Hiệu quả** | Tỷ lệ chuyển từ cảnh báo sang gọi người thân · Tỷ lệ hoàn thành danh sách phục hồi | Sự kiện trong ứng dụng, ẩn danh | Chưa nối |
| **Tin cậy** | Tỷ lệ bấm "Tôi ổn, không có gì" · Tỷ lệ báo số tổng đài sai | Chỉ số báo động giả — càng thấp càng tốt | **Đã có** — `khoan-da:false-alarm-log` |
| **Tăng trưởng** | Số người thân trung bình trong một vòng tròn · Tỷ lệ mời thành công | Hệ số lan truyền của vòng tròn gia đình | Chưa nối |
| **Giữ chân** | Tỷ lệ còn dùng sau 30 và 90 ngày · Tỷ lệ mở mẹo hằng ngày | Chỉ số duy nhất cần theo dõi liên tục | Chưa nối |
| **Chất lượng AI** | Độ nhạy · Tỷ lệ báo động giả · Thời gian phản hồi | Chạy lại bộ dữ liệu vàng mỗi lần thay đổi | **Đã có** — `npm run eval` |

## Chỉ số chất lượng AI — đã đo được

Ngưỡng chấp nhận theo mục 8.4:

| Chỉ số | Ngưỡng | Vì sao |
|---|---|---|
| Độ nhạy với ca nguy hiểm | ≥ 95% | Bỏ sót một ca là mất tiền thật |
| Tỷ lệ báo động giả | ≤ 10% | Báo động giả làm mất niềm tin nhanh hơn bỏ sót |
| Độ chính xác critical override | 100% | Đây là hàm xác định, sai là lỗi lập trình |
| Chống tiêm nhiễm | 100% | Bộ luật phải là chốt chặn cuối |
| Thời gian phản hồi | ≤ 8 giây | Người đang bị thúc ép không chờ được lâu |

Chạy `npm run eval`; kết quả mới nhất trong `docs/AI-EVALUATION.md`.
Bộ chạy trả mã thoát khác 0 khi trượt ngưỡng, nên gắn được vào CI.

**Chạy lại sau mỗi lần đổi lời nhắc, đổi model, hoặc đổi ngưỡng bộ luật.**

## Đo lường trong kiến trúc lưu cục bộ

Kiến trúc lưu cục bộ và nhu cầu đo lường mâu thuẫn nhau. Cách giải quyết:

1. **Chỉ thu thập sự kiện đếm được, ẩn danh, không kèm nội dung**: *"đã vào mức
   Nghiêm trọng"*, *"đã bấm gọi người thân"*, *"đã bấm tôi ổn"*.
2. **Xin phép rõ ràng trong onboarding**, tắt được bất cứ lúc nào, và ứng dụng
   vẫn chạy đầy đủ khi tắt.
3. **Số tiền chỉ lưu ở dạng khoảng giá trị**, không lưu số chính xác.
4. **Không bao giờ gửi kèm** số điện thoại, số tài khoản, tên người hoặc nội
   dung tin nhắn.

Danh sách không bao giờ ghi nhật ký (báo cáo 9.3): mã OTP · mật khẩu · mã PIN ·
mã truy cập · nội dung tệp đầy đủ · số tài khoản đầy đủ. Áp dụng cho cả nhật ký
máy chủ, công cụ theo dõi lỗi và công cụ phân tích hành vi.

## Vòng lặp cải tiến từ chính điểm yếu

Nút **"Tôi ổn, không có gì nguy hiểm"** ở màn hình bảo vệ vừa là lối thoát bắt
buộc (báo cáo 4.2), vừa là nguồn dữ liệu báo động giả.

Mỗi lần bấm ghi lại `{ thời điểm, tổ hợp override đã kích hoạt, mức rủi ro }`
vào `khoan-da:false-alarm-log` — lưu cục bộ, không nội dung. Dùng để hiệu chỉnh
ngưỡng bộ luật. Điểm yếu trở thành vòng lặp cải tiến.

## Chỉ số chưa nối — cần làm gì

Năm tầng chỉ số còn lại cần một lớp thu thập sự kiện ẩn danh chưa tồn tại. Trước
khi xây, phải có:

- Màn hình xin phép trong onboarding, tắt được
- Danh sách trắng tên sự kiện — không cho phép gửi sự kiện tuỳ ý
- Kiểm tra tự động rằng payload không chứa nội dung người dùng
