# Khoan Đã Project Audit

Date: 2026-07-28

## Executive Summary

Khoan Đã is a static HTML/CSS/JavaScript PWA served by a Node.js/Express backend. The app already covers the core scam-safety loop: multimodal input, risk analysis, link/QR checking, transfer checking, emergency pause, family contacts, evidence, cases, privacy controls, education, and offline shell caching.

The implementation is intentionally local-first. There is no database, ORM, backend authentication, multi-user sync, or real community moderation backend. AI is constrained to signal extraction and short guidance; deterministic rule engines own risk labels, manipulation signals, journey stage, citations, and fallback behavior.

Baseline status before this development pass:

- `npm run check`: passed.
- `npm test`: passed, 148 tests.
- `npm run build`: passed.

## Stack Inventory

- Frontend framework: none; plain HTML, CSS, and browser JavaScript.
- Backend: Express 5 on Node.js 20+.
- Routing: client-side hash routes mapped in `public/app.js`; server serves static files and API routes.
- Database: none.
- ORM: none.
- Authentication: local demo account state only; no backend auth/session/JWT.
- State management: module-level browser state plus `localStorage`.
- Local persistence: `localStorage` for history, evidence, cases, privacy, family contacts, onboarding, and settings.
- API: JSON-only Express API under `/api`.
- AI provider: Gemini native path plus OpenAI-compatible fallback path in `src/gemini.js`, configured by environment.
- OCR: AI inline media analysis through `/api/phan-tich`.
- Speech-to-Text: browser Web Speech API adapter.
- QR decoder: browser-side `jsQR`.
- URL checker: backend `src/link-shield.js` with redirect tracking and SSRF protection.
- Risk engine: deterministic rules in `src/rule-engine.js`.
- Rule engine: deterministic signal normalization, scoring, manipulation tactics, transfer risk, and recovery boost.
- PWA manifest: `public/manifest.webmanifest`.
- Service worker: `public/sw.js`, app-shell cache with API bypass.
- Test framework: Node built-in test runner.

## Audit Table

