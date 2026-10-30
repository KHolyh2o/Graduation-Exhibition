# CLAUDE.md — 졸전 사이트 작업 가이드

이 파일은 **sha 브랜치 작업자(또는 그 AI)** 가 코드를 건드리기 전에 반드시 읽어야 합니다.
Claude Code가 대화 시작 시 자동으로 이 파일을 로드합니다.

---

## 1. 프로젝트 개요

| 항목 | 값 |
|------|----|
| 사이트 | 서원대학교 미디어콘텐츠학부 2026 졸업전시 |
| 배포 URL | `https://media.seowon.ac.kr/2026/` |
| 스택 | React 19 + Vite + React Router DOM v7 |
| 배포 | GitHub Actions → SSH → `/var/www/html/2026/` |
| 브랜치 구조 | `main` (통합·배포), `sha` (디자인/기능), `kss` (디자인/기능) |

---

## 2. 절대 건드리면 안 되는 것들

```
App.jsx      <Router basename="/2026/">   ← 절대 수정 금지
vite.config.js  base: '/2026/'           ← 절대 수정 금지
```

- **Nginx 설정 덮어쓰기 금지** — `deploy.yml`에서 nginx 파일을 서버에 복사하는 코드를 넣으면 HTTPS(Certbot)가 날아간다. 과거에 실제로 발생한 사고.
- **Apache `.htaccess` 파일 생성 금지** — 서버는 Nginx다.
- **`public/index.html`에 직접 마크업 금지** — React 진입점이라 건드리면 앱이 죽는다.

---

## 3. 파일 구조

```
src/
├── theme.css              ← ★ 컨셉 확정 후 이 파일만 수정 (색상·폰트·간격)
├── index.css              ← 리셋·레이아웃·공통 클래스 (@import './theme.css')
├── App.jsx                ← 라우터 + 전역 레이아웃
│
├── pages/
│   ├── MainPage.jsx / .css       ← 메인 (히어로, 전시소개, 프로필, 아카이브)
│   ├── ProjectPage.jsx / .css    ← 작품소개 (탭 필터, 작품 카드, 모달)
│   ├── DepartmentPage.jsx / .css ← 학과소개 (교수진, 교육과정, 역량)
│   ├── GalleryPage.jsx / .css    ← 준비과정 영상
│   ├── OthersPage.jsx            ← 기타 (현재 빈 페이지)
│   └── NotFoundPage.jsx / .css   ← 404 페이지
│
├── components/
│   ├── Navbar.jsx / .css         ← 상단 네비게이션
│   ├── Footer.jsx / .css         ← 하단 푸터
│   ├── SiteEffects.jsx           ← 전 페이지 공통: 스크롤 등장 효과, 페이지 이동 효과
│   ├── SafeImg.jsx               ← 이미지 에러 시 fallback 처리
│   └── SkeletonCard.jsx / .css   ← 로딩·빈 상태 컴포넌트
│
├── data/
│   ├── graduates.js     ← 졸업생 40명 프로필
│   ├── projects.js      ← 개인·공동 작품 (csv_data/projects.csv 에서 생성)
│   ├── teamProjects.js  ← 팀(U300) 작품 — 창캡 = U300 = 한이음
│   ├── works.js         ← 작품 조회 헬퍼 (작가명·직군 필터·학생별 작품)
│   ├── projectTabs.js   ← 탭/직군 정의 (여기만 수정하면 UI 자동 반영)
│   ├── professors.js    ← 교수진
│   ├── archives.js      ← 아카이브 연도별 데이터
│   └── constants.js     ← 전시 기본 정보 (날짜, 장소 등)
│
├── hooks/
│   ├── useScrollReveal.js   ← .reveal 클래스 IntersectionObserver (GalleryPage)
│   └── useImageFallback.js  ← assetUrl(), FALLBACK 상수
│
scripts/
├── validate-data.js   ← 데이터 유효성 검사
└── csv-to-data.js     ← CSV → JS 데이터 변환

public/images/
├── no-image.svg       ← 작품 썸네일 기본 이미지
├── no-avatar.svg      ← 프로필 기본 이미지
├── projects/          ← 작품 썸네일 + proposals/
├── graduates/         ← 졸업생 프로필 사진
└── professors/        ← 교수 프로필 사진
```

