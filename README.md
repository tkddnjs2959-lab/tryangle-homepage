# TRYANGLE Official Homepage

Official homepage for Tryangle.

- Production domain: `https://tryangle-official.co.kr`
- Repository: `https://github.com/tkddnjs2959-lab/tryangle-homepage.git`
- Main app: Next.js
- Related admin/research app: `https://github.com/tkddnjs2959-lab/tryangle-research.git`

## Shared Work Log Rule

Use this `README.md` as the main shared work log for the official homepage and analytics setup.

Do not use local-only files such as `C:\Users\juaju\Desktop\AI\CLAUDE\TRYANGLE\PROJECT_STATUS.md` as the primary source of truth, because that file is not inside this Git repository and will not appear when another PC or AI clones this repo.

If another AI mentions `readme.mk`, treat it as a likely typo for `README.md` unless an actual `readme.mk` file exists.

## Current Goal

Build a zero-extra-cost analytics system that can grow from simple website analytics into a business dashboard.

Initial structure:

```text
tryangle-official.co.kr
-> Google Tag Manager
-> Google Analytics 4
-> Microsoft Clarity
-> UTM rules
-> Looker Studio
-> Google Sheets for consultation, registration, ad spend, and revenue
-> Later TRYANGLE ADMIN integration
```

Long-term goal:

```text
GA4 + ad data + lead data + student data + payment data
-> TRYANGLE ADMIN
-> business operation dashboard
```

## Analytics Principles

- Do not build a custom visitor analytics database at the beginning.
- Keep anonymous visitor behavior in GA4 and Microsoft Clarity.
- Start managing customer data only after a visitor becomes a lead through Kakao consultation or application.
- Use Google Sheets first for actual consultation, registration, ad cost, and revenue tracking.
- Introduce a custom database/admin dashboard only when the workflow is proven and data volume justifies it.

## Funnel Definition

```text
Instagram / Naver / Google / ads / direct
-> website visit
-> service, class, or portfolio interest
-> Kakao consultation click
-> actual Kakao inquiry
-> actual consultation
-> class registration
-> payment and revenue
```

Important:

`click_kakao_consult` means a website visitor clicked the Kakao consultation link. It does not mean the person actually sent a Kakao message or completed a consultation.

## Initial GA4 Event Plan

| Event name | Meaning |
| --- | --- |
| `page_view` | Page visit, collected by GA4 |
| `view_service` | Service section or page viewed |
| `view_class` | Class detail viewed |
| `view_portfolio` | Portfolio or case section viewed |
| `click_kakao_consult` | Kakao consultation link clicked on the website |
| `click_instagram` | Instagram outbound link clicked |
| `start_application` | Application flow started |
| `complete_application` | Application completed |

Keep event names stable even if button text changes.

## UTM Rules

Instagram profile:

```text
https://tryangle-official.co.kr/?utm_source=instagram&utm_medium=profile&utm_campaign=always_on
```

Instagram paid ad:

```text
https://tryangle-official.co.kr/?utm_source=instagram&utm_medium=paid&utm_campaign=class_2026_09&utm_content=character_ad_01
```

Naver blog:

```text
https://tryangle-official.co.kr/?utm_source=naver&utm_medium=blog&utm_campaign=class_2026_09
```

Use campaign names that match recruitment rounds where possible, for example `class_2026_09` or `round_2026_04`.

## Initial Dashboard KPI Plan

- Visitors
- New visitors
- Acquisition channel
- Visitors by campaign
- Popular pages
- Class page views
- Kakao consultation clicks
- Application starts
- Application completions
- Visit -> Kakao consultation click conversion rate

Because Tryangle runs classes by recruitment round, reporting should emphasize recruitment-round performance rather than only monthly reporting.

Example:

```text
2026 round 4 recruitment
- ad spend
- website visitors
- Kakao consultation clicks
- actual consultations
- registrations
- revenue
- CAC
- best channel
- best content
```

## Step Status

1. Google Tag Manager account/container: done
2. GTM installation in homepage code: done
3. GA4 property and GTM connection: pending
4. Microsoft Clarity project and GTM connection: pending
5. Event tracking: pending
6. UTM operating rules: drafted
7. Looker Studio dashboard: pending
8. Consultation/registration data sheet: pending
9. TRYANGLE ADMIN analytics integration: later

## Codebase Notes

### Local run

```bash
npm install
npm run dev
```

Port **3100** (`http://localhost:3100`). Copy `.env.local.example` to `.env.local` and
fill it in — it drives the inquiry form (Supabase), mail alerts (Resend), and Kakao
alerts. The Supabase project is **shared with `tryangle-research`**.

### Layout

| Path | Contents |
| --- | --- |
| `src/app/page.tsx` · `page.module.css` | Main page. **The CSS module is shared with the coaching page** |
| `src/app/coaching/` | `/coaching` — hidden landing page for enrolled actors (`noindex`, not linked from any menu) |
| `src/app/coaching/content.ts` | Coaching page copy and pricing. Prefer editing text here |
| `src/app/ContactForm.tsx` | Main inquiry form |
| `src/app/api/inquiry/` | Inquiry intake → Supabase + notifications |
| `src/app/api/kakao/` | Kakao "send to me" alerts (needs a one-time authorize) |
| `src/app/newsData.ts` | Press links, shared by both pages |

