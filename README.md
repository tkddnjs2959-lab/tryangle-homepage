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
3. GA4 property created: done
4. GA4 GTM connection: done
5. Microsoft Clarity project and GTM connection: done, waiting for data
6. Event tracking: first event implemented and GTM setup in progress, GA4 verification pending
7. UTM operating rules: drafted and ready to use
8. Looker Studio dashboard: pending
9. Consultation/registration data sheet: created and structured
10. TRYANGLE ADMIN analytics integration: later

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
- Status: container created by owner. `NEXT_PUBLIC_GTM_ID` was added in Vercel environments and a new deployment was triggered by owner.

Vercel environment variable:

```text
NEXT_PUBLIC_GTM_ID=GTM-WP798468
```

Deployment note:

- Owner first saw the Vercel message: `A more recent Production Deployment has been created, so the one you are looking at cannot be redeployed anymore.`
- Resolution: use the most recent Production deployment from the Deployments list, then redeploy that deployment.
- Owner reported redeploy was completed.
- GTM Preview / Tag Assistant verification: owner reported `Connected`.

Google Analytics 4:

- Measurement ID: `G-1Z0PL2VZHX`
- Status: GA4 property/web stream created by owner, connected through GTM, and verified in GA4 Realtime.
- Owner also reported that both Google Tag and Google Analytics were linked.
- Troubleshooting note: during GA4 setup, GTM Preview later reported that `GTM-WP798468` could not be found. Code still contains the GTM loader, so the likely issue is Vercel environment variable scope/value or a deployment that was built without `NEXT_PUBLIC_GTM_ID`.
- Follow-up troubleshooting: owner found the Vercel environment variable had been created with `GMT` instead of `GTM`. Owner corrected it, but `GTM-WP798468` still was not visible afterward. Next checks: confirm the corrected variable exists under Production, redeploy the latest Production deployment after the correction, and verify with Tag Assistant rather than relying only on page source.
- Resolution: after correcting the environment variable name and redeploying, owner reported that `GTM-WP798468` is now visible on the live site.
- GA4 verification: owner reported GA4 Realtime visitor count increased by 1.

Microsoft Clarity:

- Project name shown in Clarity: `TRYGANLE` (as displayed in screenshot; may be a typo of TRYANGLE).
- Installation method: Google Tag Manager.
- Status screen says Clarity was installed using Google Tag Manager and data should start appearing within a few hours.
- Screenshot status: Clarity tour shows 1/7 completed.

Event tracking:

- First event: `click_kakao_consult`
- Code implementation: done.
- Files:
  - `src/app/TrackedLink.tsx`
  - `src/app/page.tsx`
  - `src/app/coaching/page.tsx`
- Behavior: Kakao consultation links push a `click_kakao_consult` event into `window.dataLayer`.
- Event parameter: `placement`
- Placements:
  - `main_header`
  - `main_hero`
  - `main_consult_section`
  - `main_footer`
  - `coaching_header`
  - `coaching_hero`
  - `coaching_application_section`
  - `coaching_footer`
- Verification: `npm.cmd run build` passed after code changes.
- GTM setup still needed: create a Custom Event trigger for `click_kakao_consult`, then create a GA4 Event tag that sends the same event name to GA4.
- Owner proceeded with GTM setup guidance for:
  - Custom Event trigger: `CE - click_kakao_consult`
  - GA4 event tag: `GA4 Event - click_kakao_consult`
- GA4 Analytics event visibility has not been confirmed yet.

UTM operating rules:

- Use UTM links for every external link to `https://tryangle-official.co.kr`.
- Keep names lowercase where possible.
- Use underscores instead of spaces.
- Use `utm_campaign` to represent a recruitment round or always-on channel.
- Use `utm_content` to distinguish individual creatives, posts, or link positions.

UTM field definitions:

