# Master prompt để Codex build lại Khoan Đã

Sao chép toàn bộ nội dung dưới đây vào Codex sau khi đặt `KHOAN-DA-24H-BUILD-SPEC.md` trong workspace.

```text
Bạn là coding agent chính, chịu trách nhiệm xây dựng hoàn chỉnh ứng dụng web “Khoan Đã” trong workspace hiện tại.

Mục tiêu:
Xây dựng mới một ứng dụng responsive giúp người lớn tuổi nhận diện lừa đảo, dừng lại trước khi chuyển tiền và liên hệ người thân tin cậy. Hoàn thành bản production có thể deploy lên Vercel trong 24 giờ.

Nguồn sự thật:
1. Đọc toàn bộ file docs/KHOAN-DA-24H-BUILD-SPEC.md trước khi sửa hoặc tạo code.
2. Kiểm tra AGENTS.md và mọi hướng dẫn trong repo.
3. Nếu có ảnh tham chiếu, phân tích ảnh trước khi triển khai giao diện.
4. Khi đặc tả và code cũ mâu thuẫn, ưu tiên đặc tả. Ghi lại quyết định trong README.

Cách làm việc bắt buộc:
1. Khảo sát workspace, package manager, git status và file hiện có.
2. Lập kế hoạch theo P0, P1 và P2. P0 phải hoàn thành trước.
3. Không dừng ở kế hoạch. Triển khai, kiểm thử, sửa lỗi và chạy production end-to-end.
4. Dùng skill UI/UX hoặc frontend phù hợp nếu môi trường có skill đó.
5. Gửi cập nhật ngắn khi chuyển giai đoạn hoặc gặp rủi ro.
6. Không xóa hoặc hoàn tác thay đổi của người dùng.
7. Dùng apply_patch khi sửa file thủ công.
8. Không commit secret, .env hoặc dữ liệu cá nhân.

Stack mặc định:
- Next.js App Router
- TypeScript strict
- Tailwind CSS và CSS variables
- Lucide React
- Zod
- IndexedDB cho dữ liệu nghiệp vụ local-first
- localStorage cho preference nhỏ
- Gemini chỉ gọi ở server route
- Vitest cho unit test
- Playwright cho end-to-end test
- Vercel cho production

Yêu cầu sản phẩm bắt buộc:
- Onboarding 5 bước
- Trang chủ có nhập văn bản, giọng nói, ảnh và PDF
- Enter gửi, Shift + Enter xuống dòng
- Trung tâm kiểm tra có 4 luồng: cuộc gọi, tin nhắn, link/QR và chuyển tiền
- Rule engine deterministic quyết định mức rủi ro
- AI chỉ trích xuất text và boolean signal
- Fallback không AI vẫn trả hướng dẫn hữu ích
- Kết quả có mức rủi ro, tối đa 3 lý do, tối đa 3 hành động, tín hiệu, chiến thuật, thực thể đã che, giới hạn và citation tĩnh
- Dialog cảnh báo đỏ toàn màn hình với đếm 60 giây
- Checklist sau khi đã chuyển tiền và chế độ phục hồi 72 giờ
- Vụ việc, timeline, bằng chứng và xuất file
- Tối đa 5 vụ việc, 20 event mỗi vụ việc và 5 người thân trong MVP
- Học hỏi có đủ 19 bài trong đặc tả, progress, quiz và TTS
- Cảnh báo gần đây có ngày cập nhật và nguồn đã duyệt
- Xác minh người gọi theo từng nhóm tình huống, có câu hỏi đối chiếu, TTS và lối sang kịch bản thoát cuộc gọi
- Kịch bản thoát cuộc gọi có câu chữ lớn, nghe, sao chép và nút mở cảnh báo 60 giây
- Bảo vệ thiết bị có checklist xử lý khi đã đọc OTP, cài ứng dụng lạ hoặc chia sẻ màn hình; lưu tiến độ cục bộ
- Chat hỗ trợ mở được từ mọi trang, không che nội dung hoặc bottom navigation; Enter gửi và Shift + Enter xuống dòng
- Tìm kiếm toàn cục chỉ điều hướng đến route, tính năng, bài học và thủ đoạn nội bộ
- Chuông thông báo chỉ hiển thị cảnh báo đã duyệt và không để lại khoảng trắng khi bị ẩn
- Đăng nhập local-first; login chỉ hiện tài khoản và mật khẩu
- Tạo tài khoản hiện họ tên, email, mật khẩu và xác nhận mật khẩu
- Quyền riêng tư có retention, one-time check, export, backup mã hóa và xóa dữ liệu
- PWA hoạt động offline cho app shell và không cache API

Yêu cầu giao diện bắt buộc:
- Desktop và mobile dùng navigation component riêng
- Desktop có header trắng bo tròn, logo trái, icon menu giữa và account phải
- Desktop menu chỉ hiện icon; hover hoặc focus mới hiện tên
- Mobile có header thương hiệu và bottom navigation cố định
- Không bao giờ hiện hai taskbar cùng lúc
- Nút Đăng nhập đồng nhất trên mọi route: nền trắng, viền tím nhạt, dạng pill
- Modal auth bo tròn, hai tab rõ, không lệch
- Trang Vụ việc không có linh vật
- Trang Kiểm tra không có linh vật hoặc khối giới thiệu thừa
- “Danh sách vụ việc” không xuống dòng ở viewport từ 320 px
- Không có khoảng trắng thừa trong header
- Icon active rõ và marker nằm giữa icon
- Không có overflow ngang, chữ đè hoặc component nhảy layout
- Route transition 180 đến 240 ms và hỗ trợ prefers-reduced-motion
- Vùng chạm tối thiểu 44 px, focus rõ và tương phản WCAG AA

Yêu cầu an toàn bắt buộc:
- Không dùng nhãn “An toàn” như bảo đảm; dùng “Chưa thấy dấu hiệu rủi ro”
- Không tự mở URL trích xuất
- Không tự gọi, nhắn hoặc chia sẻ dữ liệu
- Không lưu tệp upload sau phân tích
- Không tạo report count giả
- Chặn SSRF khi theo redirect
- Kiểm tra MIME bằng file signature
- Media tối đa 5 MB, JSON body tối đa 8 MB
- Chat tối đa 1.000 ký tự, phân tích tối đa 5.000 ký tự
- Secret chỉ ở server
- Rate limit API
- Security headers đầy đủ

Thứ tự triển khai:
1. Khởi tạo kiến trúc, tokens, layout và route
2. Tạo domain models, storage adapters và service adapters
3. Tạo rule engine và unit test trước UI kết quả
4. Xây trang chủ và trung tâm kiểm tra
5. Xây API analyze, transfer, journey, link, reputation và chat
6. Xây dialog 60 giây, gia đình và luồng sau chuyển tiền
7. Xây vụ việc, bằng chứng, privacy và auth
8. Xây học hỏi, cảnh báo, danh bạ hỗ trợ, xác minh người gọi, thoát cuộc gọi và bảo vệ thiết bị
9. Xây chat toàn cục, tìm kiếm và chuông thông báo
10. Hoàn thiện responsive, accessibility, PWA và animation
11. Chạy test, build, Playwright screenshot desktop/mobile và sửa mọi lỗi
12. Deploy Vercel nếu repo đã có quyền deploy; nếu chưa, đưa đúng lệnh và biến môi trường cần thiết

Tiêu chuẩn code:
- TypeScript strict, không dùng any trừ khi có lý do được ghi chú
- Component nhỏ theo domain, không tạo một file app khổng lồ
- Hàm rule engine thuần và có unit test
- Không gọi fetch rải rác trong component
- Không dùng chuỗi HTML để dựng UI
- Không dùng emoji thay icon giao diện
- Không tạo abstraction nếu chỉ dùng một lần
- Không thêm dependency khi API trình duyệt hoặc thư viện hiện có đã đủ
- Mọi form có validation schema và lỗi accessible
- Mọi async action có loading, error, retry và abort khi phù hợp

Kiểm thử trước khi bàn giao:
- npm run lint
- npm run typecheck
- npm test
- npm run build
- Playwright ở 1440x900, 390x844 và 320x700
- Kiểm tra onboarding, phân tích, cảnh báo 60 giây, lưu vụ việc, thêm người thân, hoàn thành bài học, auth, export và xóa dữ liệu
- Kiểm tra production URL trả HTTP 200
- Kiểm tra không có lỗi console trên route chính

Điều kiện hoàn thành:
Không báo hoàn thành khi còn P0 chưa làm, test đỏ, build lỗi, màn hình trắng, asset không tải, navigation chồng chéo hoặc giao diện mobile bị overflow. Nếu gặp blocker dịch vụ ngoài, triển khai adapter fallback để ứng dụng vẫn chạy và ghi rõ hạn chế.

Bàn giao cuối:
- Tóm tắt tính năng đã hoàn thành
- Liệt kê file chính đã tạo hoặc sửa
- Nêu test đã chạy và kết quả
- Cung cấp URL local và production
- Liệt kê biến môi trường
- Liệt kê P1/P2 chưa hoàn thành
- Không kết thúc bằng đề xuất mơ hồ; đưa trạng thái cụ thể và bước tiếp theo cụ thể

Bắt đầu ngay: đọc đặc tả, khảo sát workspace, lập kế hoạch ngắn rồi triển khai đến khi bản production chạy được.
```

## Prompt bổ sung khi Codex bị dừng giữa chừng

```text
Tiếp tục từ trạng thái hiện tại. Đọc lại docs/KHOAN-DA-24H-BUILD-SPEC.md, git diff và kết quả test gần nhất. Không làm lại phần đã hoàn thành. Xác định P0 còn thiếu, sửa lỗi theo mức độ ảnh hưởng, chạy lại lint, typecheck, test, build và Playwright. Chỉ bàn giao khi production chạy và không còn lỗi chặn luồng chính.
```

## Prompt kiểm tra cuối

```text
Thực hiện final quality gate cho Khoan Đã. Không thêm tính năng mới. Kiểm tra tất cả tiêu chí Definition of done trong docs/KHOAN-DA-24H-BUILD-SPEC.md, sửa lỗi tìm thấy, chạy toàn bộ test và chụp screenshot desktop/mobile cho các route chính. Báo findings theo mức độ nghiêm trọng, sau đó nêu commit và URL production đã xác minh.
```
