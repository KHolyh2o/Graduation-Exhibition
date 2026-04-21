# 2026 서원대 졸업전시회 웹사이트 (Graduation Exhibition)

이 프로젝트는 2026년 졸업전시회를 위한 공식 웹사이트 프로젝트입니다.
**React + Vite** 환경으로 구성되어 있으며, 학교 서버(`media.seowon.ac.kr/2026/`)로 자동 배포(CI/CD)되도록 설정되어 있습니다.

---

## 🛠 Tech Stack
- **Framework**: React 19
- **Bundler**: Vite
- **Routing**: React Router DOM v7 (Basename: `/2026/`)
- **Deployment**: GitHub Actions (Push to `main` triggers auto-deploy)

---

## 🤖 AI Assistant (Antigravity) 가이드라인
**이 저장소를 클론하여 작업하는 AI(Antigravity 등)는 다음 규칙을 반드시 준수하여 코드를 작성해야 합니다.**

1. **HTML 덮어쓰기 금지**:
   - `public/index.html` 파일에 직접 화면 구조(마크업)를 때려 넣는 방식을 절대 사용하지 마세요.
   - 외부에서 가져온 순수 HTML/CSS 파일이 있다면, 반드시 **React 컴포넌트(JSX)로 변환**하여 `src/components/` 또는 `src/pages/` 경로에 `.jsx` 파일로 분리하여 작성해야 합니다.
2. **라우팅(Routing) 규칙**:
   - 페이지 이동이 필요할 때는 `<a href="...">` 태그 대신 반드시 `react-router-dom`의 `<Link to="...">` 컴포넌트를 사용하세요.
   - 현재 배포 경로가 `/2026/` 이므로 `App.jsx`의 라우터에 `basename="/2026/"` 설정이 되어 있습니다. 절대 경로 라우팅을 훼손하지 마세요.
3. **CSS 관리**:
   - 스타일은 `index.css`나 `App.css`에 통합하거나, 각 컴포넌트별로 모듈화하여 `import './ComponentName.css'` 방식으로 적용하세요.
4. **협업 주의사항**:
   - 코드를 푸시하기 전 로컬에서 `npm run dev`를 통해 컴포넌트 분리가 제대로 작동하는지 확인하세요.

---

## 🚀 개발 실행 방법 (Local Development)

```bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행 (localhost:5173)
npm run dev
```
