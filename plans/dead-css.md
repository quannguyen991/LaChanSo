# Quét CSS mồ côi

> Kế hoạch do recon sinh ra, ĐÃ KIỂM nhưng CHƯA THỰC HIỆN.
> Số dòng chỉ là gợi ý — file đã đổi sau khi phân tích. ĐIỂM NEO mới là hợp đồng: grep lại trước khi áp.

## Tóm tắt
Scanned all 357 class selectors in public/styles.css against index.html, app.js, services.js, sw.js, server.js and src/*.js. Exactly 9 classes are orphaned, in 3 families: `.mobile-action*` (.mobile-action, .mobile-action-grid, .mobile-action__icon, .mobile-action__alert, .mobile-action--message, .mobile-action--link, .mobile-action--transfer), `.mobile-trust-strip`, and `.home-quick-links`. 27 edits (26 in styles.css, 1 in test/frontend-contract.test.js) remove 204 lines.

ORPHAN INVENTORY (class - rule count - lines):
.mobile-action 12 rules 69 lines | .home-quick-links 13 rules 66 lines | .mobile-trust-strip 11 rules 54 lines | .mobile-action__icon 6 rules 28 lines | .mobile-action-grid 4 rules 21 lines | .mobile-action__alert 1 rule 11 lines | .mobile-action--message / --link / --transfer 1 rule 3 lines each. (Rule-line totals overlap where selector lists are shared; the net file reduction is 204.)

DYNAMIC-CLASS EXCLUSIONS: I grepped app.js/services.js for classList.add/remove/toggle/replace, className=, setAttribute("class"), querySelector/closest/matches, and template literals containing class=. Every dynamically applied name is a plain string literal (e.g. "history-row", "button button-danger-quiet", "signal-item signal-item--clear", "evidence-entry__actions"). The only genuinely constructed names are `is-entering-${direction}` and `is-leaving-${direction}` (app.js:2814-2824) — safe because app.js:2787 also lists all four literals in one classList.remove(), so the static matcher already sees them. NONE of the 9 orphans is reachable from JS. My scanner auto-excluded `.icon-receipt` and `.icon-settings` under a "prefix of dynamic token" heuristic; that was a false positive of my own heuristic — they are genuinely unreferenced, but I am flagging them DO-NOT-DELETE for a different reason (see risks).

CLASSES NAMED IN THE TASK THAT ARE NOT ORPHANS — DO NOT TOUCH:
- `.home-suggestion-chips` is STILL LIVE (public/index.html:248, `<div class="home-suggestion-chips" aria-label="Tình huống thường gặp">`). All 6 of its CSS rules must stay. There is no singular `.home-suggestion-chip` class — all 6 CSS hits are substrings of the plural.
- `.hero-band__reference`, `.hero-accessible-copy`, `.danger-dialog__icon`, `.danger-dialog__eyebrow`: 0 occurrences in styles.css. Already removed in earlier commits. Nothing to do. frontend-contract.test.js:73 already asserts hero-band__reference is absent.

EMPTY @media BLOCKS: none. I checked all 61 at-blocks, including the two nested ones — `@media (hover: hover) and (pointer: fine)` and `@media (pointer: coarse)`, both nested inside `@media (max-width: 40rem)`. Each holds exactly one rule whose selector list keeps 2 live selectors after surgery, so both survive. Same for `@media (max-width: 40rem) and (prefers-reduced-motion: reduce)`. Verified programmatically: 0 empty blocks in the result.

LINE COUNT: 6543 -> 6339, a reduction of 204 lines (-3.1%).

VERIFICATION ACTUALLY RUN (not predicted): copied the repo to a scratch dir, ran the suite as baseline (130/130 pass), applied only the 26 CSS edits (129 pass / 1 fail — exactly the predicted `#homeView .home-quick-links` AssertionError), then applied the test edit (130/130 pass). Brace balance 0 before and after; 0 empty blocks; 0 runs of 3+ blank lines introduced; 0 leftover references to any orphan class. All 26 CSS anchors verified count == 1 against the current bytes.

## Các sửa đổi (27)

### [1] public/styles.css (delete-lines) ~dòng ~L3739-3756, between .voice-guide-toggle and .upload-dropzone
LÝ DO: A1 - base .home-quick-links grid plus its anchor styling. Markup deleted. Leading newline absorbs the blank separator so no double blank line remains.

--- NEO ---

.home-quick-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  margin-block: var(--space-5);
}
.home-quick-links a {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--touch-target-primary);
  padding: var(--space-3);
  border-block: 1px solid var(--color-rule);
  color: var(--color-accent-deep);
  font-weight: 800;
  text-decoration: none;
}
--- THAY BẰNG ---

--- HẾT ---

### [2] public/styles.css (replace) ~dòng ~L3818, inside @media (max-width: 55.99rem)
LÝ DO: A2 - selector-list surgery. .signal-grid / .result-trust-row / .education-layout are live and MUST keep grid-template-columns: 1fr.

--- NEO ---
  .home-quick-links,
  .signal-grid,
  .result-trust-row,
  .education-layout { grid-template-columns: 1fr; }
--- THAY BẰNG ---
  .signal-grid,
  .result-trust-row,
  .education-layout { grid-template-columns: 1fr; }
--- HẾT ---

### [3] public/styles.css (delete-lines) ~dòng ~L3828, inside @media (max-width: 28rem)
LÝ DO: A3 - the media block keeps its other rule (.voice-guide-toggle span:last-child, .system-status), so it does not become empty.

--- NEO ---

  .home-quick-links a { white-space: normal; }
--- THAY BẰNG ---

--- HẾT ---

### [4] public/styles.css (replace) ~dòng ~L4469-4472, just after #homeView .eyebrow--danger and before .bottom-nav
LÝ DO: A4 - top-level #homeView override. Replacement keeps exactly one blank separator line.

--- NEO ---

#homeView .home-quick-links {
  grid-template-columns: minmax(0, 1fr);
}

--- THAY BẰNG ---


--- HẾT ---

### [5] public/styles.css (replace) ~dòng ~L4520-4523, inside @media (min-width: 40rem)
LÝ DO: A5 - that media block still holds #homeView .hub-tile-grid and .bottom-nav__item, so it survives.

--- NEO ---

  #homeView .home-quick-links {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

--- THAY BẰNG ---


--- HẾT ---

### [6] public/styles.css (delete-lines) ~dòng ~L4703, inside @media (min-width: 56rem), in the grid-area run
LÝ DO: A6 - named grid area 'quick' for an element that no longer exists. The neighbouring grid-area lines (label / emergency / reassurance) are live and stay.

--- NEO ---

  #homeView .home-quick-links { grid-area: quick; margin: 0; }
--- THAY BẰNG ---

--- HẾT ---

### [7] public/styles.css (replace) ~dòng ~L5058-5067, the display:none rule inside @media (max-width: 40rem)
LÝ DO: A7 - selector-list surgery. The other five selectors still need display:none on mobile; only the dead one is dropped.

--- NEO ---
  #homeView .reassurance-band,
  #homeView .home-quick-links,
  #homeView .home-sidebar,
  #homeView > .eyebrow {
--- THAY BẰNG ---
  #homeView .reassurance-band,
  #homeView .home-sidebar,
  #homeView > .eyebrow {
--- HẾT ---

### [8] public/styles.css (replace) ~dòng ~L5836-5844, the display:grid / width:100% rule inside @media (max-width: 40rem)
LÝ DO: A8 - selector-list surgery. .hub-cards / .hub-tile-grid / .reassurance-band / .home-sidebar must keep display:grid. Anchor starts at .reassurance-band and includes the display line to stay unique against A7.

--- NEO ---
  #homeView .reassurance-band,
  #homeView .home-quick-links,
  #homeView .home-sidebar {
    display: grid;
--- THAY BẰNG ---
  #homeView .reassurance-band,
  #homeView .home-sidebar {
    display: grid;
--- HẾT ---

### [9] public/styles.css (delete-lines) ~dòng ~L6046-6065, inside @media (max-width: 40rem), between #homeView .reassurance-chip and #homeView .home-sidebar
LÝ DO: A9 - the last three .home-quick-links rules, contiguous. Deleting all three in one edit avoids stale offsets between edits.

--- NEO ---

  #homeView .home-quick-links {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
    margin: 0 clamp(var(--space-1), 1vw, var(--space-2)) var(--space-5);
    border-block: 1px solid var(--color-sky-line);
  }

  #homeView .home-quick-links a {
    justify-content: flex-start;
    min-height: 3.75rem;
    padding-inline: var(--space-3);
    border-block-end: 1px solid var(--color-sky-line);
    color: var(--color-accent-deep);
    white-space: nowrap;
  }

  #homeView .home-quick-links a:last-child {
    border-block-end: 0;
  }

--- THAY BẰNG ---

--- HẾT ---

### [10] public/styles.css (delete-lines) ~dòng ~L6397, in the flex-order run inside @media (max-width: 55.99rem)
LÝ DO: A12 - flex order slot for a deleted element. Note this selector does NOT satisfy the contract-test regex (it has '.home-main > ' in between), so it cannot be used to keep that assertion alive.

--- NEO ---

  #homeView .home-main > .home-quick-links { order: 9; }
--- THAY BẰNG ---

--- HẾT ---

### [11] public/styles.css (replace) ~dòng ~L4953-4955, top-level display:none rule immediately before @media (max-width: 40rem)
LÝ DO: B1/C1 - selector-list surgery. .mobile-bottom-nav and the three .emergency-banner__* selectors MUST keep display:none by default; they are revealed only under 40rem. Do NOT delete the whole rule - that would show the mobile nav on desktop.

--- NEO ---
.mobile-action-grid,
.mobile-trust-strip,
.mobile-bottom-nav,
--- THAY BẰNG ---
.mobile-bottom-nav,
--- HẾT ---

### [12] public/styles.css (delete-lines) ~dòng ~L5069-5142, inside @media (max-width: 40rem), between the big display:none rule and #homeView .eyebrow--danger
LÝ DO: B2 - the entire .mobile-action component: grid, tile, label, icon, alert badge and 3 colour modifiers. 74 contiguous lines, the largest single block. The media block keeps 38 other rules.

--- NEO ---

  #homeView .mobile-action-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(var(--space-2), 2vw, var(--space-4));
    margin: 0 clamp(var(--space-1), 1vw, var(--space-2)) clamp(var(--space-2), 2vw, var(--space-4));
  }

  #homeView .mobile-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: var(--space-2);
    min-width: 0;
    min-height: clamp(5.5rem, 24vw, 10rem);
    padding: clamp(var(--space-1), 1vw, var(--space-3)) var(--space-1);
    border: 1px solid var(--color-rule);
    border-radius: clamp(var(--radius-md), 5vw, var(--radius-xl));
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
    color: var(--color-ink);
    font-family: var(--font-display);
    font-size: var(--text-xs);
    font-weight: 700;
    line-height: 1.25;
    text-align: center;
    text-decoration: none;
  }

  #homeView .mobile-action > span:last-child {
    white-space: nowrap;
  }

  #homeView .mobile-action__icon {
    position: relative;
    display: grid;
    place-items: center;
    width: clamp(2.8rem, 10vw, 4.5rem);
    height: clamp(2.8rem, 10vw, 4.5rem);
    border-radius: var(--radius-full);
    color: var(--color-accent-ink);
    background: var(--color-accent-bright);
    box-shadow: var(--shadow-sm);
  }

  #homeView .mobile-action__icon > .icon:first-child {
    width: clamp(1.65rem, 5.5vw, 2.35rem);
    height: clamp(1.65rem, 5.5vw, 2.35rem);
  }

  #homeView .mobile-action__alert {
    position: absolute;
    inset: auto calc(var(--space-1) * -1) calc(var(--space-1) * -1) auto;
    width: 1.2rem;
    height: 1.2rem;
    padding: 0.16rem;
    border: 2px solid var(--color-surface);
    border-radius: var(--radius-full);
    background: var(--color-notice);
    color: var(--color-danger-ink);
  }

  #homeView .mobile-action--message .mobile-action__icon {
    background: var(--color-success);
  }

  #homeView .mobile-action--link .mobile-action__icon {
    background: var(--color-violet);
  }

  #homeView .mobile-action--transfer .mobile-action__icon {
    background: var(--color-notice);
  }

--- THAY BẰNG ---

--- HẾT ---

### [13] public/styles.css (delete-lines) ~dòng ~L5231-5277, inside @media (max-width: 40rem), between #homeView .emergency-banner__cta .icon and body:has(#homeView:not([hidden])) .footer
LÝ DO: C2 - all 7 .mobile-trust-strip rules, contiguous. This is the strip that carried the banned hardcoded 'An toan' badge (see the comment at frontend-contract.test.js:93-94).

--- NEO ---

  #homeView .mobile-trust-strip {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    min-height: clamp(2.75rem, 11vw, 5rem);
    margin: clamp(0rem, calc(6vw - 1.5rem), 1.25rem) clamp(var(--space-1), 1vw, var(--space-2)) clamp(var(--space-2), 2vw, var(--space-4));
    padding: var(--space-1);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-xl);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  #homeView .mobile-trust-strip > span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    min-width: 0;
    border-inline-end: 1px solid var(--color-rule);
    color: var(--color-ink);
    font-size: var(--text-xs);
    white-space: nowrap;
  }

  #homeView .mobile-trust-strip > span:last-child {
    border-inline-end: 0;
  }

  #homeView .mobile-trust-strip .icon {
    width: clamp(1.35rem, 4.5vw, 2rem);
    height: clamp(1.35rem, 4.5vw, 2rem);
    color: var(--color-success);
  }

  #homeView .mobile-trust-strip > span:nth-child(2) .icon {
    color: var(--color-accent-bright);
  }

  #homeView .mobile-trust-strip > span:nth-child(3) .icon {
    color: var(--color-violet);
  }

  #homeView .mobile-trust-strip > span:nth-child(4) .icon {
    color: var(--color-notice);
  }

--- THAY BẰNG ---

--- HẾT ---

### [14] public/styles.css (replace) ~dòng ~L5329-5333, inside @media (max-width: 40rem)
LÝ DO: B11 - surgery; the emergency button and bottom-nav items keep their transition. Also repairs the column-0 continuation indentation of the surviving selectors.

--- NEO ---
  #homeView .mobile-action,
#homeView .emergency-banner--button,
.mobile-bottom-nav .mobile-bottom-nav__item {
    transition: transform var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out);
  }
--- THAY BẰNG ---
  #homeView .emergency-banner--button,
  .mobile-bottom-nav .mobile-bottom-nav__item {
    transition: transform var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out);
  }
--- HẾT ---

### [15] public/styles.css (replace) ~dòng ~L5335-5337, inside @media (max-width: 40rem)
LÝ DO: B12 - surgery; :active press feedback must survive for the two live selectors.

--- NEO ---
  #homeView .mobile-action:active,
#homeView .emergency-banner--button:active,
.mobile-bottom-nav .mobile-bottom-nav__item:active {
--- THAY BẰNG ---
  #homeView .emergency-banner--button:active,
  .mobile-bottom-nav .mobile-bottom-nav__item:active {
--- HẾT ---

### [16] public/styles.css (replace) ~dòng ~L5341-5343, inside @media (max-width: 40rem)
LÝ DO: B13 - surgery; disabled styling must survive for the emergency button and nav items.

--- NEO ---
  #homeView .mobile-action[aria-disabled="true"],
#homeView .emergency-banner--button:disabled,
.mobile-bottom-nav .mobile-bottom-nav__item[aria-disabled="true"] {
--- THAY BẰNG ---
  #homeView .emergency-banner--button:disabled,
  .mobile-bottom-nav .mobile-bottom-nav__item[aria-disabled="true"] {
--- HẾT ---

### [17] public/styles.css (replace) ~dòng ~L5350-5352, inside the NESTED @media (hover: hover) and (pointer: fine)
LÝ DO: B14 - surgery only. This nested media block holds exactly ONE rule; it keeps 2 live selectors, so the block does NOT become empty. Do not delete the wrapper.

--- NEO ---
    #homeView .mobile-action:hover,
#homeView .emergency-banner--button:hover,
.mobile-bottom-nav .mobile-bottom-nav__item:hover {
--- THAY BẰNG ---
    #homeView .emergency-banner--button:hover,
    .mobile-bottom-nav .mobile-bottom-nav__item:hover {
--- HẾT ---

### [18] public/styles.css (replace) ~dòng ~L5358-5360, inside the NESTED @media (pointer: coarse)
LÝ DO: B15 - surgery only. Same as B14: a one-rule nested block that survives with 2 selectors. The touch-action line is inside the anchor to keep it unique against B11.

--- NEO ---
    #homeView .mobile-action,
#homeView .emergency-banner--button,
.mobile-bottom-nav .mobile-bottom-nav__item {
      touch-action: manipulation;
--- THAY BẰNG ---
    #homeView .emergency-banner--button,
    .mobile-bottom-nav .mobile-bottom-nav__item {
      touch-action: manipulation;
--- HẾT ---

### [19] public/styles.css (delete-lines) ~dòng ~L5370, inside @media (min-width: 32rem) and (max-width: 40rem)
LÝ DO: B16 - that media block keeps 7 other rules.

--- NEO ---

  #homeView .mobile-action { font-size: 1rem; }
--- THAY BẰNG ---

--- HẾT ---

### [20] public/styles.css (delete-lines) ~dòng ~L5374, inside @media (min-width: 32rem) and (max-width: 40rem)
LÝ DO: C9 - same block as B16; still non-empty afterwards.

--- NEO ---

  #homeView .mobile-trust-strip > span { font-size: 0.92rem; }
--- THAY BẰNG ---

--- HẾT ---

### [21] public/styles.css (delete-lines) ~dòng ~L5427-5439, inside @media (max-width: 23rem), between the greeting-chip__avatar rule and #homeView .emergency-banner__lead--mobile
LÝ DO: B17 - three contiguous small-screen overrides. The 23rem block keeps 8 rules.

--- NEO ---

  #homeView .mobile-action-grid {
    gap: var(--space-1);
  }

  #homeView .mobile-action {
    font-size: var(--text-xs);
  }

  #homeView .mobile-action__icon {
    width: 2.8rem;
    height: 2.8rem;
  }

--- THAY BẰNG ---

--- HẾT ---

### [22] public/styles.css (delete-lines) ~dòng ~L5444, inside @media (max-width: 23rem), just before .mobile-bottom-nav .mobile-bottom-nav__item
LÝ DO: C10 - the trailing newline in the anchor also removes the blank line that followed this one-liner.

--- NEO ---

  #homeView .mobile-trust-strip > span { font-size: var(--text-xs); }

--- THAY BẰNG ---

--- HẾT ---

### [23] public/styles.css (replace) ~dòng ~L5452-5454, the only rule inside @media (max-width: 40rem) and (prefers-reduced-motion: reduce)
LÝ DO: B21 - surgery only. Sole rule in that media block; 2 live selectors remain so the block survives. Reduced-motion support must not be lost. Note the third selector here is .mobile-bottom-nav__item (no parent), unlike B11/B15.

--- NEO ---
  #homeView .mobile-action,
#homeView .emergency-banner--button,
.mobile-bottom-nav__item {
    transition-duration: var(--duration-fast);
--- THAY BẰNG ---
  #homeView .emergency-banner--button,
  .mobile-bottom-nav__item {
    transition-duration: var(--duration-fast);
--- HẾT ---

### [24] public/styles.css (delete-lines) ~dòng ~L5489-5493, inside the second @media (max-width: 40rem), between body:has(...) .mobile-bottom-nav and #homeView .emergency-zone
LÝ DO: C11 - whole rule; both selectors are orphaned so nothing survives it.

--- NEO ---

  #homeView .mobile-action-grid,
  #homeView .mobile-trust-strip {
    display: grid;
  }

--- THAY BẰNG ---

--- HẾT ---

### [25] public/styles.css (replace) ~dòng ~L5782-5786, the last rule before the closing brace of a @media (max-width: 40rem) block, right after #homeView .mobile-situation-form__error
LÝ DO: B22 - the anchor deliberately includes the media block's closing brace, because the rule body is byte-identical to one removed in B2; without the brace the anchor is not unique. The replacement puts that brace back.

--- NEO ---

  #homeView .mobile-action > span:last-child {
    white-space: nowrap;
  }
}
--- THAY BẰNG ---

}
--- HẾT ---

### [26] public/styles.css (replace) ~dòng ~L6443-6447, inside @media (max-width: 55.99rem), under the comment '/* 6. Nhan nut quan trong khong bi cat cut. */'
LÝ DO: B23 - the orphan is the LAST selector, so the trailing comma on .hub-card__lead must become an opening brace. #homeView .hub-card__title stays on the line above, untouched. This rule is the anti-truncation guard demanded by CLAUDE.md (no nowrap on buttons); it must keep working for the hub cards.

