# 2026 서원대학교 미디어콘텐츠학부 졸업전시 웹사이트

> **배포 주소** https://media.seowon.ac.kr/2026/
> **이 문서의 독자**: 내년(2027) 이후 졸업전시 개발 위원, 그리고 이 저장소를 처음 여는 모든 사람.
> 코드를 열기 전에 이 문서를 위에서 아래로 한 번 읽으면 "무엇이 어디에 있고, 왜 이렇게 만들었는지"를 알 수 있도록 썼습니다.

| 구분 | 주소 |
|---|---|
| 2026 졸업전시 사이트 (이 저장소) | https://media.seowon.ac.kr/2026/ |
| 소스 저장소 | https://github.com/KHolyh2o/Graduation-Exhibition |
| 역대 졸업전시 아카이브 (별도 저장소 GEArchive) | https://media.seowon.ac.kr/archive/ |
| 아카이브 관리 화면 (CMS) | https://media.seowon.ac.kr/admin/ |
| 다음 해 사이트 | `https://media.seowon.ac.kr/2027/` (연도만 바꿔서) |

> **내년 담당자가 가장 먼저 읽을 곳**: [§14 내년 체크리스트](#14-내년-개발-위원을-위한-체크리스트와-제안) · [§17 GEArchive 연동](#17-gearchive역대-전시-아카이브와의-관계) · [§18 권한·문의](#18-권한과-문의)

| 문서 | 내용 |
|------|------|
| **README.md** (이 파일) | 전체 설명서. 처음 읽는 사람용 |
| [AGENTS.md](AGENTS.md) | 작업 규칙 요약본 (금지 사항, CSS 규칙, 이식 규칙). AI 도구도 이 파일을 자동으로 읽음 |
| [DATA_MANAGEMENT_GUIDE.md](DATA_MANAGEMENT_GUIDE.md) | 운영팀용 데이터·사진 입력 가이드 (⚠ 일부 옛 규칙 포함, 아래 [§6.4](#64-알려진-문서-불일치) 참고) |
| [sha_copy/README.md](sha_copy/README.md) | 디자이너용 사용법 (React 없이 HTML 작업하는 방법) |

---

## 🎯 핵심 요약 — 어느 졸전이든 가져갈 기본 틀

> 디자인·컨셉은 해마다 바뀌지만 **아래 5가지 틀은 어느 졸업전시 사이트에서도 그대로 쓸 수 있습니다.** 나머지 상세 설명은 이 요약 밑에 있습니다.

### ① 어떤 테이블(데이터)이 필요한가

서버·DB 없이 `src/data/*.js` 의 배열이 곧 테이블입니다. 졸전 사이트는 **아래 6개면 충분**합니다.

| 테이블 | 파일 | 한 줄 설명 | 26년 규모 |
|---|---|---|---|
| **졸업생** | `graduates.js` | 프로필·직군·소개·연락처 | 40명 |
| **작품(개인·공동)** | `projects.js` | 학생이 만든 작품 | 약 60개 |
| **팀 작품** | `teamProjects.js` | 팀 단위 작품 (26년은 창캡/U300) | 9팀 |
| **교수진** | `professors.js` | 사진·직책·격려사 | 10명 |
| **아카이브** | `archives.js` | 과거 전시 연도·링크·썸네일 | 3개 |
| **전시 정보** | `constants.js` | 제목·테마·날짜·장소·위원회 팀 목록 | 1건 |

그 밖에 데이터는 아니지만 **분류 체계**를 한 파일로 따로 둡니다: `projectTabs.js` (탭·직군 정의). 필터 UI와 검증이 전부 여기서 파생됩니다. 작품 조회 규칙은 `works.js` 에 모읍니다.

### ② 테이블별 속성 (최소 구성)

| 테이블 | 속성 |
|---|---|
| **graduates** | `id`, **`studentId`(PK, 학번)**, `name`, `englishName`, `tab`·`role`(필터 코드), `jobTitle`(화면 직함), `profileImage`, `intro`(팝업용 짧은 소개), `workIntro`(작품 상세용 긴 소개), `committeeTeam`(위원회 팀, 없으면 비움), `email`, `phone`, **`introVideoUrl`**(1분 자기소개 YouTube, 없으면 비움) |
| **projects** | **`id`(PK)**, `studentId` *또는* `studentIds[]`(공동 작품) → graduates 참조, `tab`, `role`/`roles[]`, `title`, `thumbnail`, `proposalImages[]`(판넬), `videoUrl`(없으면 영상 칸 없이 판넬이 바로 시작), `description`, `contact` |
| **teamProjects** | **`id`(PK)**, `teamName`, `group`, `title`(선택), `thumbnail`, `proposalImages[]`, `teamImage`(단체사진), `videoUrl`, `description`, `members[]` = `{name, role, studentId}` → graduates 참조 |
| **professors** | `id`, `name`, `role`(학부장·지도교수 등), `photo`, `cardPhoto`(카드용 크롭, 선택), `headline`, `message`(격려사, `\n` 줄바꿈) |
| **archives** | `year`, `theme`, `url`(그 해 전시 사이트), `thumbnail` |
| **EXHIBITION** (constants) | `title`, `theme`, `dateText`, `hours`(날짜별 운영 시간 배열), `place`, `address`, `total`(졸업생 수) / `COMMITTEE_TEAMS`(위원회 팀 표시 순서) |

**관계 규칙 (이것만 지키면 됨)**
- `projects.studentId(s)` 와 `teamProjects.members[].studentId` 는 반드시 `graduates.studentId` 에 존재해야 함 (1:N).
- `tab`/`role`/`group` 은 `projectTabs.js` 에 정의된 값만 사용.
- 이미지는 데이터에 `/images/…` 로 적고, 화면에서는 `assetUrl()`/`<SafeImg>` 로 출력.
- 위반은 `npm run validate` 가 잡아 줌.

> 사람이 고치는 **원본은 CSV**(`csv_data/`), JS 는 스크립트가 만드는 **생성물**입니다 → [§6](#6-데이터-입력-파이프라인-csv--js)

### ③ 왜 React + Vite 로, 어떻게 구성했나

**구성 한 줄**: *"서버 없는 정적 SPA — 데이터 JS + React 페이지 + 학교 Nginx 정적 호스팅"*

```
데이터(src/data) ──import──► 페이지(src/pages) ──조합──► 공통 컴포넌트(src/components)
        ▲                          │
   CSV → 변환 스크립트         React Router (라우트 1개 = 페이지 파일 1개)
                                   │
                         npm run build → dist/ (HTML+JS+CSS+이미지) → 학교 서버
```

| 선택 | 이유 |
|---|---|
| **정적 사이트 (서버·DB 없음)** | 학교 서버가 Nginx 정적 호스팅만 제공. 운영·보안·비용 부담이 없고 전시 기간 접속이 몰려도 안전 |
| **React** | 작품 카드·필터·팝업·상세처럼 **같은 UI 를 데이터만 바꿔 반복**하는 구조라 컴포넌트가 맞음. 졸업생/작품이 바뀌어도 코드는 그대로 |
| **Vite** | 설정이 거의 없고 개발 서버·빌드가 빠름. `base` 하나로 `/2026/` 하위 경로 배포 해결 |
| **React Router (SPA)** | 페이지 전환이 빠르고 전환 효과를 줄 수 있음. 대신 Nginx 에 `try_files … /2026/index.html` 필요 |
| **페이지별 `lazy()`** | 데이터가 큰 페이지(작품·졸업생)가 첫 로딩을 늦추지 않게 메인 외 페이지는 접속 때 내려받음 |
| **순수 CSS + `theme.css` 변수** | 컨셉이 바뀌면 색·폰트·간격 변수 파일만 수정. CSS-in-JS/Tailwind 없이도 충분 |
| **런타임 의존성 3개** | react / react-dom / react-router-dom 뿐 → 해마다 업데이트·보안 점검 부담 최소 |

**어느 졸전이든 필요한 페이지**: 메인(히어로·전시안내·졸업생 슬라이더·크레딧·아카이브) / 작품소개(탭·직군 필터·카드) / 작품 상세(판넬·영상·작가 소개) / 졸업생 목록(+팝업) / 학과·교수진 / 404.
26년에는 여기에 갤러리(준비과정 영상)와 MEMORY(응원 게시판)를 더했습니다.

### ④ Git 관리 방법

| 항목 | 방법 |
|---|---|
| **브랜치** | `main` = 통합·**배포** (push 하면 GitHub Actions 가 빌드 후 학교 서버에 자동 배포) / 작업자별 브랜치(`sha`=디자이너, `kss`=개발자)에서 작업 후 main 으로 머지 |
| **디자이너 분리** | 디자이너는 `sha_copy/` 폴더만 수정 → 코드 충돌 최소화 ([§8](#8-sha_copy--26-졸전의-가장-큰-특수성)) |
| **작업 시작 전** | 항상 `git pull` |
| **머지 전 점검** | `npm run validate` (ERROR 0) → `npm run lint` (에러 0) → `npm run build` (성공) |
| **커밋 메시지** | `feat:` / `fix:` / `refactor:` / `docs:` + 한국어 설명 (예: `feat: 작품 썸네일 112장을 webp로 연결`) |
| **배포 사고 방지** | main push = 즉시 배포. 서버 nginx 설정·`basename`·`base` 는 건드리지 않음 ([§15](#15-절대-건드리면-안-되는-것)) |
| **권한** | push 는 소유자 + 초대한 Collaborator 만. 배포용 서버 계정은 GitHub Secrets 에 보관 ([§18](#18-권한과-문의)) |
| **저장소 크기 주의** | 이미지는 한 번 커밋하면 이력에 영구히 남아 저장소가 커짐 (26년 `.git` ≈ 150MB). **반드시 최적화(③ 아래 ⑤)한 뒤 커밋**하고, 같은 이미지를 반복 교체 커밋하지 말 것 |

### ⑤ 용량을 많이 먹는 판넬 PNG 는 어떻게 해결했나

판넬(작품 설명용 세로 대형 이미지)은 원본이 PNG/PDF 의 고해상도 이미지라 그대로 올리면 **저장소·빌드·학교 서버·방문자 로딩이 모두 무거워집니다.** 해결 방법:

1. **WebP 로 변환** — PNG 를 `webp` 로 바꿔 화질 손실을 거의 없이 용량을 크게 줄임 (macOS: `brew install webp` 후 `cwebp`).
2. **폭 1600px 로 리사이즈, 품질 q82** — 상세 페이지의 화면 폭 이상으로 클 필요가 없음. 26년 영상전공 판넬 75장이 이 기준.
3. **작품당 한 장, 파일명 = 작품 id** — `p-vd-<학번>-<번호>.webp` 처럼 이름 규칙을 고정해 매핑을 자동화 (`csv_data/source/panels.json` 이 `작품id → 이미지경로` 연결).
4. **썸네일은 별도 작은 이미지** — 목록은 `thumbnails/`, 상세만 `proposals/` 를 불러와 목록 로딩을 가볍게.
5. **지연 로딩** — `<SafeImg>`(`loading="lazy"`) 로 화면에 가까워질 때만 내려받음.

결과: 판넬 120여 장이 `proposals/` **약 48MB**, 썸네일 112장 약 8MB (전체 `public/images` ≈ 144MB, 그중 졸업생 프로필 사진 28MB).

```bash
# 예) PNG → 폭 1600px, 품질 82 WebP (원본은 그대로 두고 새 파일 생성)
cwebp -q 82 -resize 1600 0 input.png -o p-vd-202110030-1.webp
```
> 변환 전 원본(PNG/PDF)은 저장소에 올리지 말고 드라이브에 보관하세요. 도록 PDF 처럼 더 큰 파일은 저장소가 아니라 서버에 직접 올립니다(GEArchive 방식, [§17](#17-gearchive역대-전시-아카이브와의-관계)).

---

## 📚 이하 상세 설명

위 핵심 요약의 각 항목을 풀어 쓴 내용과, 26 졸전만의 사정(sha_copy 등)이 아래에 있습니다.

## 목차

1. [한눈에 보기](#1-한눈에-보기)
2. [기술 스택과 사용한 도구](#2-기술-스택과-사용한-도구)
3. [빠른 시작](#3-빠른-시작)
4. [폴더·파일 역할 지도](#4-폴더파일-역할-지도)
5. [데이터는 어떻게 구성했나 (DB 설계)](#5-데이터는-어떻게-구성했나-db-설계)
6. [데이터 입력 파이프라인 (CSV → JS)](#6-데이터-입력-파이프라인-csv--js)
7. [MEMORY 게시판 — 유일한 진짜 DB (Supabase)](#7-memory-게시판--유일한-진짜-db-supabase)
8. [**sha_copy — 26 졸전의 가장 큰 특수성**](#8-sha_copy--26-졸전의-가장-큰-특수성)
9. [CSS·디자인 시스템 규칙](#9-css디자인-시스템-규칙)
10. [배포 (GitHub Actions → 학교 서버)](#10-배포-github-actions--학교-서버)
11. [브랜치·협업 방식](#11-브랜치협업-방식)
12. [26 졸전 사이트의 특수성 (알아야 할 사정들)](#12-26-졸전-사이트의-특수성-알아야-할-사정들)
13. [어떻게 더 체계적·효율적으로 만들었나](#13-어떻게-더-체계적효율적으로-만들었나)
14. [내년 개발 위원을 위한 체크리스트와 제안](#14-내년-개발-위원을-위한-체크리스트와-제안)
15. [절대 건드리면 안 되는 것](#15-절대-건드리면-안-되는-것)
16. [문제 해결 FAQ](#16-문제-해결-faq)
17. [GEArchive(역대 전시 아카이브)와의 관계](#17-gearchive역대-전시-아카이브와의-관계)
18. [권한과 문의](#18-권한과-문의)

---

## 1. 한눈에 보기

| 항목 | 내용 |
|------|------|
| 사이트 | 2026 서원대학교 미디어콘텐츠학부 졸업전시 (테마: **과녁 / TARGET**) |
| 전시 | 2026-11-16 ~ 11-17, 서원대 미래창조관 3층 상상플러스 (`src/data/constants.js`) |
| 성격 | **서버·DB 없는 정적 사이트(SPA)**. 데이터는 전부 코드(`src/data/*.js`)에 들어 있고, 빌드하면 HTML/JS/CSS 파일 묶음이 됨 |
| 예외 | 응원 메시지 게시판 `/memory` 하나만 외부 DB(Supabase)를 사용 |
| 규모 | 졸업생 40명, 개인·공동 작품 약 60개, 팀(U300) 작품 9팀, 이미지 약 144MB |
| 페이지 | 메인 / 작품소개 / 작품상세 / 졸업생 / 학과소개 / 준비과정(갤러리) / 응원메시지(MEMORY) / 기타 / 404 |

**설계 철학 한 줄 요약**
> *"디자이너는 React를 몰라도 되고, 운영팀은 코드를 몰라도 되고, 개발자는 데이터만 바꾸면 화면이 따라오게 한다."*

이 철학이 아래 모든 구조(sha_copy, CSV 파이프라인, 단일 정의 파일, 자동 검증)의 이유입니다.

---

## 2. 기술 스택과 사용한 도구

### 2.1 런타임 (사이트 자체)

| 도구 | 버전 | 용도 / 선택 이유 |
|------|------|------------------|
| **React** | 19 | UI. 페이지·컴포넌트 단위로 분리 |
| **React Router DOM** | 7 | 클라이언트 라우팅. `basename="/2026/"` 고정 |
| **Vite** | 7 | 개발 서버·빌드. 설정이 거의 없고 빠름 |
| **순수 CSS** | – | 페이지별 `.css` 파일 + 공통 `theme.css`. CSS-in-JS·Tailwind 미사용 (디자이너의 CSS를 그대로 이식하기 위해) |
| **Supabase (PostgREST)** | – | MEMORY 게시판 한 곳에서만 사용. **SDK 없이 `fetch`로 직접 호출** → 의존성 0 |
| **Google Fonts** | – | `index.html` 의 `<link>` 한 곳에서만 로드 |

런타임 의존성은 `react`, `react-dom`, `react-router-dom` **딱 3개**입니다. 일부러 늘리지 않았습니다 (유지보수 부담·보안 점검 대상 최소화).

### 2.2 개발·빌드 도구

| 도구 | 용도 |
|------|------|
| **ESLint 9** (+ react-hooks, react-refresh) | 코드 검사. `npm run lint` 는 **에러 0건 유지**가 규칙. `sha_copy/` 는 제외 |
| **PostCSS 커스텀 플러그인** ([postcss.config.js](postcss.config.js)) | 빌드 때 모든 `font-size`에 +pt 자동 가산 (§9.3) |
| **Node 스크립트** ([scripts/](scripts/)) | CSV→JS 변환, 데이터 검증, 구글드라이브 원본 가져오기 (§6) |
| **serve** (`npx serve`) | `sha_copy/` 를 로컬 서버로 여는 용도 (§8) |

### 2.3 인프라·협업

| 도구 | 용도 |
|------|------|
| **GitHub** | 저장소, 브랜치(`main`/`sha`/`kss`), PR |
| **GitHub Actions** | `main` push → 빌드 → 학교 서버 자동 배포 ([deploy.yml](.github/workflows/deploy.yml)) |
| **Nginx** (학교 서버) | 정적 파일 서빙. SPA용 `try_files` 설정은 서버에 이미 있음 ([nginx/default](nginx/default) 은 참고용 사본) |
| **Certbot** (학교 서버) | HTTPS. ⚠ nginx 설정을 덮어쓰면 사라짐 (§15) |
| **구글 드라이브 → CSV** | 운영팀이 작품명·직군 표를 공유폴더에 정리 → CSV로 내려받아 `csv_data/source/` 에 넣음 |
| **Claude Code 등 AI 도구** | 이식·리팩터링 작업에 활용. 규칙은 [AGENTS.md](AGENTS.md) 에 있고 AI가 시작 시 자동으로 읽음 |

---

## 3. 빠른 시작

요구사항: **Node.js 20** (배포 CI와 동일).

```bash
git clone https://github.com/KHolyh2o/Graduation-Exhibition.git
cd Graduation-Exhibition
npm install

npm run dev        # 실제 사이트(React) 개발 서버  → http://localhost:5173/2026/
npm run sha_copy   # 디자이너 작업 폴더 미리보기   → 터미널에 뜬 주소 + /sha_copy/
```

> ⚠ 개발 서버 주소는 `http://localhost:5173/` 이 아니라 **`/2026/`** 까지 붙여야 열립니다 (`vite.config.js` 의 `base`).

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 배포용 빌드 → `dist/` |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint (에러 0건 유지) |
| `npm run validate` | **데이터 검증** — 작업 전후 반드시 실행 |
| `npm run csv:graduates <csv>` | 졸업생 CSV → `src/data/graduates.js` |
| `npm run csv:projects <csv>` | 개인·공동 작품 CSV → `src/data/projects.js` |
| `npm run csv:teamProjects <csv>` | 팀 작품 CSV → `src/data/teamProjects.js` |
| `npm run sha_copy` | 디자이너 폴더 미리보기 서버 |

### 환경변수 (`.env`)

MEMORY 게시판용입니다. 없어도 사이트는 정상 동작합니다 (게시판이 "미리보기 모드"로 전환).

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...   # publishable(anon) 키 — 브라우저에 노출되는 값. 보호는 RLS 가 담당
```
(이 `.env` 는 현재 git 에 커밋되어 있어 CI 빌드에도 반영됩니다.)

---

## 4. 폴더·파일 역할 지도

```
Graduation-Exhibition/
├── README.md / AGENTS.md / DATA_MANAGEMENT_GUIDE.md   ← 문서들
├── index.html              ← Vite 진입 HTML (OG 메타, Google Fonts <link>). 마크업을 직접 넣지 말 것
├── vite.config.js          ← base: '/2026/'  ⛔ 수정 금지
├── postcss.config.js       ← font-size 자동 확대 플러그인
├── eslint.config.js        ← 린트 규칙 (sha_copy 제외)
├── .env                    ← Supabase 키 (MEMORY 게시판)
├── .github/workflows/deploy.yml   ← 자동 배포
├── nginx/default           ← 서버 nginx 설정 참고 사본 (배포에 쓰지 않음)
├── supabase/memory.sql     ← MEMORY 게시판 테이블·권한(RLS) 정의
│
├── csv_data/               ← ★ 원본 데이터(엑셀/CSV). 사이트 데이터의 "출처"
│   ├── graduates.csv, projects.csv, teamProjects.csv
│   └── source/             ← 운영팀 원본 표(작품명·직군) + panels.json / thumbnails.json (이미지 매핑)
│
├── scripts/
│   ├── csv-to-data.js        ← CSV → src/data/*.js 변환기
│   ├── import-drive-works.js ← 드라이브 원본 표 → projects.csv / teamProjects.csv 생성
│   ├── export-csv.js         ← 반대 방향: 현재 src/data/*.js → CSV (백업·엑셀 편집용)
│   └── validate-data.js      ← 데이터 정합성 검사
│
├── public/                 ← 빌드 시 그대로 복사되는 정적 파일
│   ├── favicon.png
│   └── images/             ← 모든 이미지 (graduates/ professors/ projects/{thumbnails,proposals}/ teams/ archives/ UI/ …)
│
├── sha_copy/               ← ★ 디자이너 작업 폴더 (§8). React 아님, 순수 HTML/CSS/JS
│
└── src/                    ← ★ 실제 사이트 소스 (React)
    ├── main.jsx            ← 앱 시작점
    ├── App.jsx             ← 라우터 + 전역 레이아웃. basename="/2026/" ⛔ 수정 금지. 메인 외 페이지는 lazy()
    ├── index.css           ← 리셋·공통 클래스 (맨 위에 @import './theme.css')
    ├── theme.css           ← ★ 색·폰트·간격 변수 (컨셉이 바뀌면 이 파일 위주로 수정)
    ├── App.css
    │
    ├── pages/              ← 라우트 1개 = 파일 1개 (+ 같은 이름 .css)
    │   ├── MainPage        ← 히어로, 콘셉트, TARGET 3색 카드, 졸업생 슬라이더, 전시안내/지도, 크레딧(위원회), 아카이브
    │   ├── ProjectPage     ← 작품소개: 탭(멀티미디어/영상미디어/팀) + 직군 필터 + 카드 목록
    │   ├── DetailPage      ← 작품 상세 (/project/:id): 판넬 이미지, 영상, 작가 소개, Other Project
    │   ├── StudentPage     ← 졸업생 목록 (?student=<학번> 이면 팝업이 열림)
    │   ├── DepartmentPage  ← 학과소개: 교수진, 교육과정, 핵심 역량
    │   ├── GalleryPage     ← 준비과정 영상
    │   ├── MemoryPage      ← 응원 메시지 게시판 (Supabase)
    │   ├── OthersPage      ← 기타 (현재 거의 빈 페이지)
    │   └── NotFoundPage    ← 404
    │
    ├── components/
    │   ├── Navbar / Footer          ← 공통 헤더·푸터
    │   ├── SiteEffects              ← 전 페이지 공통 효과: 스크롤 등장(.fx-reveal), 페이지 이동 시 페이드(.fx-leaving)
    │   ├── GraduateModal            ← 졸업생 프로필 팝업 (메인 슬라이더·졸업생 페이지·작품 상세에서 공용)
    │   ├── SafeImg                  ← 이미지 로딩 실패 시 기본 이미지로 대체
    │   ├── ScrollTopButton          ← 맨 위로 이동 버튼 (App 에서 한 번만 마운트, 스타일은 index.css 의 .scroll-top-button 한 곳)
    │   └── SkeletonCard             ← 로딩·빈 상태 컴포넌트
    │
    ├── data/               ← ★ "DB" (§5)
    │   ├── graduates.js     졸업생 40명
    │   ├── projects.js      개인·공동 작품
    │   ├── teamProjects.js  팀(U300) 작품
    │   ├── projectTabs.js   탭·직군 정의 (단일 출처)
    │   ├── works.js         작품 조회 헬퍼 (두 작품 배열 합치기, 작가명, 필터 규칙)
    │   ├── professors.js    교수진
    │   ├── archives.js      과거 전시(2023~2025) 링크
    │   └── constants.js     전시 기본 정보(날짜·장소·위원회 팀 순서)
    │
    ├── hooks/
    │   ├── useImageFallback.js   assetUrl()(base 경로 보정), FALLBACK 상수
    │   └── useScrollReveal.js    IntersectionObserver 기반 등장 효과
    │
    └── lib/memoryApi.js    ← Supabase REST 호출 (fetch 직접)
```

---

## 5. 데이터는 어떻게 구성했나 (DB 설계)

### 5.1 큰 그림 — "JS 파일이 곧 DB"

이 사이트에는 서버도 관계형 DB도 없습니다. **`src/data/*.js` 의 객체 배열이 데이터베이스** 역할을 하고, 빌드 시 번들에 포함됩니다.

| 선택 | 이유 |
|------|------|
| 서버·DB 없이 정적 파일 | 학교 서버가 정적 호스팅(Nginx)만 제공 → 운영·보안·비용 부담 0, 전시 기간 트래픽에도 안전 |
| 데이터를 JS로 | 타입 검사 없이도 import 한 줄로 쓰고, `validate` 스크립트로 정합성 확인 가능 |
| 원본은 CSV | 운영팀이 엑셀로 수정 가능. **CSV가 사람이 고치는 원본, JS는 생성물** |

### 5.2 테이블(= 파일)과 관계

```
 csv_data/*.csv  ──(scripts/csv-to-data.js)──►  src/data/*.js  ──import──►  pages/*.jsx

 ┌──────────────┐  studentId   ┌───────────────┐
 │ graduates.js │◄────────────►│  projects.js  │   개인·공동 작품
 │  (40명)       │  (1:N)       │  (약 60개)     │
 └──────┬───────┘              └───────┬───────┘
        │ members[].studentId          │ tab / role
        ▼                              ▼
 ┌────────────────┐             ┌───────────────┐
 │ teamProjects.js│── tab/group►│ projectTabs.js│   탭·직군 정의(단일 출처)
 │  (9팀)          │             └───────────────┘
 └────────────────┘
        └──────── works.js: projects + teamProjects 를 하나의 allWorks 로 합쳐 조회 ────────┘
```

**기본 키 / 외래 키 규칙**

| 데이터 | 기본 키 | 연결 |
|--------|---------|------|
| graduates | `studentId`(학번, 문자열) — `id` 는 `g-01` 형식 표시용 | – |
| projects | `id` = `p-mm-<학번>-brand` 등 | `studentId`(단독) 또는 `studentIds`(공동) → graduates |
| teamProjects | `id` = `t-u300-01` | `members[].studentId` → graduates |

> **핵심 규칙**: `projects.studentId(s)` 는 `graduates.studentId` 에 반드시 존재해야 합니다. 어기면 `npm run validate` 가 ERROR 로 알려줍니다.

### 5.3 각 데이터의 필드

**graduates** (`src/data/graduates.js`, CSV 컬럼: `id, studentId, name, englishName, tab, role, jobTitle, profileImage, intro, workIntro, committeeTeam, email, phone, introVideoUrl`)

| 필드 | 설명 |
|------|------|
| `tab`, `role` | 필터용 **코드**. `projectTabs.js` 에 있는 값만 허용 |
| `jobTitle` | 화면에 보일 한글 직함. 쉼표 금지, 둘이면 ` · ` 로 구분 |
| `intro` | 졸업생 팝업용 짧은 소개 / `workIntro`: 작품 상세 왼쪽용 긴 소개 |
| `committee`, `committeeTeam` | 졸업전시위원회 여부와 팀명 (기획팀/디자인팀/개발팀/영상팀/운영팀) → 메인 크레딧 섹션 |
| `email`, `phone` | 팝업에 표시. ⚠ 개인정보 (§14) |
| `introVideoUrl` | 학생 소개 팝업 하단에 나오는 **1분 자기소개 영상**. 이 칸만 쓰고, 비어 있으면 영상 영역이 아예 빠진다 (작품·팀 영상을 대신 보여 주지 않음) |

**projects** (`src/data/projects.js`)

| 필드 | 설명 |
|------|------|
| `id` | `p-mm-<학번>-brand` / `-func`(부분 기능 개선) / `-device`(다른 디바이스) 등. **id 접미사가 작품 종류를 결정** (`works.js` 의 `WORK_KINDS`) |
| `tab`, `role`, `roles` | 탭/직군. 한 작품이 여러 직군이면 `roles` 배열 |
| `studentId` / `studentIds` | 단독 / 공동 작품. 공동(2명 이상)은 **M-team** 으로 분류 |
| `thumbnail`, `proposalImages[]` | 목록 썸네일 / 상세 세로 판넬 이미지(여러 장 가능) |
| `videoUrl` | YouTube URL. **`https://youtu.be/영상ID` 형식으로 통일** (쇼츠 주소 `youtube.com/shorts/…` 는 사이트가 읽지 못하므로 영상ID 로 바꿔 쓸 것). 비어 있으면 작품 상세에 영상 칸이 없고 판넬이 맨 위에서 시작한다 |
| `description`, `contact` | 설명, 연락처 |

**teamProjects** (`src/data/teamProjects.js`) — 창업캡스톤 = U300 = 한이음 (§12)

| 필드 | 설명 |
|------|------|
| `teamName` | 팀명. **팀 작품은 작품명 없이 팀명만** 씀 (`title` 은 비움) |
| `group` | 출처 표시용(`u300`). 팀프로젝트 탭은 하위 필터가 없음 |
| `teamImage` | 팀 단체 사진(배경 제거 webp). 상세 왼쪽에 표시 |
| `members[]` | `{ name, role, studentId }`. role 은 팀에서 맡은 역할(전공 직군 아님) |

**projectTabs.js — 탭·직군의 단일 출처**

```js
// 멀티미디어: pm / design / marketer / dev / mteam   영상미디어: planning / production   팀프로젝트: (필터 없음)
```
> **탭이나 직군을 추가·변경하려면 이 파일만 고치면 됩니다.** ProjectPage 의 필터 UI, validate 의 유효값 검사가 모두 여기서 파생됩니다.

### 5.4 파생 로직은 한 곳에 — `works.js`

개인 작품과 팀 작품은 모양이 다르지만, 화면은 같은 카드로 보여줍니다. 그 차이를 흡수하는 헬퍼를 [src/data/works.js](src/data/works.js) 에 모았습니다.

| 함수 | 역할 |
|------|------|
| `allWorks` | `projects + teamProjects` 합본 |
| `getWorkById(id)` | 상세 페이지 조회 |
| `getWorkTitle(w)` | 개인은 `title`, 팀은 `teamName` |
| `getWorkAuthor(w)` | 학번 → 졸업생 이름 변환 (공동이면 `, ` 로 연결) |
| `matchesSub(w, subId)` | 직군 필터 일치 여부. **M-team 은 직군 탭에 안 나오고 M-team 탭에서만 보임** |
| `WORK_KINDS` | 브랜드 제안 / 부분 개선 제안 / 다른 디바이스 구분 |

> 필터·작가명 규칙이 목록(ProjectPage)과 상세(DetailPage)에 **복붙되어 어긋나지 않도록** 둘 다 이 파일을 씁니다.

### 5.5 이미지 파일 규칙 (현재)

모든 이미지는 `public/images/` 아래에 두고, 데이터에는 `/images/...` 형식으로 적습니다.

| 종류 | 위치 | 파일명 |
|------|------|--------|
| 졸업생 프로필 | `public/images/graduates/` | `<학번>_<이름>_프로필.png` |
| 작품 썸네일 | `public/images/projects/thumbnails/` | `<작품 id>.webp` |
| 작품 판넬(상세) | `public/images/projects/proposals/` | `<작품 id>.webp` |
| 팀 단체사진 | `public/images/teams/` | `<팀 id>.webp` |
| 교수진 | `public/images/professors/` | – |
| 기본 이미지 | `public/images/no-image.svg`, `no-avatar.svg` | 이미지 누락 시 자동 대체 |

- **작품 이미지는 작품 id와 같은 이름**으로 둡니다. 사람 이름·한글이 파일명에 안 들어가 인코딩 문제가 없고, 매핑이 자동입니다.
- 판넬·썸네일은 **webp**로 변환해 용량을 줄였습니다.
- 컴포넌트에서는 반드시 `assetUrl()` 또는 `<SafeImg>` 로 출력합니다 (§9.4).

---

## 6. 데이터 입력 파이프라인 (CSV → JS)

### 6.1 흐름

```
운영팀 표(구글 드라이브)
   │  CSV로 내려받아 csv_data/source/ 에 저장 (UTF-8)
   ▼
scripts/import-drive-works.js      → csv_data/projects.csv, teamProjects.csv 생성
   │   · 멀티미디어 브랜드 칸 = 학생 개인 작품
   │   · 부분기능개선·디바이스 칸 = 같은 이름이면 하나의 공동 작품으로 병합 (학번을 ';' 로 연결)
   │   · 영상미디어 타이틀 칸 = 개인 작품 (같은 제목 중복은 1개)
   │   · 창캡 칸 = 같은 팀명끼리 팀원으로 묶음
   │   · panels.json / thumbnails.json 이 있으면 이미지 경로 자동 연결
   ▼
npm run csv:projects csv_data/projects.csv        (graduates, teamProjects 도 동일)
   ▼
src/data/projects.js 등 생성 (덮어쓰기)
   ▼
npm run validate  →  npm run dev 로 눈으로 확인  →  npm run build
```

### 6.1-1 ⚠ projects / teamProjects 는 CSV 로 다시 만들기 전에 확인할 것

26년에는 `src/data/projects.js`, `teamProjects.js` 를 CSV 이후에 **직접 고친 부분**(제목·팀명·영상 링크 등)이 있어서, `npm run csv:projects` / `csv:teamProjects` 로 다시 만들면 현재 JS 와 **내용이 달라질 수 있습니다.** (graduates 는 CSV 와 JS 가 일치함을 확인함)
- 다시 만들기 전에 `git status` 가 깨끗한지 보고, 만든 뒤 `git diff` 로 의도하지 않은 변경이 없는지 확인하세요.
- 값을 고칠 때는 **JS 와 CSV 를 같은 값으로 함께** 고쳐 두면 안전합니다.

### 6.1-2 영상 링크 넣는 방법 (운영팀 "유튜브 링크 정리" 엑셀)

| 엑셀 종류 | 넣을 곳 |
|---|---|
| 자기소개 영상 | `graduates.csv` 의 `introVideoUrl` → `npm run csv:graduates csv_data/graduates.csv` |
| 작품 영상 / 중간발표 영상 | 해당 작품의 `videoUrl` (영상전공은 작품 영상, 멀티미디어는 중간발표 영상) |
| 창업캡스톤 | 해당 팀의 `videoUrl` |

- 링크는 `https://youtu.be/영상ID` 로 정리 (`?si=…` 같은 꼬리표 제거).
- 엑셀의 영상 제목과 작품명이 다를 수 있으므로 학생 이름 + 영상 주제로 짝을 확인하고, 애매하면 담당 학생에게 되묻기.
- 영상이 없는 작품은 `videoUrl` 을 비워 두면 된다 (빈 박스는 나오지 않음).

### 6.2 자주 쓰는 순서

```bash
# 졸업생 정보가 바뀌었을 때
#   csv_data/graduates.csv 수정 후
npm run csv:graduates csv_data/graduates.csv
npm run validate

# 현재 JS 데이터를 엑셀로 편집하고 싶을 때 (역방향)
node scripts/export-csv.js
```

### 6.3 `npm run validate` 가 검사하는 것

- id / studentId **중복**
- 이름·작품명·팀명 **미입력** (WARN)
- tab / role / group 이 `projectTabs.js` 의 **허용 값**인지 (ERROR)
- 작품의 studentId 가 graduates 에 **실제로 존재**하는지 (ERROR)
- 이미지 경로의 **실제 파일 존재 여부** (WARN)

> ERROR 0건이어야 머지합니다. CSV 변환 직후·머지 직전에 항상 돌리세요.

### 6.4 알려진 문서 불일치

[DATA_MANAGEMENT_GUIDE.md](DATA_MANAGEMENT_GUIDE.md) 는 초기(9월)에 작성된 문서라 **사진 파일명 규칙**(`학번_이름_썸네일.jpg` 등)이 현재 구조(작품 id 기반 `.webp`, §5.5)와 다릅니다. CSV 컬럼 설명과 명령어는 유효하지만, 파일명은 **이 README 의 §5.5 를 기준**으로 하세요. 내년에 한 번 정리하면 좋습니다.

---

## 7. MEMORY 게시판 — 유일한 진짜 DB (Supabase)

`/memory` 페이지는 방문자가 응원 메시지(포스트잇)를 남기는 게시판입니다. 이 기능만 서버 저장이 필요해 Supabase(PostgreSQL)를 썼습니다.

### 7.1 테이블 `public.memory_messages` ([supabase/memory.sql](supabase/memory.sql))

| 컬럼 | 타입 | 제약 |
|------|------|------|
| `id` | bigint identity | PK |
| `sender_name` | text | 1~16자, 기본 `익명` |
| `message` | text | 1~140자 |
| `color` | text | `red / blue / lime / pink / yellow` 중 하나 (TARGET 포인트 컬러) |
| `created_at` | timestamptz | 기본 `now()`, 내림차순 인덱스 |

### 7.2 보안 — RLS(Row Level Security)

- 브라우저에 노출되는 `anon` 키는 **읽기(select)와 쓰기(insert)만** 가능하도록 `revoke all` 후 `grant select, insert` 만 부여.
- **수정·삭제는 불가**. 부적절한 글은 Supabase 대시보드 → Table Editor 에서 해당 행을 직접 삭제 (운영 책임자가 확인).
- 길이·색상 제한을 **DB 의 `check` 제약**으로 걸어, 클라이언트 검사를 우회해도 막힘.

### 7.3 클라이언트 ([src/lib/memoryApi.js](src/lib/memoryApi.js))

- SDK 대신 **PostgREST 를 `fetch` 로 직접 호출** (`GET /rest/v1/memory_messages`, `POST`). 의존성 추가 없음.
- `.env` 에 키가 없으면 자동으로 **localStorage 미리보기 모드**로 동작 → 키 없이도 로컬 개발·디자인 확인 가능.
- 최근 200개만 조회.

### 7.4 내년에 쓸 때

Supabase 프로젝트가 소멸/정지되었을 수 있으니 새로 만들 것: 프로젝트 생성 → SQL Editor 에서 `memory.sql` 실행 → `.env` 에 URL/anon 키 입력. ⚠ **`service_role` 키는 절대 `.env`/코드에 넣지 말 것** (anon 키만 클라이언트용).

> ⚠ 스팸 방지 장치(레이트리밋·캡차)는 없습니다. 전시 기간 어뷰징이 걱정되면 Supabase Edge Function 이나 간단한 쿨타임 추가를 검토하세요.

---

## 8. sha_copy — 26 졸전의 가장 큰 특수성

### 8.1 sha_copy 가 뭔가요?

[sha_copy/](sha_copy/) 는 **디자이너(sha)가 React 없이 순수 HTML + CSS + JS 로 화면을 설계하는 작업 폴더**입니다. 이 해에는 디자이너가 코드를 직접 다루는 팀원이라, "디자인 시안(피그마) → 개발자가 구현" 대신 **"디자이너가 실제 동작하는 HTML 로 만든다 → 개발자가 React 로 이식한다"** 방식을 썼습니다.

장점: 디자이너가 결과를 브라우저에서 바로 보며 정밀하게 조정 / 시안과 구현의 괴리 감소.
단점: 같은 화면이 **두 벌**(sha_copy HTML, src React) 존재 → 동기화 비용이 생김. 아래 규칙으로 관리했습니다.

```
sha_copy/
├── *.html            index, project, detail, student, department, gallery, memory, others, 404
├── css/              페이지별 CSS (common, navbar, footer, mainpage, projectpage, detail, student, …, theme)
├── js/               페이지별 동작 (common.js = 공통 효과·글자 확대, index.js, project.js …)
└── images → ../public/images   (심볼릭 링크 — 실제 이미지 폴더와 공유)
```

### 8.2 sha_copy 와 진짜 프로젝트의 연결 (2가지만 진짜)

1. **데이터**: 각 `js/*.js` 맨 위의 `import … from '../../src/data/…'` 가 **실제 데이터를 그대로 읽음**. 디자이너는 가짜 목업이 아니라 진짜 40명·진짜 작품으로 확인.
2. **이미지**: `sha_copy/images` 는 `public/images` 로의 **심볼릭 링크**. 한쪽에 넣으면 양쪽에 반영.

나머지(HTML 구조·CSS·JS 동작)는 sha_copy 안에서만 쓰이는 독립 파일입니다.

### 8.3 실행

```bash
npm run sha_copy       # npx serve .  (프로젝트 루트를 서버로 연다)
# 터미널에 뜬 주소 + /sha_copy/  예) http://localhost:3000/sha_copy/
```
`index.html` 을 더블클릭(file://)하면 데이터 import 가 막혀 화면이 비므로 **반드시 서버로** 엽니다. (자세한 사용법은 [sha_copy/README.md](sha_copy/README.md))

### 8.4 sha_copy → React 이식 규칙 (가장 중요)

디자이너가 sha_copy 를 바꾸면 **개발자가 `src/` 로 옮겨야 합니다.** 규칙:

1. **HTML 을 그대로 복사하지 않는다.** 이미 React 쪽이 더 발전해 있으므로(필터·상세·팝업·딥링크·로딩 처리 등) **분해해서 기존 컴포넌트 구조에 맞춘다.**
2. **특정 페이지만이 아니라 sha_copy 전체를 `src/` 와 대조**한다. 어떤 변경이 있었는지는 `git log -- sha_copy` 로 디자이너 커밋을 확인.
3. **CSS 는 페이지 루트 클래스로 감싸** 전역 충돌을 막는다 (`.index-root`, `.dept-root`, `.project-page` …).
4. **브레이크포인트는 표준 4단계만** (1024/768/640/480). 디자이너 CSS 의 900px·620px 등은 변환.
5. **sha_copy 의 목업 데이터는 쓰지 않는다.** `src/data/*` 의 실제 데이터에 디자인을 맞춘다.
6. **이식한 것 / 일부러 이식하지 않은 것(이유 포함)을 보고**한다 (PR 설명 등에).

### 8.5 "눈으로 비교"하지 말고 "계산값으로 비교"한다

이식 후 "똑같아 보인다"는 믿을 수 없습니다 (폰트 크기 차이 1~2px, letter-spacing 차이는 눈에 안 띔). 그래서 **같은 브라우저 폭에서 요소별 `getComputedStyle`(font-size / family / weight / letter-spacing / 여백 …) 값을 sha_copy 와 React 양쪽에서 뽑아 비교**했습니다. 또한 우리 전역 CSS(`src/index.css`)의 클래스가 sha_copy 에는 없는 속성을 페이지로 새게 하지 않는지도 같이 확인합니다.

### 8.6 sha_copy 가 만든 몇 가지 사정

- **글자 크기**: 디자이너는 `common.js` 의 "GLOBAL FONT SIZE" 로 런타임에 글자를 키움(헤더·푸터 +2pt, 그 외 +4pt). React 쪽은 같은 규칙을 **빌드 때 PostCSS 가 자동 적용**(§9.3) → 깜빡임 없음.
- **인라인 style 은 예외**: 디자이너가 HTML 에 `style="font-size:…"` 로 고정한 곳은 자동 확대가 안 되므로 JSX 도 인라인으로 맞춤 (예: 메인 콘셉트 타이틀 `3.2rem`).
- **`sha_copy/` 는 린트 제외**, PostCSS 확대도 제외 (이중 적용 방지).
- **내년에도 이 방식을 쓸지는 팀 사정에 달림**. 디자이너가 코드를 못 다룬다면 sha_copy 는 삭제해도 되지만, 쓴다면 위 §8.4 이식 규칙을 문서로 팀에 공유하세요.

---

## 9. CSS·디자인 시스템 규칙

### 9.1 테마 변수는 `src/theme.css` 한 곳

색상·폰트·간격은 [src/theme.css](src/theme.css) 의 CSS 변수로만 정의하고, 다른 CSS 에서 하드코딩하지 않습니다.

```css
--color-accent / --color-point / --color-btn …   /* 색 */
--font-main / --font-heading                      /* 폰트 */
--radius / --section-gap / --content-max(1180) / --header-h(68px)
/* TARGET 포인트 3색 — 작품 구분 소제목, MEMORY 포스트잇 색 등 */
```
컨셉이 바뀌면 이 파일 위주로 수정하면 사이트 전체의 분위기가 바뀝니다.

### 9.2 브레이크포인트 — 4단계 고정

| 이름 | 값 | 대상 |
|------|----|------|
| `lg` | 1024px | 태블릿 가로 |
| `md` | 768px | 태블릿 세로 |
| `sm` | 640px | 큰 모바일 |
| `xs` | 480px | 작은 모바일 |

`@media (max-width: 900px)` 같은 **비표준 값 금지**. (초기에 파일마다 값이 제각각이라 통일한 이력이 있음)

### 9.3 글자 크기 자동 확대 (`postcss.config.js`)

- CSS 에는 **평소처럼 font-size 를 적습니다.** 빌드 때 플러그인이 `calc(원래값 + Npt)` 로 바꿈.
- 선택자에 `.common-` / `#common-` / `.site-header` / `.site-footer` 가 있으면 **+2pt**, 그 외 **+4pt**.
- ⚠ **CSS 에서 직접 또 더하지 마세요** (이중 확대). `inherit`, `small` 같은 키워드 값은 제외됨.
- 헤더·푸터 안쪽 폭은 **1160px**(sha_copy common.css 기준)이며 `--content-max`(1180)와 다릅니다. 바꾸지 마세요.

### 9.4 이미지·링크 규칙

- 이미지: 데이터에는 `/images/…`, 컴포넌트에서는 `assetUrl()` 또는 `<SafeImg src fallbackSrc alt />` (base `/2026/` 보정 + 깨진 이미지 대체).
- 내부 이동은 `<Link to="/project">` 만. **`<a href>` 금지** (basename·페이지 전환 효과가 깨짐).

### 9.5 기타

- 헤더 글래스 효과는 `.common-header::before` 에 건다. 헤더 자체에 `backdrop-filter` 를 걸면 안쪽 `position: fixed` 모바일 메뉴가 깨진다.
- 구글 폰트는 `index.html` 의 `<link>` 한 곳에서만. CSS 에 `@import url(googleapis…)` 를 다시 넣지 말 것.

---

## 10. 배포 (GitHub Actions → 학교 서버)

`main` 브랜치에 push 하면 [deploy.yml](.github/workflows/deploy.yml) 이 자동 실행됩니다.

```
push to main
  → Node 20 설치, npm ci
  → npm run build            (dist/ 생성)
  → rsync 로 dist/ 를 서버 /tmp/deploy-2026/ 에 전송 (--delete, 바뀐 파일만)
  → 서버에서 /var/www/html/2026/ 로 rsync 복사
  → nginx -t 검사 후 systemctl restart nginx
```

- 동시 실행 방지(`concurrency`), 타임아웃 20분.
- 필요한 **GitHub Secrets**: `SERVER_HOST`, `SERVER_PORT`, `USERNAME`, `PASSWORD`. (내년에 서버 계정이 바뀌면 Settings → Secrets 에서 갱신)
- 내년 사이트는 보통 `/2027/` 이 될 것입니다 → §14 의 "연도 교체" 목록 참고.
- 배포는 SPA 라서 Nginx 에 `try_files $uri $uri/ /2026/index.html;` 이 있어야 새로고침/직접 접속 시 404 가 안 납니다 (서버에는 이미 설정되어 있음).

---

## 11. 브랜치·협업 방식

| 브랜치 | 용도 |
|--------|------|
| `main` | 통합·**배포**. push 즉시 사이트에 반영되므로 신중히 |
| `sha` | 디자이너 작업 (sha_copy) |
| `kss` | 개발자 작업 |

- 디자이너는 `sha_copy/` 안만 수정해 `git add sha_copy` → commit → push (충돌을 최소화하는 분리).
- 작업 시작 전 항상 `git pull`.
- **머지 전 체크리스트**
  1. `src/index.css` 상단에 `@import './theme.css';` 가 있는가
  2. 브레이크포인트가 4단계 표준값인가
  3. `npm run validate` ERROR 0건
  4. `npm run lint` 에러 0건
  5. `npm run build` 성공
- 커밋 메시지는 `feat:` / `fix:` / `refactor:` 접두사 + 한국어 설명 형태를 사용했습니다.

---

## 12. 26 졸전 사이트의 특수성 (알아야 할 사정들)

내년 사이트를 만들 때 "왜 26년은 이렇게 돼 있지?" 하고 의아할 만한 점들입니다.

1. **디자이너가 직접 HTML 을 작성** — 위 §8. 가장 큰 특징.
2. **테마 `과녁`(TARGET)** — 포인트 3색, 메인의 TARGET 카드, 크레딧의 위원회 구성 등이 이 콘셉트에서 나옴. 테마가 바뀌면 `constants.js` 의 `theme`, `theme.css`, 메인 콘셉트 섹션 이미지를 교체.
3. **작품 구조가 독특함** — 졸업작품이 "하나의 졸업작품"이 아니라:
   - 멀티미디어 전공: **브랜드 제안**(학생 개인) + **부분 기능 개선 제안** + **다른 디바이스 제안**(후자 둘은 여럿이 함께 → **M-team**)
   - 영상미디어 전공: 개인 타이틀(영상) 최대 3개
   - 그래서 한 학생이 작품을 **여러 개** 갖고, 한 작품에 학생이 **여럿**일 수 있음 (`studentId` vs `studentIds`). 작품 상세의 "Other Project" 는 참여 학생별로 묶어 보여줌.
4. **창캡 = U300 = 한이음** — 같은 것을 부르는 세 이름. 창업캡스톤 팀 프로젝트이며 `teamProjects.js` 에 모음 (`group: 'u300'`). 팀 작품은 작품명 없이 **팀명만** 사용.
5. **판넬 이미지 중심 상세 페이지** — 작품 설명이 텍스트가 아니라 학생이 만든 세로 판넬 이미지(webp). 그래서 `description` 이 비어 있는 작품이 많은 것이 정상.
6. **"브로슈어가 정답"** — 졸업생 프로필·직군·교수진 정보는 인쇄 브로슈어 내용을 기준으로 맞춤 (데이터가 서로 다를 때 브로슈어 우선).
7. **데이터가 늦게 들어옴** — 개발은 더미 데이터(`이름 입력` 등)로 먼저 진행하고, 운영팀 자료(드라이브)가 들어오면 스크립트로 일괄 반영. 그래서 import 스크립트와 validate 가 존재.
8. **응원 메시지 게시판(MEMORY)** — 유일하게 서버 저장이 필요한 기능이라 Supabase 를 도입.
9. **졸업생 딥링크** — `/student?student=<학번>` 으로 접속하면 해당 졸업생 팝업이 바로 열림 (QR·명함에서 개인 링크로 활용 가능).

---

## 13. 어떻게 더 체계적·효율적으로 만들었나

전년도 대비 / 초기 상태 대비 개선한 점입니다. 내년에도 유지·발전시킬 만한 원칙들입니다.

| 영역 | 개선 | 효과 |
|------|------|------|
| **데이터** | CSV(원본) → 스크립트 → JS(생성물) 파이프라인 | 운영팀이 엑셀만 수정 → 개발자 수작업 복붙 제거 |
| **데이터 검증** | `npm run validate` (중복, 외래키, 허용 값, 이미지 존재) | 전시 직전 "작품이 안 나와요" 류 사고를 사전에 차단 |
| **단일 출처** | 탭·직군은 `projectTabs.js`, 테마는 `theme.css`, 전시정보는 `constants.js` | 한 곳만 고치면 UI·검증이 같이 바뀜 |
| **조회 로직 공유** | `works.js` 에 필터·작가명·종류 규칙 집중 | 목록/상세/메인이 제각각 다르게 동작하는 버그 방지 |
| **디자인-개발 분리** | `sha_copy` + 이식 규칙 + 계산값 비교 | 디자이너 자율성 + 구현 정확도 |
| **글자 크기** | PostCSS 플러그인으로 빌드 때 일괄 적용 | CSS 마다 수정하지 않아도 되고 런타임 깜빡임 없음 |
| **CSS 일관성** | 브레이크포인트 4단계 고정, 페이지 루트 클래스, 변수 사용 | 반응형 버그·전역 충돌 감소 |
| **성능** | 메인 외 페이지 `lazy()` 분할, 이미지 webp, `loading="lazy"` | 데이터가 큰 페이지가 첫 로딩을 늦추지 않음 |
| **견고함** | `SafeImg` 폴백, `SkeletonCard`/`EmptyState`, 404 페이지 | 이미지·데이터 누락 시에도 화면이 깨지지 않음 |
| **코드 품질** | ESLint 에러 0건 유지, 안 쓰는 CSS 정리 | 새 사람이 들어와도 노이즈 없는 코드 |
| **의존성 최소화** | 런타임 의존성 3개, Supabase SDK 없이 fetch | 업데이트·보안 점검 부담 감소 |
| **배포 안전** | rsync 증분 전송, nginx -t 후 재시작, concurrency | 빠르고 중간에 실패해도 서버가 죽지 않음 |
| **문서화** | AGENTS.md(규칙), README(설명), 데이터 가이드(운영팀) | 사람·AI 모두 같은 규칙으로 작업 |

---

## 14. 내년 개발 위원을 위한 체크리스트와 제안

### 14.1 새 연도 사이트 시작 순서 (추천)

1. 저장소를 복제하거나 **새 저장소**로 시작 (연도별 이력 분리가 깔끔함).
2. **연도 교체** — 아래 위치를 `2026` → `2027` 로 (⚠ 이름만 바꾸면 안 되고 서버 경로도 함께):
   - [vite.config.js](vite.config.js) `base: '/2027/'`
   - [src/App.jsx](src/App.jsx) `basename="/2027/"`
   - [deploy.yml](.github/workflows/deploy.yml) 의 `/tmp/deploy-2026`, `/var/www/html/2026`
   - [nginx/default](nginx/default) / 서버 nginx 의 `location /2026/` (**서버 설정은 덮어쓰지 말고 블록을 추가**)
   - [index.html](index.html) 의 OG 메타(`og:url`, `og:image`, 제목)
   - [constants.js](src/data/constants.js) 전시 정보, [archives.js](src/data/archives.js) 에 2026 추가
3. 더미 데이터 상태로 시작: `graduates.csv` 등을 비우거나 템플릿으로 교체하고 `npm run csv:*` 로 생성.
4. **컨셉(색·폰트)이 정해지면** `theme.css` → 메인 섹션 → 나머지 순서로.
5. 데이터가 들어오면 CSV 갱신 → 변환 → `npm run validate` → 눈으로 확인.
6. 최소 **전시 1주 전**에 전체 데이터 입력 완료, 이미지 최적화(webp) 마무리.

### 14.2 26년에 아쉬웠던 점 / 개선 제안

- **개인정보**: `graduates.csv`/`graduates.js` 에 학생 이메일·전화번호가 들어 있고 **공개 사이트와 저장소에 노출**됩니다. 내년에는 (a) 공개 동의를 받고, (b) 저장소를 private 으로 하거나 연락처 필드를 분리하는 것을 권장합니다.
- **sha_copy 이중 관리 비용**: 이식 누락이 생기기 쉬움. 내년에는 (a) 디자이너와 처음부터 컴포넌트 단위로 협업하거나, (b) sha_copy 를 폐지하고 피그마→React 로 가는 것도 선택지.
- **DATA_MANAGEMENT_GUIDE.md 정리** (§6.4) 및 **README 의 AI 가이드 문구** 갱신.
- **자동 테스트 없음**: 지금은 `validate` + `lint` + `build` 가 전부. 핵심 로직(`works.js` 필터)에 단위 테스트(Vitest)를 추가하면 안전.
- **TypeScript 미사용**: 데이터 모양을 타입으로 보장하면 validate 의 상당 부분을 대체 가능.
- **MEMORY 스팸 방지**·**관리자 삭제 UI** 없음 (§7.4).
- **접근성/SEO**: SPA 라 검색 노출이 약함. `index.html` 의 OG 메타가 가리키는 `/images/og-image.jpg` 는 **현재 저장소에 파일이 없음** (링크 미리보기 이미지가 안 뜸) → 만들어 넣을 것. 필요하면 사전 렌더링(prerender) 도입 검토.
- **이미지 용량(약 144MB)**: webp 변환·리사이즈를 스크립트로 자동화하면 더 좋음 (현재는 수작업/별도 변환).
- **아카이브 목록 자동 연동**: `archives.js` 를 직접 고치는 대신 GEArchive 의 `data.js` 를 읽어 오면 연도 추가가 한 번으로 끝남.
- `OthersPage` 는 거의 비어 있음 — 쓰지 않으면 라우트·메뉴에서 제거.

---

## 15. 절대 건드리면 안 되는 것

```
src/App.jsx        <Router basename="/2026/">   ← 연도 교체 외에는 수정 금지
vite.config.js     base: '/2026/'               ← 연도 교체 외에는 수정 금지
```

- **서버 Nginx 설정을 덮어쓰지 말 것.** `deploy.yml` 에서 nginx 파일을 서버로 복사하는 단계를 넣으면 **HTTPS(Certbot) 설정이 사라진다.** (과거에 실제로 발생한 사고. 그래서 [nginx/default](nginx/default) 는 참고용일 뿐 배포에 쓰지 않음)
- **Apache `.htaccess` 를 만들지 말 것.** 서버는 Nginx.
- **`index.html` 에 화면 마크업을 직접 넣지 말 것.** React 진입점이라 앱이 죽는다. 외부 HTML 은 반드시 JSX 컴포넌트로 변환.
- **`<a href>` 로 내부 이동 금지** → `<Link>`.
- **`service_role` 키를 코드/`.env` 에 넣지 말 것.**
- 헤더·푸터에 직접 `backdrop-filter` 금지 (§9.5).

---

## 16. 문제 해결 FAQ

| 증상 | 원인 / 해결 |
|------|-------------|
| 개발 서버 주소로 들어갔는데 빈 화면/404 | 주소 끝에 `/2026/` 를 붙였는지 확인 |
| sha_copy 가 하얗게 비어 있음 | `index.html` 더블클릭(file://)으로 열었음 → `npm run sha_copy` 후 `/sha_copy/` 로 접속 |
| sha_copy 이미지가 다 깨짐 | `sha_copy/images` 심볼릭 링크가 깨졌거나 이름이 바뀜 (`../public/images` 를 가리켜야 함). Windows 에서는 링크가 일반 파일로 풀리는 경우가 있어 `git config core.symlinks true` 확인 |
| 작품이 목록에 안 나옴 | `tab`/`role` 이 `projectTabs.js` 값과 다름, 또는 M-team 작품을 직군 탭에서 찾는 중 → `npm run validate` |
| 작가명이 `-` 로 나옴 | `studentId` 가 graduates 에 없음 |
| 이미지가 안 뜸 | 경로 오타/파일 없음 → validate 의 WARN 확인. 컴포넌트에서 `assetUrl()`/`SafeImg` 를 썼는지 확인 |
| 글자가 너무 큼 | CSS 에서 직접 +pt 를 더하지 않았는지 확인 (PostCSS 가 이미 더함) |
| 새로고침하면 404 (배포 후) | 서버 nginx 의 `try_files … /2026/index.html` 누락 |
| 배포 후 HTTPS 가 사라짐 | nginx 설정을 덮어씀 (§15). Certbot 으로 재발급 필요 |
| MEMORY 에 글이 저장 안 됨 | `.env` 키 없음(→ 로컬 미리보기 모드) 또는 Supabase 테이블/RLS 미설정 (`supabase/memory.sql` 실행) |
| 빌드 시 환경변수 안 먹음 | `VITE_` 접두사 필수, 값을 바꾼 뒤 개발 서버 재시작. 현재 `.env` 는 **git 에 커밋**되어 있어 CI 빌드에도 그대로 들어감 (anon 키라 공개되어도 RLS 가 보호). 비공개로 바꾸려면 `.gitignore` 에 추가하고 Actions 의 `env:` 로 주입 |

---

## 17. GEArchive(역대 전시 아카이브)와의 관계

역대 졸업전시를 한곳에 모아 보여 주는 **별도 사이트/저장소**가 있습니다 (`GEArchive`, https://media.seowon.ac.kr/archive/). 이 졸업전시 사이트와는 코드가 완전히 분리되어 있고, 서로 **링크로만** 연결됩니다.

| | 졸업전시 사이트 (이 저장소) | GEArchive |
|---|---|---|
| 역할 | 그 해 전시 홍보·작품 소개 | 역대 전시 목록 (연도·제목·포스터·사이트 링크·도록 PDF) |
| 스택 | React + Vite, 빌드 필요 | 순수 HTML 1장 + Node/Express CMS, 빌드 없음 |
| 데이터 수정 | CSV → 스크립트 → 코드 → 배포 | **관리 화면(CMS)에서 입력만 하면 즉시 반영** (코드 수정·배포 불필요) |
| 서버 위치 | `/var/www/html/2026/` | `/var/www/html/archive`, CMS 는 `/var/www/archive-cms` |

**두 사이트 사이에서 해야 할 일**

1. **전시가 끝나면 GEArchive 에 올해 전시를 추가** — CMS(`/admin/`)에서 연도·제목·전시 사이트 주소(`https://media.seowon.ac.kr/2026/`)·포스터·도록 PDF 입력. 도록은 150MB 안팎 권장(원본이 크면 GEArchive 의 `scripts/compress-catalog.sh` 로 압축).
2. **내년 사이트의 메인 하단 "아카이브" 섹션** 은 이 저장소의 [src/data/archives.js](src/data/archives.js) 에 **직접 적은 목록**입니다 (현재 2023~2025, 테마명은 아직 "테마명 입력 예정"). 내년에는 2026 을 추가하고 테마명을 채우세요. 이 목록은 GEArchive 데이터를 자동으로 읽지 **않습니다** (참고: 두 곳을 자동 연동하면 수작업이 줄어듦 → §14.2 제안).
3. 아카이브 사이트의 디자인은 매년 그대로 쓰도록 일부러 평범하게 만들었으므로 해마다 새로 디자인하지 않습니다. 이 저장소와는 달리 **`main` 에 push 해도 서버의 전시 데이터(`data.js`, 포스터, 도록)는 덮어써지지 않습니다.**

---

## 18. 권한과 문의

- 이 저장소는 **공개(Public)** 입니다. 누구나 보고, `git clone` 이나 Code → Download ZIP 으로 내려받아 구조를 공부할 수 있습니다.
- **수정(push)은 소유자와 소유자가 Collaborator 로 초대한 사람만** 가능합니다. 그 외 사람은 Fork 해서 자기 복사본에서만 고칠 수 있고, 이 저장소와 서버에는 영향을 줄 수 없습니다. (원본에 반영하려면 Pull Request 를 보내고 소유자가 승인해야 함)
- `main` 에 push 하면 **곧바로 학교 서버에 배포**되므로, 코드 수정 권한(Collaborator)은 신뢰하는 사람에게만 주세요.
- ⚠ 공개 저장소이므로 **개인정보·비밀값을 커밋하지 마세요.** 졸업생 연락처(`email`, `phone`)는 공개 동의를 받은 값만 넣고, 서버 비밀번호·`service_role` 키 등은 코드에 넣지 말고 GitHub Secrets 에만 둡니다. 한 번 커밋하면 지워도 git 이력에 남습니다.
- 배포용 서버 계정은 GitHub **Settings → Secrets and variables → Actions** 의 `SERVER_HOST`, `SERVER_PORT`, `USERNAME`, `PASSWORD` 에 있습니다. 계정이 바뀌면 여기를 갱신해야 배포가 됩니다.
- GEArchive 관리 화면(CMS) 로그인은 서버의 `sudo` 권한 계정만 가능합니다.
- **문의**: 사용 중 막히면 교수님께 **2026년 졸업전시위원회에서 개발을 맡았던 남학생의 연락처를 문의**해서 연락하세요. GitHub 수정 권한과 서버 계정도 같은 경로로 요청하면 됩니다.

---

*마지막 업데이트: 2026-11-06 · 작성: 26 졸업전시 개발팀*
