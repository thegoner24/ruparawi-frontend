// Authentication Controller
// This controller centralizes all authentication-related logic

// Define types for authentication
export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends UserCredentials {
  firstName: string;
  lastName: string;
  username?: string; // Added username field as required by the backend
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    username?: string;
    // Backend: role is array of objects with name property
    role?: { name: string }[];
    // Optionally keep roles for compatibility
    roles?: string[];
    // Other fields as needed
    [key: string]: any;
  };
}

// API URL
export const API_BASE_URL = 'https://mad-adriane-dhanapersonal-9be85724.koyeb.app';

// Controller class for authentication
export class AuthController {
  // Register a new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Create a modified userData object that includes username
      const userDataWithUsername = {
        ...userData,
        // If username is not provided, generate one from firstName and lastName
        username: userData.username || `${userData.firstName.toLowerCase()}_${userData.lastName.toLowerCase()}`
      };
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDataWithUsername)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed'
        };
      }
      
      return {
        success: true,
        message: 'Registration successful',
        ...data
      };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      return {
        success: false,
        message: errorMessage
      };
    }
  }
  

  static async login(credentials: UserCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
      
      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token);
      }
      
      return {
        success: true,
        message: 'Login successful',
        ...data
      };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      return {
        success: false,
        message: errorMessage
      };
    }
  }
  
  // Logout user
  static logout(): void {
    localStorage.removeItem('authToken');
  }
  
  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
  
  // Get authentication token
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  
  // Get user profile with roles from /auth/me
  static async getUserProfileWithRoles(): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch user profile'
        };
      }
      return {
        success: true,
        message: 'User profile retrieved successfully',
        user: data
      };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during profile fetch';
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // Get current user profile
  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      
      if (!token) {
        return {
          success: false,
          message: 'No authentication token found'
        };
      }
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to fetch user profile'
        };
      }
      
      return {
        success: true,
        message: 'User profile retrieved successfully',
        user: data.user
      };
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}

export default AuthController;
