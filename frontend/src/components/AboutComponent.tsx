import React from 'react';
import { Link } from 'react-router-dom';

const AboutComponent: React.FC = () => {
  return (
    <div className="page-content about-page">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <h2>About Me</h2>

      <div className="about-content">
        <div className="about-section">
          <h3>👋 Hello!</h3>
          <p>
            My name is Matthew Savage, a student in CS601, and this portfolio showcasing the skills
            and technologies I learned throughout the course. The project features four interactive
            web applications: a drag-and-drop geography game, a geolocation-based weather app, a
            tech news feed, and live Boston sports scores.
          </p>
        </div>

        <div className="about-section">
          <h3>🎓 What I Learned</h3>
          <ul className="about-list">
            <li>
              <strong>HTML5 APIs:</strong> Implementing drag-and-drop functionality and geolocation
              services
            </li>
            <li>
              <strong>JavaScript/TypeScript:</strong> Building interactive applications with strong
              typing
            </li>
            <li>
              <strong>React:</strong> Creating reusable components and managing application state
            </li>
            <li>
              <strong>CSS Grid & Flexbox:</strong> Designing responsive, mobile-friendly layouts
            </li>
            <li>
              <strong>API Integration:</strong> Fetching and displaying data from external services
            </li>
            <li>
              <strong>Full-Stack Development:</strong> Building both frontend and backend
              applications
            </li>
          </ul>
        </div>

        <div className="about-section">
          <h3>🛠️ Project Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h4>Interactive Game</h4>
              <p>Drag-and-drop game teaching New England state capitals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h4>Location Services</h4>
              <p>Geolocation API integration with live weather data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📰</div>
              <h4>Tech News Feed</h4>
              <p>Real-time technology news from Hacker News API</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h4>Sports Scores</h4>
              <p>Live scores and recent games for all Boston sports teams</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Modern Stack</h4>
              <p>React, TypeScript, and Vite with direct API integration</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h4>Responsive Design</h4>
              <p>Mobile-friendly layouts using CSS Grid and Flexbox</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h3>💻 Technologies Used</h3>
          <div className="tech-categories">
            <div className="tech-category">
              <h4>Frontend</h4>
              <ul className="tech-list">
                <li>React 19</li>
                <li>TypeScript</li>
                <li>React Router v7</li>
                <li>Vite 7</li>
                <li>CSS3 (Grid & Flexbox)</li>
              </ul>
            </div>
            <div className="tech-category">
              <h4>Service Layer</h4>
              <ul className="tech-list">
                <li>TypeScript Services</li>
                <li>Direct API Integration</li>
                <li>External APIs</li>
              </ul>
            </div>
            <div className="tech-category">
              <h4>APIs & Services</h4>
              <ul className="tech-list">
                <li>ESPN Sports API</li>
                <li>Hacker News API</li>
                <li>Open-Meteo Weather API</li>
                <li>OpenStreetMap API</li>
                <li>HTML5 Geolocation API</li>
                <li>HTML5 Drag & Drop API</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;
