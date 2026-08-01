# Build lại Khoan Đã trong 24 giờ

Tài liệu này mô tả đầy đủ sản phẩm Khoan Đã để một nhóm nhỏ hoặc Codex có thể xây dựng lại ứng dụng trong 24 giờ. Mục tiêu là tạo một bản web hoạt động được, responsive, có luồng kiểm tra lừa đảo, hỗ trợ khẩn cấp, lưu vụ việc, học hỏi và quyền riêng tư. Tài liệu ưu tiên khả năng hoàn thành, kiểm thử và triển khai hơn số lượng hiệu ứng trang trí.

## Kế hoạch nội dung

- **Loại tài liệu**: Reference kết hợp implementation brief
- **Mục tiêu**: Xây dựng và triển khai một bản Khoan Đã mới có đủ luồng quan trọng trong 24 giờ
- **Đối tượng**: Lập trình viên, nhà thiết kế sản phẩm và coding agent
- **Phạm vi**: Web desktop và web mobile, API nội bộ, AI có dự phòng, dữ liệu local-first, Progressive Web App (PWA)
- **Ngoài phạm vi 24 giờ**: Đồng bộ đa thiết bị hoàn chỉnh, cơ sở dữ liệu báo cáo cộng đồng quy mô lớn, xác thực danh tính thật, gọi điện thay người dùng và tự động gửi báo cáo cho cơ quan chức năng

## 1. Tóm tắt sản phẩm

Khoan Đã là ứng dụng hỗ trợ người lớn tuổi dừng lại và xác minh trước khi chuyển tiền, đọc mã xác nhận, cài ứng dụng hoặc bấm đường link lạ. Ứng dụng không thay ngân hàng, công an hoặc cơ quan nhà nước. Ứng dụng giải thích dấu hiệu rủi ro, đề xuất hành động an toàn và kết nối người dùng với người thân hoặc đầu mối chính thức.

Sản phẩm phải hoạt động theo bốn nguyên tắc:

- Không khẳng định một tình huống “an toàn tuyệt đối”
- Không để mô hình AI tự quyết định mức rủi ro hoặc tự tạo nguồn
- Không tự mở link, tự gọi điện, tự gửi dữ liệu hoặc tự chuyển người dùng sang ứng dụng khác
- Không lưu tệp tải lên sau khi phân tích

## 2. Đối tượng sử dụng

### Người dùng chính

Người từ 55 tuổi trở lên, có thể ít quen với công nghệ, đang gặp cuộc gọi, tin nhắn, đường link hoặc yêu cầu chuyển tiền đáng ngờ.

### Người dùng hỗ trợ

Con cháu hoặc người thân được người dùng lưu vào danh sách tin cậy. Người thân chỉ nhận nội dung khi người dùng chủ động gọi, nhắn hoặc chia sẻ.

### Yêu cầu ngôn ngữ

- Dùng tiếng Việt rõ ràng, câu ngắn và không đổ lỗi
- Xưng hô “bác” và “cháu” trong trợ lý
- Tránh thuật ngữ kỹ thuật nếu không có giải thích
- Dùng “Chưa thấy dấu hiệu rủi ro” thay cho “An toàn”
- Khi có nguy hiểm, dùng động từ trực tiếp: “Dừng lại”, “Không chuyển tiền”, “Không đọc OTP”

## 3. Phạm vi bắt buộc trong 24 giờ

### P0: Phải hoàn thành trước khi triển khai

- Shell responsive riêng cho desktop và mobile
- Onboarding 5 bước
- Trang chủ với nhập văn bản, giọng nói và tệp
- Trung tâm kiểm tra với 4 luồng: cuộc gọi, tin nhắn, link/QR và chuyển tiền
- Rule engine xác định mức rủi ro
- Kết quả có lý do, hành động, giới hạn và nguồn tĩnh
- Chế độ cảnh báo 60 giây
- Danh sách vụ việc và dòng thời gian
- Hồ sơ người thân tin cậy
- Phần Học hỏi có bài học tương tác
- Phần Cảnh báo gần đây
- Đăng nhập và tạo tài khoản ở mức demo local-first
- Quyền riêng tư, xuất dữ liệu và xóa dữ liệu
- PWA, test tự động và triển khai Vercel

### P1: Hoàn thành sau P0 nếu còn thời gian

- Trung tâm bằng chứng
- Trợ lý tạo báo cáo
- Checklist sau khi đã chuyển tiền
- Chế độ bảo vệ phục hồi 72 giờ
- Danh bạ hỗ trợ có phiên bản và ngày rà soát
- Text-to-Speech (TTS) cho kết quả và bài học
- Chat hỗ trợ dạng widget
- Sao lưu mã hóa bằng mật khẩu

### P2: Không chặn phát hành 24 giờ

