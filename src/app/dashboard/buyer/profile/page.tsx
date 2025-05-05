"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/controllers/authController";

interface UserProfile {
  id: number;
  first_name: string | null;
  last_name: string | null;
  username: string;
  email: string;
  bio: string | null;
  last_login: string;
  created_at: string;
  profile_image_url: string | null;
  role: { name: string }[];
}

// Helper to ensure string for possibly-null profile fields
function safeString(val: string | null | undefined): string {
  return typeof val === 'string' ? val : '';
}


// Type for editing form (includes password, which is not in UserProfile)
type UserProfileEditForm = {
  bio: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  password?: string;
};

// Custom hook to fetch user profile
type UseUserProfileResult = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
};

// Custom hook to update user profile
function useUpdateUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No auth token found. Please log in.');
      setLoading(false);
      return;
    }
    try {
      const url = `${API_BASE_URL}/user/me`;
      console.log('[Profile Debug] PUT', url, 'payload:', data);
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorText = await res.text();
        setError(errorText || 'Failed to update profile');
      } else {
        setSuccess('Profile updated successfully!');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error, success, setSuccess, setError };
}

function useUserProfile(): UseUserProfileResult & { refetch: () => void } {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = React.useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No auth token found. Please log in.');
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('[Profile Debug] Fetching /auth/me');
        console.log('[Profile Debug] Token:', token);
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('[Profile Debug] Response status:', res.status, res.statusText);
        if (!res.ok) {
          const errorText = await res.text();
          console.log('[Profile Debug] Error body:', errorText);
          if (res.status === 401) {
            throw new Error('Session expired. Please log in again.');
          } else {
            throw new Error('Failed to fetch profile');
          }
        }
        const data = await res.json();
        // If the API returns { success: true, user: { ... } }, extract user
        setProfile(data.user || data);
      } catch (e: unknown) {
        console.error('[Profile Debug] Caught error:', e);
        if (e instanceof Error) {
          setError(e.message || 'Unknown error');
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}

const ProfilePage: React.FC = () => {
  const { profile, loading, error, refetch } = useUserProfile();
  const { updateProfile, loading: updating, error: updateError, success: updateSuccess, setSuccess, setError } = useUpdateUserProfile();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<UserProfileEditForm>({
    bio: '',
    first_name: '',
    last_name: '',
    profile_image_url: '',
    password: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        bio: typeof profile.bio === 'string' ? profile.bio : '',
        first_name: typeof profile.first_name === 'string' ? profile.first_name : '',
        last_name: typeof profile.last_name === 'string' ? profile.last_name : '',
        profile_image_url: typeof profile.profile_image_url === 'string' ? profile.profile_image_url : '',
        password: '', // do not prefill password
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only send allowed fields
    const { bio, first_name, last_name, profile_image_url, password } = form;
    const payload: any = {};
    if (bio !== undefined) payload.bio = bio;
    if (first_name !== undefined) payload.first_name = first_name;
    if (last_name !== undefined) payload.last_name = last_name;
    if (profile_image_url !== undefined) payload.profile_image_url = profile_image_url;
    if (password) payload.password = password;
    console.log('[Profile Debug] PUT /user/me payload:', payload);
    await updateProfile(payload);
    setEditMode(false);
    refetch(); // Refetch profile after update
  };

  const handleCancel = () => {
    setEditMode(false);
    setSuccess(null);
    setError(null);
    if (profile) {
      setForm({
        bio: safeString(profile.bio),
        first_name: safeString(profile.first_name),
        last_name: safeString(profile.last_name),
        profile_image_url: safeString(profile.profile_image_url),
        password: '',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-6">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading profile...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : profile ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <img
            src={(profile.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent((profile.first_name || '') + ' ' + (profile.last_name || ''))}`) as string}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-pink-200 object-cover shadow"
          />
          {!editMode ? (
            <>
              <div className="text-xl font-semibold">{safeString(profile.first_name)} {safeString(profile.last_name)}</div>
              <div className="text-gray-600">@{profile.username}</div>
              <div className="flex flex-col gap-1 w-full max-w-md">
                <div><span className="font-medium">Email:</span> {profile.email || <span className="text-gray-400">N/A</span>}</div>
                <div><span className="font-medium">Bio:</span> {safeString(profile.bio)}</div>
                <div><span className="font-medium">Last Login:</span> {profile.last_login ? new Date(profile.last_login).toLocaleString() : <span className="text-gray-400">N/A</span>}</div>
              </div>
              <div className="flex flex-col items-center gap-1 mt-2">
                <div className="text-gray-400 text-sm">Joined: {new Date(profile.created_at).toLocaleDateString()}</div>
                {profile.role && profile.role.length > 0 && (
                  <div className="text-xs text-pink-700 bg-pink-100 rounded px-2 py-1 mt-1">
                    Roles: {profile.role.map((r: { name: string }) => r.name).join(', ')}
                  </div>
                )}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
                onClick={() => setEditMode(true)}
              >Edit Profile</button>
              {updateSuccess && <div className="text-green-600 mt-2">{updateSuccess}</div>}
              {updateError && <div className="text-red-600 mt-2">{updateError}</div>}
            </>
          ) : (
            <form className="flex flex-col gap-3 w-full max-w-md" onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="font-medium">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name ?? ''}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
                <div className="w-1/2">
                  <label className="font-medium">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name ?? ''}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio ?? ''}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                  rows={3}
                />
              </div>
              <div>
                <label className="font-medium">Profile Image URL</label>
                <input
                  type="text"
                  name="profile_image_url"
                  value={form.profile_image_url ?? ''}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="font-medium">Password <span className="text-gray-400 text-xs">(leave blank to keep current)</span></label>
                <input
                  type="password"
                  name="password"
                  value={form.password ?? ''}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                  autoComplete="new-password"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition disabled:opacity-50"
                  disabled={updating}
                >{updating ? 'Saving...' : 'Save'}</button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                  onClick={handleCancel}
                  disabled={updating}
                >Cancel</button>
              </div>
              {updateSuccess && <div className="text-green-600 mt-2">{updateSuccess}</div>}
              {updateError && <div className="text-red-600 mt-2">{updateError}</div>}
            </form>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">No profile data found.</div>
      )}
    </div>
  );
};

export default ProfilePage;
