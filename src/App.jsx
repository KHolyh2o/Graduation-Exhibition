import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SiteEffects from './components/SiteEffects';
import MainPage from './pages/MainPage';
import ProjectPage from './pages/ProjectPage';
import DetailPage from './pages/DetailPage';
import StudentPage from './pages/StudentPage';
import DepartmentPage from './pages/DepartmentPage';
import GalleryPage from './pages/GalleryPage';
import MemoryPage from './pages/MemoryPage';
import OthersPage from './pages/OthersPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <Router basename="/2026/">
      <div className="App">
        <SiteEffects />
        <Navbar />
        <div className="content">
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
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
