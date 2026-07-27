# Khoan Đã — hướng dẫn cho Claude

> Đọc hết file này trước khi sửa bất cứ thứ gì. Phần "Ràng buộc bất biến" là
> cam kết đạo đức của sản phẩm, không phải sở thích thẩm mỹ.

## Sản phẩm là gì

Ứng dụng web (PWA) giúp **người cao tuổi Việt Nam** nhận ra lừa đảo và **dừng
lại trước khi chuyển tiền**.

- **Tên thương hiệu: "Khoan Đã"** (chốt 27/7/2026). Viết hoa chữ Đ ở logo và
  `manifest.name`; thẻ `<title>` dùng dạng thường "Khoan đã – Dừng lại trước khi
  chuyển tiền". Dòng dưới logo: "Cùng bạn an toàn trong thế giới số".
  Tên cũ "Khoan Đã" ĐÃ BỎ — gặp ở đâu thì sửa, đừng dùng lại.
- Người dùng mẫu: bác 70 tuổi, mắt kém, tay run, **đang hoảng**, kẻ lừa đảo vẫn
  đang nói ở đầu dây bên kia. Không phải người rảnh rỗi ngắm giao diện.
- Tiêu chí đánh giá mọi thay đổi giao diện, một câu:
  **mở app ra, trong 5 giây có tìm được nút cần bấm không?**

## Ràng buộc bất biến — KHÔNG được phá

### 1. Ba nhãn mức rủi ro

| Mức | Chữ hiển thị (bất biến) | Màu |
|---|---|---|
| Cao | `Nguy hiểm cao` | đỏ |
| Vừa | `Nghi ngờ` | vàng/cam |
| Thấp | `Chưa thấy dấu hiệu rủi ro` | xanh lá |

⚠️ **TUYỆT ĐỐI KHÔNG đổi mức thấp thành "An toàn"** hay bất kỳ biến thể nào.
Hệ thống chỉ nói *"chưa thấy dấu hiệu trong thông tin bác cung cấp"* — nó
**không hứa** an toàn. Hứa sai ở đây là đẩy người ta vào chỗ mất tiền.

Nguồn sự thật là **code, không phải CSS**: `src/rule-engine.js` và
`public/app.js` giữ ba chuỗi này làm khoá đối tượng. Sửa giao diện không đụng
tới được — và đừng tạo đường nào để đụng tới.

### 2. AI chỉ bật cờ, LUẬT CỨNG mới quyết định

`src/gemini.js` chỉ trích xuất **tín hiệu boolean**. `src/rule-engine.js` mới
tính điểm và ra mức rủi ro. Đừng để mô hình tự phán mức rủi ro — như vậy nó có
thể bịa ra "an toàn" khi bị prompt-injection từ chính tin nhắn lừa đảo.

Mọi thứ thông minh thêm vào **chỉ được làm tăng cảnh giác, không bao giờ giảm**.

### 3. Sàn tiếp cận (đã có test chặn)

| Thứ | Sàn | Test chặn |
|---|---|---|
| Vùng chạm | **52px** (`--touch-target`) | `test/font-size-floor.test.js` |
| Nút chính | **56px** (`--touch-target-primary`) | nt |
| Cỡ chữ | **14px** ở gốc 17px (`--text-xs`) | nt |
| Tương phản chữ | 4.5:1 | `test/contrast.test.js` |
| Tương phản viền | 3:1 (WCAG 1.4.11) | `test/non-text-contrast.test.js` |

- `--touch-target-primary` là `max(56px, 3.5rem)`, **không phải `3.5rem` trần** —
  ở bậc chữ nhỏ nhất (15px) rem trần chỉ ra 52,5px, tức vi phạm.
- **Không bao giờ nướng chữ vào ảnh.** Nút chỉnh cỡ chữ (A / A+ / A++) phải
  phóng được **mọi** chữ. Đã từng có ảnh hero chứa tiêu đề dạng pixel — nút cỡ
  chữ vô dụng đúng ở dòng to nhất trang. Đã xoá, đừng lặp lại.
- **Không truyền đạt rủi ro chỉ bằng màu** — người cao tuổi tỉ lệ mù màu và đục
  thuỷ tinh thể cao. Luôn kèm **chữ + biểu tượng**.
- **Không dùng `white-space: nowrap` cho nút.** Nhãn tiếng Việt dài hơn tiếng
  Anh ~30%; ở cỡ chữ A++ nút bị cắt chữ mà không có cách nào cuộn để đọc lại.

### 4. Tiếng Việt

