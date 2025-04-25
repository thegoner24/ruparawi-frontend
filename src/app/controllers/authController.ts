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
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// API URL
const API_BASE_URL = 'https://mad-adriane-dhanapersonal-9be85724.koyeb.app';

// Controller class for authentication
export class AuthController {
  // Register a new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
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
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred during registration'
      };
    }
  }
  
  // Login user
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
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      return {
        success: true,
        message: 'Login successful',
        ...data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred during login'
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
      
      const response = await fetch(`${API_BASE_URL}/profile`, {
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
        user: data.user
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred while fetching user profile'
      };
    }
  }
}

export default AuthController;
