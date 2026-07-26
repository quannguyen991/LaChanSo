# Gộp 2 thanh điều hướng dưới thành một

> Kế hoạch do recon sinh ra, ĐÃ KIỂM nhưng CHƯA THỰC HIỆN.
> Số dòng chỉ là gợi ý — file đã đổi sau khi phân tích. ĐIỂM NEO mới là hợp đồng: grep lại trước khi áp.

## Tóm tắt
MERGE PLAN — collapse `.mobile-bottom-nav` into `.bottom-nav`. READ-ONLY analysis; nothing edited. Baseline verified: `node --test` = 130 pass, 0 fail.

⚠️ FILES ARE MOVING UNDER YOU. `public/styles.css` changed TWICE while I analysed it (commits `61e859f`, then `1f44fb7` "refactor: drive the font-size ladder from tokens.css" at 20:58). Every line number below shifted +1 mid-analysis. All line numbers are HINTS captured at styles.css md5 `6fa6d69eb58c1ef8866e83c1914cb99e`. The ANCHORS are the contract — every one was copied verbatim from the current file and machine-verified to occur exactly once (all 27 anchors: count=1). Re-grep before applying. Note: styles.css/index.html are CRLF; normalize `\r\n` when string-matching.

═══ 1. THE TWO BLOCKS, VERBATIM ═══

`public/index.html` lines 1713–1732 (survivor) and 1734–1753 (loser), adjacent, separated by one blank line 1733.

They are NOT byte-identical. Four differences, all class/label — everything else matches exactly:

| | nav A (1713) | nav B (1734) |
|---|---|---|
| nav class | `bottom-nav` | `mobile-bottom-nav` |
| aria-label | `Điều hướng chính` | `Điều hướng điện thoại` |
| inner class | `bottom-nav__inner` | `mobile-bottom-nav__inner` |
| item class | `bottom-nav__item` | `bottom-nav__item mobile-bottom-nav__item` |

IDENTICAL in both: order (Trang chủ → Kiểm tra → Vụ việc → Gia đình), all four `href`, all four `data-route` (`#trang-chu`, `#kiem-tra`, `#hanh-trinh`, `#gia-dinh`), all four icons (`icon-home`, `icon-search`, `icon-route`, `icon-users`), all four label strings, `aria-hidden="true"` on every icon span, indentation. No `id`, no other `data-*` on either.

THE LOAD-BEARING DETAIL: nav B's items carry **both** classes. `.bottom-nav__item` is already the shared base class — it is on all 8 links today. That single fact makes app.js need zero changes and makes `.bottom-nav__item` rules already leak into the mobile nav today (which the CSS analysis below depends on).

═══ 2. SURVIVOR: `.bottom-nav` ═══

Keep `.bottom-nav` / `.bottom-nav__inner` / `.bottom-nav__item`. Delete `.mobile-bottom-nav*`. Reasons, strongest first:
1. `.bottom-nav__item` is already on all 8 links and is what `app.js` queries. Keeping it = no JS change and no risk of `updateBottomNav` silently no-oping.
2. CLAUDE.md §"Nợ kỹ thuật" #3 says mobile and desktop must be ONE system. A class named `mobile-` that renders at 1280px is a lie in the source. `.bottom-nav` is viewport-neutral.
3. `aria-label="Điều hướng chính"` (main navigation) is correct at every width. `"Điều hướng điện thoại"` (phone navigation) is wrong at desktop — dropping it is a screen-reader improvement, not a loss.

The *visual design* is chosen per breakpoint, not per class: the phone look (edge-anchored rounded card) and the wide look (centred floating grid) both survive, retargeted onto `.bottom-nav`. Goal is pixel-identical output at every width. Only the DOM and class names change.

═══ 3. EVERY CSS SITE (public/styles.css, 27 occurrences) ═══

RESOLVED VISIBILITY GATES — these are the four rules that must be DELETED, not renamed. Renaming any of them makes the survivor invisible:
- L4956 `.mobile-bottom-nav,` inside top-level group `.mobile-action-grid, .mobile-trust-strip, .mobile-bottom-nav, .emergency-banner__* { display: none }` → DELETE the one line (E2). Renaming would hide `.bottom-nav` by default at all widths.
- L5283 `.bottom-nav { display: none }` @media (max-width: 40rem) → DELETE (E3). Hides the survivor on phones.
- L6286 `.bottom-nav { display: none !important }` @media (max-width: 40rem) → DELETE (E14). Same, with `!important`.
- L6142 `.mobile-bottom-nav { display: none !important }` @media (min-width: 40.0625rem) → DELETE (E13). Renaming kills the survivor at ≥641px.
- L5486 `body:has(#homeView:not([hidden])) .mobile-bottom-nav { display: block }` @media (max-width: 40rem) → DELETE (E12). Redundant: L6294 already sets `display: block` in the same breakpoint. Renaming is an equally safe fallback.

PROVABLY DEAD — DELETE. Every declaration in each is re-declared later in the SAME breakpoint by the L6290 block (verified property-by-property):
- L5287–5296 `.mobile-bottom-nav` @(max-width:40rem) — position/z-index/inset/display/padding/border-block-start/background/box-shadow all re-set at L6291–6300 (`border` shorthand supersedes `border-block-start`). DELETE (E3).
- L5298–5303 `.mobile-bottom-nav__inner` @(max-width:40rem) — display/grid-template-columns/width/min-height all re-set at L6304–6308. DELETE (E3).
- L5305–5318 `.mobile-bottom-nav .mobile-bottom-nav__item` @(max-width:40rem) — all 12 props are a strict subset of L6313–6327. DELETE (E3).
- L5320–5323 `... .icon` (1.55rem) @(max-width:40rem) — superseded by L6330 then L6411. DELETE (E3).
- L5325–5328 `...[aria-current="page"]` @(max-width:40rem) — background+color re-set at L6336–6337. DELETE (E3).
- L5376 `... { font-size: 0.88rem }` @(min-width:32rem) and (max-width:40rem) — superseded by L6404 (later, same 0,2,0 specificity, ≤55.99rem covers it). DELETE (E9).
- L5447–5449 `... { font-size: var(--text-xs) }` @(max-width:23rem) — same reason. DELETE (E10).
- L6365 `.mobile-bottom-nav__item:hover,` @(hover:hover) and (pointer:fine) — L6364 `.bottom-nav__item:hover` already covers it. DELETE the selector line (E19).

