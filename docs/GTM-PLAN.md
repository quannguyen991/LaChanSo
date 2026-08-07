# Chiến lược ra thị trường

> Nguồn: Phần 10 và Phần 3 báo cáo sản phẩm v2.

## Điểm sai lớn nhất phải sửa trước

**Người dùng không phải người quyết định cài.**

| | Người dùng | Người quyết định cài |
|---|---|---|
| Là ai | Cha mẹ, ông bà, 60+ | Con cái, 30–50 tuổi |
| Động cơ | Sợ bị lừa, nhưng cũng sợ bị coi là lẩm cẩm | Lo cho bố mẹ, có cảm giác bất lực vì ở xa |
| Hành vi | Dùng Zalo hằng ngày, ngại cài app mới, ngại làm phiền con | Cài giúp, cấu hình giúp, là người nhận cảnh báo |
| Hệ quả thiết kế | Giao diện phải giả định người dùng đang hoảng loạn và không đọc chữ nhỏ | Phải có luồng "cài hộ" và bảng theo dõi dành riêng |

Toàn bộ chiến lược phân phối bên dưới xuất phát từ bảng này. Mọi kênh nhắm vào
người con, trừ kênh mặt đất.

## Kênh phân phối theo thứ tự ưu tiên

| # | Kênh | Vì sao | Ràng buộc |
|---|---|---|---|
| 1 | **Zalo OA và Zalo Mini App** | Không cần cài đặt. Người cao tuổi đã dùng Zalo hằng ngày. Chuyển tiếp tin nhắn nghi ngờ ngay trong ứng dụng đang bị lừa | Cần đăng ký, thường yêu cầu pháp nhân. Tin nhắn chủ động có hạn mức và chi phí. Phải kiểm tra chính sách hiện hành |
| 2 | **Luồng con cài cho bố mẹ** | Người quyết định cài là người con, không phải người dùng | Cần thiết kế riêng, đã đưa vào P0 |
| 3 | **Vòng tròn gia đình** | Mỗi người dùng mời tới 5 người thân — vòng lặp lan truyền có sẵn trong sản phẩm | Phải đo được hệ số lan truyền, không chỉ làm cho có |
| 4 | **Video ngắn trên mạng xã hội** | Nhóm 30–50 tuổi là người quyết định cài. Nội dung: cuộc gọi lừa đảo thật, chèn màn hình đếm ngược 60 giây | Cần sản xuất đều, tối thiểu 2 video/tuần |
| 5 | **Kênh mặt đất** | Hội Người cao tuổi, tổ dân phố, chi hội phụ nữ. Thẻ sáu câu từ chối in được | Chi phí thấp, tạo ảnh truyền thông tốt, khó đo lường |
| 6 | **Đối tác ngân hàng** | Bên chịu thiệt hại và áp lực truyền thông lớn nhất. Có ngân sách chống gian lận và ngân sách trách nhiệm xã hội | Chu kỳ bán hàng dài, cần bằng chứng hiệu quả trước |

## Vòng lặp tăng trưởng

```
   Người con lo cho bố mẹ
            │
            ▼  cài hộ, cấu hình hộ (kênh 2)
   Bố mẹ dùng Khoan Đã
            │
            ▼  thêm 5 người thân vào vòng tròn (kênh 3)
   Anh chị em, cháu cùng vào
            │
            ▼  nhận mẹo hằng ngày, bấm "Gửi cho người thân"
   Nội dung lan vào nhóm Zalo gia đình khác
            │
            ▼
   Gia đình mới biết đến sản phẩm
```

Điểm mấu chốt: **tin từ con cái có độ tin cậy cao hơn hẳn tin từ thương hiệu**,
và mỗi lần chia sẻ là một lần tiếp thị miễn phí trong một nhóm chat sẵn có.

Phiếu tin cậy (`#kiem-tra` → nút *Gửi cho người thân*) là hiện thân đầu tiên của
vòng lặp này trong sản phẩm — vừa là bằng chứng, vừa là kênh marketing chi phí
bằng không.