- Đồng bộ tài khoản đa thiết bị
- Push notification thật
- Dashboard quản trị tin cảnh báo
- Provider uy tín số điện thoại thật
- Hệ thống báo cáo cộng đồng có kiểm duyệt
- Phân quyền người thân ở backend

## 4. Kiến trúc đề xuất

### Công nghệ

- **Frontend và backend**: Next.js App Router với TypeScript
- **UI**: CSS variables, Tailwind CSS và component nội bộ
- **Icon**: Lucide React
- **Schema**: Zod
- **State cục bộ**: React state và IndexedDB; dùng localStorage cho cài đặt nhỏ
- **AI**: Gemini qua route handler phía server
- **Kiểm thử**: Vitest cho unit test, Playwright cho luồng giao diện
- **Triển khai**: Vercel
- **PWA**: Web manifest và service worker chỉ cache app shell, không cache `/api/*`

### Lý do chọn local-first

Bản 24 giờ phải chạy ngay cả khi chưa có khóa AI hoặc cơ sở dữ liệu. Mọi luồng chính dùng rule engine cục bộ hoặc server-side deterministic. Nếu có Gemini, AI chỉ trích xuất tín hiệu và nội dung từ văn bản hoặc tệp. Nếu Gemini lỗi, ứng dụng trả kết quả dự phòng có ghi rõ giới hạn.

### Cấu trúc thư mục đề xuất

```text
app/
  api/
  canh-bao/
  gia-dinh/
  hoc-hoi/
  kiem-tra/
  quyen-rieng-tu/
  trang-chu/
  vu-viec/
components/
  auth/
  checks/
  layout/
  safety/
  shared/
domain/
  journey/
  link/
  reputation/
  risk/
  transfer/
lib/
  ai/
  persistence/
  validation/
public/
tests/
```

### Ranh giới kỹ thuật

- Component không gọi AI trực tiếp
- Mọi request đi qua service adapter
- Rule engine là hàm thuần, không đọc DOM và không gọi mạng
- Storage adapter che giấu IndexedDB hoặc localStorage
- UI chỉ nhận kết quả đã chuẩn hóa
- API key chỉ tồn tại ở server

## 5. Hệ thống điều hướng

### Desktop

Thanh điều hướng cố định ở trên cùng. Logo nằm bên trái, nhóm icon điều hướng nằm giữa, nút đăng nhập hoặc tài khoản nằm bên phải. Khi chưa hover, menu chỉ hiện icon. Khi hover hoặc focus, menu hiện nhãn mà không đẩy lệch thanh điều hướng.

Các mục chính:

- Trang chủ
- Kiểm tra
- Vụ việc
- Học hỏi
- Gia đình

### Mobile

Header chỉ có thương hiệu và hành động tài khoản. Bottom navigation cố định có 5 mục tương ứng desktop. Desktop navigation và mobile navigation phải là hai component riêng, không dùng cùng một DOM rồi ép CSS đổi hướng.

### Quy tắc route

- Route chuyển trong 180 đến 240 ms
- Dùng opacity và translateY tối đa 8 px
- Không animate chiều cao layout
- Tôn trọng `prefers-reduced-motion`
- Khi đổi route, đóng dialog nguy hiểm và menu tài khoản
- Route hiện tại có icon rõ, màu tím đậm và marker nằm giữa icon

## 6. Hệ thống giao diện

### Tông màu

- Nền ứng dụng: trắng pha tím rất nhạt
- Màu thương hiệu chính: tím
- Màu chữ chính: tím than hoặc đen tím
- Màu an toàn tương đối: xanh lá
- Màu nghi ngờ: vàng cam
- Màu nguy hiểm: đỏ
- Không dùng màu đỏ cho hành động bình thường

### Hình dạng

- Card tối đa 8 px nếu là danh sách lặp
- Modal có thể bo 20 đến 28 px
- Nút chính dạng pill khi phù hợp
- Không lồng card trong card
- Không dùng gradient trang trí tràn lan
- Không dùng linh vật tại trang Vụ việc

### Typography

- Font hỗ trợ tiếng Việt đầy đủ
- Body tối thiểu 16 px trên mobile
- Vùng chạm tối thiểu 44 x 44 px
- Không dùng font-size theo viewport width trên toàn ứng dụng
- Tiêu đề không được vỡ từng từ khi còn đủ chiều ngang
- “Danh sách vụ việc” phải giữ trên một dòng ở 320 px trở lên

### Trạng thái tài khoản

Khi chưa đăng nhập, mọi trang dùng cùng một nút **Đăng nhập** nền trắng, viền tím nhạt và dạng pill. Khi đã đăng nhập, nút đổi thành avatar hoặc tên tài khoản. Không để một trang dùng nút đặc tím còn trang khác dùng nút trắng.

