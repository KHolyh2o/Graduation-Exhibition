import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SiteEffects from './components/SiteEffects';
import ScrollTopButton from './components/ScrollTopButton';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

// 메인 외 페이지는 접속했을 때만 내려받는다 (작품·졸업생 데이터가 큰 페이지가 첫 로딩을 늦추지 않게)
const ProjectPage    = lazy(() => import('./pages/ProjectPage'));
const DetailPage     = lazy(() => import('./pages/DetailPage'));
const StudentPage    = lazy(() => import('./pages/StudentPage'));
const DepartmentPage = lazy(() => import('./pages/DepartmentPage'));
const GalleryPage    = lazy(() => import('./pages/GalleryPage'));
const MemoryPage     = lazy(() => import('./pages/MemoryPage'));
const OthersPage     = lazy(() => import('./pages/OthersPage'));

function App() {
  return (
    <Router basename="/2026/">
      <div className="App">
        <SiteEffects />
        <Navbar />
        <div className="content">
          <Suspense fallback={null}>
          <Routes>
            <Route path="/"           element={<MainPage />} />
            <Route path="/project"    element={<ProjectPage />} />
            <Route path="/project/:id" element={<DetailPage />} />
            <Route path="/student"    element={<StudentPage />} />
            <Route path="/department" element={<DepartmentPage />} />
            <Route path="/gallery"    element={<GalleryPage />} />
            <Route path="/memory"     element={<MemoryPage />} />
            <Route path="/others"     element={<OthersPage />} />
            <Route path="*"           element={<NotFoundPage />} />
          </Routes>
          </Suspense>
        </div>
        <Footer />
        <ScrollTopButton />
      </div>
    </Router>
  );
}

export default App;
