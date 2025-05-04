"use client";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/controllers/authController";


interface VendorProfile {
  business_address: string;
  business_description: string;
  business_email: string;
  business_logo_url: string;
  business_name: string;
  business_phone: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  vendor_status: string;
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState<VendorProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE_URL}/vendor/profile`, {
          method: "GET",
          headers,
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        if (data && data.vendor) {
          setProfile(data.vendor);
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      if (!profile) throw new Error("Profile data is missing");
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = token
        ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        : { "Content-Type": "application/json" };
      const res = await fetch(`${API_BASE_URL}/vendor/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ vendor: profile }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading profile...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!profile) return <div>No profile data found.</div>;

  // Read-only view
  if (!editMode) {
    return (
      <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center py-0 px-0 overflow-hidden">
        {/* SVG background pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="goldPattern" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect x="0" y="0" width="40" height="40" fill="none" />
              <circle cx="20" cy="20" r="1.5" fill="#FFD700" />
              <circle cx="0" cy="0" r="1.5" fill="#FFD700" />
              <circle cx="40" cy="40" r="1.5" fill="#FFD700" />
              <circle cx="0" cy="40" r="1.5" fill="#FFD700" />
              <circle cx="40" cy="0" r="1.5" fill="#FFD700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#goldPattern)" />
        </svg>

        <div className="relative z-10 w-full h-full bg-white rounded-none shadow-none p-0 sm:p-10 m-0 border-0 backdrop-blur-md flex flex-col justify-center">
          <div className="flex flex-col items-center mb-8">
            <img
              src={profile.business_logo_url}
              alt="Business Logo"
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full shadow-lg border-4 border-yellow-400 object-cover bg-white"
              style={{ objectFit: 'cover' }}
            />
            <div className="flex flex-col items-center mt-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-yellow-600 tracking-tight text-center drop-shadow-lg">
                {profile.business_name}
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mt-2 mb-1"></div>
              <span className="text-xs sm:text-sm text-gray-500 tracking-wide uppercase font-semibold">{profile.vendor_status}</span>
            </div>
          </div>
          <div className="space-y-4 text-base sm:text-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <span className="w-32 sm:w-44 text-gray-500 font-medium">Email</span>
              <span className="text-gray-900 break-all">{profile.business_email}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <span className="w-32 sm:w-44 text-gray-500 font-medium">Phone</span>
              <span className="text-gray-900">{profile.business_phone}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <span className="w-32 sm:w-44 text-gray-500 font-medium">Address</span>
              <span className="text-gray-900">{profile.business_address}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <span className="w-32 sm:w-44 text-gray-500 font-medium">Description</span>
              <span className="text-gray-900">{profile.business_description}</span>
            </div>
          </div>
          <button
            className="mt-10 w-full sm:w-auto bg-yellow-500 text-white font-bold px-8 py-2 rounded-lg hover:bg-yellow-600 shadow transition-colors duration-150"
            onClick={() => { setEditMode(true); setEditProfile(profile); }}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Editable form view
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-yellow-600 font-bold">Edit Business Profile</h1>
      <form onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        try {
          if (!editProfile) throw new Error("Profile data is missing");
          const token = localStorage.getItem("authToken");
          const headers: HeadersInit = token
            ? { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            : { "Content-Type": "application/json" };
          // Only send allowed fields
          const payload = {
            business_name: editProfile.business_name,
            business_email: editProfile.business_email,
            business_phone: editProfile.business_phone,
            business_address: editProfile.business_address,
            business_description: editProfile.business_description,
            business_logo_url: editProfile.business_logo_url,
          };
          const res = await fetch(`${API_BASE_URL}/vendor/profile`, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Failed to update profile");
          const data = await res.json();
          setProfile(data.vendor);
          setSuccess("Profile updated successfully!");
          setEditMode(false);
        } catch (err: any) {
          setError(err.message || "Unknown error");
        } finally {
          setSubmitting(false);
        }
      }} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Business Name</label>
          <input
            type="text"
            name="business_name"
            value={editProfile?.business_name || ''}
            onChange={e => setEditProfile(editProfile && { ...editProfile, business_name: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Business Email</label>
          <input
            type="email"
            name="business_email"
            value={editProfile?.business_email || ''}
            onChange={e => setEditProfile(editProfile && { ...editProfile, business_email: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Business Phone</label>
          <input
            type="text"
            name="business_phone"
            value={editProfile?.business_phone || ''}
            onChange={e => setEditProfile(editProfile && { ...editProfile, business_phone: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Business Address</label>
          <input
            type="text"
            name="business_address"
            value={editProfile?.business_address || ''}
            onChange={e => setEditProfile(editProfile && { ...editProfile, business_address: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Business Description</label>
          <input
            type="text"
            name="business_description"
            value={editProfile?.business_description || ''}
            onChange={e => setEditProfile(editProfile && { ...editProfile, business_description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Business Logo URL</label>
          <input
            type="text"
            name="business_logo_url"
            value={editProfile?.business_logo_url || ''}
            onChange={e => setEditProfile(editProfile && { ...editProfile, business_logo_url: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-yellow-500 text-white font-bold px-6 py-2 rounded hover:bg-yellow-600 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 font-bold px-6 py-2 rounded hover:bg-gray-400"
            onClick={() => { setEditMode(false); setEditProfile(null); }}
          >
            Cancel
          </button>
        </div>
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
}

