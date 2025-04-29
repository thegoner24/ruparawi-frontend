"use client";
import { useEffect, useState } from "react";
import { HiUser, HiClipboardList, HiHeart, HiTrash } from "react-icons/hi";

// --- MAIN DASHBOARD PAGE ---
export default function UserDashboardPage() {
  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState("profile");

  // Mock profile state (no backend, no token required)
  const [profile, setProfile] = useState<any>({
    first_name: "Jane",
    last_name: "Doe",
    bio: "Fashion enthusiast. Love traditional fabrics!",
    profile_image_url: "/images/profile-default.jpg",
    email: "janedoe@example.com"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dummy order and wishlist data (not connected to backend)
  const orders = [
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
  const [wishlistItems, setWishlistItems] = useState([
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



  // Profile completion calculation
  const requiredFields = ["first_name", "last_name", "bio"];
  const optionalFields = ["profile_image_url"];
  const completedRequired = requiredFields.filter((f) => profile?.[f]).length;
  const completedOptional = optionalFields.filter((f) => profile?.[f]).length;
  const completionPercentage = Math.round(
    ((completedRequired / requiredFields.length) * 0.7 +
      (optionalFields.length
        ? (completedOptional / optionalFields.length) * 0.3
        : 0)) *
      100
  );

  // Profile update handler (mock, no API)
  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile);
    alert("Profile updated!");
  };


  // Wishlist actions
  const removeFromWishlist = (itemId: number) =>
    setWishlistItems((items) => items.filter((item) => item.id !== itemId));
  const addToCart = (item: typeof wishlistItems[0]) => {
    alert(`Added ${item.name} to cart!`);
    removeFromWishlist(item.id);
  };

  // Delete account handler (not connected to backend)
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Account deleted (demo only).");
    }
  };

  // Sidebar menu
  const menu = [
    { id: "profile", label: "Edit Profile", icon: HiUser },
    { id: "orders", label: "Order History", icon: HiClipboardList },
    { id: "wishlist", label: "Wishlist", icon: HiHeart },
    { id: "delete", label: "Delete Account", icon: HiTrash },
  ];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex gap-8">
        {/* Sidebar */}
        <aside
          className="
            w-72
            bg-white
            rounded-2xl
            border
            border-gray-300
            p-6
            flex flex-col
            gap-2
            transition
            duration-300
            ease-in-out
          "
        >
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
                      : "text-gray-700 hover:bg-gray-200"
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
                completion={completionPercentage}
                loading={loading}
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
                    <a
                      href="/shop"
                      className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
                    >
                      CONTINUE SHOPPING
                    </a>
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
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-[200px] object-cover"
                              />
                            ) : (
                              <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
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
function EditProfileForm({
  profile,
  onUpdate,
  completion,
  loading,
}: {
  profile: any;
  onUpdate: (data: any) => void;
  completion: number;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    profile_image_url: profile.profile_image_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    // No API call, just update local state
    onUpdate({ ...profile, ...formData });
    alert("Profile updated!");
    setSaving(false);
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600">{error}</div>}
      {/* Profile Completion */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">
          Profile Completion: {completion}%
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-black h-2.5 rounded-full"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>
      {/* Profile Image URL */}
      <div>
        <label className="block font-medium mb-1">Profile Image URL</label>
        <input
          name="profile_image_url"
          value={formData.profile_image_url}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full"
        />
        {formData.profile_image_url && (
          <img
            src={formData.profile_image_url}
            alt="Profile"
            className="h-16 w-16 rounded-full object-cover mt-2"
          />
        )}
      </div>
      {/* First Name */}
      <div>
        <label className="block font-medium mb-1">First Name</label>
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full"
          required
        />
      </div>
      {/* Last Name */}
      <div>
        <label className="block font-medium mb-1">Last Name</label>
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full"
          required
        />
      </div>
      {/* Bio */}
      <div>
        <label className="block font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="w-fit px-12 py-3 bg-black text-white rounded-full font-semibold tracking-wide text-lg hover:bg-gray-900 transition"
        disabled={saving || loading}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
