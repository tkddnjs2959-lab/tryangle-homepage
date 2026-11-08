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
| `view_insight` | An individual insight article was opened |
| `click_insight_article` | An insight card or related article was clicked |
| `share_insight` | An insight article share button was clicked |
| `click_instagram` | Instagram outbound link clicked |
| `start_application` | Application flow started |
| `complete_application` | Application completed |

Keep event names stable even if button text changes.

Insight event parameters:

| Event | Parameter | Meaning |
| --- | --- | --- |
| `view_insight` | `article` | Opened article slug |
| `click_insight_article` | `source` | `insights_index` or `related_article` |
| `click_insight_article` | `article` | Destination article slug |
| `click_insight_article` | `from_article` | Previous article slug, only for related links |
| `share_insight` | `article` | Shared article slug |

GTM setup for each new custom event:

1. Create a Custom Event trigger with the exact lowercase event name.
2. Create a GA4 Event tag using the same event name.
3. Map the listed parameters as event parameters if article-level reporting is needed.
4. Preview the site and publish the container after confirming the event fires.

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
8. Looker Studio dashboard: design drafted, creation pending
9. Consultation/registration data sheet: created and structured
10. TRYANGLE ADMIN analytics integration: later

### 2026-08-10 Attribution and inquiry tracking

- Added `src/app/AttributionCapture.tsx` to persist the first UTM values for the current session.
- `TrackedLink` now adds the stored UTM values to `window.dataLayer` events.
- The inquiry form sends attribution data to `/api/inquiry`.
- Added the shared Supabase migration `tryangle-research/supabase/migrations/20260810000001_inquiry_attribution.sql`.
- Inquiry records now retain `source`, `medium`, `campaign`, and `content`, defaulting to `unknown` when no UTM exists.
- This connects anonymous acquisition data to identifiable inquiry records. A Kakao link click is still not treated as an actual inquiry.
- Verification: `npm.cmd run build` passed in `tryangle-homepage`.

Migration operation:

1. Apply the new migration to the shared Supabase project.
2. Deploy the homepage after the migration is applied.
3. Submit a test inquiry using one of the approved UTM links.
4. Confirm the new attribution columns in the `inquiries` table.

### 2026-08-10 SEO foundation

- Added canonical URL and Open Graph metadata to the root layout.
- Added `ProfessionalService` JSON-LD structured data.
- Added generated `sitemap.xml` and `robots.txt`.
- `/coaching` remains excluded because it is an enrollment-only `noindex` page.
- `/api/` remains excluded from crawlers.
- Next content step: create public search-intent pages for actor branding, audition profile strategy, and character analysis.

### 2026-08-10 Search-intent content foundation

- Added a data-driven public insight route at `/insights/[slug]`.
- Added three initial Korean search-intent articles covering actor profile strategy, audition image checks, and character branding.
- Each article has page-specific metadata, a canonical URL, and a tracked Kakao consultation CTA.
- Added `/insights` as the public content hub so search visitors can browse all articles.
- Added footer links from the main and coaching pages to `/insights` for internal discovery.
- Each insight page now shows two automatically selected related articles to strengthen internal navigation.
- Added `click_insight_article` dataLayer events for article cards and related-article links, including source and article slug parameters.
- Added `view_insight` dataLayer events when an individual insight page is opened, with the article slug as a parameter.
- Added a tracked consultation CTA to the `/insights` hub with placement `insights_index_cta`.
- Added RSS feed discovery metadata so compatible readers and automation tools can discover `/insights/feed.xml`.
- Added a visible `새 글 RSS로 받기` link on `/insights`; the feed is available after the latest deployment.
- `sitemap.xml` now includes all insight pages automatically.
- To add a new article, add one object to `src/app/insights/content.ts`; static generation, metadata, and sitemap inclusion follow automatically.
- Human review is required before publishing new claims or client case studies.

### 2026-08-10 Content distribution automation hook

- Added `/insights/feed.xml`, an RSS feed generated from `src/app/insights/content.ts`.
- When a new insight is added, the RSS feed updates automatically after deployment.
- Connect this feed to Make, n8n, or a newsletter tool to create social/newsletter drafts.
- Recommended workflow: RSS trigger → AI draft caption/summary → human review → scheduled publishing.
- Do not auto-publish unreviewed client claims, testimonials, or actor images.

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

### 2026-08-09 Event Verification

- Owner reported that the GA4 `click_kakao_consult` event count increased by 2.
- This confirms that the Kakao consultation click event is being received by Analytics.
- GTM Preview details and the `placement` parameter were not separately recorded; verify them later if needed.

### 2026-08-09 Looker Studio Preparation