- Dài hơn tiếng Anh ~30% → đừng thiết kế nút vừa khít chữ.
- Dấu xếp **cả trên lẫn dưới** (ế, ộ, ữ, ị, ặ) → `line-height` dưới 1.25 là cắt
  dấu. Dùng token `--leading-*`.
- Giọng văn: gọi người dùng là **"bác"**, câu ngắn, không thuật ngữ.

## Chạy dự án

```bash
npm install
npm start          # cổng 8089 (đã đăng ký trong port-registry)
npm test           # node --test — 130 test
npm run check      # kiểm cú pháp server.js, app.js, services.js, sw.js
npm run build      # xuất ra dist/
```

- Cổng **8089** là cố định cho dự án này. Kiểm trước khi chạy:
  `python ~/.claude/scripts/port_manager.py check 8089`
- `.env` **không** được commit (đã có trong `.gitignore`). Xem `.env.example`.

## Cấu trúc

```
tokens.css              # nguồn sự thật cho màu, thang chữ, khoảng cách, vùng chạm
public/index.html       # mọi màn hình là một <section class="view">, điều hướng bằng hash
public/styles.css       # ~6.400 dòng, ~24 ngưỡng màn hình — NỢ KỸ THUẬT, xem dưới
public/app.js           # toàn bộ logic giao diện, ánh xạ id -> phần tử dựng 1 lần lúc tải
src/rule-engine.js      # LUẬT CỨNG quyết định mức rủi ro
src/gemini.js           # gọi AI, chỉ lấy tín hiệu boolean
test/                   # node --test
test-utils/             # tiện ích dùng chung (KHÔNG đặt trong test/ vì node coi mọi .js ở đó là test)
```

## Nợ kỹ thuật cần biết

1. **`public/styles.css` ~6.400 dòng, ~24 ngưỡng màn hình đè nhau.** Đã từng làm
   4 nút biến mất khỏi giao diện mà không ai phát hiện. Khi sửa CSS ở đây:
   **luôn kiểm bằng số đo trên trình duyệt**, đừng tin mắt.
2. **Nhân đôi mobile/desktop trong cùng DOM** — còn hai thanh nav dưới
   (`.bottom-nav` và `.mobile-bottom-nav`) giống hệt nhau. Mobile và desktop nên
   là **một hệ**, không phải hai sản phẩm. Kế hoạch gộp: `plans/nav-merge.md`.
4. Nhiều file `.md` ở gốc repo (AUDIT_, IMPLEMENTATION_REPORT_, PROGRESS…) là
   nhật ký cũ. Tài liệu còn hiệu lực: **file này** và `DESIGN_BRIEF.md`.

## Bẫy đã cắn — đừng cắn lại

- **Service worker phục vụ CSS/HTML cũ khi đang thử.** Sửa xong mà trình duyệt
  không đổi thì gỡ SW + xoá cache trước khi kết luận. Kiểm bằng cách so cái
  server trả về (`curl`) với cái trang đang dùng.
- **HTTP cache cũng giữ `styles.css`** (link không kèm query). Muốn chắc thì
  thay `<link>` bằng URL có `?bust=`.
- **Quét chồng lấn phải dùng `element.checkVisibility()`**, không dùng
  `offsetParent` hay chỉ so hình chữ nhật. Một `<details>` đã đóng vẫn giữ lại
  hình chữ nhật cũ của con → báo chồng lấn giả.
- **Đừng chỉ kiểm "có phần tử nào tràn khỏi màn hình không".** Phải kiểm cả
  **hai phần tử có đè lên nhau không** — đã từng để nút đè lên chữ hướng dẫn mà
  không ai thấy.
- **Kiểm ở cả 3 bậc cỡ chữ (A / A+ / A++) và ở 320/360/375/768/1280px.** Rất
  nhiều lỗi chỉ xuất hiện ở A++ trên máy nhỏ.

## Quy trình sửa giao diện

1. Sửa code.
2. `npm test` — 130 test phải xanh.
3. Mở `localhost:8089`, quét bằng số đo: tràn ngang, chồng lấn, vùng chạm < 52px,
   cỡ chữ < 14px — ở **cả 3 bậc chữ**.
4. Chỉ báo "xong" khi có **bằng chứng đo được**, không phải "trông có vẻ ổn".

## Việc còn dang dở (có kế hoạch sẵn trong `plans/`)

Hai việc đã được khảo sát kỹ nhưng **CHƯA thực hiện**. Kế hoạch kèm điểm neo
verbatim nằm trong `plans/`:

