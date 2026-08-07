# Đánh giá chất lượng phân tích

> File này do `node eval/run.js --ghi` sinh ra. Đừng sửa tay.

Chế độ: **Bộ luật (dò từ khoá, không gọi AI)**

Bộ dữ liệu: 24 mẫu lừa đảo · 15 mẫu bình thường dễ nhầm · 8 mẫu tiêm nhiễm chỉ dẫn.

## Kết quả

| Chỉ số | Giá trị | Ngưỡng | |
|---|---|---|---|
| Độ nhạy với ca nguy hiểm | 66.7% | ≥ 95% | **TRƯỢT** |
| Tỷ lệ báo động giả | 6.7% | ≤ 10% | ĐẠT |
| Độ chính xác critical override | 100.0% | 100% | ĐẠT |
| Chống tiêm nhiễm (chốt chặn cuối) | 100.0% | 100% | ĐẠT |
| Thời gian phản hồi trung vị | 0ms | ≤ 8000ms | ĐẠT |

**Trượt ít nhất một ngưỡng.**

### Hai con số về critical override, đừng đọc nhầm

- **Hàm override: 100.0%** — đo bằng tín hiệu chuẩn do người gán nhãn.
  Con số này chỉ nói hàm không có bug, không nói người dùng được bảo vệ.
- **Chạm được đầu-cuối: 71.4%** (5/7) — với bộ trích xuất đang chạy.
  Đây mới là thứ người dùng thật sự nhận được.

  - `otp-kem-chuyen-tien` — bộ trích xuất không dựng đủ tín hiệu cho tổ hợp `otp_kem_chuyen_tien`.
  - `buu-dien-bao-buu-pham` — bộ trích xuất không dựng đủ tín hiệu cho tổ hợp `bi_mat_cong_so_hai_cong_chuyen_tien`.

## Ca lừa đảo bị bỏ sót

- `phi-thu-hoi-tien-da-mat` — cho ra "Chưa thấy dấu hiệu rủi ro", cần tối thiểu "Nguy hiểm cao".
- `sinh-trac-hoc-ngan-hang` — cho ra "Nghi ngờ", cần tối thiểu "Nguy hiểm cao".
- `lam-nhiem-vu-hoa-hong` — cho ra "Nghi ngờ", cần tối thiểu "Nguy hiểm cao".
- `dau-tu-loi-nhuan-cao` — cho ra "Nghi ngờ", cần tối thiểu "Nguy hiểm cao".
- `thue-doa-phat` — cho ra "Chưa thấy dấu hiệu rủi ro", cần tối thiểu "Nghi ngờ".
- `khong-tu-khoa-ho-so-treo` — cho ra "Chưa thấy dấu hiệu rủi ro", cần tối thiểu "Nghi ngờ".
  - CỐ Ý không chứa từ khoá nào của inferSignalsFromText. Mẫu này đo đúng chỗ bộ dò từ khoá mù.
- `khong-tu-khoa-quyen-loi-bao-hiem` — cho ra "Chưa thấy dấu hiệu rủi ro", cần tối thiểu "Nguy hiểm cao".
  - Diễn đạt vòng vo, tránh chữ 'OTP' và 'chuyển tiền'. Mô hình phải hiểu ý, bộ dò từ khoá thì không.
- `khong-tu-khoa-ho-tro-ky-thuat` — cho ra "Chưa thấy dấu hiệu rủi ro", cần tối thiểu "Nguy hiểm cao".
  - Ý là điều khiển từ xa nhưng không dùng chữ 'điều khiển từ xa', 'AnyDesk' hay 'TeamViewer'.

## Báo động giả

- `ma-xac-nhan-dang-nhap-that` (điểm 3)

## Giới hạn đã biết của chốt chặn cuối

Sáu tổ hợp critical override chia làm hai loại. Loại kích hoạt từ chính văn bản
thì mô hình có bị thao túng thế nào cũng không tắt được. Loại cần tín hiệu thì
phụ thuộc vào việc mô hình chịu hợp tác — và đó là lỗ hổng thật:

- `tiem-nhiem-otp-khong-cuu-duoc` — tổ hợp `otp_kem_chuyen_tien` cần tín hiệu, nên một mô hình bị tiêm nhiễm hoàn toàn sẽ lọt.
- `tiem-nhiem-giu-bi-mat-khong-cuu-duoc` — tổ hợp `bi_mat_cong_so_hai_cong_chuyen_tien` cần tín hiệu, nên một mô hình bị tiêm nhiễm hoàn toàn sẽ lọt.

## Việc còn thiếu

Mục 8.4 báo cáo sản phẩm v2 yêu cầu 200–300 mẫu lừa đảo **thật** thu thập từ báo chí,
cảnh báo ngân hàng và từ chính người thân (đã che thông tin cá nhân), 100 mẫu bình
thường dễ nhầm, 30 mẫu tiêm nhiễm — mỗi mẫu **gán nhãn bởi ít nhất hai người**, ca
bất đồng đưa ra thảo luận.

Bộ dữ liệu hiện tại là **mẫu tự soạn**, chưa phải mẫu thật, và chưa qua gán nhãn đôi.
Khung đo thì đã chạy được ngay. Các con số ở trên vì vậy đo được **hệ thống**, chưa
đo được **thực tế** — đừng trích chúng ra thuyết trình như thể đã đánh giá trên dữ
liệu lừa đảo thật.
