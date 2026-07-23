# Đối chiếu tài liệu Khoan Đã

Tài liệu này đối chiếu bản tóm tắt sản phẩm được cung cấp ngày 2026-07-22 với
MVP Web/PWA hiện tại. Những phần cần tài khoản, backend, quyền hệ điều hành
hoặc tích hợp đối tác không được giả lập bằng UI tĩnh.

## Đã có

- Nhập tình huống bằng văn bản, giọng nói và ảnh; Gemini chỉ trích xuất tín hiệu.
- Kết quả Xanh - Vàng - Đỏ với lý do, hành động, nguồn cảnh báo và đọc thành tiếng.
- Bản đồ chiến thuật thao túng trong kết quả: giả danh quyền lực, tạo sợ hãi,
  thúc ép thời gian, cô lập/giữ bí mật, chiếm quyền thiết bị, dẫn dụ lợi ích,
  ép giao dịch và lợi dụng tình cảm gia đình.
- Dừng thông minh, đếm ngược, gọi người thân/ngân hàng và chụp bằng chứng.
- Chế độ kết thúc cuộc gọi với câu nói sẵn, đọc thành tiếng, gọi hỗ trợ,
  lưu bằng chứng và nối sang Vụ việc.
- Kiểm tra trước khi chuyển tiền, Lá chắn link/QR, Scam Journey, lịch sử,
  nhật ký bằng chứng, trợ lý cứu hộ sau chuyển tiền và Lá chắn phục hồi 72 giờ.
- Bộ câu hỏi xác minh, sổ liên hệ cục bộ tối đa 5 người, mật khẩu gia đình,
  Trung tâm quyền riêng tư và trợ lý chuẩn bị báo cáo.

## Có nhưng chỉ ở mức cục bộ

- Sổ liên hệ và mật khẩu gia đình chỉ lưu trên trình duyệt hiện tại.
- Checklist, lịch sử, bằng chứng và chế độ phục hồi chỉ hoạt động khi mở ứng dụng.
- Chưa có gửi cảnh báo, xác nhận hoặc phân quyền từ xa cho người thân.

## Chưa triển khai, cần hạ tầng thật

- Family Circle nhiều người với tài khoản, consent, phân quyền và đồng bộ.
- Chế độ hai người xác nhận giao dịch có xác nhận từ thiết bị người thân.
- Hotline được quản trị tập trung, cập nhật từ máy chủ hoặc CMS.
- Kiểm tra an toàn thiết bị tự động (Accessibility, quản trị thiết bị, SMS,
  thông báo, ứng dụng điều khiển từ xa).
- Vaccine lừa đảo, bài học cá nhân hóa và radar chiến dịch quy mô lớn.
- Android Call Shield, share sheet, notification và can thiệp khi điện thoại reo.
- Backend tài khoản, mã hóa lưu trữ, audit log, notification và đồng bộ sự việc.
- Phát hiện deepfake tuyệt đối, tự động khóa giao dịch hoặc tự động gửi báo cáo.

## Nguyên tắc an toàn

Ứng dụng chỉ nói “chưa thấy dấu hiệu” khi dữ liệu hiện có chưa cho thấy tín hiệu
rõ ràng. Ứng dụng không khẳng định một tài khoản chắc chắn là lừa đảo, không tự
khóa ngân hàng và không gửi dữ liệu cho người thân nếu chưa có đồng ý rõ ràng.
