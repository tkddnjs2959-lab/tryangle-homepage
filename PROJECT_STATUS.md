# 주아쌤 레슨 홈페이지 — 작업 기준

최종 정리: 2026-11-08 (한국 시간)

## 기준 저장소와 배포

- GitHub: https://github.com/tkddnjs2959-lab/tryangle-homepage
- 기준 브랜치: `main`
- Vercel: 팀 `fsd11`, 프로젝트 `tryangle-homepage`
- 운영 주소: https://tryangle-official.co.kr/
- 현재 운영 배포: `dpl_AVz78diTkumfgcZGWAiCZBAR5nAv` (READY)
- 가장 최신의 전체 인수인계 내용은 저장소의 README.md에서 `Current Production State and Handoff`를 확인한다. 이 문서는 핵심 요약이다.

## 현재 페이지 상태

- `/`가 주아쌤 매체연기 레슨 페이지다. Try앵글 브랜딩이나 예전 홈페이지 구성을 루트에 되살리지 않는다.
- 제목: `주아쌤 매체연기 레슨`
- 제목 아래 성인 안내: `*본 레슨은 성인(만 19세 이상)만을 대상으로 합니다.`
- 디자인: 차콜 배경 `#1e1d20`, 핑크 강조색. `public/jua-t-logo.png`는 글자만 남긴 투명 로고다.
- 섹션 순서: 가격 → 이력 사항 → 상담 예약.
- 리뷰 사진은 자료를 받은 뒤 추가한다.
- `/coaching`은 404/noindex로 비활성화되어 있다. 실제 코칭 페이지는 루트에 표시한다.
- `/character-positioning`은 기존 페이지 보존 경로이며 noindex.

## 가격과 이력

- 2:1 주 1회: 월 4회, 회당 1시간, 정가 30만원, 할인가 12만원.
- 2:1 주 2회: 월 8회, 회당 1시간, 정가 47만원, 할인가 19만원.
- 1:1 주 1회: 월 4회, 회당 1시간, 25만원.
- 이력은 학력, 연기트레이너 대표 이력, 배우 활동으로 구성한다. 기존 사진과 문구를 유지하고 관련 뉴스는 추가하지 않는다.

## 상담 예약 폼

- `2:1 레슨` / `1:1 레슨` 선택 탭이 있다. 기본값은 2:1이다.
- 선택한 유형은 신청 메시지의 `레슨 유형` 항목에 저장되며 개인정보 수집 안내에도 포함된다.
- 성별 선택은 숨기고, 희망 요일·시간은 직접 입력한다. 예시: `월요일 3시 이후, 금요일 6시`.
- 제출 버튼은 `상담 예약하기`.
- 접수 후 문구:
  - 상담 예약이 접수되었습니다.
  - 아래 버튼을 눌러 카카오톡에서 “상담 예약했어요”라고 메시지를 남겨주세요.
  - 확인 후 방문상담 가능 일정을 안내해드리겠습니다.
- 접수 완료 카카오톡 주소: https://pf.kakao.com/_mWxcMb
- 우측 고정 `신청하기` 버튼을 유지한다.
- 카카오 버튼의 `click_kakao_consult`는 링크 클릭만 뜻한다. 실제 카카오 메시지나 상담 완료로 해석하지 않는다. 신청 유입의 UTM은 함께 저장한다.

## 주요 파일

- `src/app/page.tsx`: 홈페이지 루트와 메타데이터
- `src/app/coaching/CoachingLanding.tsx`: 페이지 섹션 및 폼 설정
- `src/app/coaching/page.tsx`: 비활성화된 /coaching 경로
- `src/app/coaching/content.ts`: 가격 및 이력 데이터
- `src/app/coaching/coaching.module.css`: 랜딩페이지와 반응형 디자인
- `src/app/ContactForm.tsx`: 폼과 레슨 유형 선택, 신청 데이터
- `src/app/page.module.css`: 공용 폼과 탭 디자인
- `public/jua-t-logo.png`: 투명 JAU T 로고

## 다른 컴퓨터에서 작업 재개

1. 로컬 변경을 확인하고 보존한다: `git status --short`. 로컬 변경을 무조건 초기화하거나 삭제하지 않는다.
2. 공식 저장소의 `main`을 가져온다: `git fetch origin`, `git switch main`, `git pull --ff-only origin main`.
3. README.md의 `Current Production State and Handoff`와 이 파일을 읽는다.
4. 필요한 범위만 수정하고 `npm run build`로 빌드를 확인한다.
5. GitHub `main`에 반영하고 Vercel에서 동일 커밋의 운영 배포가 READY인지 확인한다.
6. 오래 지속될 디자인/문구/동작 변경은 README.md와 이 파일에 함께 기록한다.

새 컴퓨터에서 시작할 때 사용할 지시:
> tryangle-homepage 저장소의 main을 최신으로 동기화하고 README.md의 “Current Production State and Handoff”와 PROJECT_STATUS.md를 읽어줘. 기존 로컬 변경은 보존하고 덮어쓰지 마. 주아쌤 레슨 페이지는 루트 / 에서 운영 중이니 요청 범위만 수정해. 작업 후 빌드 확인, main 반영, Vercel 운영 배포 READY 확인, 두 작업 기록 문서 업데이트까지 진행해줘.

## 복구 기준

- 이전에 다른 컴퓨터에서 예전 화면으로 덮인 일이 있었으므로 과거 Vercel 배포를 소스 기준으로 삼지 않는다.
- 현재의 GitHub `main`이 유일한 코드 기준이다. 복구가 필요하면 먼저 GitHub main을 확인하고, 오래된 별도 브랜치나 실패 배포로 main을 되돌리지 않는다.
