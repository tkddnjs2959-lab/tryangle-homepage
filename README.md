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