### Line-break rules (important)

Line breaks in the Korean copy are placed by hand, and mobile needs different breaks
than desktop. A plain `<br />` breaks on both. Use these utilities instead — mobile
means **≤560px** everywhere.

Main page (`page.module.css`)

| Class | Role |
| --- | --- |
| `.brMobile` | Breaks on mobile only |

Coaching page (`coaching/coaching.module.css`)

| Class | Role |
| --- | --- |
| `.brM` | `<br>` that breaks on mobile only |
| `.brD` | `<br>` that breaks on desktop only (hidden on mobile) |
| `.gapM` | Blank line on mobile only (`<span>`, 0.85em tall) |
| `.leadStrong` | Bold and larger on mobile only (same as body text on desktop) |
| `.calloutIndent` | Indents the callout's second line on mobile |

A `\n` inside a list string in `content.ts` is turned into a mobile-only break by the
`mobileLines()` helper in `page.tsx`; on desktop it renders as a single space.

When a request is mobile-only, add `.brM` / `.gapM` and convert any existing shared
`<br />` that desktop still needs into `.brD`. Always check both 375px and desktop
widths afterwards.

## Completed Work

### 2026-08-09

Prepared the homepage code for Google Tag Manager.

- File: `src/app/layout.tsx`
- Change: load the GTM script and noscript iframe only when `NEXT_PUBLIC_GTM_ID` exists.
- Verification: `npm.cmd run build` passed.
- Commit: `e948ae4` (`GTM 환경변수 기반 설치 준비`)
- Push: completed to `origin/main`

Current code expects:

```text
NEXT_PUBLIC_GTM_ID=GTM-WP798468
```

Google Tag Manager container:

- Container ID: `GTM-WP798468`
- Website: `https://tryangle-official.co.kr`
- Status: container created by owner, production environment variable still needs to be added and deployed.

---

Adjusted the coaching page copy and spacing for mobile.

- Files: `src/app/coaching/page.tsx`, `coaching.module.css`, `content.ts`
- Scope: `/coaching` only, mobile (≤560px) only. Desktop rendering is unchanged
  except for the two copy edits noted below.
- Added the `.brM` / `.brD` / `.gapM` / `.leadStrong` / `.calloutIndent` utilities and
  the `mobileLines()` helper described under [Line-break rules](#line-break-rules-important).

Section by section:

1. Hero — break after `…이수한 배우만`, blank line after `…오디션 기회를 만든다면,`.
   Added single quotes around `오디션 기회` and `캐스팅` (**applies to desktop too**).
2. `1:1 매체연기 코칭이란` — first line `TRY앵글의 1:1 매체연기 코칭은` is bold and larger
   on mobile, followed by a blank line.
3. `왜 1:1 코칭인가요?` — the first two paragraphs now flow without forced breaks on
   mobile; blank lines around `매체연기 심화 훈련부터…` split it into three blocks.
4. `코칭 분야` — the parenthetical in the audition-training item moves to its own line.
5. `연기트레이너 대표 이력` — reworded to `연기 지도 수강생 소속사 다수 합격 /
   (9아토엔터테인먼트, 모드하우스 등)` (**applies to desktop too**; the agency name had
   been missing its leading `9`). The graduate-coaching parenthetical also breaks on mobile.
6. `비용` callout — break before `정원에 제한을 두고 있습니다.` plus an indent.
7. `신청 방법` — break after `…관심 있으신 분들은`.

- Verification: rendered `/coaching` at 375px and desktop width in a browser and
  compared the resulting line structure.
- Commit: `코칭 페이지 모바일 문구·간격 정리`

---

Centered the trainer profile header on the coaching page.

- Files: `src/app/coaching/page.tsx`, `coaching.module.css`
- The eyebrow `이주아 대표 | 연기트레이너 프로필` is centered at every width; the photo
  and the `이주아` heading are now centered on desktop too (mobile already stacked them).
- `.eyebrowSm` and `.mentorHead` in `page.module.css` are **shared with the main page's
  mentor section**, so they were left alone. The coaching page adds its own
  `.profileEyebrow` / `.mentorHeadCenter` on top instead. Keep it that way — editing the
  shared classes would move the main page's mentor block as well.
- Verification: measured the elements' center against the section center at 1280px and
  375px in a browser; all aligned.

## Next Owner Action

Add the GTM ID to the production deployment:

1. Add it to Vercel environment variables as `NEXT_PUBLIC_GTM_ID`.
2. Redeploy the homepage.
3. Verify with GTM Preview or Google Tag Assistant.
4. Move to GA4 setup.

## Future Lead Sheet

Use Google Sheets first.

Suggested columns:

```text
created_at
name
phone
kakao_nickname
source
medium
campaign
content
lead_status
consult_status
registered
class_round
payment_amount
memo
```