### Modal đăng nhập

Modal có hai tab **Đăng nhập** và **Tạo tài khoản**. Tab bo tròn, có viền rõ và trạng thái chọn màu tím. Đăng nhập chỉ hiện tài khoản và mật khẩu. Tạo tài khoản hiện họ tên, email, mật khẩu và xác nhận mật khẩu.

## 7. Onboarding 5 bước

Onboarding chỉ xuất hiện lần đầu hoặc khi người dùng chủ động mở lại.

1. Giới thiệu mục tiêu “Dừng lại trước khi chuyển tiền”
2. Chọn cách nhập: gõ, nói hoặc gửi ảnh
3. Giới thiệu mức rủi ro và hành động an toàn
4. Giới thiệu người thân tin cậy
5. Chọn bắt đầu kiểm tra hoặc vào trang chủ

Yêu cầu:

- Có nút tiếp tục ở mọi bước
- Có quay lại, bỏ qua và đóng
- Nút không bị mất ở viewport thấp
- Web và mobile dùng bố cục riêng
- Lưu trạng thái hoàn thành cục bộ

## 8. Trang chủ

### Mục tiêu

Người dùng kể tình huống trong 10 giây và nhận hướng dẫn đầu tiên mà không phải tìm menu.

### Thành phần

- Lời chào ngắn
- Ô “Kể tình huống bác đang gặp”
- Nút đính kèm ảnh/PDF
- Nút micro
- Nút gửi
- Chip tình huống mẫu
- Kết quả nhanh hiển thị ngay dưới ô nhập
- Nút gọi người thân
- Nút báo cho người thân
- Lối vào cảnh báo 60 giây
- Liên kết đến kiểm tra chi tiết

### Hành vi

- Nhấn Enter gửi nội dung
- Shift + Enter tạo dòng mới
- Nội dung tối đa 5.000 ký tự cho phân tích
- Chat tối đa 1.000 ký tự
- Cho phép PNG, JPEG, WEBP và PDF tối đa 5 MB
- Nén ảnh phía client trước khi gửi
- Hiện preview và nút bỏ tệp
- Không gửi khi cả nội dung và tệp đều trống
- Có loading, hủy request, lỗi và retry

## 9. Trung tâm kiểm tra

Trang Kiểm tra chỉ hiển thị bốn lựa chọn chính:

1. **Kiểm tra cuộc gọi**: nhập số điện thoại hoặc kể lại nội dung
2. **Phân tích tin nhắn**: dán văn bản hoặc gửi ảnh chụp
3. **Kiểm tra link và mã QR**: nhập URL, tải ảnh QR hoặc quét QR
4. **Kiểm tra chuyển tiền**: nhập người liên hệ, chủ tài khoản, số tài khoản đã che bớt và nội dung yêu cầu

Không đặt linh vật, thẻ giới thiệu thừa hoặc nội dung lặp lên trên bốn lựa chọn. Mỗi lựa chọn có icon, tiêu đề, mô tả một câu và hành động rõ.

## 10. Phân tích tình huống

### Dữ liệu vào

- Văn bản người dùng nhập
- Văn bản nhận diện từ ảnh hoặc PDF
- Tín hiệu boolean do AI trích xuất
- Trạng thái phục hồi 72 giờ
- Dữ liệu vụ việc đang mở nếu người dùng chọn lưu

### Tín hiệu cần nhận diện

- Giả danh cơ quan nhà nước
- Yêu cầu chuyển vào tài khoản cá nhân
- Thúc ép thời gian
- Đe dọa bắt giữ, khóa tài khoản hoặc cắt trợ cấp
- Yêu cầu giữ bí mật
- Đòi OTP, PIN hoặc mật khẩu
- Yêu cầu cài ứng dụng lạ
- Yêu cầu chia sẻ màn hình hoặc điều khiển từ xa
- Giả danh người thân
- Giả danh dịch vụ thiết yếu
- Hứa lợi nhuận cao, không có rủi ro
- Người quen qua mạng xin tiền
- Báo người thân gặp nạn
- Đe dọa bằng hình ảnh riêng tư
- Tài khoản người thân bị hack
- Giả ngân hàng xác thực sinh trắc học
- Dụ cài VNeID hoặc dịch vụ công giả
- Dọa khóa SIM
- Nhiệm vụ chốt đơn nhận hoa hồng

### Mức kết quả

- **Nguy hiểm cao**: Có một tín hiệu nghiêm trọng hoặc nhiều tín hiệu kết hợp
- **Nghi ngờ**: Có tín hiệu vừa, cần xác minh thêm
- **Chưa thấy dấu hiệu rủi ro**: Chưa đủ bằng chứng, vẫn nhắc người dùng tự xác minh

### Cấu trúc kết quả

