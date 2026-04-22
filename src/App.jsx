import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainPage from './pages/MainPage';
import ProjectPage from './pages/ProjectPage';
import DepartmentPage from './pages/DepartmentPage';
import GalleryPage from './pages/GalleryPage';
import OthersPage from './pages/OthersPage';
import './App.css';

function App() {
  return (
    <Router basename="/2026/">
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/"           element={<MainPage />} />
            <Route path="/project"    element={<ProjectPage />} />
            <Route path="/department" element={<DepartmentPage />} />
            <Route path="/gallery"    element={<GalleryPage />} />
            <Route path="/others"     element={<OthersPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
