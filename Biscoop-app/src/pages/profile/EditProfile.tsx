import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { getUserProfile, updateUserProfile, getCurrentUserId } from '../../api/users';
import './profile.css';

interface ExtendedUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio: string;
  genre: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  
  const [formData, setFormData] = useState<ExtendedUserData>({
    firstName: '',
    lastName: '',
    email: user.email,
    password: '',
    bio: '',
    genre: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setErrorMessage('User not logged in');
      return;
    }

    try {
      setLoading(true);
      // Load from API
      const profile = await getUserProfile(userId);
      console.log('📋 Loading profile for edit:', profile);
      
      // Load extended profile data from localStorage
      const savedProfile = localStorage.getItem('userProfile');
      let extendedData = { bio: '', genre: '' };
      
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          extendedData = {
            bio: profileData.bio || '',
            genre: profileData.genre || ''
          };
        } catch (e) {
          console.error('Error loading extended profile:', e);
        }
      }

      // Get password from localStorage (for updating)
      const registeredUser = localStorage.getItem('registeredUser');
      let password = '';
      if (registeredUser) {
        try {
          const userData = JSON.parse(registeredUser);
          password = userData.password || '';
        } catch (e) {
          console.error('Error loading password:', e);
        }
      }

      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email,
        password: password,
        bio: extendedData.bio,
        genre: extendedData.genre
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setErrorMessage('Failed to load profile from database.');
      
      // Fallback to localStorage
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          setFormData({
            firstName: user.name.split(' ')[0] || '',
            lastName: user.name.split(' ').slice(1).join(' ') || '',
            email: user.email,
            password: '',
            bio: profileData.bio || '',
            genre: profileData.genre || ''
          });
        } catch (e) {
          console.error('Error loading from localStorage:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const textFields = [
    { key: 'firstName', label: 'First Name', placeholder: 'Enter first name' },
    { key: 'lastName', label: 'Last Name', placeholder: 'Enter last name' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' }
  ];

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('First and last name are required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Valid email is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      setErrorMessage('User not logged in');
      return;
    }

    try {
      setLoading(true);

      // Update via API - SEND COMPLETE USER DATA INCLUDING PASSWORD
      const updatedProfile = await updateUserProfile(userId, {
        id: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password // IMPORTANT: Send password to database!
      });

      console.log('✅ Profile updated in database:', updatedProfile);

      // IMPORTANT: Update the user context so Profile component shows correct data
      const fullName = `${updatedProfile.firstName} ${updatedProfile.lastName}`;
      setUser({
        ...user,
        name: fullName,
        email: updatedProfile.email
      });

      // Save extended profile data to localStorage (bio and genre only)
      const profileData = {
        bio: formData.bio,
        genre: formData.genre,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      // Update registered user data in localStorage (for login persistence)
      const registeredUser = localStorage.getItem('registeredUser');
      if (registeredUser) {
        const userData = JSON.parse(registeredUser);
        userData.id = userId;
        userData.name = fullName;
        userData.email = formData.email;
        userData.password = formData.password;
        localStorage.setItem('registeredUser', JSON.stringify(userData));
        console.log('✅ localStorage updated');
      }

      // Also update username in simple storage
      localStorage.setItem('username', fullName);

      setSuccessMessage('Profile updated successfully in database!');
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('❌ Save error:', error);
      setErrorMessage('Error saving profile to database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading && !formData.email) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p style={{ textAlign: 'center', color: '#9ab0c9' }}>Loading profile from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <button 
          onClick={() => navigate('/profile')} 
          className="btn-back"
        >
          ← Back to Profile
        </button>
        
        <h2 className="edit-title">Edit Profile</h2>
        
        {successMessage && (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        
        <div className="avatar-section">
          <div className="edit-avatar">
            👤
          </div>
          <button className="btn-change-avatar">
            Change Avatar
          </button>
        </div>

        {textFields.map(field => (
          <div key={field.key} className="form-group">
            <label className="form-label">{field.label}</label>
            <input
              type={field.type || 'text'}
              value={formData[field.key as keyof typeof formData]}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="form-input"
              required
            />
          </div>
        ))}
        
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            className="form-textarea"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Favorite Genre</label>
          <select
            value={formData.genre}
            onChange={(e) => updateField('genre', e.target.value)}
            className="form-select"
          >
            <option value="">Select a genre</option>
            {['Action & Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Science Fiction', 'Thriller'].map(g => (
              <option key={g} value={g.toLowerCase()}>{g}</option>
            ))}
          </select>
        </div>

        <div className="button-grid">
          <button 
            onClick={handleSave} 
            className="btn-success"
            disabled={loading || !!successMessage}
          >
            {loading ? 'Saving to Database...' : successMessage ? 'Saved!' : 'Save Changes'}
          </button>
          <button 
            onClick={handleCancel} 
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;