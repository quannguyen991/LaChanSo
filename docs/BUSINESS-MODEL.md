# Mô hình kinh doanh

> Nguồn: Phần 11 báo cáo sản phẩm v2.

## Nguyên tắc đạo đức không thương lượng

**Toàn bộ luồng cứu người miễn phí vĩnh viễn.**

Không bao giờ dựng tường phí trước một người đang hoảng loạn hoặc vừa mất tiền.
Vừa vô đạo đức, vừa huỷ hoại thương hiệu ngay lập tức nếu bị đưa lên báo.

Cụ thể, những luồng sau **không bao giờ** được đặt sau tường phí:

- Phân tích tình huống và kết quả (`#kiem-tra`, `#tin-nhan-la`)
- Màn hình một câu hỏi (`#khan-cap`)
- Dừng 60 giây và màn hình *Bác đang được bảo vệ* (`#duoc-bao-ve`)
- Gọi người thân, gọi ngân hàng, trợ lý cuộc gọi (`#goi-ngan-hang`)
- Luồng phục hồi sau khi mất tiền (`#vua-chuyen-tien`)
- Phiếu tin cậy

## Nguồn thu

| Nguồn thu | Mô tả | Người trả tiền | Giai đoạn |
|---|---|---|---|
| **Miễn phí (nền tảng)** | Kiểm tra, cảnh báo, cứu hộ, phục hồi, học hỏi | Không ai | Ngay từ đầu |
| **B2B2C — nguồn thu chính** | Ngân hàng, ví điện tử, công ty bảo hiểm nhúng lớp cảnh báo của Khoan Đã trước bước xác nhận giao dịch. Bán bằng giá trị: giảm chi phí tra soát, giảm khủng hoảng truyền thông | Ngân hàng, ví điện tử | Giai đoạn 2 |
| **Gói Người bảo vệ gia đình** | Đồng bộ đa thiết bị, bảng theo dõi cho con, cảnh báo thời gian thực, sao lưu đám mây | **Người con, không phải bố mẹ** | Giai đoạn 2 |
| **Khu vực công và tài trợ** | Đề án chuyển đổi số, quỹ trách nhiệm xã hội, tổ chức phi lợi nhuận | Cơ quan, doanh nghiệp, quỹ | Song song |
| **Đào tạo và nội dung** | Bộ tài liệu tập huấn cho Hội Người cao tuổi, ngân hàng, doanh nghiệp | Tổ chức | Giai đoạn 3 |

Lưu ý cấu trúc: **người trả tiền không phải người được bảo vệ**. Gói trả phí bán
cho người con — người có thu nhập, có động cơ, và đang có cảm giác bất lực vì ở
xa. Người cao tuổi không bao giờ bị hỏi tiền.

## Luận điểm bán hàng cho ngân hàng

Không bán bằng công nghệ. Bán bằng ba con số mà bộ phận quản trị rủi ro của ngân
hàng **đang phải chịu**:

1. Chi phí xử lý mỗi vụ tra soát giao dịch nghi ngờ lừa đảo
2. Tổn thất phải hoàn trả và tổn thất uy tín mỗi khi một vụ việc lên báo
3. **Chi phí tổng đài cho các cuộc gọi hoảng loạn không có thông tin đầy đủ**

Điểm thứ ba là luận điểm **dễ bán nhất** vì nó đo được ngay, không cần chờ dữ
liệu dài hạn — và sản phẩm đã có phần trả lời cho nó.

### Vì sao điểm thứ ba đo được ngay

Màn hình `#goi-ngan-hang` (Trợ lý cuộc gọi ngân hàng) đặt sẵn trước mắt nạn nhân
năm số liệu mà tổng đài luôn hỏi: ngân hàng, số tiền, thời điểm, tài khoản nhận,
mã giao dịch. Người vừa mất tiền không phải nhớ gì cả.

Chỉ số bán hàng: **thời gian trung bình mỗi cuộc gọi tra soát**, đo trước và sau
khi khách hàng dùng Khoan Đã. Đây là con số ngân hàng đã có sẵn trong hệ thống
tổng đài của họ — không cần chúng ta cung cấp gì.

## Đơn vị kinh tế của phần AI

Cần đo và trình bày được:
- Chi phí suy luận trung bình cho **một lần phân tích**
- Chi phí ước tính cho **một người dùng hoạt động trong một tháng**

Ba biện pháp kiểm soát chi phí phải có ngay từ đầu — **cả ba đã có trong mã**:

| Biện pháp | Vị trí |
|---|---|
| Giới hạn kích thước đầu vào: chat 1.000 ký tự, phân tích 5.000 ký tự, tệp 5 MB | `server.js` |
| Giới hạn tần suất theo thiết bị và theo phiên | `server.js` — 90 yêu cầu/phút mỗi IP |
| Bộ luật chạy trước và xử lý được các ca hiển nhiên mà không cần gọi AI | `src/rule-engine.js` — đường dự phòng |

Với `claude-haiku-4-5` (mặc định hiện tại), giá niêm yết là **1 USD/triệu token
đầu vào và 5 USD/triệu token đầu ra**. Một lần phân tích tiêu thụ khoảng 1.500
token đầu vào (lời nhắc hệ thống) cộng nội dung người dùng, và vài trăm token
đầu ra. **Chưa đo trên lưu lượng thật** — cần chạy thật rồi điền vào đây.

## Rủi ro thương mại

| Rủi ro | Mức | Cách giảm thiểu |
|---|---|---|
| Chi phí gọi AI vượt kiểm soát | Trung bình | Ba biện pháp ở trên; đo đơn vị kinh tế trước khi mở rộng |
| Chu kỳ bán hàng ngân hàng dài | Cao | Cần bằng chứng hiệu quả trước — chính là chỉ số Bắc Đẩu |
| Nghĩa vụ pháp lý về dữ liệu cá nhân | Trung bình | Kiến trúc lưu cục bộ thu hẹp phạm vi. Xin ý kiến pháp lý trước khi bật đồng bộ máy chủ và báo cáo cộng đồng |
| Chính sách Zalo thay đổi hoặc không duyệt | Trung bình | Web Share Target là phương án làm được ngay, không phụ thuộc bên thứ ba |
