import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSportsScores, Game } from '../services/sportsService';

const BostonSportsScoreComponent: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    setLoading(true);
    setError('');

    try {
      const games = await getSportsScores();
      setGames(games);
    } catch (err) {
      console.error('Error loading sports scores:', err);
      setError('Failed to load sports scores. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getResultClass = (teamScore: number, opponentScore: number, status: string) => {
    if (!status.toLowerCase().includes('final')) return '';
    if (teamScore > opponentScore) return 'game-win';
    if (teamScore < opponentScore) return 'game-loss';
    return 'game-tie';
  };

  return (
    <div className="page-content">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <h2>🏆 Boston Sports Scores</h2>
      <p>Latest scores for your favorite Boston professional sports teams via backend server</p>

      <button className="btn" onClick={loadScores} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Scores'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {loading && games.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading sports scores...</p>
        </div>
      ) : (
        <div className="sports-grid">
          {games.map((game, index) => (
            <div
              key={index}
              className={`sports-card ${getResultClass(game.teamScore, game.opponentScore, game.status)}`}
            >
              <div className="sports-header">
                <span className="sports-logo">{game.logo}</span>
                <h3>{game.team}</h3>
              </div>

              <div className="sports-matchup">
                <div className="team-score">
                  <div className="team-name">{game.team}</div>
                  <div className="score">{game.teamScore}</div>
                </div>
                <div className="vs">VS</div>
                <div className="team-score">
                  <div className="team-name opponent">{game.opponent}</div>
                  <div className="score">{game.opponentScore}</div>
                </div>
              </div>

              <div className="sports-footer">
                <span className="game-status">{game.status}</span>
                <span className="game-date">{formatDate(game.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BostonSportsScoreComponent;