- Nhãn rủi ro bằng chữ và màu
- Một câu đồng cảm
- Tối đa 3 lý do
- Tối đa 3 hành động cần làm ngay
- Tín hiệu đã nhận diện
- Chiến thuật thao túng
- Thực thể trích xuất đã che dữ liệu nhạy cảm
- Hạn chế của kết quả
- Trích dẫn từ thư viện tĩnh
- Nút nghe kết quả
- Nút sửa nội dung đã nhận diện
- Nút lưu vào vụ việc
- Nút báo kết quả sai

## 11. Rule engine và AI

### Trách nhiệm của AI

AI chỉ thực hiện các việc sau:

- Đọc nội dung văn bản, ảnh hoặc PDF
- Trích xuất văn bản
- Trả về tập boolean theo schema cố định
- Viết một câu đồng cảm ngắn

AI không được:

- Tự quyết định điểm hoặc mức rủi ro
- Tạo số liệu báo cáo
- Tạo trích dẫn hoặc đường link nguồn
- Tự gọi hoặc nhắn cho người thân
- Tự mở URL trích xuất được

### Trách nhiệm của rule engine

- Chuẩn hóa mọi tín hiệu về boolean
- Tính điểm theo bảng luật versioned
- Chọn mức rủi ro
- Sinh lý do và hành động từ thư viện tĩnh
- Không giảm một kết quả nguy hiểm đã xác định
- Tăng cảnh giác khi chế độ phục hồi 72 giờ đang bật

### Chế độ dự phòng

Khi AI không phản hồi, dùng keyword inference và rule engine. Kết quả phải ghi: “Dịch vụ AI tạm thời không phản hồi; kết quả đang dựa trên luật trong ứng dụng.”

## 12. Kiểm tra link và mã QR

### Chức năng

- Nhập URL
- Tải ảnh QR
- Giải mã QR ở client
- Theo dõi redirect ở server
- Hiện domain ban đầu và domain cuối
- So domain với thương hiệu người dùng khai báo
- Cảnh báo lookalike domain

### Bảo mật Server-Side Request Forgery

Server-Side Request Forgery (SSRF) là việc server bị ép truy cập địa chỉ nội bộ. Luồng redirect phải chặn loopback, mạng riêng, link-local, multicast, broadcast, Carrier-Grade NAT và IPv4-mapped IPv6. Chỉ cho phép HTTP và HTTPS. Giới hạn số lần redirect.

### Kết quả

- Domain cuối
- Chuỗi redirect
- HTTPS có hoặc không
- Thương hiệu có khớp không
- Lý do và hành động
- Không tự mở link

## 13. Kiểm tra chuyển tiền

### Trường nhập

- Tên người liên hệ
- Tên chủ tài khoản
- Ngân hàng
- Số tài khoản đã che bớt
- Số tiền
- Nội dung cuộc trò chuyện

### Tín hiệu

- Tên người liên hệ không khớp chủ tài khoản
- Cá nhân tự xưng là cơ quan hoặc doanh nghiệp
- Yêu cầu chuyển thử rồi hoàn lại
- Thúc ép thời gian
- Yêu cầu giữ bí mật
- Nội dung chuyển khoản bất thường

### Kết quả

Hiện rủi ro, lý do, hành động và câu nhắc đối chiếu tên chủ tài khoản trong ứng dụng ngân hàng. Không yêu cầu người dùng nhập OTP hoặc số tài khoản đầy đủ.

## 14. Cảnh báo 60 giây

### Điều kiện mở

- Kết quả nguy hiểm cao
- Người dùng bấm “Tôi đang bị thúc ép”
- Người dùng chọn một dấu hiệu đe dọa hoặc giữ bí mật

### Giao diện

- Dialog phủ toàn màn hình
- Header nền đỏ, chữ trắng
- Đồng hồ 60 giây
- Một hành động tại mỗi bước
- Nút đóng vẫn tồn tại nhưng không nổi bật hơn hành động an toàn

### Sáu bước

1. Đặt điện thoại xuống và hít thở
2. Không chuyển tiền, không đọc OTP, không bấm link
3. Cúp cuộc gọi đáng ngờ
4. Gọi số người thân đã lưu
5. Tự gọi ngân hàng hoặc đơn vị qua số chính thức
6. Lưu bằng chứng nếu đã có giao dịch

## 15. Sau khi đã chuyển tiền

### Checklist 8 bước

- Gọi ngay ngân hàng chuyển đi
- Yêu cầu khóa giao dịch hoặc tài khoản
- Đổi mật khẩu ngân hàng và email
- Khóa SIM nếu nghi bị chiếm quyền
- Lưu biên lai, ảnh chụp, số điện thoại và link
- Báo người thân
- Liên hệ cơ quan chức năng qua kênh chính thức
- Không đóng thêm phí để “lấy lại tiền”

