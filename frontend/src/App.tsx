import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DragDropPage from './pages/DragDropPage';
import GeolocationPage from './pages/GeolocationPage';
import NewsPage from './pages/NewsPage';
import SportsPage from './pages/SportsPage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>CS601 Portfolio</h1>
          <p>Final Project</p>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/drag-drop" element={<DragDropPage />} />
          <Route path="/geolocation" element={<GeolocationPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        <footer className="footer">
          <p>&copy; 2025 CS601 Final Project</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
