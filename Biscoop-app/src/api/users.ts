// User API Service - Films Style with Database Support
const API_BASE_URL = 'http://localhost:5275/api/Users';

export interface UserDTO {
  id?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserBooking {
  id: string;
  userId: string;
  showId: string;
  show: {
    id: string;
    filmId: string;
    roomId: string;
    begintijd: string;
    eindtijd: string;
    film: {
      id: string;
      name: string;
      duration: number;
      rating: string;
      genre: string;
    };
    zaal: {
      id: string;
      naam: string;
      rijen: number;
      stoelenPerRij: number;
    };
  };
  seats: Array<{
    id: string;
    reservationId: string;
    stoelnummer: string;
  }>;
}

export interface FilmHistory {
  id: string;
  name: string;
  rating: string;
  genre: string;
  duration: number;
  description: string;
}

// NEW: Create or get user from database
export async function createOrGetUser(userData: UserDTO): Promise<UserProfile> {
  try {
    // First, try to find user by email
    const response = await fetch(`${API_BASE_URL}/GetByEmail?email=${encodeURIComponent(userData.email)}`);
    
    if (response.ok) {
      // User exists, return it
      const user = await response.json();
      console.log('User found in database:', user.id);
      return user;
    }
    
    // User doesn't exist, create new one
    console.log('Creating new user in database...');
    const createResponse = await fetch(`${API_BASE_URL}/AddOrUpdate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create user: ${createResponse.status}`);
    }
    
    const newUser = await createResponse.json();
    console.log('User created in database:', newUser.id);
    return newUser;
  } catch (error) {
    console.error("Failed to create/get user:", error);
    throw error;
  }
}

// GET user profile by ID
export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/GetById?id=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

// UPDATE user profile
export async function updateUserProfile(userId: string, userData: UserDTO): Promise<UserProfile> {
  try {
    const response = await fetch(`${API_BASE_URL}/AddOrUpdate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, id: userId }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}

// DELETE user account
export async function deleteUserAccount(userId: string, userData: UserDTO): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/Delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, id: userId }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

// GET user film history
export async function getUserHistory(userId: string): Promise<FilmHistory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/GetHistory?id=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch history:", error);
    throw error;
  }
}

// ADD film to user history
export async function addToUserHistory(userId: string, filmId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/AddToHistory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, filmId }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add to history: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to add to history:", error);
    throw error;
  }
}

// GET user bookings
export async function getUserBookings(userId: string): Promise<UserBooking[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/GetBookings?id=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    throw error;
  }
}

// Helper to get current user ID from localStorage
export function getCurrentUserId(): string | null {
  return localStorage.getItem('userId');
}

// Helper to save user ID to localStorage
export function saveCurrentUserId(userId: string): void {
  localStorage.setItem('userId', userId);
}

// Helper to clear user ID from localStorage
export function clearCurrentUserId(): void {
  localStorage.removeItem('userId');
}