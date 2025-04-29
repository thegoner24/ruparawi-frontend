"use client";
import { useState, useEffect } from 'react';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import EditProfileForm from '../components/profile/EditProfileForm';
import OrderHistory from '../components/profile/OrderHistory';
import Wishlist from '../components/profile/Wishlist';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileController, { CompleteProfile } from '../controllers/profileController';
import AuthController from '../controllers/authController';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState<CompleteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile data when component mounts
  useEffect(() => {
    async function loadProfile() {
      if (!AuthController.isAuthenticated()) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }
      
      try {
        setLoading(true);
        const profileData = await ProfileController.getCompleteProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, []);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      setLoading(true);
      // Only update vendor profile fields
      const vendorData = {
        phone_number: updatedProfile.phone_number,
        address: updatedProfile.address,
        profile_image_url: updatedProfile.profile_image_url,
        business_type: updatedProfile.business_type,
        registration_number: updatedProfile.registration_number
      };
      
      const success = await ProfileController.updateVendorProfile(vendorData);
      
      if (success) {
        // Refresh profile data
        const profileData = await ProfileController.getCompleteProfile();
        setProfile(profileData);
        alert('Profile updated successfully');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting account
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // You would add API call to delete account here
      alert("Account deletion is not implemented yet.");
    }
  };

  if (loading && !profile) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl">Loading profile data...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <ProfileSidebar active={activeSection} onChange={setActiveSection} />

          {/* Main content */}
          <div className="flex-1">
            <ProfileHeader />
            <div className="bg-white shadow rounded-lg overflow-hidden mb-8 p-8">
              {activeSection === 'profile' && profile && (
                <EditProfileForm 
                  profile={profile} 
                  onUpdate={handleProfileUpdate}
                  loading={loading}
                />
              )}
              {activeSection === 'orders' && <OrderHistory />}
              {activeSection === 'wishlist' && <Wishlist />}
              {activeSection === 'delete' && (
                <div className="flex flex-col items-start">
                  <h2 className="text-2xl font-semibold text-red-600 mb-4">Delete Account</h2>
                  <p className="mb-6 text-gray-700">
                    Deleting your account is permanent and cannot be undone. All your data will be lost.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold text-lg hover:bg-red-700 transition"
                  >
                    Confirm Delete Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