### Dữ liệu

- Số tiền
- Thời điểm
- Kênh chuyển
- Tài khoản nhận đã che bớt
- Có đọc OTP hay không
- Ghi chú

### Hành động

- Sao chép tóm tắt cho ngân hàng
- Tải file tóm tắt
- Lưu bằng chứng
- Bật chế độ phục hồi 72 giờ

## 16. Vụ việc và lịch sử

### Danh sách vụ việc

- Tiêu đề “Vụ việc & lịch sử”
- Bộ lọc: Tất cả, Đã kiểm tra, Đã lưu
- Nút thêm vụ việc
- Tiêu đề “Danh sách vụ việc” không xuống dòng
- Không hiển thị linh vật
- Empty state gọn, không có khoảng trắng thừa

### Giới hạn MVP

- Tối đa 5 vụ việc
- Tối đa 20 sự kiện mỗi vụ việc
- Tất cả lưu cục bộ

### Sự kiện vụ việc

- Cuộc gọi đầu tiên
- Tin nhắn tiếp theo
- Được gửi link
- Yêu cầu cài ứng dụng
- Yêu cầu chuyển thử
- Yêu cầu chuyển thêm
- Yêu cầu giữ bí mật
- Khác

### Chi tiết vụ việc

- Tên vụ việc
- Trạng thái
- Dòng thời gian
- Nội dung và ảnh bằng chứng
- Kết quả phân tích từng sự kiện
- Giai đoạn thao túng hiện tại
- Dự đoán bước tiếp theo
- Xuất file vụ việc
- Xóa có xác nhận

## 17. Scam journey

Rule engine hành trình xác định giai đoạn cao nhất từ toàn bộ sự kiện:

1. Làm quen
2. Tạo niềm tin
3. Gây sợ hãi hoặc khẩn cấp
4. Cô lập và yêu cầu giữ bí mật
5. Yêu cầu chuyển tiền

Kết quả hành trình gồm nhãn giai đoạn, mô tả, bước kẻ gian có thể làm tiếp và một trích dẫn tĩnh. Engine phải thuần luật và không phụ thuộc AI.

## 18. Bằng chứng

### Loại dữ liệu

- Ảnh chụp tin nhắn
- URL
- Số điện thoại
- Biên lai
- Ghi chú
- Thời điểm

### Chức năng

- Thêm, sửa, xóa
- Gắn vào vụ việc
- Chọn thời hạn lưu
- Tải dossier dạng text hoặc JSON
- Không tự tải tệp lên cloud trong MVP

## 19. Báo cáo

Trợ lý báo cáo tạo bản tóm tắt từ dữ liệu người dùng chọn. Bản tóm tắt phải chỉnh sửa được trước khi sao chép hoặc tải xuống. Báo cáo cộng đồng chỉ lưu vào hàng đợi local và ghi rõ chưa gửi đến cơ quan nào.

## 20. Gia đình và người thân tin cậy

### Dữ liệu liên hệ

- Họ tên
- Vai trò
- Số điện thoại
- Quyền ban đầu
- Thời hạn quyền
- Mã xác minh hoặc từ khóa gia đình tùy chọn

### Giới hạn

- Tối đa 5 liên hệ
- Không tự gửi dữ liệu
- Mọi lần chia sẻ phải có hành động rõ từ người dùng

### Hành động

- Gọi
- Soạn SMS cảnh báo
- Soạn yêu cầu xác minh
- Thu hồi quyền
- Xem nhật ký quyền riêng tư

## 21. Học hỏi

### Bố cục

- Bài học hôm nay
- Tiếp tục bài đang học
- Bộ lọc chủ đề
- Tình huống thực tế
- 5 nguyên tắc vàng
- Danh sách bài đã hoàn thành

### Bài học tối thiểu

1. Giả danh công an
2. Giả danh ngân hàng
3. Giả danh người thân
4. Giả danh shipper
5. Mã OTP
6. Cài ứng dụng APK
7. Chia sẻ màn hình
8. Đầu tư lợi nhuận cao
9. Cộng tác viên làm nhiệm vụ
10. Deepfake giọng nói
11. Lừa đảo lấy lại tiền
12. Giả danh điện lực
13. VNeID giả
14. Xác thực sinh trắc học giả
15. Dọa khóa SIM
16. Giả danh giáo viên
17. Kết bạn rồi rủ đầu tư
18. Link và mã QR giả
19. 5 nguyên tắc vàng

### Cấu trúc mỗi bài

- Tiêu đề
- Chủ đề
- Tình huống
- Hai đến bốn lựa chọn
- Đáp án đúng
- Giải thích
- Nút nghe
- Nút thử lại
- Nút bài tiếp theo
- Trạng thái hoàn thành

## 22. Cảnh báo và tin lừa đảo