## Nguyên tắc nội dung

1. **Kể chuyện một người cụ thể, không kể tính năng.** Mọi nội dung đều bắt đầu
   bằng một tình huống có tên, có tuổi, có số tiền.
2. **Không dùng giọng doạ nạt.** Nhóm mục tiêu đã sợ sẵn; doạ thêm chỉ khiến họ
   né tránh chủ đề.
3. **Không bao giờ ám chỉ nạn nhân là người thiếu hiểu biết.** Thông điệp chuẩn:
   *"Lừa đảo không thắng vì nạn nhân ngu. Nó thắng vì nạn nhân không có 60 giây."*
4. **Mọi con số công bố phải truy được nguồn.** Một con số sai trong lĩnh vực này
   phá huỷ toàn bộ uy tín.

> ⚠️ Quy tắc 4 áp dụng cho cả số liệu của chính chúng ta. Con số trong
> `docs/AI-EVALUATION.md` hiện đo trên **mẫu tự soạn**, chưa phải mẫu thật —
> không được trích ra ngoài như thể đã đánh giá trên dữ liệu lừa đảo thật.

## Giải quyết rủi ro lớn nhất: tần suất dùng tự nhiên rất thấp

Người ta bị lừa mỗi năm một lần, nên ứng dụng bị quên trong 364 ngày còn lại.

**Mẹo an toàn hằng ngày** là câu trả lời:
- Dưới 60 chữ, một thủ đoạn, một câu cần nhớ, một nút bấm
- Tần suất 3–5 lần một tuần, **không phải hằng ngày** — gửi mỗi ngày sẽ bị tắt
  thông báo
- Nút *Gửi cho người thân*: người con chia sẻ mẹo vào nhóm Zalo gia đình

Hai mục tiêu thật: **giữ tên thương hiệu trong đầu** để đúng lúc bị lừa người
dùng nhớ ra, và **tiêm vaccine** — mỗi thủ đoạn đọc trước là một lần kẻ lừa đảo
mất yếu tố bất ngờ.

## Bảng rủi ro triển khai

| Rủi ro | Mức | Cách giảm thiểu |
|---|---|---|
| Người dùng không mở ứng dụng đúng lúc bị lừa | Cao | Chia sẻ là xong + Zalo OA + Màn hình một câu hỏi + mẹo hằng ngày |
| Người cao tuổi không tự cài được | Cao | Luồng con cài cho bố mẹ, quét QR một lần. Kênh Zalo không cần cài đặt |
| Báo động giả làm mất niềm tin | Cao | Critical override hẹp và xác định. Luôn có lối thoát. Ghi nhận mỗi lần bấm để hiệu chỉnh ngưỡng |
| Tần suất dùng tự nhiên rất thấp | Cao | Mẹo hằng ngày, bảng theo dõi hằng tuần cho người con, nội dung học hỏi |
| Số tổng đài trong danh bạ bị sai | Cao | Quy trình rà soát định kỳ, ghi nguồn và ngày, nút báo số sai, **không lấy số từ nội dung người dùng gửi** |
| Phạm vi quá lớn, demo hỏng | Cao | Ba luồng làm hoàn hảo, phần còn lại đưa vào slide lộ trình. Đóng băng tính năng trước ngày thi |

## Trạng thái triển khai các kênh

| Kênh | Trạng thái |
|---|---|
| Màn hình một câu hỏi (`start_url`) | **Đã có** |
| Vòng tròn gia đình (liên hệ, vai trò, mã gia đình) | Đã có phần cơ bản |
| Phiếu tin cậy chia sẻ được | **Đã có** |
| Luồng con cài cho bố mẹ + QR | **Chưa làm** |
| Mẹo an toàn hằng ngày | Chưa làm |
| Zalo OA / Mini App | Chưa làm — P2, cần pháp nhân |
| Thẻ sáu câu từ chối in được | Chưa làm — P2 |