| Field | Use | Examples |
| --- | --- | --- |
| `utm_source` | Platform or source | `instagram`, `naver`, `google`, `kakao`, `direct_manual` |
| `utm_medium` | Traffic type | `profile`, `paid`, `blog`, `organic`, `dm`, `qr` |
| `utm_campaign` | Recruitment round or campaign | `always_on`, `class_2026_09`, `round_2026_04` |
| `utm_content` | Creative or placement | `character_ad_01`, `profile_link`, `blog_cta_01` |

Approved starter links:

Instagram profile:

```text
https://tryangle-official.co.kr/?utm_source=instagram&utm_medium=profile&utm_campaign=always_on&utm_content=profile_link
```

Instagram paid ad:

```text
https://tryangle-official.co.kr/?utm_source=instagram&utm_medium=paid&utm_campaign=class_2026_09&utm_content=character_ad_01
```

Naver blog:

```text
https://tryangle-official.co.kr/?utm_source=naver&utm_medium=blog&utm_campaign=class_2026_09&utm_content=blog_cta_01
```

Kakao message or manual share:

```text
https://tryangle-official.co.kr/?utm_source=kakao&utm_medium=dm&utm_campaign=class_2026_09&utm_content=manual_reply
```

QR code for offline use:

```text
https://tryangle-official.co.kr/?utm_source=offline&utm_medium=qr&utm_campaign=class_2026_09&utm_content=studio_poster
```

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

1. Verify `click_kakao_consult` in GTM Preview and GA4 Realtime/DebugView.
2. Start using the approved UTM links for Instagram profile, Instagram ads, Naver blog, Kakao manual replies, and offline QR codes.
3. Wait for Microsoft Clarity data to appear and verify Recordings/Heatmaps.
4. Next build step: create the consultation/registration tracking sheet structure.

## Future Lead Sheet

Use Google Sheets first.

Recommended first file name:

```text
TRYANGLE_상담_등록_관리
```

Created Google Sheet:

```text
https://docs.google.com/spreadsheets/d/1uYwRYGfa-mMs-jlmI75ADoAKTaDAqiaJQ_runu2UJ90/edit
```

Note: the owner initially created the file as `TRYANLGE_상담_등록_관리`; it was renamed to `TRYANGLE_상담_등록_관리`.

Recommended tabs:

```text
Leads
Campaigns
Classes
Summary
```

`Leads` columns:

```text
lead_id
created_at
name
phone
kakao_nickname
source
medium
campaign
content
landing_page
lead_status
consult_status
registered
class_round
payment_amount
memo
```

`Campaigns` columns:

```text
campaign
campaign_name
start_date
end_date
channel
ad_cost
memo
```

`Classes` columns:

```text
class_round
class_name
start_date
end_date
price
capacity
memo
```

`Summary` can be built later after real data exists.

Applied sheet structure:

- Tabs confirmed: `LEADS`, `CAMPAIGNS`, `CLASSES`, `SUMMARY`
- Header row frozen on all tabs.
- Basic filters added to `LEADS`, `CAMPAIGNS`, and `CLASSES`.
- Header rows styled with dark navy background and white bold text.
- `CAMPAIGNS` includes an initial `class_2026_09` row.
- `CLASSES` includes an initial `8기` class row.
- `LEADS` is ready for real lead entries.

`LEADS` dropdowns:

```text
lead_status: new, contacted, consulting, registered, lost
consult_status: not_started, scheduled, completed, no_show, cancelled
registered: yes, no
```

Lead entry operating rules:

- Only record people who actually contact Tryangle through Kakao, application, phone, DM, or another identifiable lead channel.
- Do not manually record anonymous visitors who only viewed the website or clicked the Kakao button. Those remain in GA4/Clarity.
- Suggested `lead_id` format: `L-YYYY-0001`, for example `L-2026-0001`.
- Copy UTM values into `source`, `medium`, `campaign`, and `content` when the source is known.
- If the source is unknown, use:

```text
source: unknown
medium: unknown
campaign: unknown
content: unknown
```

- `payment_amount` should be the actual paid amount. Use `0` or blank before registration.
- `SUMMARY` tab includes the field guide and operating rules.
