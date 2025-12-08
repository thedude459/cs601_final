import React from 'react';
import { Link } from 'react-router-dom';

const HomeComponent: React.FC = () => {
  return (
    <div className="page-content home-page">
      <h2>Welcome to My CS601 Final Project! 🎓</h2>
      <p className="home-intro">
        This portfolio showcases the skills and knowledge I&apos;ve gained in CS601 throughout the
        course.
      </p>

      <div className="home-cards">
        <Link to="/drag-drop" className="home-card">
          <div className="card-emoji">🎮</div>
          <h3>New England Capitals Game</h3>
          <p>
            Interactive drag-and-drop game using the HTML5 Drag & Drop API. Match state capitals to
            their correct states!
          </p>
          <span className="card-action">Play Game →</span>
        </Link>

        <Link to="/geolocation" className="home-card">
          <div className="card-emoji">📍</div>
          <h3>Geolocation & Weather</h3>
          <p>
            Uses the Geolocation API to find your location and displays real-time weather data with
            detailed metrics.
          </p>
          <span className="card-action">Check Weather →</span>
        </Link>

        <Link to="/news" className="home-card">
          <div className="card-emoji">🌐</div>
          <h3>News Feed</h3>
          <p>Fetches the latest tech news from Hacker News API.</p>
          <span className="card-action">View News →</span>
        </Link>

        <Link to="/sports" className="home-card">
          <div className="card-emoji">🏆</div>
          <h3>Boston Sports</h3>
          <p>Live scores and updates for the Bruins, Red Sox, Patriots, and Celtics from ESPN.</p>
          <span className="card-action">View Scores →</span>
        </Link>

        <Link to="/about" className="home-card">
          <div className="card-emoji">👨‍💻</div>
          <h3>About Me</h3>
          <p>
            Learn about the technologies, skills, and knowledge demonstrated in this CS601 portfolio
            project.
          </p>
          <span className="card-action">Learn More →</span>
        </Link>
      </div>
    </div>
  );
};

export default HomeComponent;
