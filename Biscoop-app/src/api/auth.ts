// Authentication API Service
const API_BASE_URL = 'http://localhost:5275/api/Auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// LOGIN - Authenticate user and get JWT token
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `Login failed: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    console.log('✅ Login successful:', data.user.email);
    
    // Store token and user info in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('username', `${data.user.firstName} ${data.user.lastName}`);
    
    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
}

// REGISTER - Create new user account
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/Register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `Registration failed: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    console.log('✅ Registration successful:', data.user.email);
    
    // Store token and user info in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('username', `${data.user.firstName} ${data.user.lastName}`);
    
    return data;
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
}

// VALIDATE TOKEN - Check if current token is still valid
export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/ValidateToken`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Token validation error:', error);
    return false;
  }
}

// LOGOUT - Clear stored authentication data
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  console.log('✅ Logged out');
}

// Helper to get current token
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getToken();
  return token !== null;
}