RENAME — these carry live declarations nothing else re-declares. Keep the two-class DESCENDANT form (`.bottom-nav .bottom-nav__item`), do NOT flatten (see risk R3):
- L5332 `.mobile-bottom-nav .mobile-bottom-nav__item` (transition) @(max-width:40rem) → `.bottom-nav .bottom-nav__item` (E4)
- L5338 `...:active` (translateY 1px) @(max-width:40rem) → (E5)
- L5344 `...[aria-disabled="true"]` @(max-width:40rem) → (E6)
- L5353 `...:hover` (translateY −1px) @(max-width:40rem) >> @(hover:hover) and (pointer:fine) → (E7)
- L5361 `...` (touch-action) @(max-width:40rem) >> @(pointer:coarse) → (E8)
- L5455 `.mobile-bottom-nav__item,` @(max-width:40rem) and (prefers-reduced-motion:reduce) → `.bottom-nav__item,` (E11)
- L6290–6301 `.mobile-bottom-nav` @(max-width:40rem) → `.bottom-nav` (E14). This is THE phone presentation.
- L6303–6310 `.mobile-bottom-nav__inner` @(max-width:40rem) → `.bottom-nav__inner` **plus four reset declarations** (E15) — see R1, this is the one edit that is not a pure rename.
- L6312–6328 `.mobile-bottom-nav .mobile-bottom-nav__item` @(max-width:40rem) → (E16)
- L6330–6332 `... .icon` (1.15rem) @(max-width:40rem) → (E17)
- L6335–6337 `...[aria-current="page"]` @(max-width:40rem) → (E18)
- L6340–6342 `...[aria-current="page"] .icon` @(max-width:40rem) → (E18)

MOVE, don't rename in place — L6404–6409 (`font-size: clamp(0.875rem, 3.4vw, 1rem); line-height: 1.15; white-space: normal`) and L6411–6414 (`.icon { width/height: 1.5rem }`), both @media (max-width: 55.99rem). 55.99rem = 895.84px, so this block ALSO covers tablets. Today those selectors name `.mobile-bottom-nav`, which is `display:none` above 640px, so they never touch the tablet nav. Rename them in place and they suddenly apply at 641–895px: labels jump 14.9px→17px, `nowrap`→`normal`, icons 1.25rem→1.5rem. Fix: delete them from the 55.99rem block (E20) and re-add them, renamed, at the END of the ≤40rem block right after the `[aria-current] .icon` rule (E18). Source position is preserved relative to L6312/L6330, so the cascade is bit-identical.

UNTOUCHED — no `.mobile-bottom-nav` token, no change needed:
L99, L1997, L2932, L3321, L4292 (all `var(--bottom-nav-height)`); L2181–2235 (base); L2314/L2318 (hover, already applies to both navs today); L3593–3618 @(min-width:56rem); L3659–3680 @(min-width:72rem) and (max-height:56rem); L4474–4498; L4525 @(min-width:40rem); L4706–4712 @(min-width:56rem); L4888–4899 and L4941–4949 @(max-width:30rem); L6146–6197 @(min-width:40.0625rem) — the wide presentation, untouched; L6364.
FYI, dead-but-harmless: the 56rem and 72rem blocks (including the vertical side-rail at L3659) are already fully overridden by the later top-level L4474 rules and by L6146 — they render nothing today and still render nothing after the merge. The ≤30rem `.bottom-nav*` rules go from dead to live-but-shadowed (L6303/L6313 win on every overlapping property, and L4945 is deliberately out-specificity'd by E18's `html[data-font-size]` selector). Confirm with measurement, don't touch them in this change.

═══ 4. app.js — ZERO CHANGES REQUIRED ═══
Only two reference sites, both fine because `.bottom-nav__item` is already the shared class:
- L479 `bottomNavItems: document.querySelectorAll(".bottom-nav__item"),` — inside the one-shot `elements` map built at load. Returns 8 today, 4 after. Static NodeList, node removed at author time, so no staleness.
- L2627–2635 `function updateBottomNav(hash)` — iterates `elements.bottomNavItems`, sets/removes `aria-current="page"` by `item.dataset.route === hash`. Both navs get `aria-current` today (harmless, one is hidden); after the merge exactly one set does. No class checks, no active-tab logic anywhere else. No `querySelector` for `.mobile-bottom-nav`, no reference to `aria-label="Điều hướng điện thoại"`.

═══ 5. TEST ASSERTIONS THAT MUST CHANGE (test/frontend-contract.test.js) ═══
Four break, one becomes vacuous. Exact current text:
- L88 `    "mobile-reference-top", "mobile-situation-form", "mobile-bottom-nav"` — FAILS (class gone from html). → E21
- L101 `  assert.match(styles, /@media \(max-width: 40rem\)[\s\S]*?\.mobile-bottom-nav/);` — FAILS. → E22, replaced by a much stronger guard (`doesNotMatch` on both files + exactly-one-nav count).
- L155 `  const mobileNav = html.match(/<nav class="mobile-bottom-nav"[\s\S]*?<\/nav>/)?.[0] || "";` — yields `""`, so L162's four `assert.match(mobileNav, …)` all FAIL. → E23
- L164 `  assert.doesNotMatch(mobileNav, /href="#lich-su"/);` — passes VACUOUSLY against `""`. Silent rot. → E23
- L168 `  assert.match(styles, /\.mobile-bottom-nav[\s\S]*?border-radius:\s*var\(--radius-xl\)/);` — FAILS. → E23
- L154 test title `"desktop and mobile taskbars share routes and render cross-browser icons"` — the premise is gone. → E23
STILL PASS untouched: L102 `grid-template-columns: repeat(4, minmax(0, 1fr))` (L6305/L6157), L167 `@media (min-width: 40.0625rem) … repeat(4` (L6157). No other test file references the nav; `font-size-floor.test.js` scans every `font-size:` line in styles.css — the merge removes lines and adds none below 14px @17px root, so it stays green.

