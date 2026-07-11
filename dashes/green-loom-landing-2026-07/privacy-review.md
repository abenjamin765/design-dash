# Privacy Review — Green Loom Landing Page

**Dash:** green-loom-landing-2026-07 · **Trigger:** email capture = PII surface (tier driver) · **Date:** 2026-07-10

## 1. Data inventory

| Data | Purpose | Storage | Retention |
|---|---|---|---|
| Email (required) | Early-access list + contact | Form vendor (processor of record) | Until unsubscribe or list deletion |
| Role (optional) | M-003 signup-quality guardrail | Form vendor field | Same |
| Source section | Attribution (hero vs closing) | Hidden form field, vendor | Same |
| Consent timestamp | Lawful-basis record | Vendor | Same |
| Scheduler booking (name/email/time) | Discovery calls | Scheduler vendor | Vendor policy |
| Analytics | Conversion measurement | TBD — see §4 | TBD |

**Not collected:** no accounts, no payment, no health/medical data, no precise location, no cookies beyond what §4 resolves.

## 2. Lawful basis & consent (GDPR/CCPA posture)

- Explicit, unchecked, required consent checkbox on both forms (wireframe §1/§7) — consent is the basis for marketing email.
- Privacy notice + manage-consent/unsubscribe links in footer (Q-tier CTA, always present).
- No dark patterns in consent flow (ethics review §2).

## 3. Vendor requirements (named at build time)

Form vendor and scheduler must each provide: GDPR-compliant DPA · double opt-in support (recommended) · one-click unsubscribe · data export + deletion · EU data handling disclosure. Candidates meeting these are acceptable; name them in this file before launch.

## 4. Open items (block launch, not the dash)

| # | Item | Owner | Due |
|---|---|---|---|
| PR-1 | Name form + scheduler vendors; record DPAs here | Aaron | pre-launch |
| PR-2 | Analytics choice: prefer cookieless (no consent banner needed) over cookie-based (banner required) | Aaron | pre-launch |
| PR-3 | Publish privacy notice page (footer link target) | Aaron | pre-launch |
| PR-4 | A-001 non-author review covers this file | Peer (TBD) | 2026-08-10 |

## Gate verdict

**PASS for design.** The design minimizes data (email-only minimum, optional role), makes consent explicit, and authors all failure states. Launch is gated on PR-1..PR-3.
