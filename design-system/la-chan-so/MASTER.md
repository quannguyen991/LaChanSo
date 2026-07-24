# Hệ thống thiết kế Lá Chắn Số

**Cập nhật:** 2026-07-24 (bản 5 — tên thương hiệu là Lá Chắn Số, "Khoan đã" là câu cửa miệng)  
**Đối tượng:** Người cao tuổi cần kiểm tra và xử lý tình huống lừa đảo  
**Cấu trúc:** App Hub / Command Center với 5 tab dưới

## DNA giao diện

- Khung chuẩn để đối chiếu: 941×1672 px, app shell rộng 901 px và căn giữa trên màn hình lớn.
- Header giấy sáng: tên LÁ CHẮN SỐ kèm câu cửa miệng "Khoan đã", trạng thái hệ thống, điều chỉnh cỡ chữ và hướng dẫn giọng nói.
- Hero dùng ảnh ông bà làm tín hiệu nhận diện; tiêu đề và nội dung luôn là HTML thật để đọc được ở mọi kích thước.
- Sau hero là lưới 1.92:1: cột tác vụ bên trái, cột hỗ trợ bên phải.
- Trust Blue là màu tin cậy theo bản giao diện gốc, cam là tín hiệu dừng suy nghĩ, đỏ chỉ dành cho nguy hiểm thật.
- Banner cuối dùng minh họa khiên khóa và ba cam kết ngắn.

## Typography

- Font duy nhất: `Nunito Sans Variable`, phục vụ cục bộ với subset tiếng Việt.
- Body: 16–17 px trở lên ở nội dung vận hành, line-height 1.5–1.65.
- Heading: roman, weight 700–850, letter-spacing 0.
- Không dùng chữ nghiêng cho heading.

## Token

Nguồn duy nhất là `tokens.css` ở project root, được server phục vụ tại `/tokens.css`:

- `--color-paper`, `--color-surface`, `--color-ink`: nền xanh-trắng và chữ navy đậm.
- `--color-accent*`: CTA Trust Blue.
- `--color-notice*`: tín hiệu cam cho trạng thái “khoan đã” và cảnh báo nhẹ.
- `--color-success*`, `--color-warning*`, `--color-danger*`: trạng thái an toàn/nghi ngờ/nguy hiểm.
- `--color-focus-inner`, `--color-focus-outer`: focus ring hai lớp.
- `--space-*`, `--radius-*`, `--shadow-*`, `--duration-*`: nhịp và trạng thái dùng chung.

Không thêm màu hoặc font trực tiếp ngoài token.

## Asset

- `public/assets/home-hero-reference.webp`: hero ở khung chuẩn.
- `public/assets/home-couple-reference.webp`: crop ông bà dùng cho mobile.
- `public/assets/brand-shield-reference.png`: logo nền trong suốt và icon thương hiệu.
- `public/assets/avatar-reference.webp`: avatar lời chào.
- `public/assets/reassurance-reference.webp`: khiên khóa ở banner cuối.
- `public/assets/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`: icon PWA maskable sinh từ logo khiên (manifest + màn hình chính iOS).
- `scripts/crop-reference-assets.py`: tái tạo crop từ ảnh tham chiếu của người dùng.
- `public/vendor/unicons/`: IconScout Unicons Line, dùng cho icon chức năng; giấy phép được giữ nguyên trong `LICENSE.txt`.

## Responsive

- ≥896 px: app shell tối đa 901 px; hero chia hai cột với ảnh ông bà và nội dung HTML thật.
- <896 px: xếp một cột, giữ toàn bộ nhãn và hành động không bị cắt.
- Thanh tab cố định gồm 5 mục: Trang chủ, Kiểm tra, Lịch sử, Vụ việc, Gia đình.
- Bắt buộc không tràn ngang tại 320/375/414/768/941/1280/1440 px.

## Accessibility và tương tác

- Vùng chạm tối thiểu 44×44 px, hành động chính tối thiểu 56 px.
- Tất cả control có active, focus-visible và disabled phù hợp.
- Không truyền đạt rủi ro chỉ bằng màu.
- Mức thấp phải viết “Chưa thấy dấu hiệu rủi ro”, không viết “An toàn”.
- Người dùng có ba mức chữ và hướng dẫn giọng nói; bài học/luồng khẩn cấp có TTS theo bước.
- Bản đồ thao túng dùng nhãn ngắn và lời giải thích bình tĩnh; tối đa 4 chiến thuật mỗi kết quả để không gây quá tải.
- Chế độ kết thúc cuộc gọi dùng câu nói lớn, mỗi câu có nút nghe riêng và hành động tiếp theo rõ ràng.
- Chuyển màn hình chỉ animate vùng nội dung bằng `opacity` và `transform`: thoát 170 ms, vào 340 ms, có hướng tiến/lùi và hủy chuyển cảnh cũ khi bấm nhanh.
- Tôn trọng `prefers-reduced-motion`; khi bật, chuyển màn hình diễn ra tức thời.
- `test/contrast.test.js` kiểm tra các cặp màu chính ở WCAG 4.5:1 và focus indicator 3:1.