- Dashboard creation started.
- Confirmed the Google Sheets data source is accessible:
  - File: `TRYANGLE_상담_등록_관리`
  - URL: `https://docs.google.com/spreadsheets/d/1uYwRYGfa-mMs-jlmI75ADoAKTaDAqiaJQ_runu2UJ90`
- Planned data sources: GA4 property `Tryangle Official Website` and the Google Sheet above.
- Planned report pages: `Overview`, `Acquisition`, `Campaigns`, `Kakao Consult Funnel`, `Leads & Revenue`.
- The Looker Studio report itself still needs to be created in the owner's Google account.
- Owner created the Looker Studio report:
  - URL: `https://datastudio.google.com/reporting/1d378a8e-1524-4836-bf5e-c7639100abd4/page/Mt05F/edit`
  - Current stage: report created; data-source connection and page/chart setup pending.

### 2026-08-10 Overview Page Cleanup

- Owner shared a screenshot of the first Looker Studio page.
- GA4 data source is connected and showing active users, views, and session tables.
- Current issue: the `이벤트 수` scorecard has no event filter, so it shows `데이터 없음`; the time-series chart and tables need spacing/layout cleanup.
- Recommended first-page layout:
  1. Top row: Active users, Views, Sessions, `click_kakao_consult` event count.
  2. Middle row: Users over time chart.
  3. Bottom row: Session source/medium table and Session campaign table.
- Required event scorecard filter: `Event name = click_kakao_consult`.
- Owner revised the Overview layout: four KPI cards on top, a user time-series chart in the middle, and source/medium plus campaign tables at the bottom.
- Screenshot review: layout is now acceptable; the Kakao event scorecard still shows `데이터 없음` and needs filter/date-range verification.
- Follow-up screenshot: removing the filter makes the event scorecard show 59 total events, confirming the GA4 connection and `이벤트 수` metric are working.
- Diagnosis: the custom filter did not match the GA4 event-name field/value. Recreate it by searching the field list for `이벤트 이름`, selecting that field, and using an exact equals condition for `click_kakao_consult`.
- Latest screenshot: the filter chip is present but the scorecard still shows no data. Next diagnostic is to add a temporary table with dimension `이벤트 이름` and metric `이벤트 수` to inspect the exact event-name values arriving in Looker Studio before recreating the scorecard filter.
- Diagnostic table result: GA4 currently contains `page_view` (5), `user_engagement` (3), `click` (2), `session_start` (2), and `first_visit` (1); `click_kakao_consult` is not present.
- Source code still pushes `event: click_kakao_consult` from `src/app/TrackedLink.tsx`, so the likely issue is the GTM GA4 Event tag is configured with event name `click` instead of `click_kakao_consult`.
- Next fix: in GTM, edit `GA4 Event - click_kakao_consult`, set Event Name exactly to `click_kakao_consult`, keep the custom-event trigger name `click_kakao_consult`, publish the container, then test again.
- GTM screenshot review: the existing tag and trigger use uppercase `CLICK_KAKAO_CONSULT`, while `src/app/TrackedLink.tsx` pushes lowercase `click_kakao_consult`. GTM custom-event matching is case-sensitive, so both the trigger event name and GA4 tag event name must be changed to lowercase `click_kakao_consult`.
- Latest report screenshot still shows only the old `click` event and no `click_kakao_consult`; this means the newly corrected GTM configuration has not yet been confirmed as firing. Next verification must be done in GTM Preview by clicking a Kakao link and checking the custom event and GA4 tag before waiting for Looker Studio refresh.
- GTM Preview screenshot shows the GA4 tag fires, but GA4/Looker Studio still records `click`. This indicates the tag's GA4 Event Name field is still likely set to `click`; verify the tag configuration itself, not only the trigger, and set Event Name to lowercase `click_kakao_consult`.
- Owner screenshot confirms the GA4 tag Event Name is now correctly set to `click_kakao_consult` with Measurement ID `G-1Z0PL2VZHX`. The remaining check is the custom-event trigger's internal Event name; its displayed trigger label is uppercase, but the configured event value must be lowercase `click_kakao_consult`.
- Owner decided not to block dashboard work on renaming the event. The currently observed GA4 event is `click` (2 events), so the Overview scorecard may use `이벤트 이름 = click` for now. Renaming to `click_kakao_consult` remains an optional cleanup for clearer long-term analytics naming.
- Next dashboard step: finish the Overview event scorecard using `이벤트 이름 = click`, then build the `Acquisition` page with session source/medium, session campaign, active users, and sessions.
- Owner reported that the `Acquisition` page was created with the planned KPI cards, source/medium table, campaign table, and sessions-over-time chart.
- Next dashboard step: build the `Campaigns` page using `Session campaign` and the `CAMPAIGNS` Google Sheet tab for campaign cost and recruitment-round comparison.
- Owner proceeded to the `Campaigns` page. A source/tab mismatch was observed in the Google Sheets table and should be corrected later so `campaign` rows come from the `CAMPAIGNS` tab rather than `CLASSES`-like values.
- Next dashboard step: build the `Kakao Consult Funnel` page using GA4 active users/sessions and the currently observed `click` event.
- Owner asked for an easier alternative to building the Looker Studio dashboard. Recommended simplified operation: use GA4's built-in Acquisition/Engagement reports for website analytics, Microsoft Clarity for recordings/heatmaps, and Google Sheets for leads, registrations, ad cost, and revenue. Keep Looker Studio as an optional later layer after enough data accumulates.
- Strategic transition: the core tracking setup is in place, so the next priority is advertising strategy—campaign objective, target audience, creative/message testing, UTM links, and measuring consultation/registration outcomes rather than adding more dashboard complexity.
- Content strategy decision: target `배우 지망생 / 오디션 준비생` and promote the `정규 클래스`. Use Instagram for short proof-oriented content and Naver Blog for searchable long-form explanations. AI may draft titles, outlines, captions, and article text, but human review and manual publishing are recommended for Naver Blog.
- API note: Naver's official blog writing API was discontinued, so direct automatic publishing to Naver Blog should not be planned. Instagram publishing can be automated only through Meta's official publishing tools/API with a professional account and required permissions; start with scheduled/manual publishing before building automation.

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