Trang Cảnh báo có hai lớp nội dung:

- **Thư viện thủ đoạn**: Nội dung ổn định, được kiểm duyệt trong mã hoặc cấu hình
- **Cảnh báo gần đây**: Danh sách có ngày cập nhật, tiêu đề, mô tả, nguồn và liên kết nguồn chính thức

Không tự tổng hợp tin từ mạng rồi khẳng định là thật. Nếu chưa có pipeline kiểm duyệt, dùng file JSON có người duyệt. Mỗi mục cần `id`, `title`, `summary`, `publishedAt`, `reviewedAt`, `sourceName`, `sourceUrl`, `tags` và `status`.

## 23. Danh bạ hỗ trợ

Danh bạ chỉ chứa số và website đã đối chiếu. Mỗi mục có nguồn, ngày cập nhật và thời hạn rà soát. Nếu quá 90 ngày, hiển thị cảnh báo yêu cầu người dùng đối chiếu với thẻ ngân hàng hoặc ứng dụng chính thức.

## 24. Các công cụ hỗ trợ bổ sung

### Xác minh người gọi

Người dùng chọn nhóm người gọi rồi nhận danh sách câu hỏi để đọc trực tiếp. Các nhóm gồm ngân hàng, công an giả, shipper, trúng thưởng, cộng tác viên, đầu tư, vay tiền, người thân và nhóm chưa rõ.

Mỗi nhóm phải có:

- Câu hỏi yêu cầu họ tên và đơn vị
- Câu hỏi yêu cầu mã hồ sơ hoặc thông tin có thể đối chiếu
- Câu “Tôi sẽ tự gọi lại số tổng đài chính thức”
- Câu “Tôi cần trao đổi với người thân trước”
- Nút đọc toàn bộ bằng TTS
- Nút mở kịch bản thoát cuộc gọi

### Kịch bản thoát cuộc gọi

Hiển thị câu chữ lớn để người dùng đọc: “Tôi không quyết định qua điện thoại. Tôi sẽ tự gọi lại số chính thức và hỏi người thân.” Có nút nghe, sao chép và mở cảnh báo 60 giây.

### Bảo vệ thiết bị

Trang này dùng khi người dùng đã đọc OTP, cài ứng dụng lạ hoặc chia sẻ màn hình. Checklist gồm:

1. Dừng cuộc gọi và tắt chia sẻ màn hình
2. Gọi ngân hàng qua số chính thức
3. Gỡ ứng dụng lạ và thu hồi quyền Trợ năng hoặc Điều khiển từ xa
4. Đổi mật khẩu ngân hàng, email và ví trên thiết bị sạch
5. Kiểm tra giao dịch gần đây và lưu bằng chứng

Trang có nút gọi ngân hàng, mở trung tâm bằng chứng và lưu tiến độ checklist cục bộ.

### Chat hỗ trợ

Chat widget mở từ mọi trang nhưng không che nội dung hoặc bottom navigation. Chat nhận tối đa 1.000 ký tự, Enter để gửi, Shift + Enter để xuống dòng và luôn có fallback deterministic. Chat không tự mở dialog nguy hiểm nếu chưa giải thích lý do; nó có thể đề xuất nút mở khi nhận diện rủi ro cao.

### Tìm kiếm toàn cục

Search trên desktop tìm route, tính năng, bài học và thủ đoạn lừa đảo. Kết quả chỉ điều hướng nội bộ. Mobile có thể đặt search trong menu hoặc trang riêng để header không bị chật.

### Chuông thông báo

Chuông mở danh sách cảnh báo trong ứng dụng. Khi chưa đăng nhập, có thể ẩn chuông để tránh khoảng trắng thừa. MVP không tự nhận push notification là đã hoạt động nếu chưa có quyền và service backend.

## 25. Quyền riêng tư

### Cài đặt

- Bật hoặc tắt lưu lịch sử
- Kiểm tra một lần, không lưu
- Chọn tự xóa sau 24 giờ, 7 ngày, 30 ngày, 90 ngày hoặc không tự xóa
- Bật hoặc tắt cá nhân hóa
- Bật hoặc tắt chia sẻ gia đình
- Chọn cỡ chữ

### Quản lý dữ liệu

- Xem dữ liệu đang lưu
- Xuất JSON
- Xuất backup mã hóa AES-GCM
- PBKDF2 SHA-256 với 250.000 vòng cho khóa backup
- Xóa toàn bộ dữ liệu có xác nhận
- Xóa tài khoản local có xác nhận
- Nhật ký hành động quyền riêng tư

## 26. Xác thực

### Chế độ demo 24 giờ

Tài khoản được lưu trên thiết bị. Mật khẩu phải hash trước khi lưu. Giao diện phải ghi rõ dữ liệu chỉ nằm trên thiết bị và không đồng bộ.

