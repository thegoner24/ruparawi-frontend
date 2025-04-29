// Profile Controller
// This controller handles user/vendor profile operations

import AuthController from './authController';

// Define interfaces for profile data
export interface VendorProfile {
  phone_number?: string;
  address?: string;
  profile_image_url?: string;
  business_type?: string;
  registration_number?: string;
  profile_completion?: number;
}

export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface CompleteProfile extends UserProfile, VendorProfile {}

// API URL - same as in AuthController
const API_BASE_URL = 'https://mad-adriane-dhanapersonal-9be85724.koyeb.app';

export class ProfileController {
  // Get user authentication data (auth/me)
  static async getUserAuthData(): Promise<UserProfile | null> {
    try {
      const token = AuthController.getToken();
      
      if (!token) {
        console.error('No authentication token found');
        return null;
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch user auth data:', errorData);
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user auth data:', error);
      return null;
    }
  }
  
  // Get vendor profile data (vendor/profile)
  static async getVendorProfile(): Promise<VendorProfile | null> {
    try {
      const token = AuthController.getToken();
      
      if (!token) {
        console.error('No authentication token found');
        return null;
      }
      
      const response = await fetch(`${API_BASE_URL}/vendor/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch vendor profile:', errorData);
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
      return null;
    }
  }
  
  // Get complete profile (combined data from auth/me and vendor/profile)
  static async getCompleteProfile(): Promise<CompleteProfile | null> {
    try {
      const [userData, vendorData] = await Promise.all([
        this.getUserAuthData(),
        this.getVendorProfile()
      ]);
      
      if (!userData) {
        console.error('Failed to fetch user data');
        return null;
      }
      
      return {
        ...userData,
        ...vendorData
      };
    } catch (error) {
      console.error('Error fetching complete profile:', error);
      return null;
    }
  }
  
  // Update vendor profile
  static async updateVendorProfile(profileData: VendorProfile): Promise<boolean> {
    try {
      const token = AuthController.getToken();
      
      if (!token) {
        console.error('No authentication token found');
        return false;
      }
      
      const response = await fetch(`${API_BASE_URL}/vendor/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update vendor profile:', errorData);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      return false;
    }
  }
}

export default ProfileController;