═══ 6. WHAT YOU MUST SEE AFTER THE MERGE ═══
Everywhere: exactly ONE `<nav class="bottom-nav" aria-label="Điều hướng chính">` in the DOM, exactly 4 `.bottom-nav__item` links, visible on all 16 views, active tab tracking the hash. `document.querySelectorAll('.bottom-nav__item').length === 4`.

**375px** (identical to today's phone nav): a rounded card (`--radius-xl`) pinned to the bottom with ~8.5px (`0.5rem`) of gap on left/right/bottom (or safe-area, whichever is larger), 1px `--color-rule` border, `color-mix(surface 94%, sky-soft)` background, `--shadow-lg`, `overflow: clip`. Inside, a 4-column grid, 4.25px gap, 4.25px padding, min-height 4.25rem ≈ 72px @17px root — with NO border, NO shadow, NO pill background of its own. Each tab is icon-above-label, icon 1.5rem ≈ 25.5px, label `clamp(0.875rem, 3.4vw, 1rem)` → 14.9px @17px root, line-height 1.15, wrapping allowed, weight 700, min-height 3.75rem ≈ 63.75px. Active tab: `--color-accent-soft` fill, `--color-accent` text, `--radius-lg`. The old centred pill must NOT appear anywhere.

**768px** (must be PIXEL-IDENTICAL to today): a centred floating bar 12px above the bottom, inner width `min(100% − 2rem, 52rem)` = 734px @17px root, min-height 4.75rem ≈ 80.75px, 1px border, `--radius-xl`, `color-mix(surface 94%, sky-soft)`, `--shadow-lg`. Items: icon 1.25rem ≈ 21.25px above label at `--text-xs` = 14.9px, line-height 1, `nowrap`, min-height 3.75rem ≈ 63.75px. Wrapper is `pointer-events: none`, inner is `pointer-events: auto`. If labels or icons got BIGGER here, E18/E20 were done wrong.

**1280px** (must be PIXEL-IDENTICAL to today): same as 768px; only the inner width differs — `min(1246px, 884px)` = 884px @17px root (780px at A, 1040px at A++).

═══ 7. WHAT WOULD REGRESS ═══ (detail in `risks`)
R1 inner double-chrome at ≤640px (the single most likely bug). R2 tablet type/icon inflation at 641–895px. R3 specificity collapse if you flatten `.bottom-nav .bottom-nav__item`. R4 the ~1px dead band at 640.01–640.99px. R5/R6 pre-existing `nowrap` + `line-height: 1` on nav items violate CLAUDE.md §3/§4. R7 concurrent edits. R8 `--bottom-nav-height` is an unmeasured constant feeding four unrelated rules. Touch targets stay ≥52px at all three font steps (3.75rem = 56.25 / 63.75 / 75px at 15 / 17 / 20px roots) and labels stay ≥14px at the 17px root the floor test uses.

## Các sửa đổi (24)

### [1] public/index.html (delete-lines) ~dòng 1734-1753, plus the blank line 1733 that separated the two navs. After the edit, line 1732 `    </nav>` (survivor) is followed by one blank line then `    <dialog class="danger-dialog"...`.
LÝ DO: Removes the duplicate nav. The survivor at 1713-1732 already carries the same four routes, icons and labels, and its items already have the .bottom-nav__item class that app.js binds to.

--- NEO ---
    <nav class="mobile-bottom-nav" aria-label="Điều hướng điện thoại">
      <div class="mobile-bottom-nav__inner">
        <a class="bottom-nav__item mobile-bottom-nav__item" href="#trang-chu" data-route="#trang-chu">
          <span class="icon icon-home" aria-hidden="true"></span>
          <span>Trang chủ</span>
        </a>
        <a class="bottom-nav__item mobile-bottom-nav__item" href="#kiem-tra" data-route="#kiem-tra">
          <span class="icon icon-search" aria-hidden="true"></span>
          <span>Kiểm tra</span>
        </a>
        <a class="bottom-nav__item mobile-bottom-nav__item" href="#hanh-trinh" data-route="#hanh-trinh">
          <span class="icon icon-route" aria-hidden="true"></span>
          <span>Vụ việc</span>
        </a>
        <a class="bottom-nav__item mobile-bottom-nav__item" href="#gia-dinh" data-route="#gia-dinh">
          <span class="icon icon-users" aria-hidden="true"></span>
          <span>Gia đình</span>
        </a>
      </div>
    </nav>

--- THAY BẰNG ---

--- HẾT ---

### [2] public/styles.css (replace) ~dòng ~4954-4957, top-level group ending `.emergency-banner__cta { display: none; }`
LÝ DO: REQUIRED DELETE, not rename. This top-level rule hides the mobile nav by default at every width. Renaming it to .bottom-nav would hide the survivor everywhere except inside the two media blocks that re-show it — including the ~1px band at 640.01-640.99px where neither block matches.

--- NEO ---
.mobile-trust-strip,
.mobile-bottom-nav,
.emergency-banner__title--mobile,
--- THAY BẰNG ---
.mobile-trust-strip,
.emergency-banner__title--mobile,
--- HẾT ---

### [3] public/styles.css (replace) ~dòng ~5283-5330, all inside @media (max-width: 40rem)
LÝ DO: Two things at once. (a) REQUIRED: drops `.bottom-nav { display: none }` which would hide the survivor on phones. (b) Deletes 44 lines that are provably dead: every declaration in this .mobile-bottom-nav / __inner / __item / .icon / [aria-current] run is re-declared later in the SAME breakpoint by the L6290 block, which wins on source order at equal specificity. Verified property-by-property; `border: 1px solid` at L6297 supersedes `border-block-start`, and L6313-6327 is a strict superset of L5306-5317.

--- NEO ---
  .bottom-nav {
    display: none;
  }

  .mobile-bottom-nav {
    position: fixed;
    z-index: 70;
    inset: auto 0 0;
    display: block;
    padding: var(--space-1) max(clamp(var(--space-2), 2vw, var(--space-4)), env(safe-area-inset-right)) max(var(--space-1), env(safe-area-inset-bottom)) max(clamp(var(--space-2), 2vw, var(--space-4)), env(safe-area-inset-left));
    border-block-start: 1px solid var(--color-rule);
    background: var(--color-surface);
    box-shadow: 0 -4px 24px var(--color-shadow);
  }

  .mobile-bottom-nav__inner {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    width: 100%;
    min-height: clamp(4rem, 16vw, 6.75rem);
  }

  .mobile-bottom-nav .mobile-bottom-nav__item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    min-width: 0;
    min-height: clamp(4rem, 16vw, 6.75rem);
    padding: var(--space-2) var(--space-1);
    border-radius: var(--radius-lg);
    color: var(--color-muted);
    font-size: var(--text-xs);
    line-height: 1;
    white-space: nowrap;
  }

  .mobile-bottom-nav .mobile-bottom-nav__item .icon {
    width: 1.55rem;
    height: 1.55rem;
  }

  .mobile-bottom-nav .mobile-bottom-nav__item[aria-current="page"] {
    background: var(--color-accent-soft);
    color: var(--color-accent);
  }

  #homeView .mobile-action,
