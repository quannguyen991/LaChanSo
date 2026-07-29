# Khoan Đã Implementation Plan

Date: 2026-07-28

## Product Direction

Khoan Đã should behave like one continuous safety companion, not a set of separate technical tools. The product flow is:

Recognize suspicious signs -> stop the dangerous action -> verify independently -> contact family -> save evidence -> recover after transfer -> track the case -> prevent follow-up scams.

The implementation should remain local-first until backend requirements for accounts, sharing, reporting, or moderation are explicit.

## Design Principles

- Keep Trust Blue as the primary brand color, with a bright background, white cards, generous radius, soft shadow, and clear typography.
- Preserve the existing onboarding and friendly senior-focused illustrations.
- Use tokens from `tokens.css`; avoid adding raw component colors.
- Keep touch targets at least 52px and primary actions at least 56px where existing invariants require it.
- Use short Vietnamese copy addressing the user as “bác”.
- Show at most three important warnings/actions in high-pressure moments.

## Delivery Phases

| Phase | Goal | Scope | Validation |
|---|---|---|---|
| 1 | Structured result foundation | Build a local `ScamAnalysisResult` envelope from existing rule/journey/entity logic while preserving current API responses | Unit tests for builder and API backwards compatibility |
| 2 | Unified intake | Auto-detect URL, transfer info, phone/account/money, media type, and QR from the same input | API tests and frontend contract tests |
| 3 | Scam Case upgrade | Version local case model with timeline, status, recovery state, evidence references, and append flow | Unit tests for local model helpers |
| 4 | Recovery flow | Convert “Tôi vừa chuyển tiền” into progressive questions and a 10-step checklist with statuses | Frontend contract and browser smoke test |
| 5 | Family Verification Protocol | Upgrade family password into independent verification steps and shareable message drafts | Frontend contract tests |
| 6 | Evidence Center | Add typed evidence, extracted entities, redaction/exclusion rules, and export templates | Unit tests for exports excluding OTP/secrets |
| 7 | Official Directory | Normalize support directory schema and expose categories, sources, update dates, and “will never ask” warnings | Data schema tests |
| 8 | Privacy Center | Show local data inventory, retention controls, per-case deletion, exports, and sharing log | Unit tests for inventory calculations |
| 9 | Education scenarios | Convert lessons into short interactive exercises with skill tags and immediate feedback | Frontend contract tests |
| 10 | PWA share target/offline | Add share target intake and offline limitation copy | Manifest/SW tests and browser smoke test |
| 11 | Community report architecture | Add local draft form, API contract, moderation requirements, rate-limit design | Tests for local draft and redaction |

## First Implementation Slice

Start with Phase 1 because it reduces duplication and unlocks later work:

- Add a structured analysis builder that maps existing Vietnamese risk labels to stable `low | medium | high | critical` values.
- Reuse `evaluateRisk`, `classifyJourney`, and existing manipulation tactic output.
- Extract basic entities from user text: URL, phone number, bank-like account number, money amount, OTP mention, and QR/link hints.
- Predict up to three possible next steps from journey stage and manipulation signals without claiming certainty.
- Add data-status and limitation strings for low data, unclear media, unavailable AI, and link checks not yet run.
- Include this structured object in `/api/phan-tich` responses while preserving old fields for the current UI.

## Backlog Guardrails

- No external bank, telco, government, or moderation integration without provider access and product approval.
- No backend data migration until a persistence design exists.
- No “sent”, “synced”, “verified”, or “reported” language unless the system can prove that action happened.
- No “quét điện thoại”; use “Hướng dẫn kiểm tra an toàn thiết bị”.
- No “An toàn tuyệt đối” or low-risk “An toàn”.