--- NEO ---
  #homeView .hub-card__lead,
  #homeView .mobile-action > span:last-child {
    white-space: normal;
  }
--- THAY BẰNG ---
  #homeView .hub-card__lead {
    white-space: normal;
  }
--- HẾT ---

### [27] test/frontend-contract.test.js (replace) ~dòng L113, inside test 'mobile home exposes the reference workflow without replacing desktop routes'
LÝ DO: REQUIRED, and the ONLY assertion in the whole suite that breaks. The loop asserts styles.css matches /#homeView \.home\-quick\-links/; after A4/A5/A6/A7/A8/A9 that pattern has zero matches. The .home-quick-links markup is already gone from index.html (0 occurrences), so the assertion was pinning dead CSS in place. Measured: with only the CSS edits the suite is 129 pass / 1 fail with exactly this AssertionError; with this edit it is 130/130.

--- NEO ---
for (const className of ["hub-cards", "hub-tile-grid", "reassurance-band", "home-quick-links", "home-sidebar"]) {
--- THAY BẰNG ---
for (const className of ["hub-cards", "hub-tile-grid", "reassurance-band", "home-sidebar"]) {
--- HẾT ---

## Rủi ro
- MOVING TARGET - the single biggest risk. Another agent is editing this repo RIGHT NOW. During my scan public/styles.css changed three times (md5 48d7c8a6 -> 6fa6d69e) and commit 61e859f landed mid-analysis, shifting every line below ~3682 by +1. All lineHint values are approximate and WILL drift. Match on the verbatim anchor text ONLY, never on line numbers. Re-run the uniqueness check immediately before editing.
- CRLF LINE ENDINGS. public/styles.css, index.html and app.js are all 100% CRLF (6543/6543 lines). The anchors above use \n. A literal old_string match will FAIL unless you convert the anchors to \r\n first, or edit line-range-wise after confirming the anchor's first and last lines. This is the most likely cause of a bogus 'anchor not found'.
- DO NOT DELETE .icon-receipt and .icon-settings, even though they are currently unreferenced (0 hits in html/js). They became orphans only minutes ago, in commit 61e859f, which deduped the profile menu and dropped the 'Hoc hoi' and 'Cai dat' links. They are one-line entries in the 39-entry vendored Unicons sprite table (.icon-NAME { --icon-source: url(...) }) and are 2 lines total. That table is a library, not page-specific CSS, and menu links churn week to week. Deleting them saves 2 lines and risks a silently missing icon the next time someone re-adds a menu entry. FLAGGED, NOT PLANNED.
- DO NOT delete the whole rule in edit B1. It is a shared display:none for six selectors; four of them (.mobile-bottom-nav and three .emergency-banner__* classes) are live and depend on it. Deleting the rule instead of two selector lines would make the mobile bottom nav appear on desktop - precisely the 'four buttons vanished' class of bug this file already produced once.
- B14, B15 and B21 each touch the ONLY rule inside its @media block. Each keeps 2 live selectors, so no block empties - but if someone 'simplifies' by deleting the rule instead of doing the selector surgery, hover feedback, touch-action:manipulation and prefers-reduced-motion support silently disappear for the emergency button and the bottom nav. Reduced-motion loss is an accessibility regression, not cosmetic.
- B22's rule body is byte-identical to a block removed in B2. Its anchor is only unique because it includes the enclosing media block's closing brace. If you shorten that anchor you will match the wrong site or get a non-unique error.
- B23 removes the LAST selector of a list, so a trailing comma must become an opening brace. A careless line-delete here leaves '#homeView .hub-card__lead,' dangling and silently kills the white-space:normal anti-truncation guard for hub card titles - the exact CLAUDE.md rule about Vietnamese labels being cut off at A++.
- The test suite validates styles.css only by regex; it cannot see visual regressions. Nothing here changes computed styles (every deleted selector matches zero elements), but the file has a documented history of invisible breakage. Verify in a browser at 320/360/375/768/1280px across all three font steps before calling this done.
- My orphan detection treats any textual occurrence of a class name in html/js/sw/server/src as 'used', including inside comments. That is deliberately conservative - it can miss orphans, never invent them. I separately confirmed zero classes are referenced only inside an HTML comment, so no orphan is hidden that way.
- Scope discipline: this plan touches only orphan CSS and one test array element. It does not address the CLAUDE.md tech-debt item about duplicate mobile/desktop DOM (.bottom-nav vs .mobile-bottom-nav) - both are still live and out of scope here.

## Cách kiểm chứng
- BEFORE EDITING, re-confirm the file has not moved under you: cd into the repo and run `git status --short && md5sum public/styles.css`. My analysis was done at md5 6fa6d69eb58c1ef8866e83c1914cb99e, 6543 lines. If it differs, re-run the uniqueness check below before trusting any anchor.
- Verify every anchor is still unique. Reusable script at C:/Users/Admin/AppData/Local/Temp/claude/C--Users-Admin/c79926cb-fb55-4274-b62b-2d6a6cc6ff2d/scratchpad/anchors.js - run `node anchors.js`. It normalises CRLF, asserts count == 1 for all 26 CSS anchors, simulates the whole plan, and prints line delta, brace balance, empty-block count and leftover references. It writes only to scratchpad, never to the repo. Abort if any anchor reports count != 1.
- Re-run the orphan scan to confirm the orphan set is still exactly 9 classes: `node C:/Users/Admin/AppData/Local/Temp/claude/C--Users-Admin/c79926cb-fb55-4274-b62b-2d6a6cc6ff2d/scratchpad/orphan-scan.js`. It re-derives every class selector from the current styles.css and re-checks it against html/js, so it is safe to trust after further commits.
- Apply the 26 CSS edits, then confirm the mechanical result: `wc -l public/styles.css` must print 204 fewer lines than before (6543 -> 6339 at the state I measured). Then `grep -c 'mobile-action\|mobile-trust-strip\|home-quick-links' public/styles.css` must print 0.
- Confirm no empty rule or empty @media survived: `grep -Pzo '\{\s*\}' public/styles.css | wc -c` should print 0, and brace balance must stay at 0 (anchors.js reports both).
- Run the suite BEFORE the test edit to prove the blast radius is exactly one assertion: `npm test` must report 129 pass / 1 fail, and the single failure must be 'mobile home exposes the reference workflow without replacing desktop routes' with 'The input did not match the regular expression /#homeView \\.home\\-quick\\-links/'. Any other failure means an edit went wrong - stop and re-check.
- Apply the test/frontend-contract.test.js edit, then `npm test` must report 130 pass / 0 fail. I measured exactly this on a scratch copy of the repo.
- Run `npm run check` - it syntax-checks server.js, public/app.js, public/services.js and public/sw.js. It does not parse CSS, so it should be unaffected; treat any failure as evidence you edited the wrong file.
- Browser check, since no test can see this: start on port 8089 (`python ~/.claude/scripts/port_manager.py check 8089` first), hard-reload with the service worker unregistered and the cache cleared (CLAUDE.md documents SW/HTTP cache serving stale CSS). Confirm at 320 / 360 / 375 / 768 / 1280px and at all three font steps (A / A+ / A++) that: the mobile bottom nav is still hidden on desktop and visible under 40rem; the emergency banner button still has press/hover/disabled feedback; hub card titles still wrap instead of truncating; and nothing on the home screen shifted position.
- OPTIONAL HARDENING, matching the existing pattern at frontend-contract.test.js:96-97: add `assert.doesNotMatch(styles, /mobile-action-grid/);`, `assert.doesNotMatch(styles, /mobile-trust-strip/);` and `assert.doesNotMatch(html, /home-quick-links/);` plus `assert.doesNotMatch(styles, /home-quick-links/);` so this CSS cannot creep back. I verified all four pass against the simulated result. Not required for green tests.
