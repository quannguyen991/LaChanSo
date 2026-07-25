# Audit onboarding Khoan Da - 2026-07-24

## Kien truc hien tai

- Frontend: HTML, CSS va JavaScript thuan trong `public/`.
- Backend: Node.js + Express trong `server.js`.
- Database va authentication: khong co. Du lieu nguoi dung dang luu cuc bo trong `localStorage`.
- Design system: token tap trung trong `tokens.css`, font Lexend/Nunito Sans va IconScout Unicons vendored.
- API: phan tich tinh huong, chuyen khoan, Scam Journey, link/QR va reputation.
- Test: Node test cho API, rule engine, media, link, journey, Gemini adapter, contrast va frontend contract.

## Bang doi chieu

| Tinh nang | Trang thai hien tai | File lien quan | Co the tai su dung | Viec can lam |
|---|---|---|---|---|
| Onboarding 4 buoc | Chua co | - | Tai su dung logo, anh ong ba, avatar, token va icon | Xay 4 man hinh that, luu trang thai, bo qua/quay lai/mo lai |
| Trang chu | Hoat dong, mobile dung hero anh tham chieu | `public/index.html`, `public/app.js`, `public/styles.css` | Co | Sua goc anh/hover, dong bo composer va design system onboarding |
| Phan tich van ban/anh/PDF | Hoat dong qua API that khi co Gemini key; co rule fallback | `server.js`, `src/gemini.js`, `src/rule-engine.js` | Co | Tai su dung trong composer |
| Giong noi | Hoat dong bang Web Speech API, co fallback | `public/app.js`, `public/services.js` | Co | Khong xin quyen trong onboarding; chi kich hoat khi nguoi dung bam |
| Link/QR | Hoat dong, co QR decode va SSRF protection | `src/link-shield.js`, `public/app.js` | Co | Mo nhu flow rieng trong Check Hub |
| Kiem tra chuyen khoan | Hoat dong | `server.js`, `public/app.js` | Co | Tai su dung flow rieng |
| Ket qua rui ro | Hoat dong, 3 muc, toi da 3 ly do/hanh dong | `src/rule-engine.js`, `public/app.js` | Co | Tai su dung trong hoi thoai ngan |
| Scam Journey/Vu viec | Hoat dong cuc bo | `src/journey-engine.js`, `public/app.js` | Co | Giu ro nhan local-only |
| SOS va dung thong minh | Hoat dong: 60 giay, TTS, goi ho tro, bang chung | `public/index.html`, `public/app.js` | Co | Giu va dong bo giao dien |
| Evidence Pack/bao cao | Hoat dong cuc bo, xuat file; chua ma hoa | `public/app.js` | Co | Giu thong bao trung thuc |
| Gia dinh/Vong tin cay | Toi da 5 lien he, phan quyen cuc bo | `public/app.js` | Co | Them loi moi/trang thai ro la local, khong gia gui tu xa |
| Hotline | Doc tu config cuc bo | `public/config/support-directory.json` | Co | Dua vao menu avatar |
| Bai luyen | 11 bai tuong tac | `public/app.js` | Co | Dua vao menu Hoc hoi |
| Privacy Center | Hoat dong cuc bo, retention/xoa/xuat/one-time | `public/app.js` | Co | Dua vao menu avatar |
| PWA offline | Co manifest, chua co service worker | `public/manifest.webmanifest` | Mot phan | Them cache cho shell va huong dan khan cap |
| Android caller ID/call blocking/APK scan | Khong co, khong the lam tren web | - | Khong | Chi ghi ro can ung dung Android |
| Backend da nguoi dung, dong bo, moi tu xa, xac nhan hai nguoi | Chua co | - | Khong | Can database, auth, ma hoa va notification backend |

## Mock va du lieu cuc bo

- Reputation provider va bao cao cong dong chua co backend that; giao dien phai tiep tuc ghi ro trang thai minh hoa/chua gui.
- Onboarding step 3 la demo giai thich san pham theo brief, khong goi AI.
- Contact, case, evidence, privacy audit, education progress va recovery mode luu trong `localStorage`.
- Khong duoc tuyen bo da moi nguoi than, da gui canh bao hoac da dong bo neu chua co backend.
