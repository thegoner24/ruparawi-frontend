"use client";
import { useState } from "react";
import { HiUser, HiClipboardList, HiHeart, HiTrash } from "react-icons/hi";

export default function UserDashboardPage() {
  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState("profile");

  // Example user profile state (replace with real data/fetch as needed)
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    profileImage: null,
  });

  // Dummy order and wishlist data
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
  const requiredFields = ["fullName", "email", "phoneNumber", "address"];
  const optionalFields = ["profileImage", "businessType", "registrationNumber"];
  const completedRequired = requiredFields.filter((f) => profile[f as keyof typeof profile]).length;
  const completedOptional = optionalFields.filter((f) => profile[f as keyof typeof profile]).length;
  const completionPercentage = Math.round(
    ((completedRequired / requiredFields.length) * 0.7 +
      (completedOptional / optionalFields.length) * 0.3) *
      100
  );

  // Profile update handler
  const handleProfileUpdate = (updatedProfile: typeof profile) => {
    setProfile({ ...profile, ...updatedProfile });
    alert("Profile updated!");
  };

  // Wishlist actions
  const removeFromWishlist = (itemId: number) =>
    setWishlistItems((items) => items.filter((item) => item.id !== itemId));
  const addToCart = (item: typeof wishlistItems[0]) => {
    alert(`Added ${item.name} to cart!`);
    removeFromWishlist(item.id);
  };

  // Delete account handler
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
            {activeSection === "profile" && (
              <EditProfileForm
                profile={profile}
                onUpdate={handleProfileUpdate}
                completion={completionPercentage}
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
}: {
  profile: any;
  onUpdate: (data: any) => void;
  completion: number;
}) {
  const [formData, setFormData] = useState(profile);
  const [imagePreview, setImagePreview] = useState(profile.profileImage);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, profileImage: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
        <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-900 transition">
          Upload Photo
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="col-span-2">
          <label
            className="uppercase text-base tracking-wider text-gray-700 mb-1 block"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label
            className="uppercase text-base tracking-wider text-gray-700 mb-1 block"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
            required
          />
        </div>
        {/* Phone Number */}
        <div>
          <label
            className="uppercase text-base tracking-wider text-gray-700 mb-1 block"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
            required
          />
        </div>
        {/* Address */}
        <div className="col-span-2">
          <label
            className="uppercase text-base tracking-wider text-gray-700 mb-1 block"
            htmlFor="address"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
            required
          />
        </div>
        {/* Business Type */}
        <div>
          <label
            className="uppercase text-base tracking-wider text-gray-700 mb-1 block"
            htmlFor="businessType"
          >
            Business Type
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
          >
            <option value="">Select business type</option>
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Registration Number */}
        <div>
          <label
            className="uppercase text-base tracking-wider text-gray-700 mb-1 block"
            htmlFor="registrationNumber"
          >
            Registration Number
          </label>
          <input
            id="registrationNumber"
            name="registrationNumber"
            type="text"
            value={formData.registrationNumber || ""}
            onChange={handleChange}
            className="border border-gray-300 focus:border-black rounded-none px-6 py-4 w-full text-lg text-black bg-white outline-none transition"
          />
        </div>
      </div>
      <div className="mt-8">
        <button
          type="submit"
          className="w-fit px-12 py-3 bg-black text-white rounded-full font-semibold tracking-wide text-lg hover:bg-gray-900 transition"
        >
          SAVE CHANGES
        </button>
      </div>
    </form>
  );
}