| Khu vực | Hiện trạng | File liên quan | Vấn đề | Hướng xử lý |
|---|---|---|---|---|
| Frontend framework | HTML/CSS/JS thuần, không React/Vue | `public/index.html`, `public/app.js`, `public/styles.css` | `app.js` và CSS lớn, nhiều trách nhiệm trong một file | Giữ stack hiện tại, tách dần helper dữ liệu/rules khi có lát cắt rõ |
| Backend | Express phục vụ static và API JSON | `server.js` | API vẫn chủ yếu là adapter phân tích, chưa có persistence backend | Bổ sung API contract khi cần, tránh hứa đồng bộ/thông báo thật |
| Routing | Hash routing một trang | `public/app.js`, `public/index.html` | Nhiều route phụ, bottom nav hiện có 5 mục thay vì mục tiêu 4 | Hợp nhất điều hướng dần, đưa học hỏi/hỗ trợ/riêng tư vào avatar menu |
| Database | Không có DB | `package.json` | Không thể lưu đa thiết bị, phân quyền thật, moderation thật | Duy trì local-first, ghi rõ giới hạn, thiết kế contract trước khi thêm backend |
| ORM | Không có ORM | `package.json` | Không có migration hiện tại | Không thêm ORM khi chưa có yêu cầu persistence backend rõ |
| Authentication | Local account/dialog demo | `public/app.js`, `public/index.html` | Không xác thực server, không bảo vệ dữ liệu đa thiết bị | Không ghi là đăng nhập thật; nếu thêm sync cần thiết kế auth riêng |
| State management | Global browser state và DOM refs | `public/app.js` | Khó mở rộng case/evidence nếu tiếp tục nhân pipeline | Chuẩn hóa model kết quả và helpers local storage trước |
| LocalStorage | Lưu history, evidence, case, family, privacy | `public/app.js` | Chưa có schema version rõ cho mọi dữ liệu | Thêm model local có version và migration nhẹ khi mở rộng |
| API | `/api/chat`, `/api/phan-tich`, `/api/kiem-tra-*` | `server.js`, `public/services.js` | Các pipeline phân tích vẫn trả nhiều shape riêng | Bổ sung envelope tổng hợp tương thích ngược |
| AI provider | Gemini hoặc OpenAI-compatible structured output | `src/gemini.js` | Schema hiện chủ yếu là boolean signals, chưa có `ScamAnalysisResult` đầy đủ | Giữ AI chỉ bật cờ; rule engine dựng structured result cuối cùng |
| OCR | Media gửi backend để AI đọc nội dung | `src/gemini.js`, `server.js` | Chưa tự chạy QR/entity extraction đầy đủ trên cùng một ảnh | Tạo unified intake sau khi có model kết quả tổng hợp |
| Speech-to-Text | Web Speech API trong browser | `public/services.js`, `public/app.js` | Phụ thuộc trình duyệt; chưa có server STT | Giữ fallback thân thiện, không tuyên bố STT luôn có |
| QR decoder | `jsQR` browser-side | `public/services.js`, `public/app.js` | QR và media analysis còn là các workflow cạnh nhau | Gộp kết quả QR vào unified result/evidence |
| URL checker | Backend resolve redirect, chống SSRF | `src/link-shield.js`, `server.js` | Chỉ kiểm tra khi route link được gọi | Tự nhận diện URL từ nội dung và gọi checker khi phù hợp |
| Risk engine | Deterministic, đã test rộng | `src/rule-engine.js`, `test/rule-engine.test.js` | Chưa xuất đủ summary, data status, next question, limitations | Thêm builder structured result quanh engine hiện có |
| Manipulation detection | Đã có tactic rules trong risk engine | `src/rule-engine.js` | Tín hiệu yêu cầu mới chưa được bao phủ hết | Mở rộng signal/rule/tactic có test, vẫn tối đa 3 hiển thị trong UI |
| Scam Journey | Rule-based stage classifier | `src/journey-engine.js` | Case lifecycle chưa đủ đổi tên/đóng/xóa/nối tự động | Nâng cấp Case model local trước khi thêm UI nhiều bước |
| PWA manifest | Có manifest cơ bản | `public/manifest.webmanifest` | Chưa có Web Share Target | Thêm share target route/action nếu service worker và UI intake sẵn sàng |
| Service worker | Cache shell, bỏ qua API | `public/sw.js` | Offline copy chưa nêu rõ giới hạn ở mọi flow | Thêm offline banner/result limitation trong structured result |
| Components trùng lặp | Desktop/mobile nav và nhiều form riêng | `public/index.html`, `public/app.js`, `public/styles.css` | Nguy cơ drift giữa home, check hub, link, transfer, case | Hợp nhất qua shared result renderer và shared intake helpers |
| Nút chưa hoạt động | Không thấy empty button blocker trong baseline tests | `test/frontend-contract.test.js` | Vẫn cần browser console/manual click audit cho flow dài | Thêm contract tests cho route/action mới khi sửa |
| Mock/local-only data | Reputation demo, family/evidence/privacy local-only | `src/reputation-engine.js`, `public/services.js` | Có thể gây hiểu nhầm nếu copy UI nói như đã gửi/đồng bộ | Giữ nhãn local-only, không ghi “đã gửi” khi chỉ mở share sheet |
| Type/lint/build/console | Không có TypeScript/linter; syntax/test/build pass | `package.json` | Browser console chưa được Playwright kiểm tra trong baseline | Khi sửa UI lớn, chạy thêm browser smoke test |

## Current Risk Notes

- Do not rename the low-risk label to “An toàn”. The invariant label is “Chưa thấy dấu hiệu rủi ro”.
- Do not let AI decide the final risk level. AI may extract signals; local rules decide.
- Do not claim file, notification, report, family sharing, or recovery outcomes happened unless the app can verify them.
- Do not introduce a database or migration in this pass; current data is local-only and user-owned.
- Avoid large visual rewrites while existing `public/app.js`, `public/index.html`, and `public/khoan-da-2026.css` are already modified in the worktree.
