"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Ensure AuthController.getToken() reads from localStorage
type AuthControllerType = {
  getToken: () => string | null;
};

const AuthController: AuthControllerType = {
  getToken: () => {
    return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }
};

const API_BASE_URL = "https://mad-adriane-dhanapersonal-9be85724.koyeb.app";

const VendorDashboard = () => {
  // Debug: Show token in localStorage at dashboard mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
    }
  }, []);
  const router = useRouter();

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

  const [businessSettings, setBusinessSettings] = useState<any>(null);
  const [businessSettingsLoading, setBusinessSettingsLoading] = useState(true);
  const [businessSettingsError, setBusinessSettingsError] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Fetch vendor business settings
  useEffect(() => {
    const fetchBusinessSettings = async () => {
      setBusinessSettingsLoading(true);
      setBusinessSettingsError(null);
      try {
        let token = localStorage.getItem('authToken');
        let res = await fetch(`${API_BASE_URL}/vendor/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        // If unauthorized or signature error, try refresh
        if (res.status === 401 || res.status === 422) {
          const refreshedToken = await refreshToken();
          if (!refreshedToken) {
            router.push("/login");
            return;
          }
          token = refreshedToken;
          res = await fetch(`${API_BASE_URL}/vendor/profile`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        }
        if (!res.ok) throw new Error("Failed to fetch business settings");
        const data = await res.json();
        setBusinessSettings(data);
      } catch (err: any) {
        setBusinessSettingsError(err.message || "Error fetching business settings");
      } finally {
        setBusinessSettingsLoading(false);
      }
    };
    fetchBusinessSettings();
  }, []);

  // Fetch vendor products
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        let token = localStorage.getItem('authToken');
        let res = await fetch(`${API_BASE_URL}/vendor/products`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        // If unauthorized or signature error, try refresh
        if (res.status === 401 || res.status === 422) {
          const refreshedToken = await refreshToken();
          if (!refreshedToken) {
            router.push("/login");
            return;
          }
          token = refreshedToken;
          res = await fetch(`${API_BASE_URL}/vendor/products`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        }
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err: any) {
        setProductsError(err.message || "Error fetching products");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState<'dashboard' | 'profile' | 'products'>('dashboard');
  // Profile edit state
  const [editProfile, setEditProfile] = useState(false);
  const [businessSettingsForm, setBusinessSettingsForm] = useState<any>(null);
  // Product modals
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState<any>({ name: '', price: '', stock: '' });

  // Sync business settings form with business settings data
  useEffect(() => { if (businessSettings) setBusinessSettingsForm(businessSettings); }, [businessSettings]);

  // Handlers for business settings form
  const handleBusinessSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessSettingsForm({ ...businessSettingsForm, [e.target.name]: e.target.value });
  };
  const handleBusinessSettingsSave = async () => {
    // TODO: Implement API call to update business settings
    setEditProfile(false);
  };

  // Handlers for product form
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to add or update product
    setShowProductForm(false);
    setEditProduct(null);
    setProductForm({ name: '', price: '', stock: '' });
  };
  const handleEditProduct = (product: any) => {
    setEditProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };
  const handleDeleteProduct = (id: any) => {
    // TODO: Implement API call to delete product
    alert(`Delete product ${id}`);
  };
  const handleAddProduct = () => {
    setEditProduct(null);
    setProductForm({ name: '', price: '', stock: '' });
    setShowProductForm(true);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f6f3ea] p-6 border-r border-[#e8d8b9] flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-8 text-[#bfa76a]">Vendor</h2>
        <nav className="flex flex-col gap-2">
          <button className={`text-left px-3 py-2 rounded ${activeSection === 'dashboard' ? 'bg-[#e8d8b9] font-bold' : 'hover:bg-[#f0e9d6]'}`} onClick={() => setActiveSection('dashboard')}>Dashboard</button>
          <button className={`text-left px-3 py-2 rounded ${activeSection === 'profile' ? 'bg-[#e8d8b9] font-bold' : 'hover:bg-[#f0e9d6]'}`} onClick={() => setActiveSection('profile')}>Profile</button>
          <button className={`text-left px-3 py-2 rounded ${activeSection === 'products' ? 'bg-[#e8d8b9] font-bold' : 'hover:bg-[#f0e9d6]'}`} onClick={() => setActiveSection('products')}>Products</button>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Vendor Dashboard</h1>
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#bfa76a]">Welcome, Vendor!</h2>
            <p className="text-gray-700">Use the sidebar to manage your profile and products.</p>
          </div>
        )}
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#bfa76a] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Vendor Profile
              </h2>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Active Account
              </div>
            </div>

            {businessSettingsLoading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-md">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-[#bfa76a] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#bfa76a] font-medium">Loading profile data...</p>
                </div>
              </div>
            ) : businessSettingsError ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-lg">Error Loading Profile</h3>
                    <p>{businessSettingsError}</p>
                  </div>
                </div>
              </div>
            ) : businessSettings && businessSettingsForm ? (
              <div>
                {!editProfile ? (
                  <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#f0e9d6]">
                      <div className="bg-gradient-to-r from-[#bfa76a] to-[#e8d8b9] h-24 relative"></div>
                      <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10">
                          <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-lg">
                            {businessSettings.logo_url ? (
                              <img 
                                src={businessSettings.logo_url} 
                                alt="Business Logo"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#bfa76a] to-[#e8d8b9] flex items-center justify-center text-3xl font-bold text-white">
                                {businessSettings.business_name ? businessSettings.business_name[0].toUpperCase() : 'V'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800">{businessSettings.business_name || 'Your Business'}</h3>
                            <p className="text-gray-600">{businessSettings.tagline || 'Quality products and services'}</p>
                          </div>
                          <div>
                            {(() => {
                              const status = (businessSettings.status || '').toLowerCase();
                              let color = 'bg-gray-400';
                              let label = businessSettings.status || 'Unknown';
                              
                              if (status === 'active') color = 'bg-emerald-500';
                              else if (status === 'pending') color = 'bg-amber-400';
                              else if (status === 'rejected') color = 'bg-rose-500';
                              
                              return (
                                <span className={`inline-block px-4 py-1 rounded-full text-white font-medium text-sm ${color}`}>
                                  {label}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div className="bg-white rounded-xl shadow-md p-6 border border-[#f0e9d6]">
                        <h3 className="text-lg font-semibold text-[#bfa76a] mb-4 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Contact Person</p>
                              <p className="font-medium">{businessSettings.owner_name || businessSettings.name || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="font-medium">{businessSettings.email || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="font-medium">{businessSettings.phone || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Address</p>
                              <p className="font-medium">{businessSettings.address || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Business Information */}
                      <div className="bg-white rounded-xl shadow-md p-6 border border-[#f0e9d6]">
                        <h3 className="text-lg font-semibold text-[#bfa76a] mb-4 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Business Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Business Type</p>
                              <p className="font-medium">{businessSettings.business_type || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Registration Number</p>
                              <p className="font-medium">{businessSettings.registration_number || 'Not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Registered Since</p>
                              <p className="font-medium">{businessSettings.created_at ? new Date(businessSettings.created_at).toLocaleDateString() : 'Not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Website</p>
                              <p className="font-medium">{businessSettings.website || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button 
                        className="px-5 py-2.5 bg-gradient-to-r from-[#bfa76a] to-[#e8d8b9] text-white font-medium rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2"
                        onClick={() => setEditProfile(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-[#f6f3ea] to-[#efe3c7] p-8 rounded-2xl shadow-xl border border-[#f0e9d6]" onSubmit={e => { e.preventDefault(); handleBusinessSettingsSave(); }}>
                    {Object.entries(businessSettingsForm).map(([key, value]) => {
  // String/number fields
  if (typeof value === 'string' || typeof value === 'number' || value === undefined) {
    return (
      <div key={key} className="flex flex-col gap-1 bg-white/80 rounded-xl shadow-sm p-4 border border-[#e8d8b9] hover:shadow-md transition-shadow">
        <label className="block text-[#bfa76a] capitalize font-semibold mb-1 tracking-wide">{key.replace(/_/g, ' ')}:</label>
        <input
          className="w-full border-2 border-[#e8d8b9] focus:border-[#bfa76a] px-3 py-2 rounded-lg outline-none bg-white/90 text-gray-800 placeholder-gray-400 transition-all duration-200"
          name={key}
          value={value ?? ''}
          onChange={handleBusinessSettingsChange}
          placeholder={`Enter ${key.replace(/_/g, ' ')}`}
        />
      </div>
    );
  }
  // Array fields
  if (Array.isArray(value)) {
    return (
      <div key={key}>
        <label className="block text-gray-700 capitalize mb-1">{key.replace(/_/g, ' ')}:</label>
        {value.map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-1">
            <input
              className="w-full border px-2 py-1 rounded"
              name={`${key}.${idx}`}
              value={item ?? ''}
              onChange={e => {
                const arr = [...value];
                arr[idx] = e.target.value;
                setBusinessSettingsForm({ ...businessSettingsForm, [key]: arr });
              }}
            />
            <button
              type="button"
              className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-400 text-white rounded shadow hover:from-red-600 hover:to-pink-500 transition-colors flex items-center gap-1"
              onClick={() => {
                const arr = value.filter((_: any, i: number) => i !== idx);
                setBusinessSettingsForm({ ...businessSettingsForm, [key]: arr });
              }}
            >
              🗑 Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="px-2 py-1 bg-gradient-to-r from-green-500 to-lime-400 text-white rounded shadow hover:from-green-600 hover:to-lime-500 transition-colors flex items-center gap-1"
          onClick={() => setBusinessSettingsForm({ ...businessSettingsForm, [key]: [...value, ''] })}
        >
          ➕ Add
        </button>
      </div>
    );
  }
  // Object fields (nested)
  if (typeof value === 'object' && value !== null) {
    return (
      <fieldset key={key} className="border-2 border-[#e8d8b9] rounded-xl p-4 mb-2 bg-white/80 shadow-sm">
        <legend className="text-[#bfa76a] font-semibold capitalize px-2">{key.replace(/_/g, ' ')}</legend>
        {Object.entries(value).map(([subKey, subValue]) => (
          (typeof subValue === 'string' || typeof subValue === 'number' || subValue === undefined) ? (
            <div key={subKey}>
              <label className="block text-gray-700 capitalize mb-1">{subKey.replace(/_/g, ' ')}:</label>
              <input
                className="w-full border-2 border-[#e8d8b9] focus:border-[#bfa76a] px-3 py-2 rounded-lg outline-none bg-white/90 text-gray-800 placeholder-gray-400 transition-all duration-200"
                name={`${key}.${subKey}`}
                value={subValue ?? ''}
                onChange={e => {
                  setBusinessSettingsForm({
                    ...businessSettingsForm,
                    [key]: { ...value, [subKey]: e.target.value }
                  });
                }}
                placeholder={`Enter ${subKey.replace(/_/g, ' ')}`}
              />
            </div>
          ) : null
        ))}
      </fieldset>
    );
  }
  return null;
})}
              <div className="col-span-2 flex gap-4 mt-6 justify-end">
                      <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#bfa76a] to-[#e8d8b9] text-white font-semibold rounded-xl shadow hover:from-[#a68d4c] hover:to-[#d6c28a] transition-colors">
                        <span>💾</span> Save
                      </button>
                      <button type="button" className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 font-semibold rounded-xl shadow hover:from-gray-400 hover:to-gray-300 transition-colors" onClick={() => setEditProfile(false)}>
                        <span>✖️</span> Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : null}
          </div>
        )}
        {/* Products Section */}
        {activeSection === 'products' && (
          <section className="bg-white rounded-lg shadow p-6 border border-[#f0e9d6]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#bfa76a]">Products</h2>
              <button className="px-4 py-2 bg-[#bfa76a] text-white rounded" onClick={handleAddProduct}>Add Product</button>
            </div>
            {productsLoading ? (
              <div>Loading products...</div>
            ) : productsError ? (
              <div className="text-red-600">{productsError}</div>
            ) : products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#f6f3ea]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {products.map((product: any) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                          <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleEditProduct(product)}>Edit</button>
                          <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No products found.</div>
            )}
            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
                  <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
                    <input className="border p-2 rounded" name="name" value={productForm.name} onChange={handleProductChange} placeholder="Product Name" required />
                    <input className="border p-2 rounded" name="price" value={productForm.price} onChange={handleProductChange} placeholder="Price" type="number" required />
                    <input className="border p-2 rounded" name="stock" value={productForm.stock} onChange={handleProductChange} placeholder="Stock" type="number" required />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="px-4 py-2 bg-[#bfa76a] text-white rounded">Save</button>
                      <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setShowProductForm(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;