--- THAY BẰNG ---
  #homeView .mobile-action,
--- HẾT ---

### [4] public/styles.css (replace) ~dòng ~5332, third selector of the group `#homeView .mobile-action, #homeView .emergency-banner--button, …`, inside @media (max-width: 40rem)
LÝ DO: Live rule — the transition is not re-declared anywhere else. Keep the two-class descendant form so specificity stays (0,2,0); see risk R3.

--- NEO ---
.mobile-bottom-nav .mobile-bottom-nav__item {
    transition: transform
--- THAY BẰNG ---
.bottom-nav .bottom-nav__item {
    transition: transform
--- HẾT ---

### [5] public/styles.css (replace) ~dòng ~5338, inside @media (max-width: 40rem)
LÝ DO: Live rule (press feedback translateY(1px)); not re-declared elsewhere.

--- NEO ---
.mobile-bottom-nav .mobile-bottom-nav__item:active {
--- THAY BẰNG ---
.bottom-nav .bottom-nav__item:active {
--- HẾT ---

### [6] public/styles.css (replace) ~dòng ~5344, inside @media (max-width: 40rem)
LÝ DO: Live rule (cursor/opacity/pointer-events for disabled tabs); not re-declared elsewhere.

--- NEO ---
.mobile-bottom-nav .mobile-bottom-nav__item[aria-disabled="true"] {
--- THAY BẰNG ---
.bottom-nav .bottom-nav__item[aria-disabled="true"] {
--- HẾT ---

### [7] public/styles.css (replace) ~dòng ~5353, inside @media (max-width: 40rem) >> @media (hover: hover) and (pointer: fine)
LÝ DO: Live rule (hover lift translateY(-1px)); distinct property from the background-only hover at L6364.

--- NEO ---
.mobile-bottom-nav .mobile-bottom-nav__item:hover {
--- THAY BẰNG ---
.bottom-nav .bottom-nav__item:hover {
--- HẾT ---

### [8] public/styles.css (replace) ~dòng ~5361, inside @media (max-width: 40rem) >> @media (pointer: coarse)
LÝ DO: Live rule — kills the 300ms tap delay on touch. Losing it would make every tab feel laggy for the target user.

--- NEO ---
.mobile-bottom-nav .mobile-bottom-nav__item {
      touch-action: manipulation;
--- THAY BẰNG ---
.bottom-nav .bottom-nav__item {
      touch-action: manipulation;
--- HẾT ---

### [9] public/styles.css (delete-lines) ~dòng ~5376, inside @media (min-width: 32rem) and (max-width: 40rem)
LÝ DO: Dead. L6404 (@media max-width: 55.99rem, same 0,2,0 specificity, later in source) sets font-size for the whole 0-895.84px range and wins. Renaming it would just re-create the duplicate.

--- NEO ---
  .mobile-bottom-nav .mobile-bottom-nav__item { font-size: 0.88rem; }

--- THAY BẰNG ---

--- HẾT ---

### [10] public/styles.css (delete-lines) ~dòng ~5446-5449 (including the blank line above), inside @media (max-width: 23rem)
LÝ DO: Dead for the same reason as the 32rem rule — superseded by L6404.

--- NEO ---

  .mobile-bottom-nav .mobile-bottom-nav__item {
    font-size: var(--text-xs);
  }
--- THAY BẰNG ---

--- HẾT ---

### [11] public/styles.css (replace) ~dòng ~5455, third selector of the group inside @media (max-width: 40rem) and (prefers-reduced-motion: reduce)
LÝ DO: Live rule and an accessibility guarantee — it is the only thing that neutralises the nav's transform animation for users who ask for reduced motion. Single-class form here is correct: it mirrors the other two selectors in the group and only has to beat the transition set in E4.

--- NEO ---
.mobile-bottom-nav__item {
    transition-duration:
--- THAY BẰNG ---
.bottom-nav__item {
    transition-duration:
--- HẾT ---

### [12] public/styles.css (delete-lines) ~dòng ~5486-5489, inside @media (max-width: 40rem)
LÝ DO: Redundant after the merge: L6294 already sets `display: block` on the same element in the same breakpoint. Keeping it renamed would leave a very high-specificity (1,2,1) display override scoped to the home view only — a trap for whoever next tries to hide the nav on one screen. Renaming instead of deleting is an equally safe fallback if you want a smaller diff.

--- NEO ---
  body:has(#homeView:not([hidden])) .mobile-bottom-nav {
    display: block;
  }


--- THAY BẰNG ---

--- HẾT ---

### [13] public/styles.css (replace) ~dòng ~6142-6146, inside @media (min-width: 40.0625rem)
LÝ DO: REQUIRED DELETE. Renaming this to .bottom-nav would apply `display: none !important` to the survivor at every width ≥641px — the nav would vanish on tablet and desktop, and `!important` means nothing downstream could rescue it.

--- NEO ---
  .mobile-bottom-nav {
    display: none !important;
  }

  .bottom-nav {
    position: fixed;
--- THAY BẰNG ---
  .bottom-nav {
    position: fixed;
--- HẾT ---

### [14] public/styles.css (replace) ~dòng ~6286-6292, inside @media (max-width: 40rem)
LÝ DO: REQUIRED. Deletes the `!important` hide of the survivor on phones and, in the same stroke, retargets the phone presentation (position/inset/display/padding/overflow/border/radius/background/shadow, lines through ~6301) onto .bottom-nav. This rule is now THE phone nav.

--- NEO ---
  .bottom-nav {
    display: none !important;
  }

  .mobile-bottom-nav {
    position: fixed;
    z-index: 150;
--- THAY BẰNG ---
  .bottom-nav {
    position: fixed;
    z-index: 150;
--- HẾT ---

### [15] public/styles.css (replace) ~dòng ~6303-6310, inside @media (max-width: 40rem)
LÝ DO: THE ONE NON-MECHANICAL EDIT. `.mobile-bottom-nav__inner` currently matches no other rule in the file. The moment it becomes `.bottom-nav__inner` it starts inheriting four declarations from the wide-screen base rules that nothing in this block overrides: `border-radius: var(--radius-full)` (L4487), `background: var(--color-surface)` (L2197), `box-shadow: var(--shadow-lg)` (L2198), `border: 1px solid var(--color-rule)` (L2199). Without these four resets, every phone user sees a white pill with its own border and shadow nested inside the rounded nav card.

--- NEO ---
  .mobile-bottom-nav__inner {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-1);
    width: 100%;
    min-height: 4.25rem;
    padding: var(--space-1);
  }
--- THAY BẰNG ---
  .bottom-nav__inner {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-1);
    width: 100%;
    min-height: 4.25rem;
    padding: var(--space-1);
    /* Ở khổ điện thoại, khung (viền + nền + bo góc + bóng) nằm ở phần tử
       NGOÀI .bottom-nav. Lớp trong phải xoá lại khung của bản rộng — nếu
       không sẽ thành hai lớp khung lồng nhau: viền đôi, bóng đôi, và một
       viên thuốc bo tròn bị cắt cụt bởi overflow: clip của phần tử ngoài. */
    border: 0;
    border-radius: 0;
    background: none;
    box-shadow: none;
  }
--- HẾT ---

### [16] public/styles.css (replace) ~dòng ~6312-6314, inside @media (max-width: 40rem)
LÝ DO: THE phone tab rule (14 declarations through ~6327). Descendant form is mandatory: at 0,2,0 it beats the single-class `.bottom-nav__item` rules at L2202/L4487; flattening it to 0,1,0 would hand min-height and line-height to `html[data-font-size="large"] .bottom-nav__item` (L4945, 0,2,1) below 480px.

--- NEO ---
  .mobile-bottom-nav .mobile-bottom-nav__item {
    display: flex;
    flex-direction: column;
--- THAY BẰNG ---
  .bottom-nav .bottom-nav__item {
    display: flex;
    flex-direction: column;
--- HẾT ---

### [17] public/styles.css (replace) ~dòng ~6330-6331, inside @media (max-width: 40rem)
LÝ DO: Rename for consistency. Note this rule is itself shadowed by the 1.5rem icon rule moved in by E18, so the rendered icon size does not change — deleting it instead is equally valid, renaming keeps the diff mechanical.

--- NEO ---
  .mobile-bottom-nav .mobile-bottom-nav__item .icon {
    width: 1.15rem;
--- THAY BẰNG ---
  .bottom-nav .bottom-nav__item .icon {
    width: 1.15rem;
--- HẾT ---

### [18] public/styles.css (replace) ~dòng ~6335-6342, inside @media (max-width: 40rem). The appended rules land immediately before `  .danger-dialog {`.
LÝ DO: Renames the active-tab rules AND relocates the two rules deleted by E20 into the phone breakpoint. Placement matters: they must sit after E16/E17 in source order to keep winning, and they do. The `html[data-font-size]` variant (0,3,1) must be kept — it is the only thing beating `html[data-font-size="large"] .bottom-nav__item` (0,2,1) at L4945, which is the label-shrinks-when-you-ask-for-bigger-text bug the original comment says was already fixed once.

--- NEO ---
  .mobile-bottom-nav .mobile-bottom-nav__item[aria-current="page"] {
    background: var(--color-accent-soft);
    color: var(--color-accent);
  }

  .mobile-bottom-nav .mobile-bottom-nav__item[aria-current="page"] .icon {
    transform: none;
  }
--- THAY BẰNG ---
  .bottom-nav .bottom-nav__item[aria-current="page"] {
    background: var(--color-accent-soft);
    color: var(--color-accent);
  }

  .bottom-nav .bottom-nav__item[aria-current="page"] .icon {
    transform: none;
  }

  /* Nhãn thanh điều hướng dưới: 9,8px là không đọc nổi, và bản cũ còn THU NHỎ
     lại khi người dùng bật "Cỡ chữ lớn". Selector phải đủ mạnh để thắng luật
     html[data-font-size="large"] .bottom-nav__item (0,2,1) ở dưới 30rem.
     Hai luật này trước đây nằm trong @media (max-width: 55.99rem) và chỉ nhắm
     .mobile-bottom-nav — tức là CHỈ áp cho điện thoại. Sau khi gộp nav, để
     nguyên chỗ cũ sẽ làm chữ và biểu tượng ở khổ máy tính bảng (641-895px)
     tự dưng to lên. Vì vậy chuyển hẳn vào ngưỡng 40rem. */
  .bottom-nav .bottom-nav__item,
  html[data-font-size] .bottom-nav .bottom-nav__item {
    font-size: clamp(0.875rem, 3.4vw, 1rem);
    line-height: 1.15;
    white-space: normal;
  }

  .bottom-nav .bottom-nav__item .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
--- HẾT ---

### [19] public/styles.css (replace) ~dòng ~6364-6365, inside @media (hover: hover) and (pointer: fine)
LÝ DO: The two selectors already matched the same elements (mobile items carried both classes). One survives.

--- NEO ---
  .bottom-nav__item:hover,
  .mobile-bottom-nav__item:hover {
--- THAY BẰNG ---
  .bottom-nav__item:hover {
--- HẾT ---

### [20] public/styles.css (delete-lines) ~dòng ~6401-6414 plus the blank line 6400 above it, inside @media (max-width: 55.99rem). Numbered comments 1./3./4. remain in that block — renumber or leave, cosmetic only.
LÝ DO: MUST BE DELETED, NOT RENAMED. 55.99rem = 895.84px, so this block covers tablets. Today these selectors name .mobile-bottom-nav, which is display:none above 640px, so they never reach the tablet nav. Rename in place and 641-895px silently gains 17px labels, wrapping, line-height 1.15 and 1.5rem icons. E18 re-adds them, renamed, inside @media (max-width: 40rem) where their reach is unchanged.

--- NEO ---
  /* 2. Nhãn thanh điều hướng dưới: 9.8px là không đọc nổi, và bản cũ còn
        THU NHỎ lại khi người dùng bật "Cỡ chữ lớn". Chọn selector đủ mạnh để
        thắng luật html[data-font-size="large"] .bottom-nav__item. */
  .mobile-bottom-nav .mobile-bottom-nav__item,
  html[data-font-size] .mobile-bottom-nav .mobile-bottom-nav__item {
    font-size: clamp(0.875rem, 3.4vw, 1rem);
    line-height: 1.15;
    white-space: normal;
  }

  .mobile-bottom-nav .mobile-bottom-nav__item .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

--- THAY BẰNG ---

--- HẾT ---

### [21] test/frontend-contract.test.js (replace) ~dòng 88, inside test("mobile home exposes the reference workflow without replacing desktop routes")
LÝ DO: The class no longer exists in index.html, so this loop would fail. The remaining two are still genuine mobile-only surfaces.

--- NEO ---
    "mobile-reference-top", "mobile-situation-form", "mobile-bottom-nav"
--- THAY BẰNG ---
    "mobile-reference-top", "mobile-situation-form"
--- HẾT ---

### [22] test/frontend-contract.test.js (replace) ~dòng 101, inside test("mobile home exposes the reference workflow without replacing desktop routes")
LÝ DO: Replaces an assertion that can only fail with the guard that actually prevents the duplicate from coming back. The two doesNotMatch calls also prove the CSS rename left no orphan selectors.

--- NEO ---
  assert.match(styles, /@media \(max-width: 40rem\)[\s\S]*?\.mobile-bottom-nav/);
--- THAY BẰNG ---
  // MỘT thanh nav, không phải hai. Trước đây index.html chứa cả .bottom-nav
  // lẫn .mobile-bottom-nav trong cùng DOM, loại trừ nhau bằng media query:
  // không được thêm một pixel nào, nhưng mọi thay đổi nav phải làm hai lần.
  assert.doesNotMatch(html, /mobile-bottom-nav/);
  assert.doesNotMatch(styles, /mobile-bottom-nav/);
  assert.equal((html.match(/<nav class="bottom-nav"/g) || []).length, 1);
--- HẾT ---

### [23] test/frontend-contract.test.js (replace) ~dòng 154-169
LÝ DO: Rewrites the test around the single nav, and adds two assertions that lock in the exact things this merge could get wrong: the four-item count (protects app.js's selector contract) and the inner chrome reset from E15.

--- NEO ---
test("desktop and mobile taskbars share routes and render cross-browser icons", () => {
  const mobileNav = html.match(/<nav class="mobile-bottom-nav"[\s\S]*?<\/nav>/)?.[0] || "";
  for (const [hash, label, icon] of [
    ["#trang-chu", "Trang chủ", "icon-home"],
    ["#kiem-tra", "Kiểm tra", "icon-search"],
    ["#hanh-trinh", "Vụ việc", "icon-route"],
    ["#gia-dinh", "Gia đình", "icon-users"]
  ]) {
    assert.match(mobileNav, new RegExp(`href="${hash}"[\\s\\S]*?${icon}[\\s\\S]*?${label}`));
  }
  assert.doesNotMatch(mobileNav, /href="#lich-su"/);
  assert.match(html, /class="profile-menu__links"[\s\S]*?href="#lich-su"[\s\S]*?Lịch sử kiểm tra/);
  assert.match(styles, /-webkit-mask-image:\s*var\(--icon-source\)/);
  assert.match(styles, /@media \(min-width: 40\.0625rem\)[\s\S]*?grid-template-columns:\s*repeat\(4/);
  assert.match(styles, /\.mobile-bottom-nav[\s\S]*?border-radius:\s*var\(--radius-xl\)/);
});
--- THAY BẰNG ---
test("the one bottom taskbar carries every route and renders cross-browser icons", () => {
  const bottomNav = html.match(/<nav class="bottom-nav"[\s\S]*?<\/nav>/)?.[0] || "";
  assert.ok(bottomNav, "thanh điều hướng dưới biến mất khỏi index.html");
  // Bốn tab, không hơn không kém. app.js gắn vào .bottom-nav__item; nếu class
  // này đổi tên, updateBottomNav() im lặng không làm gì mà không báo lỗi.
  assert.equal((bottomNav.match(/class="bottom-nav__item"/g) || []).length, 4);
  for (const [hash, label, icon] of [
    ["#trang-chu", "Trang chủ", "icon-home"],
    ["#kiem-tra", "Kiểm tra", "icon-search"],
    ["#hanh-trinh", "Vụ việc", "icon-route"],
    ["#gia-dinh", "Gia đình", "icon-users"]
  ]) {
    assert.match(bottomNav, new RegExp(`href="${hash}"[\\s\\S]*?${icon}[\\s\\S]*?${label}`));
  }
  assert.doesNotMatch(bottomNav, /href="#lich-su"/);
  assert.match(html, /class="profile-menu__links"[\s\S]*?href="#lich-su"[\s\S]*?Lịch sử kiểm tra/);
  assert.match(styles, /-webkit-mask-image:\s*var\(--icon-source\)/);
  assert.match(styles, /@media \(min-width: 40\.0625rem\)[\s\S]*?grid-template-columns:\s*repeat\(4/);
  // Khổ điện thoại: khung nằm ở phần tử ngoài…
  assert.match(styles, /@media \(max-width: 40rem\)[\s\S]*?\.bottom-nav \{[^}]*border-radius:\s*var\(--radius-xl\)/);
  // …còn lớp trong PHẢI xoá khung của bản rộng, nếu không sẽ viền đôi bóng đôi.
  assert.match(styles, /\.bottom-nav__inner \{[^}]*box-shadow:\s*none/);
});
--- HẾT ---

### [24] CLAUDE.md (replace) ~dòng 105-107, section "Nợ kỹ thuật cần biết"
LÝ DO: CLAUDE.md names this exact duplicate as known debt. Leaving the entry stale means the next session re-reports a fixed problem, or worse, re-creates the second nav believing it is expected.

--- NEO ---
3. **Nhân đôi mobile/desktop trong cùng DOM** — ví dụ có hai thanh nav dưới
   (`.bottom-nav` và `.mobile-bottom-nav`). Mobile và desktop nên là **một hệ**,
   không phải hai sản phẩm.
--- THAY BẰNG ---
3. **Nhân đôi mobile/desktop trong cùng DOM.** Hai thanh nav dưới đã gộp còn
   một (`.bottom-nav`, hiện diện ở cả 16 màn hình) — test chặn quay đầu nằm ở
   `test/frontend-contract.test.js`. Vẫn còn cặp `.mobile-reference-top` /
   `.mobile-situation-form` chưa gộp. Mobile và desktop phải là **một hệ**,
   không phải hai sản phẩm.
--- HẾT ---

## Rủi ro
- R1 — DOUBLE CHROME AT ≤640px. The likeliest way to ship a visible bug. `.mobile-bottom-nav__inner` matches nothing else in the file today; renamed to `.bottom-nav__inner` it inherits `border-radius: var(--radius-full)` (L4487), `background: var(--color-surface)` (L2197), `box-shadow: var(--shadow-lg)` (L2198) and `border: 1px solid var(--color-rule)` (L2199) — none of which the phone block overrides. Result: a white pill with its own border and shadow nested inside the rounded nav card, its round ends sheared off by the card's `overflow: clip`. E15's four reset declarations are not optional. Verify with `getComputedStyle(inner)` → borderWidth 0px, boxShadow none, backgroundColor rgba(0,0,0,0).
- R2 — TABLET TYPE AND ICON INFLATION AT 641–895px. `@media (max-width: 55.99rem)` = 0–895.84px, i.e. it covers tablets, but its two nav rules currently name `.mobile-bottom-nav`, which is display:none above 640px. Rename them in place instead of moving them (skip E20, or do E20 without E18's appended block) and 641–895px silently changes: labels 14.9px → 17px, `nowrap` → `normal`, line-height 1 → 1.15, icons 1.25rem → 1.5rem. Not catastrophic — arguably nicer for the audience — but it is an unannounced visual change on a breakpoint nobody was asked to touch, and at A++ on a 641px viewport each tab has only ~152px. Decide deliberately; do not let it happen by accident.
- R3 — SPECIFICITY COLLAPSE IF YOU 'TIDY' THE SELECTORS. `.bottom-nav .bottom-nav__item` looks redundant and will tempt someone to flatten it to `.bottom-nav__item`. That drops it from (0,2,0) to (0,1,0) and hands the cascade below 480px to `html[data-font-size="large"] .bottom-nav__item` (L4945, specificity 0,2,1), which sets `line-height: 1.05` and `min-height: 4.35rem`. The comment at L6401 records that this precise bug — labels SHRINKING when the user presses A++ — was already found and fixed once. Same for the `html[data-font-size]` variant in E18: it exists solely to reach (0,3,1) and outrank L4945. Do not simplify either.
- R4 — ~1px DEAD BAND AT 640.01–640.99px. The breakpoint pair is `max-width: 40rem` (≤640px) and `min-width: 40.0625rem` (≥641px). Fractional viewport widths from browser zoom or fractional DPI land between them, where neither block applies and the nav falls back to L2181/L4474/L4479/L4487 — a centred pill, item min-height 4rem, that matches neither neighbouring design. This is PRE-EXISTING and unchanged by the merge (today `.bottom-nav` renders exactly that there), so it is not a regression. But after the merge it is the only nav in the app, so it is worth a follow-up: switch the pair to `(width <= 640px)` / `(width > 640px)`. Media-query `rem` resolves against 16px regardless of the A/A+/A++ root, so the font ladder does not move this boundary.
- R5 — PRE-EXISTING CLAUDE.md §3 VIOLATION CARRIED FORWARD. `white-space: nowrap` sits on `.bottom-nav__item` at ~L2216, ~L4497 and ~L6188 (verify — line numbers drifted twice today). CLAUDE.md forbids nowrap on buttons because Vietnamese labels run ~30% longer than English and clip at A++ with no way to scroll and read. Below 640px the merged rule sets `white-space: normal`, so phones are safe; 641px and up still clip. The merge neither creates nor fixes this. Separate ticket — but note the recent work that stripped nowrap from `.button` missed the nav items.
- R6 — PRE-EXISTING CLAUDE.md §4 VIOLATION CARRIED FORWARD. `line-height: 1` on the wide nav item (~L6186) and `1.15` on the phone item are both under the 1.25 floor the brief sets for Vietnamese, whose diacritics stack above AND below (ế, ộ, ữ, ị, ặ). Nav labels are short and currently do not visibly clip, which is why nobody caught it, but 'Gia đình' at A++ is the one to inspect. Not introduced here; do not silently change it inside this merge either, because that would break the pixel-identical claim.
- R7 — THE REPO IS BEING EDITED CONCURRENTLY. During this read-only analysis `public/styles.css` changed twice and two commits landed (`61e859f`, `1f44fb7`). Line numbers shifted +1 mid-way and grep and Read disagreed for several minutes. Every anchor above was re-verified against styles.css md5 `6fa6d69eb58c1ef8866e83c1914cb99e` / index.html md5 `beefd39cd1af28eedfc2b5648156ccaa`. Confirm those hashes, or re-grep each anchor, before applying. Both files are CRLF — normalize line endings when matching multi-line anchors.
- R8 — `--bottom-nav-height: 5.5rem` (93.5px at the 17px root) is a hand-guessed constant, not a measurement, and it drives four unrelated rules: `body { padding-bottom }` (L99), `.toast` position (L1997), `.profile-menu` position (L2932) and `#homeView.view` padding (L3321, L4292). The merge does not change nav geometry (4.25rem inner on phones, 4.75rem wide), so clearance is unchanged and no edit is needed. But now that there is one nav instead of two, anyone adjusting its height will break the toast and the profile menu with no test to catch it. Worth a follow-up that derives the token or asserts it against a measured height.
- R9 — SILENT-FAILURE MODE IN app.js. `updateBottomNav()` iterates a NodeList captured once at load. If the selector ever stops matching, it throws nothing and logs nothing — the active tab simply never highlights, and on a nav that is global chrome across all 16 views that is easy to miss in a quick click-through. E23's four-item count assertion is the guard; keep it.

## Cách kiểm chứng
- Confirm the baseline before touching anything: `cd <repo> && node --test` must report `tests 130 / pass 130 / fail 0`. Also confirm the file hashes the anchors were verified against — `md5sum public/styles.css public/index.html` should give `6fa6d69eb58c1ef8866e83c1914cb99e` and `beefd39cd1af28eedfc2b5648156ccaa`. If either differs, re-grep every anchor before applying; the repo was being edited concurrently during this analysis.
- After applying all 24 edits: `grep -rn 'mobile-bottom-nav' public/ test/` must return ZERO hits. Then `grep -c '<nav class="bottom-nav"' public/index.html` must return 1, and `grep -c 'class="bottom-nav__item"' public/index.html` must return 4.
- `npm run check` (node --check on server.js, app.js, services.js, sw.js) then `node --test` — still 130 pass, 0 fail. The rewritten assertions in frontend-contract.test.js add checks but no new test() blocks, so the count should not move.
- Serve on the registered port and defeat the two caches CLAUDE.md warns about, or you will measure stale CSS and conclude nothing: `python ~/.claude/scripts/port_manager.py check 8089`, `npm start`, then in the browser unregister the service worker and hard-clear cache, and load styles.css with a `?bust=` query. Sanity-check by diffing what `curl localhost:8089/styles.css` returns against what the page actually applied.
- Measure, do not eyeball — 15 combinations: 320 / 360 / 375 / 768 / 1280px × A / A+ / A++. At each one assert with JS, not with your eyes: (a) `document.querySelectorAll('nav.bottom-nav').length === 1` and that node passes `element.checkVisibility()`; (b) `document.querySelectorAll('.bottom-nav__item').length === 4`; (c) every item's `getBoundingClientRect().height >= 52`; (d) every item's `getComputedStyle(el).fontSize` parses to >= 14px at the 17px root (record the A-step value too — 0.875rem is 13.1px at the 15px root, a known property of the token system, not something this merge introduces).
- Overlap scan, not just overflow scan — CLAUDE.md records a bug where a button sat on top of instruction text and nobody saw it. Use `element.checkVisibility()` (NOT `offsetParent`, NOT bare rect comparison — a closed `<details>` keeps a stale child rect and reports false overlaps) and check pairwise intersection between the nav and page content, and between the four nav items themselves, at all 15 combinations.
- Prove the phone chrome reset landed (risk R1): at 375px run `getComputedStyle(document.querySelector('.bottom-nav__inner'))` and confirm `borderTopWidth` is `0px`, `boxShadow` is `none`, `backgroundColor` is `rgba(0, 0, 0, 0)` and `borderRadius` is `0px`. If any of those carry the pill styling, E15's resets were dropped and users are seeing a double-bordered nav.
- Prove the tablet did not move (risk R2): screenshot the nav at 768px and at 1280px BEFORE and AFTER the merge and diff them — they must be pixel-identical. Specifically confirm at 768px that `getComputedStyle(item).fontSize` is still ~14.9px (not 17px), `whiteSpace` is still `nowrap` (not `normal`), and the icon is still 1.25rem (not 1.5rem). Any of those changing means E18/E20 were applied wrong.
- Behaviour, on more than the home view: navigate to at least 5 of the 16 routes (#trang-chu, #kiem-tra, #hanh-trinh, #gia-dinh, plus one route with no tab such as #lich-su). The nav must stay visible on every one, exactly one tab must carry `aria-current="page"` on the four routes that have tabs, and NO tab may carry it on #lich-su. Tab through with the keyboard: exactly 4 focusable links, visible focus ring on each.
- Screen reader / accessibility tree: confirm the single nav announces as `Điều hướng chính` at phone width too (it previously announced `Điều hướng điện thoại` there). Confirm `prefers-reduced-motion: reduce` still flattens the tab press animation at ≤640px — that is E11, and it is the only rule providing it.
