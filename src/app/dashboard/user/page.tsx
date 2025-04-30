"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiUser, HiClipboardList, HiHeart, HiTrash } from "react-icons/hi";
import AuthController from "../../controllers/authController";
import Image from 'next/image';
import Link from 'next/link';

// API URL - consistent with your other files
const API_BASE_URL = "https://mad-adriane-dhanapersonal-9be85724.koyeb.app";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  profileImageUrl?: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  items: {
    name: string;
    price: string;
    quantity: number;
  }[];
}

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy order and wishlist data (keep as-is)
  const orders: Order[] = [
    {
      id: "ORD-2025-001",
      date: "April 26, 2025",
      status: "Delivered",
      total: "$269.00",
      items: [
        { name: "White Cotton Blouse", price: "$129.00", quantity: 1 },
        { name: "Linen Pants", price: "$140.00", quantity: 1 },
      ],
    },
  ];
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Handwoven Batik Tunic",
      price: "$149.00",
      imageUrl: "/images/product-1.jpg",
    },
    {
      id: 2,
      name: "Traditional Tenun Shawl",
      price: "$89.00",
      imageUrl: "/images/product-2.jpg",
    },
  ]);

  // Helper to refresh JWT
  const refreshToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // if your backend uses httpOnly cookies
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("authToken", data.access_token);
        return data.access_token;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Redirect to login if no JWT is found at all
  useEffect(() => {
    const token = AuthController.getToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Fetch user profile with token refresh
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        let token = AuthController.getToken();
        if (!token) {
          setError("No authentication token found");
          router.push("/login");
          return;
        }

        let res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // If unauthorized or signature error, try refresh
        if (res.status === 401 || res.status === 422) {
          token = await refreshToken();
          if (!token) {
            router.push("/login");
            return;
          }
          res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        }

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        if (data.success && data.user) {
          setProfile(data.user);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    alert("Profile updated!");
  };

  const removeFromWishlist = (itemId: number) =>
    setWishlistItems((items) => items.filter((item) => item.id !== itemId));
  const addToCart = (item: WishlistItem) => {
    alert(`Added ${item.name} to cart!`);
    removeFromWishlist(item.id);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deleted (demo only).");
    }
  };

  const menu = [
    { id: "profile", label: "Edit Profile", icon: HiUser },
    { id: "orders", label: "Order History", icon: HiClipboardList },
    { id: "wishlist", label: "Wishlist", icon: HiHeart },
    { id: "delete", label: "Delete Account", icon: HiTrash },
  ];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="text-xl text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-72 bg-white rounded-2xl border border-gray-300 p-6 flex flex-col gap-2">
          <nav className="flex flex-col gap-1">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition
                  ${
                    activeSection === item.id
                      ? "bg-black text-white"
                      : item.id === "delete"
                      ? "text-red-600 hover:bg-red-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-normal text-black mb-2 tracking-tight">
              My Account
            </h1>
            <p className="text-gray-600">
              Manage your profile, view order history, and manage your wishlist.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden mb-8 p-8">
            {/* Edit Profile */}
            {activeSection === "profile" && profile && (
              <EditProfileForm
                profile={profile}
                onUpdate={handleProfileUpdate}
                loading={loading}
                refreshToken={refreshToken}
                router={router}
              />
            )}

            {/* Order History */}
            {activeSection === "orders" && (
              <div>
                <h2 className="text-2xl font-normal text-black mb-6">
                  Order History
                </h2>
                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-600">
                      You haven't placed any orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg overflow-hidden shadow-sm"
                      >
                        <div className="bg-gray-50 p-6 border-b flex flex-wrap justify-between items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Order #{order.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="font-medium">{order.total}</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-medium mb-4">Items</h3>
                          <ul className="space-y-4">
                            {order.items.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <div>
                                  <p>{item.name}</p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <span>{item.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-6 bg-gray-50 border-t flex justify-end">
                          <button className="px-4 py-2 text-sm border border-black text-black hover:bg-black hover:text-white transition rounded-full">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeSection === "wishlist" && (
              <div>
                <h2 className="text-2xl font-normal text-black mb-6">
                  My Wishlist
                </h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-600">Your wishlist is empty.</p>
                    <Link
                      href="/shop"
                      className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
                    >
                      CONTINUE SHOPPING
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 flex justify-end">
                      <button
                        onClick={() =>
                          wishlistItems.forEach((item) => addToCart(item))
                        }
                        className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-900 transition"
                      >
                        ADD ALL TO CART
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg overflow-hidden shadow-sm"
                        >
                          <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-2">{item.name}</h3>
                            <p className="text-lg mb-4">{item.price}</p>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => addToCart(item)}
                                className="w-full py-2 bg-black text-white text-sm rounded-full hover:bg-gray-900 transition"
                              >
                                ADD TO CART
                              </button>
                              <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="w-full py-2 border border-black text-black text-sm rounded-full hover:bg-gray-100 transition"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delete Account */}
            {activeSection === "delete" && (
              <div className="flex flex-col items-start">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">
                  Delete Account
                </h2>
                <p className="mb-6 text-gray-700">
                  Deleting your account is permanent and cannot be undone. All
                  your data will be lost.
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
    </main>
  );
}

// --- Inline EditProfileForm ---
interface EditProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: UserProfile) => void;
  loading: boolean;
  refreshToken: () => Promise<string | null>;
  router: any;
}

function EditProfileForm({
  profile,
  onUpdate,
  loading,
  refreshToken,
  router
}: EditProfileFormProps) {
  // Combine first and last name for the "Name" field
  const initialName =
    (profile.firstName || "") +
    ((profile.lastName) ? " " + profile.lastName : "");

  const [formData, setFormData] = useState({
    name: initialName,
    email: profile.email || "",
    phoneNumber: profile.phoneNumber || "",
    address: profile.address || "",
    bio: profile.bio || "",
    password: "",
    profileImageUrl: profile.profileImageUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(profile.profileImageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Split name into first and last for backend
  function splitName(fullName: string) {
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    return { firstName, lastName };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    let token = AuthController.getToken();
    if (!token) {
      setError("No authentication token found");
      setSaving(false);
      router.push("/login");
      return;
    }
    const { firstName, lastName } = splitName(formData.name);
    try {
      let res = await fetch(`${API_BASE_URL}/user/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: formData.bio,
          firstName,
          lastName,
          profileImageUrl: imagePreview || null,
          password: formData.password || undefined,
        }),
        credentials: "include",
      });

      // If unauthorized or signature error, try refresh
      if (res.status === 401 || res.status === 422) {
        token = await refreshToken();
        if (!token) {
          router.push("/login");
          return;
        }
        res = await fetch(`${API_BASE_URL}/user/me`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio: formData.bio,
            firstName,
            lastName,
            profileImageUrl: imagePreview || null,
            password: formData.password || undefined,
          }),
          credentials: "include",
        });
      }

      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      if (data.success) {
        onUpdate({
          ...profile,
          ...formData,
          firstName,
          lastName,
          profileImageUrl: imagePreview,
        });
        alert("Profile updated!");
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600">{error}</div>}
      {/* Profile Photo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden mb-2 flex items-center justify-center border border-gray-300">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          ) : (
            <HiUser className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <label>
          <span className="bg-[#bfa76a] text-white px-4 py-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-[#a58d4b] transition">
            Change Photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </span>
        </label>
      </div>
      {/* Name */}
      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full placeholder-gray-400"
          required
        />
      </div>
      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          placeholder="you@email.com"
          value={formData.email}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full placeholder-gray-400"
          required
        />
      </div>
      {/* Phone Number */}
      <div>
        <label className="block font-medium mb-1">Phone Number</label>
        <input
          name="phoneNumber"
          type="tel"
          placeholder="Your phone number"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full placeholder-gray-400"
        />
      </div>
      {/* Address */}
      <div>
        <label className="block font-medium mb-1">Address</label>
        <input
          name="address"
          type="text"
          placeholder="Your address"
          value={formData.address}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full placeholder-gray-400"
        />
      </div>
      {/* Bio */}
      <div>
        <label className="block font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          placeholder="Tell us about yourself"
          value={formData.bio}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full placeholder-gray-400"
        />
      </div>
      {/* Change Password */}
      <div>
        <label className="block font-medium mb-1">Change Password</label>
        <input
          name="password"
          type="password"
          placeholder="New password"
          value={formData.password}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full placeholder-gray-400"
        />
      </div>
      <button
        type="submit"
        className="w-fit px-12 py-3 bg-[#bfa76a] text-white rounded-full font-semibold tracking-wide text-lg hover:bg-[#a58d4b] transition"
        disabled={saving || loading}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