### Chế độ production sau MVP

Dùng Supabase Auth hoặc provider tương đương. Không lưu password hash trong localStorage. Áp dụng Row Level Security (RLS) cho vụ việc, bằng chứng và liên hệ.

## 27. Accessibility

- Tương phản chữ đạt WCAG AA
- Focus ring hai màu trên mọi control
- Vùng chạm tối thiểu 44 px
- Không dùng màu làm tín hiệu duy nhất
- Dialog có focus trap và trả focus khi đóng
- Form có label và lỗi gắn bằng `aria-describedby`
- Icon-only button có accessible name
- Screen reader nhận được route title mới
- Hỗ trợ bàn phím đầy đủ
- Cỡ chữ nhỏ nhất vẫn không dưới 14 px
- Text-to-Speech dùng `vi-VN`

## 28. PWA và offline

- Manifest có tên, mô tả, màu nền và icon maskable
- Service worker cache app shell
- Không cache request hoặc response `/api/*`
- Khi offline, mở được shell và dữ liệu cục bộ
- Luồng AI hiển thị trạng thái offline và dùng phân tích deterministic nếu đủ văn bản
- Mỗi phát hành đổi cache version

## 29. API contract

### `GET /api/health`

Trả `{ ok: true }`.

### `GET /api/support-directory`

Trả phiên bản, ngày rà soát, số ngày hết hạn và danh sách đầu mối.

### `POST /api/chat`

Input: `message`, tối đa 1.000 ký tự. Output: câu trả lời, mức rủi ro và cờ fallback.

### `POST /api/analyze`

Input: văn bản tối đa 5.000 ký tự, media tùy chọn và trạng thái phục hồi. Output: kết quả rule engine, signals, nội dung đã đọc và structured result.

### `POST /api/check-transfer`

Input: các trường chuyển tiền. Output: signals chuyển tiền, mức rủi ro, lý do và hành động.

### `POST /api/analyze-journey`

Input: danh sách sự kiện. Output: giai đoạn, mô tả, bước tiếp theo và citation.

### `POST /api/check-link`

Input: URL và thương hiệu khai báo. Output: redirect chain, final URL, risk và lý do.

### `POST /api/check-reputation`

Input: loại thực thể và giá trị. Nếu chưa có provider thật, trả trạng thái “chưa có dữ liệu xác minh” và `reportCount: null`.

## 30. Data model

### Account

```typescript
type Account = {
  id: string
  name: string
  email: string
  passwordHash?: string
  createdAt: string
}
```

### Trusted contact

```typescript
type TrustedContact = {
  id: string
  name: string
  relationship: string
  phone: string
  permission: "call_only" | "high_alert" | "summary" | "evidence" | "recovery"
  expiresAt?: string
  createdAt: string
}
```

### Case

```typescript
type SafetyCase = {
  id: string
  title: string
  status: "new" | "checking" | "resolved" | "closed"
  createdAt: string
  updatedAt: string
  events: CaseEvent[]
}
```

### Case event

```typescript
type CaseEvent = {
  id: string
  type: string
  text: string
  createdAt: string
  mediaRef?: string
  analysis?: StructuredRiskResult
}
```

### Structured result

```typescript
type StructuredRiskResult = {
  riskLevel: "high" | "medium" | "low"
  riskLabel: string
  empathy: string
  reasons: string[]
  actions: string[]
  signals: Record<string, boolean>
  tactics: string[]
  entities: Array<{ type: string; maskedValue: string }>
  limitations: string[]
  citations: string[]
  usedFallback: boolean
}
```

## 31. Bảo mật

- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Rate limit tối đa 90 API request mỗi phút trên một IP cho MVP
- JSON body tối đa 8 MB
- Kiểm tra MIME bằng file signature
- Media tối đa 5 MB
- Không log nội dung nhạy cảm
- Không nhận OTP trong schema
- Không commit `.env`
- Không cho client biết API key

## 32. Trạng thái và lỗi

Mỗi tác vụ bất đồng bộ phải có:

- Idle
- Loading
- Success
- Empty
- Error
- Retry
- Cancel khi có request đang chạy
- Offline khi mất mạng

Thông báo lỗi phải cho biết người dùng nên làm gì tiếp theo. Không hiển thị stack trace hoặc tên provider AI.

## 33. Kiểm thử bắt buộc

### Unit test

- Mỗi tín hiệu rule engine
- Tín hiệu nghiêm trọng đơn lẻ tạo mức nguy hiểm cao
- Tín hiệu mức vừa không trả mức thấp
- Kết quả thấp vẫn có hành động thận trọng
- Journey chọn giai đoạn cao nhất không phụ thuộc thứ tự
- SSRF chặn toàn bộ địa chỉ nội bộ
- MIME giả bị từ chối
- Reputation không tạo số báo cáo giả
- Structured result không lộ OTP