## Looker Studio Dashboard Plan

Recommended dashboard name:

```text
TRYANGLE_홈페이지_마케팅_대시보드
```

Initial data sources:

```text
GA4: Tryangle Official Website
Google Sheets: TRYANGLE_상담_등록_관리
```

Initial pages:

```text
1. Overview
2. Acquisition
3. Campaigns
4. Kakao Consult Funnel
5. Leads & Revenue
```

Initial Overview KPIs:

```text
Active users
New users
Views
Sessions
Engagement rate
Kakao consultation clicks
Top source / medium
Top campaign
```

Recruitment-round analysis:

- Use `utm_campaign` and the Sheet `campaign` column as the bridge between website performance and actual lead/registration results.
- Monthly reporting is secondary. Primary review should be by recruitment round, for example `class_2026_09`.

Creation status:

- Dashboard design drafted.
- Owner still needs to create the Looker Studio report and connect GA4 + Google Sheets data sources.

---

## Handoff For Next PC / Next AI

Last updated: 2026-08-09 Asia/Seoul.

Use this repository and this `README.md` as the source of truth for the official homepage analytics work.

Repository:

```text
https://github.com/tkddnjs2959-lab/tryangle-homepage.git
```

Production site:

```text
https://tryangle-official.co.kr
```

Related Google Sheet:

```text
https://docs.google.com/spreadsheets/d/1uYwRYGfa-mMs-jlmI75ADoAKTaDAqiaJQ_runu2UJ90/edit
```

Do not use the local-only file below as the primary handoff document:

```text
C:\Users\juaju\Desktop\AI\CLAUDE\TRYANGLE\PROJECT_STATUS.md
```

That file may exist locally, but it is not part of the `tryangle-homepage` Git repository.

### Completed

1. GTM container created.

```text
GTM-WP798468
```

2. Homepage code loads GTM through Vercel env var.

```text
NEXT_PUBLIC_GTM_ID=GTM-WP798468
```

3. GTM was verified on the live site after fixing a Vercel env var typo.

Issue found and fixed:

```text
Wrong: GMT
Correct: GTM
```

4. GA4 property/web stream created and connected.

```text
G-1Z0PL2VZHX
```

5. GA4 Realtime was verified. Owner reported visitor count increased by 1.

6. Microsoft Clarity was installed through GTM. Clarity screen said data should appear within a few hours.

7. First website event was implemented in code:

```text
click_kakao_consult
```

Files changed:

```text
src/app/TrackedLink.tsx
src/app/page.tsx
src/app/coaching/page.tsx
```

The event is pushed to `window.dataLayer` with a `placement` parameter.

8. UTM operating rules were drafted.

Starter links:

