type Review = {
  id: string;
  reservering_id?: string | null;
  rating: number;
  description: string;
  user_id?: string | null;
  user_name?: string;
};

// store reviews per film under this key + movieId
const LOCAL_PREFIX = 'reviews:film:';

async function tryFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchReviews(movieId: string, token?: string): Promise<Review[]> {
  const url = `/api/movies/${movieId}/reviews`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const data = await tryFetch(url, { headers });
    // expect data to be Review[] or { reviews: Review[] }
    if (Array.isArray(data)) return data as Review[];
    if (data && Array.isArray(data.reviews)) return data.reviews as Review[];
    return [];
  } catch (err) {
    // fallback to localStorage
    try {
      const raw = localStorage.getItem(LOCAL_PREFIX + movieId);
      return raw ? (JSON.parse(raw) as Review[]) : [];
    } catch (e) {
      return [];
    }
  }
}

export async function postReview(movieId: string, review: Omit<Review, 'id'>, token?: string): Promise<Review[]> {
  const url = `/api/movies/${movieId}/reviews`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(review) });
    if (!res.ok) throw new Error(`Post failed: ${res.status}`);
    const data = await res.json();
    // assume server returns the updated review list or the created review
    if (Array.isArray(data)) return data as Review[];
    if (data && Array.isArray(data.reviews)) return data.reviews as Review[];
    // If server returned only the new review, append it to client-local list
    const created = data as Review;
    const existingRaw = localStorage.getItem(LOCAL_PREFIX + movieId);
    const existing = existingRaw ? (JSON.parse(existingRaw) as Review[]) : [];
    const updated = [created, ...existing];
    localStorage.setItem(LOCAL_PREFIX + movieId, JSON.stringify(updated));
    return updated;
  } catch (err) {
    // fallback: write to localStorage and return updated list
    const key = LOCAL_PREFIX + movieId;
    const existingRaw = localStorage.getItem(key);
    const existing = existingRaw ? (JSON.parse(existingRaw) as Review[]) : [];
    const created: Review = { id: String(Date.now()), ...review } as Review;
    const updated = [created, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  }
}

export async function deleteReview(movieId: string, reviewId: string, token?: string): Promise<Review[]> {
  // server should accept DELETE /api/movies/:movieId/reviews/:reviewId or similar
  const url = `/api/movies/${movieId}/reviews/${reviewId}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { method: 'DELETE', headers });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data as Review[];
    if (data && Array.isArray(data.reviews)) return data.reviews as Review[];
  } catch (err) {
    // fallback: remove from localStorage
    const key = LOCAL_PREFIX + movieId;
    const existingRaw = localStorage.getItem(key);
    const existing = existingRaw ? (JSON.parse(existingRaw) as Review[]) : [];
    const updated = existing.filter((r) => r.id !== reviewId);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  }
  return [];
}