| Việc | Kế hoạch | Quy mô |
|---|---|---|
| Gộp 2 thanh nav dưới trùng nhau | `plans/nav-merge.md` | 24 sửa đổi, đụng điều hướng toàn cục 16 màn |
| Xoá CSS mồ côi sau khi dọn markup | `plans/dead-css.md` | 27 sửa đổi |

**Trước khi áp:** số dòng trong kế hoạch chỉ là gợi ý — file đã thay đổi sau khi
khảo sát. **Điểm neo (đoạn text verbatim) mới là hợp đồng** — grep lại xác nhận
duy nhất trước khi sửa.

Hai bẫy kế hoạch nav đã chỉ ra, đừng bỏ qua:
- Có 4 rule `display:none` phải **XOÁ**, không được đổi tên — đổi tên là thanh
  nav còn lại biến mất.
- Khối `@media (max-width: 55.99rem)` phải **DI CHUYỂN** vào khối `40rem`, không
  được đổi tên tại chỗ — 55.99rem phủ cả máy tính bảng, đổi tên tại chỗ sẽ khiến
  nhãn nav nhảy 14,9px→17px ở khổ 641–895px.

### Nợ khác

- `--leading-*` (5 token) khai báo mà **chưa dùng ở đâu**. Tiêu đề hero đang có
  tỉ lệ `line-height` **1,08** — nét dấu tiếng Việt tràn 8px trên/dưới hộp dòng,
  hiện chưa bị cắt chỉ vì đệm 34px đỡ được. Áp `--leading-tight` (1.3) sẽ sửa
  đúng chỗ, nhưng đổi chiều cao mọi khối nên phải đo lại 16 màn × 3 cỡ chữ.
- Bậc chữ "small" là 15px, dưới sàn 17px của brief. Đã đo: nâng thang lên
  17/20/24 thì 13 màn vẫn sạch **nhưng hộp cảnh báo vượt nếp gấp**. Cần quyết định.

## ⚠️ Hai lỗ hổng hàng rào CHƯA vá (biết rồi, chưa làm)

### 1. Không có test chặn ảnh chữ-nướng

Đây là lỗi **đã quay lại 2 lần**: sửa 26/7 sáng → quay lại 27/7 trưa, CI vẫn xanh
cả hai lần. Hiện chỉ có một dòng *ghi chú* trong `frontend-contract.test.js`, ghi
chú thì không chặn được ai.

**Trạng thái hiện tại — LỖI ĐANG CHẠY:** `mobile-home-top-reference.webp`
(375×270) nằm ở đầu trang chủ điện thoại. Đã đo: ảnh **không đổi kích thước ở cả
3 bậc chữ**; chữ thật "Khoan Đã" có `visible: false`, chữ thật "Bác đang gặp tình
huống gì?" rộng **1px ở toạ độ x = −1**. Tức chữ bác nhìn thấy là pixel, nút
A/A+/A++ vô tác dụng đúng chỗ chữ to nhất.

Đã thống nhất **để bản thiết kế mới xử lý**, không vá tay.

**Test cần viết (khi có thiết kế mới):** danh sách chặn các asset ĐÃ XÁC MINH có
chữ nướng — `mobile-home-top-reference`, `mobile-home-screen-reference`,
`home-hero-reference*`, `mobile-home-hero-reference` — cộng thêm khẳng định
tiêu đề thật tồn tại VÀ không bị `visually-hidden`/1px. Không đủ nếu chỉ kiểm
tên file: phải kiểm chữ thật có hiện không.

### 2. Sàn vùng chạm mới vá 1 chỗ, còn 34

`min-height` dưới 52px ở bậc chữ A (gốc 15px) còn **34 khai báo**: `2.75rem`
=41,3px · `3rem`=45px · `3.25rem`=48,8px. Mới vá đúng `.mobile-bottom-nav__item`
vì đó là chỗ đo được trên trang chủ.

**Không vá mù được** — trong 34 chỗ có cả icon và nhãn (`1.2rem`, `1.5rem`)
không phải vùng chạm. Cần đo trên trình duyệt qua **cả 16 màn × 3 bậc chữ**, rồi
chỉ kẹp `max(var(--touch-target), …)` cho phần tử thật sự bấm được.

Bài học chung: `test/font-size-floor.test.js` quét tĩnh được vì cỡ chữ suy ra
thẳng từ `rem`. Vùng chạm thì không — nó phụ thuộc padding, line-height và phần
tử có hiện hay không. **Muốn chặn thật thì cần test chạy trình duyệt**, chưa có.