```text
Instagram profile:
https://tryangle-official.co.kr/?utm_source=instagram&utm_medium=profile&utm_campaign=always_on&utm_content=profile_link

Instagram paid ad:
https://tryangle-official.co.kr/?utm_source=instagram&utm_medium=paid&utm_campaign=class_2026_09&utm_content=character_ad_01

Naver blog:
https://tryangle-official.co.kr/?utm_source=naver&utm_medium=blog&utm_campaign=class_2026_09&utm_content=blog_cta_01

Kakao manual share:
https://tryangle-official.co.kr/?utm_source=kakao&utm_medium=dm&utm_campaign=class_2026_09&utm_content=manual_reply

Offline QR:
https://tryangle-official.co.kr/?utm_source=offline&utm_medium=qr&utm_campaign=class_2026_09&utm_content=studio_poster
```

9. Google Sheet for manual lead/registration/revenue tracking was created and structured.

Sheet tabs:

```text
LEADS
CAMPAIGNS
CLASSES
SUMMARY
```

Important: this Sheet is not an automatic Kakao import. It is a manual sales/lead ledger for actual identifiable leads after Kakao inquiry, application, phone, or DM.

### Pending / Verify Next

1. Verify `click_kakao_consult` in GTM Preview and GA4 Realtime or DebugView.

GTM setup that should exist or should be created:

```text
Trigger:
CE - click_kakao_consult
Type: Custom Event
Event name: click_kakao_consult

Tag:
GA4 Event - click_kakao_consult
Event name: click_kakao_consult
Trigger: CE - click_kakao_consult
```

After setting this up, click a Kakao button on the live site and check:

```text
GTM Preview -> event list includes click_kakao_consult
GA4 Realtime/DebugView -> event appears
```

2. Check Microsoft Clarity after some time.

Verify:

```text
Dashboard has data
Recordings appear
Heatmaps begin collecting
```

3. Create Looker Studio report.

Recommended report name:

```text
TRYANGLE_홈페이지_마케팅_대시보드
```

Data sources:

```text
GA4: Tryangle Official Website
Google Sheets: TRYANGLE_상담_등록_관리
```

Initial report pages:

```text
Overview
Acquisition
Campaigns
Kakao Consult Funnel
Leads & Revenue
```

Start with these GA4 scorecards:

```text
Active users
New users
Views
Sessions
```

Then add tables:

```text
Session source / medium
Session campaign
```

4. Later, connect the Google Sheet to Looker Studio for manual lead, registration, ad cost, and revenue reporting.

### Git Notes

Before working on another PC:

```powershell
git clone https://github.com/tkddnjs2959-lab/tryangle-homepage.git
cd tryangle-homepage
npm install
```

Before editing:

```powershell
git pull
```

After editing:

```powershell
npm.cmd run build
git status
git add README.md path/to/changed/files
git commit -m "message"
git push
```

There may be an untracked local `.claude/` folder on the original PC. Do not commit it unless explicitly needed.

## 2026-08-10 Share-Link UTM Automation

- Added an article share button to each `/insights/[slug]` page.
- The button uses the browser-native share sheet when available, or copies the article URL to the clipboard.
- Shared URLs automatically include:

```text
utm_source=insight
utm_medium=share
utm_campaign=always_on
utm_content={article_slug}
```

- Added the `share_insight` dataLayer event with the `article` parameter.
- This is client-side only. It does not call OpenAI, DeepSeek, or any other AI API.

API clarification:

- Current content growth features such as sitemap, robots, RSS, insight pages, related links, and share links do not require an AI API.
- Existing API routes are for site operations only: inquiry submission, Kakao authorization/callback, Supabase inquiry storage, and optional email/Kakao alerts.
- DeepSeek has not been integrated. If AI drafting or summarization is needed later, connect it explicitly and keep human review before publishing.

## 2026-08-10 Insight Content Expansion

- Expanded the public `/insights` content library from 3 articles to 10 articles.
- Added seven new search-intent articles:
  - `profile-photo-outfit-guide`
  - `profile-shoot-preparation-checklist`
  - `audition-self-introduction`
  - `casting-profile-core-points`
  - `acting-entrance-vs-audition`
  - `new-actor-profile-mistakes`
  - `actor-portfolio-structure`
  - `media-acting-audition-routine`
- Rewrote `src/app/insights/content.ts` with clean Korean copy so article titles, descriptions, summaries, and sections remain readable in source.
- The `/insights` hub, `/insights/[slug]` pages, `sitemap.xml`, and `/insights/feed.xml` update automatically from the `INSIGHTS` array after deployment.
- No AI API was added for this step.

## 2026-08-10 Insight Article Detail Pass

- Expanded all 10 insight articles from short outline-style posts into more detailed practical guides.
- Each article now includes deeper context, concrete preparation criteria, common mistakes, and review questions where relevant.
- Article structure remains code-driven in `src/app/insights/content.ts`; no CMS, OpenAI API, or DeepSeek API was added.
- This pass is intended to make the pages more useful for real visitors and stronger for search-intent landing pages.
