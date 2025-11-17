import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserHistory, addToUserHistory, getCurrentUserId } from '../../api/users';
import type { FilmHistory } from '../../api/users';
import './profile.css';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<FilmHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'duration'>('name');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const history = await getUserHistory(userId);
      setMovies(history);
      setError('');
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique genres for filter
  const genres = ['all', ...Array.from(new Set(movies.map(m => m.genre).filter(Boolean)))];

  // Filter and sort movies
  const filteredAndSortedMovies = movies
    .filter(movie => filterGenre === 'all' || movie.genre === filterGenre)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'rating':
          return (b.rating || '').localeCompare(a.rating || '');
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const totalMovies = movies.length;
  const totalHours = Math.round(movies.reduce((sum, movie) => sum + (movie.duration || 0), 0) / 60);

  const stats = [
    { value: totalMovies, label: 'Movies Watched' },
    { value: totalHours, label: 'Hours Watched' },
    { value: movies.length, label: 'In History' }
  ];

  if (loading) {
    return (
      <div className="profile-container">
        <div className="history-card">
          <p style={{ textAlign: 'center', color: '#9ab0c9' }}>Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="history-card">
        <div className="history-header">
          <h2 className="history-title">Movie History</h2>
          <button 
            onClick={() => navigate('/profile')} 
            className="btn-back-inline"
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <div className="history-stats">
          {stats.map((stat, i) => (
            <div key={i} className="history-stat">
              <span className="history-stat-value">{stat.value}</span>
              <span className="history-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="history-filters">
          <div className="filter-group">
            <label className="filter-label">Filter by Genre:</label>
            <select 
              value={filterGenre} 
              onChange={(e) => setFilterGenre(e.target.value)}
              className="filter-select"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'duration')}
              className="filter-select"
            >
              <option value="name">Title</option>
              <option value="rating">Rating</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Movie List */}
        <div className="movie-list">
          {filteredAndSortedMovies.length > 0 ? (
            filteredAndSortedMovies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-poster-small">
                  🎬
                </div>
                <div className="movie-info">
                  <div className="movie-title">{movie.name}</div>
                  <div className="movie-meta">
                    {movie.genre && <span>📁 {movie.genre}</span>}
                    {movie.duration && <span>⏱️ {movie.duration} min</span>}
                    {movie.rating && <span>🎭 {movie.rating}</span>}
                  </div>
                  {movie.description && (
                    <div className="movie-review">"{movie.description}"</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-movies">
              <p>No movies found in your history.</p>
              {filterGenre !== 'all' && (
                <button 
                  onClick={() => setFilterGenre('all')}
                  className="btn-reset-filters"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="history-footer">
          <button 
            onClick={() => navigate('/profile')} 
            className="btn-back-center"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;