# Design — Khoan Đã

Locked visual system for the Khoan Đã safety assistant. This app is a mobile-first,
calm utility for older adults and their trusted family circle. Existing routes,
rule engines, local storage, and forms stay in place; this file governs the visual
and interaction layer.

## Genre

Playful, soft, and reassuring. The character is an orientation cue, not decoration.

## Macrostructure family

- App pages: Workbench / App Hub with one clear task per screen.
- Safety pages: Narrative Workflow, with a calm next step and visible risk label.
- Learning pages: Catalogue list with one highlighted lesson.

## Theme

- `--color-paper`: `oklch(98% 0.012 298)`
- `--color-surface`: `oklch(99.4% 0.004 298)`
- `--color-ink`: `oklch(20% 0.065 285)`
- `--color-muted`: `oklch(51% 0.04 285)`
- `--color-accent`: `oklch(52% 0.22 292)`
- `--color-accent-soft`: `oklch(93% 0.055 298)`
- `--color-danger`: `oklch(45% 0.19 25)`
- `--color-warning`: `oklch(46% 0.11 78)`
- `--color-success`: `oklch(42% 0.11 155)`

Purple is reserved for primary action and selected navigation. Red/orange/green
always carry a text label and an icon as well as colour.

## Typography

- Display: Manrope Variable, 800, roman.
- Body: Be Vietnam Pro, 400–600.
- Wordmark: Manrope Variable, 800.
- Minimum body size: 16px; comfortable line-height 1.55–1.65.

## Spacing and shape

4/8px scale through the named `--space-*` tokens. Touch targets are at least 44px;
primary actions are 56px. App cards use a 24px radius, input surfaces 18px, and
navigation uses a 28px floating pill.

## Motion

Only transform and opacity transitions. Route changes use the existing directional
crossfade. Hover lift is limited to desktop pointers. Reduced motion collapses to a
150ms opacity transition.

## Navigation

N5 floating pill variant: five persistent tabs — Trang chủ, Kiểm tra, Vụ việc,
Học hỏi, Gia đình. The selected tab is a filled violet tile with an icon and label.

## Microinteractions

Silent success, explicit error recovery, focus rings, and no hover-only actions.
Native dialogs remain the safety-critical surface for the 60-second pause flow.

## Exports

The canonical CSS tokens live in `/tokens.css`. Tailwind, DTCG, and shadcn consumers
should map the same paper/ink/accent/risk tokens rather than introduce new colours.
