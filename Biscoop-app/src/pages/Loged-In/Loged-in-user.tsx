import React from 'react';
import { useNavigate } from 'react-router-dom';
import './loged-in-user.css';
import bowingGif from '../../assets/bowing-gif.gif';

type Props = {
  username?: string | null;
};

const LogedInUser: React.FC<Props> = ({ username }) => {
  const navigate = useNavigate();

  // Prefer prop, fallback to localStorage, then 'User'
  const name = username ?? localStorage.getItem('username') ?? 'User';

  function handleBrowse() {
    navigate('/movie_list');
  }

  function handleBookings() {
    navigate('/bookings');
  }

  function handleSettings() {
    navigate('/edit-profile');
  }

  function handleLogout() {
    // Clear common auth keys (adjust keys if your app uses different names)
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  }

  return (
    <div className="logged-in-page">
      <section className="li-quick">
          <button className="li-logout" onClick={handleLogout}>Logout</button>
      </section>
      <header className="li-header">
        <img src={bowingGif} alt="bowing gif" style={{ width: "500px", height: "300px" }} />
        <h1 className="li-title">Welcome back, <span className="li-username">{name}</span>!</h1>
        <p className="li-sub">Find your upcoming screenings, manage bookings, or browse new movies.</p>
      </header>

      <main className="li-main">
        <section className="li-actions">
          <div className="li-card" onClick={handleBookings} role="button" tabIndex={0}>
            <h3>My Bookings</h3>
            <p>View or manage your reservations and tickets.</p>
          </div>

          <div className="li-card" onClick={handleBrowse} role="button" tabIndex={0}>
            <h3>Browse Movies</h3>
            <p>See what's playing and pick your next film.</p>
          </div>

          <div className="li-card" onClick={handleSettings} role="button" tabIndex={0}>
            <h3>Account Settings</h3>
            <p>Update profile</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LogedInUser;