---

## 4. CSS 아키텍처

### 브레이크포인트 — 4단계 고정, 이 값만 사용할 것

| 이름 | 값 | 대상 |
|------|----|------|
| `lg` | `1024px` | 태블릿 가로 |
| `md` | `768px` | 태블릿 세로 |
| `sm` | `640px` | 큰 모바일 |
| `xs` | `480px` | 작은 모바일 |

```css
/* 올바른 예 */
@media (max-width: 1024px) { … }
@media (max-width: 768px)  { … }
@media (max-width: 640px)  { … }

/* 잘못된 예 — 사용 금지 */
@media (max-width: 900px)  { … }   /* 비표준 */
@media (max-width: 620px)  { … }   /* 비표준 */
```

### 테마 변수 — `src/theme.css`에만 정의

컨셉이 확정되면 `theme.css` 한 파일만 수정한다. 다른 CSS 파일에서 색상·폰트·간격을 하드코딩하지 말고 반드시 변수를 사용할 것.

```css
/* 주요 변수 */
--color-accent    /* 강조색 — 컨셉 컬러로 교체 예정 */
--font-heading    /* 제목 폰트 — 교체 예정 */
--color-btn       /* 버튼 기본색 */
--radius          /* 모서리 둥글기 */
--section-gap     /* 섹션 간격 */
--content-max     /* 최대 너비 1180px */
--header-h        /* 헤더 높이 68px */
```

### 이미지 경로 처리

`data/` 파일에 이미지 경로를 넣을 때는 `/images/…` 형식으로 작성.
컴포넌트에서 렌더링할 때는 반드시 `assetUrl()` 또는 `<SafeImg>` 를 통해 출력.

```js
import { assetUrl, FALLBACK } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';

// 직접 쓸 때
<img src={assetUrl('/images/projects/foo.jpg')} />

// fallback 포함
<SafeImg src={project.thumbnail} fallbackSrc={FALLBACK.image} alt="…" />
```

---

## 5. 데이터 구조 연결 관계

```
graduates.js        ─── studentId ───►  projects.js
  (40명 프로필)                           (개인 작품 60개)

projectTabs.js      ─── tab / role ──►  projects.js
  (탭·직군 정의)                          teamProjects.js

constants.js        ─── EXHIBITION ──►  MainPage.jsx
  (전시 기본 정보)                         (날짜, 장소 등)
```

**핵심 규칙:**
- `projects.js`의 `studentId`는 `graduates.js`의 `studentId`와 반드시 1:1 매칭되어야 함
- `projects.js`의 `tab`, `role`은 `projectTabs.js`에 정의된 값만 사용
- 탭·직군을 추가하려면 `projectTabs.js`만 수정 — 나머지는 자동 반영

---

## 6. Skeleton / Empty state 컴포넌트 사용법

데이터가 없거나 로딩 중일 때 `src/components/SkeletonCard.jsx`를 사용.

```jsx
import { SkeletonProjectCard, SkeletonProfileCard, EmptyState } from '../components/SkeletonCard';

// 로딩 중 — 카드 n개 표시
{loading && Array.from({ length: 6 }).map((_, i) => <SkeletonProjectCard key={i} />)}

// 데이터 없음
{!loading && items.length === 0 && <EmptyState message="작품이 없습니다." />}
```

---

## 7. 데이터 관리 스크립트

운영팀에서 CSV로 데이터를 전달받았을 때 사용.

```bash
# 데이터 유효성 검사 (작업 전후 반드시 실행)
npm run validate

# CSV → graduates.js 변환
npm run csv:graduates path/to/graduates.csv

# CSV → projects.js 변환
npm run csv:projects path/to/projects.csv
```

### graduates.csv 컬럼 순서
```
id, studentId, name, tab, role, profileImage
```