### Component test

- Login chỉ có hai trường ở mode đăng nhập
- Register hiện đủ bốn trường
- Route hiện tại cập nhật nav
- Dialog 60 giây mở và đóng đúng
- Enter gửi chat, Shift + Enter xuống dòng
- Empty state vụ việc không có linh vật

### End-to-end test

1. Onboarding đến trang chủ
2. Phân tích tình huống mẫu và nhận kết quả
3. Mở cảnh báo 60 giây
4. Lưu kết quả thành vụ việc
5. Thêm người thân và mở SMS
6. Hoàn thành một bài học
7. Đăng ký, đăng xuất và đăng nhập lại
8. Xuất dữ liệu rồi xóa dữ liệu
9. Kiểm tra desktop 1440 x 900
10. Kiểm tra mobile 390 x 844 và 320 x 700

## 34. Tiêu chí nghiệm thu UI

- Không có hai taskbar cùng xuất hiện
- Header cố định không chồng nội dung
- Nút đăng nhập giống nhau trên mọi route
- Không có khoảng trắng vô nghĩa trong header
- Icon nằm giữa control và không mờ ở trạng thái active
- Marker active nằm đúng giữa icon
- Không có chữ đè lên nhau
- “Danh sách vụ việc” không xuống dòng
- Bốn thẻ kiểm tra không chứa linh vật
- Trang Vụ việc không chứa linh vật
- Modal account bo tròn, tab rõ và không lệch
- Mobile và desktop không dùng CSS sửa chéo nhau
- Screenshot diff không có overflow ngang

## 35. Kế hoạch thực hiện 24 giờ

### Giờ 0 đến 2: Nền tảng

- Khởi tạo repo, TypeScript, lint, test và Vercel
- Tạo tokens, layout desktop/mobile và routing
- Tạo data model và storage adapter

### Giờ 2 đến 6: Luồng chính

- Trang chủ
- Trung tâm kiểm tra
- API analyze
- Rule engine và structured result

### Giờ 6 đến 9: Kiểm tra chuyên biệt

- Tin nhắn và tệp
- Link/QR
- Chuyển tiền
- Reputation placeholder trung thực

### Giờ 9 đến 12: An toàn khẩn cấp

- Dialog 60 giây
- Người thân
- Checklist sau chuyển tiền

### Giờ 12 đến 15: Dữ liệu người dùng

- Vụ việc và timeline
- Bằng chứng
- Privacy center
- Auth local-first

### Giờ 15 đến 18: Nội dung

- 19 bài học
- Cảnh báo gần đây
- Danh bạ hỗ trợ
- TTS

### Giờ 18 đến 21: Responsive và accessibility

- Desktop 1440 px
- Tablet 1024 px
- Mobile 390 px và 320 px
- Keyboard, focus, screen reader và reduced motion

### Giờ 21 đến 23: Kiểm thử

- Unit test
- Component test
- Playwright
- Kiểm tra console và network

### Giờ 23 đến 24: Phát hành

- Build production
- Deploy Vercel
- Smoke test production
- Ghi lại biến môi trường và hạn chế còn lại

## 36. Definition of done

Chỉ coi bản build hoàn thành khi:

- `npm run lint` đạt
- `npm run typecheck` đạt
- `npm test` đạt
- `npm run build` đạt
- Playwright chạy được ba luồng P0
- Không có lỗi console ở các route chính
- Production trả HTTP 200
- AI lỗi vẫn có kết quả dự phòng
- Không có secret trong client bundle
- README có hướng dẫn chạy và deploy
- Có danh sách hạn chế chưa hoàn thành

## 37. Biến môi trường

```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=your_supported_gemini_model_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Nếu dùng Supabase sau MVP:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key_here
```

## 38. Câu lệnh chạy dự án

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Kiểm tra và build:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## 39. Những quyết định không được tự ý thay đổi

- AI không quyết định mức rủi ro
- Không dùng từ “an toàn” như một bảo đảm
- Không tự gửi dữ liệu cho người thân hoặc bên thứ ba
- Không gọi số do người lạ cung cấp
- Không lưu media sau phân tích
- Không trộn navigation desktop và mobile
- Không đặt secret trong frontend
- Không tạo dữ liệu uy tín hoặc số lượng báo cáo giả
- Không cache API response trong service worker
- Không thêm linh vật vào trang Vụ việc hoặc trung tâm Kiểm tra

## 40. Master prompt dùng với Codex

Master prompt độc lập nằm tại [CODEX-MASTER-PROMPT.md](./CODEX-MASTER-PROMPT.md). Khi bắt đầu repo mới, đưa cả hai file vào workspace rồi gửi toàn bộ master prompt cho Codex.
