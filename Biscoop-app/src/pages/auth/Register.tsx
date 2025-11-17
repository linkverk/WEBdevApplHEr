import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import './auth.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      
      // Call the authentication API
      const response = await register({
        email,
        password,
        firstName,
        lastName
      });
      
      console.log('✅ Registration successful:', response);
      
      // Navigate to profile after successful registration
      navigate('/profile', { 
        state: { 
          message: 'Account successfully created!',
          registeredName: `${firstName} ${lastName}`
        } 
      });
    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { 
      label: 'First Name', 
      type: 'text', 
      value: firstName, 
      onChange: setFirstName, 
      placeholder: 'Enter your first name' 
    },
    { 
      label: 'Last Name', 
      type: 'text', 
      value: lastName, 
      onChange: setLastName, 
      placeholder: 'Enter your last name' 
    },
    { 
      label: 'Email', 
      type: 'email', 
      value: email, 
      onChange: setEmail, 
      placeholder: 'Enter your email' 
    },
    { 
      label: 'Password', 
      type: 'password', 
      value: password, 
      onChange: setPassword, 
      placeholder: 'Create a password' 
    }
  ];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        
        {error && (
          <div className="error-message" style={{ 
            color: '#e74c3c', 
            marginBottom: '1rem', 
            padding: '0.5rem',
            backgroundColor: '#fee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {fields.map((field, i) => (
            <div key={i} className="form-group">
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="form-input"
                required
                disabled={loading}
              />
            </div>
          ))}
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <span className="auth-text">Already have an account? </span>
          <button 
            onClick={() => navigate('/login')} 
            className="link-button"
            disabled={loading}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;