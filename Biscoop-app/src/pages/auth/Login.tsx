import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import './auth.css';

export interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      // Call the authentication API
      const response = await login({ email, password });
      
      console.log('✅ Login successful:', response);
      
      // Call the onLogin callback
      onLogin(email, password);
      
      // Navigate to profile/home
      navigate('/profile');
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        
        {error && (
          <div className="error-message" style={{ 
            color: '#e74c3c', 
            marginBottom: '1rem', 
            padding: '0.75rem',
            backgroundColor: '#fee',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <span className="auth-text">Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="link-button"
            disabled={loading}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;