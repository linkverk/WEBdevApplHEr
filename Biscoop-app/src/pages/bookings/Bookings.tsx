import React, { useEffect, useState } from 'react';
import './bookings.css';
import { useNavigate } from 'react-router-dom';

type Booking = {
  id: string;
  movie: string;
  date: string;
  time: string;
  seats: string[];
};

const SAMPLE_BOOKINGS: Booking[] = [
  { id: '1', movie: 'The Grand Adventure', date: '2025-11-05', time: '19:30', seats: ['A3', 'A4'] },
  { id: '2', movie: 'Space Between Worlds', date: '2025-11-08', time: '21:00', seats: ['C1'] },
];

function loadBookings(key = 'bookings'): Booking[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return SAMPLE_BOOKINGS;
    return JSON.parse(raw) as Booking[];
  } catch (e) {
    return SAMPLE_BOOKINGS;
  }
}

const Bookings: React.FC = () => {
  const storageKey = 'bookings';
  const [bookings, setBookings] = useState<Booking[]>(() => loadBookings(storageKey));
  const navigate = useNavigate();

  // helper to generate a random seat like 'B7'
  function randomSeat(): string {
    const letters = 'ABCDEF'; // adjust range A-F
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = Math.floor(Math.random() * 12) + 1; // 1-12
    return `${letter}${number}`;
  }

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(bookings));
  }, [bookings]);

  function randomMovieName(): string {
    const movies = ['The Lost City', 'Galactic Odyssey', 'Mystery Manor', 'Comedy Nights', 'Horror House'];
    return movies[Math.floor(Math.random() * movies.length)];
  }
  function randomTime(): string {
    const hours = Math.floor(Math.random() * 5) + 17;
    const minutes = Math.random() < 0.5 ? '00' : '30';
    return `${hours}:${minutes}`;
    }
  function randomDate(): string 
  {
    const day = Math.floor(Math.random() * 30);
    const month = Math.floor(Math.random() * 12);
    const year = 2025;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

  function addSample() {
    const next: Booking = {
      id: String(Date.now()),
      movie: randomMovieName(),
      date: randomDate(),
      time: randomTime(),
      seats: [randomSeat()],
    };
    setBookings((s) => [next, ...s]);
  }

  function removeBooking(id: string) {
    setBookings((s) => s.filter((b) => b.id !== id));
  }

  return (
    <div className="bookings-page">
      <header className="bookings-header">
        <h2>Your Bookings</h2>
        <div className="bookings-actions">
          <button onClick={addSample} className="btn">Add sample booking</button>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
        </div>
      </header>

      <main>
        {bookings.length === 0 ? (
          <p className="empty">You have no bookings yet.</p>
        ) : (
          <ul className="bookings-list">
            {bookings.map((b) => (
              <li key={b.id} className="booking-item">
                <div className="booking-left">
                  <strong className="movie">{b.movie}</strong>
                  <div className="meta">{b.date} · {b.time}</div>
                </div>
                <div className="booking-right">
                  <div className="seats">Seats: {b.seats.join(', ')}</div>
                  <button className="btn btn-delete" onClick={() => removeBooking(b.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Bookings;
