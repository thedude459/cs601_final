import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const NewsComponent: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch news from backend API
      const response = await fetch('http://localhost:3000/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const articles = await response.json();
      setArticles(articles);
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Failed to load news. Please try again later.');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-content">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      <h2>📰 Latest Tech News</h2>
      <p>Fetching top stories from Hacker News API via backend server</p>

      <button className="btn" onClick={loadNews} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh News'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {loading && articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading news articles...</p>
        </div>
      ) : (
        <div className="news-grid">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
            >
              <div className="news-source">{article.source.name}</div>
              <h3>{article.title}</h3>
              <p className="news-description">{article.description}</p>
              <div className="news-footer">
                <span className="news-date">{formatDate(article.publishedAt)}</span>
                <span className="news-link">Read more →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsComponent;
