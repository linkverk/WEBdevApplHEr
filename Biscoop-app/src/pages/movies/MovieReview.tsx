import React, { useEffect, useState } from 'react';
import './movies.css';
import ReviewList from '../movie-detail/ReviewList';
import { fetchReviews, postReview } from '../../api/reviews';
import { fakeMovies } from '../../utils/fake-data';

type Review = {
  id: string;
  reservering_id?: string | null;
  rating: number;
  description: string;
  user_id?: string | null;
  user_name?: string;
};

// ReviewForm uses the logged-in username (localStorage 'username') or 'Guest'
const ReviewForm: React.FC<{ onSubmit: (name: string, text: string, rating: number) => void | Promise<void> }> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  // Use logged-in username when available, otherwise 'Guest'
  const username = localStorage.getItem('username') ?? 'Guest';

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return;
    await onSubmit(username, text.trim(), rating);
    setText('');
    setRating(5);
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="row">
        <label>User</label>
        <div>{username}</div>
      </div>
      <div className="row">
        <label>Review</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="row">
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
        </select>
      </div>
      <div className="row actions">
        <button type="submit" className="btn">Submit review</button>
      </div>
    </form>
  );
};

const MovieList: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null); // movieId showing reviews/form
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});

  useEffect(() => {
    // load reviews for all dummy movies via API (with localStorage fallback inside the API)
    let mounted = true;
    (async () => {
      const token = localStorage.getItem('token') ?? undefined;
      const map: Record<string, Review[]> = {};
      await Promise.all(
        fakeMovies.map(async (m) => {
          map[m.id] = await fetchReviews(m.id, token);
        })
      );
      if (mounted) setReviewsMap(map);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  async function handleSubmit(movieId: string, name: string, text: string, rating: number) {
    const token = localStorage.getItem('token') ?? undefined;
    const user_id = localStorage.getItem('user_id') ?? null;
    const payload = {
      reservering_id: null,
      rating,
      description: text,
      user_id,
      user_name: name,
    };
    const updated = await postReview(movieId, payload, token);
    setReviewsMap((prev) => ({ ...prev, [movieId]: updated }));
  }

  return (
    <div className="movies-page">
      <h2>Movies</h2>
      <div className="movies-grid">
        {fakeMovies.map((m) => (
          <div key={m.id} className="movie-card">
            <div className="poster">🎞️</div>
            <div className="movie-info">
              <h3>{m.title} <span className="year">({m.duration} min)</span></h3>
              <p className="desc">{m.description}</p>
              <div className="movie-actions">
                <button onClick={() => setExpanded(expanded === m.id ? null : m.id)} className="btn">{expanded === m.id ? 'Hide reviews' : 'Reviews & Rate'}</button>
              </div>

              {expanded === m.id && (
                <div className="reviews-panel">
                  <h4>Reviews</h4>
                  {/* Map internal review shape to ReviewList's expected {name,text,rating} */}
                  <ReviewList reviews={(reviewsMap[m.id] ?? []).map((r) => ({
                    name: r.user_name ?? (r.user_id === localStorage.getItem('user_id') ? (localStorage.getItem('username') ?? 'Guest') : 'Guest'),
                    text: r.description,
                    rating: r.rating,
                  }))} />

                  <ReviewForm
                    onSubmit={(name, text, rating) => handleSubmit(m.id, name, text, rating)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default MovieList;
