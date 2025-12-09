import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCapitals, Capital } from '../services/capitalsService';

interface Bucket {
  state: string;
  capital: Capital | null;
  emoji: string;
}

const DragAndDropComponent: React.FC = () => {
  const [availableCapitals, setAvailableCapitals] = useState<Capital[]>([]);
  const [buckets, setBuckets] = useState<Bucket[]>([
    { state: 'Maine', capital: null, emoji: '🦞' },
    { state: 'New Hampshire', capital: null, emoji: '🏔️' },
    { state: 'Vermont', capital: null, emoji: '🍁' },
    { state: 'Massachusetts', capital: null, emoji: '🧑‍🌾' },
    { state: 'Rhode Island', capital: null, emoji: '⛵' },
    { state: 'Connecticut', capital: null, emoji: '🍕' },
  ]);
  const [draggedCapital, setDraggedCapital] = useState<Capital | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successCount, setSuccessCount] = useState<number>(0);
  const [gameComplete, setGameComplete] = useState<boolean>(false);

  const loadCapitals = useCallback(async () => {
    try {
      const capitals = await getCapitals();
      setAvailableCapitals(capitals);
    } catch (error) {
      console.error('Error loading capitals:', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCapitals();
  }, [loadCapitals]);

  const handleDragStart = (capital: Capital) => {
    setDraggedCapital(capital);
    setErrorMessage('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnBucket = (bucket: Bucket) => {
    if (!draggedCapital) return;

    if (draggedCapital.state === bucket.state) {
      // Correct match
      const newBuckets = buckets.map((b) =>
        b.state === bucket.state ? { ...b, capital: draggedCapital } : b
      );
      setBuckets(newBuckets);
      setAvailableCapitals((prev) => prev.filter((cap) => cap.id !== draggedCapital.id));
      const newCount = successCount + 1;
      setSuccessCount(newCount);
      setErrorMessage('');

      if (newCount === 6) {
        setGameComplete(true);
      }
    } else {
      // Wrong match
      setErrorMessage(
        `❌ Oops! ${draggedCapital.capital} is not the capital of ${bucket.state}. Try again!`
      );
    }

    setDraggedCapital(null);
  };

  const handleDropOnAvailable = () => {
    if (!draggedCapital) return;

    const bucketWithCapital = buckets.find((b) => b.capital?.id === draggedCapital.id);
    if (bucketWithCapital) {
      setAvailableCapitals((prev) => [...prev, draggedCapital]);
      setBuckets((prev) =>
        prev.map((b) => (b.state === bucketWithCapital.state ? { ...b, capital: null } : b))
      );
      setSuccessCount((prev) => prev - 1);
      setErrorMessage('');
      setGameComplete(false);
    }

    setDraggedCapital(null);
  };

  const resetGame = () => {
    setBuckets((prev) => prev.map((b) => ({ ...b, capital: null })));
    setSuccessCount(0);
    setErrorMessage('');
    setGameComplete(false);
    loadCapitals();
  };

  return (
    <div className="page-content">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <h2>🎮 New England Capitals Game</h2>
      <p>Drag each capital city to its correct state bucket!</p>

      {gameComplete && (
        <div className="success-message">
          🎉 <strong>Congratulations!</strong> You matched all the capitals correctly! 🎉
          <button className="btn reset-btn" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      {errorMessage && <div className="error-message game-error">{errorMessage}</div>}

      {!gameComplete && (
        <div className="game-progress">
          <strong>Progress:</strong> {successCount} / 6 states matched
        </div>
      )}

      <div className="capitals-game-container">
        <div className="available-capitals-zone">
          <h3>📍 Capital Cities</h3>
          <div
            className="capitals-list"
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              handleDropOnAvailable();
            }}
          >
            {availableCapitals.map((capital) => (
              <div
                key={capital.id}
                className="draggable-item capital-card"
                draggable
                onDragStart={() => handleDragStart(capital)}
              >
                {capital.capital}
              </div>
            ))}
          </div>
        </div>

        <div className="state-buckets-zone">
          <h3>🗺️ New England States</h3>
          <div className="buckets-grid">
            {buckets.map((bucket) => (
              <div
                key={bucket.state}
                className="state-bucket"
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOnBucket(bucket);
                }}
              >
                <div className="state-label">
                  <span className="state-emoji">{bucket.emoji}</span>
                  <strong>{bucket.state}</strong>
                </div>
                <div className="bucket-drop-area">
                  {bucket.capital ? (
                    <div
                      className="draggable-item capital-card in-bucket"
                      draggable
                      onDragStart={() => handleDragStart(bucket.capital!)}
                    >
                      {bucket.capital.capital}
                    </div>
                  ) : (
                    <span className="drop-hint">Drop capital here</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragAndDropComponent;