### projects.csv 컬럼 순서
```
id, studentId, tab, role, title, thumbnail, description,
videoUrl, proposalImages, contactEmail, contactPhone
```
*(proposalImages는 세미콜론으로 구분: `/images/a.jpg;/images/b.jpg`)*

---

## 8. 라우트 구조

| 경로 | 페이지 |
|------|--------|
| `/` | 메인 (히어로, 전시소개, 졸업생 프로필, 아카이브) |
| `/project` | 작품소개 (카테고리·직군 필터, 작품 카드) |
| `/project/:id` | 작품 상세 |
| `/student` | 졸업생 소개 (`?student=<학번>` 이면 팝업이 열림) |
| `/department` | 학과소개 (교수진, 교육과정, 핵심 역량) |
| `/gallery` | 준비과정 영상 |
| `/others` | 기타 |
| `*` | 404 NotFound |

`<Link to="/project">` 방식으로만 이동. `<a href>` 사용 금지.

---

## 9. sha_copy → React 이식 규칙

`sha_copy/` 는 디자이너(sha)가 React 없이 HTML·CSS·JS 로 작업하는 폴더다. 그쪽 변경은 **전부** `src/` 로 옮겨야 한다
(우리 컴포넌트가 더 발전돼 있으므로 HTML 을 그대로 복사하지 말고 분해해서 우리 구조에 맞출 것).

- 사용자가 지정한 페이지만이 아니라 sha_copy 전체를 `src/` 와 대조한다 (`git log -- sha_copy` 로 디자이너 커밋 확인).
- CSS 는 페이지 클래스(`.index-root`, `.dept-root`, `.project-page` …)로 감싸서 전역 충돌을 막고, 브레이크포인트는 표준 4단계만 쓴다.
- sha_copy 의 데이터(`js/*.js` 안의 목업)는 쓰지 않고 `src/data/*` 의 실제 데이터에 디자인을 맞춘다.
- 이식한 것과 일부러 이식하지 않은 것(이유 포함)을 사용자에게 보고한다.

---

## 10. sha 브랜치 작업 시 주의사항

sha 브랜치는 main 대비 다음 파일들이 **없거나 이전 버전**입니다. main에 머지하기 전에 충돌을 꼭 확인하세요.

**main에서 새로 추가된 파일:**
- `src/theme.css` — 테마 변수 분리 파일 (index.css가 import)
- `src/pages/NotFoundPage.jsx` / `.css` — 404 페이지
- `src/components/SkeletonCard.jsx` / `.css` — 로딩·빈 상태
- `scripts/validate-data.js` — 데이터 검사 스크립트
- `scripts/csv-to-data.js` — CSV 변환 스크립트

**main에서 변경된 파일:**
- `src/index.css` — 테마 변수 제거 → `@import './theme.css'`로 대체
- `src/App.jsx` — `NotFoundPage` import + `*` 라우트 추가
- `index.html` — OG / Twitter Card 메타태그 추가
- `package.json` — `validate`, `csv:graduates`, `csv:projects` 스크립트 추가
- 모든 CSS 파일 — 브레이크포인트 `900px`→`1024px`, `620px`→`640px` 통일

**머지 전 체크리스트:**
1. `src/index.css` 상단에 `@import './theme.css';` 있는지 확인
2. 브레이크포인트가 4단계 표준값(`1024 / 768 / 640 / 480`)인지 확인
3. `npm run validate` 실행 후 ERROR 0건 확인
4. `npm run build` 성공 확인

---

## 11. 현재 플레이스홀더 상태 (데이터 미입력)

운영팀 자료 수집 전까지 아래는 더미 데이터 상태입니다. **수정하지 마세요.**

- `graduates.js` — 이름 전부 `'이름 입력'`, 학번은 임시값
- `projects.js` — 대부분 `_make()` 팩토리로 생성된 빈 슬롯
- `teamProjects.js` — 팀명·작품명 대부분 미입력
- `constants.js` — `theme: '테마명 입력 예정'`

데이터가 들어오면 `scripts/csv-to-data.js`로 일괄 변환 후 `npm run validate`로 검증.
