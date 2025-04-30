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

  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Fetch vendor profile
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      try {
        let token = AuthController.getToken();
        console.log("[DEBUG] JWT being sent for profile:", token);
        let res = await fetch(`${API_BASE_URL}/vendor/profile`, {
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
          res = await fetch(`${API_BASE_URL}/vendor/profile`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        }
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setProfileError(err.message || "Error fetching profile");
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch vendor products
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        let token = AuthController.getToken();
        console.log("[DEBUG] JWT being sent for products:", token);
        let res = await fetch(`${API_BASE_URL}/vendor/products`, {
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
          res = await fetch(`${API_BASE_URL}/vendor/products`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Vendor Dashboard</h1>

      {/* Profile Section */}
      <section className="mb-12 bg-white rounded-lg shadow p-6 border border-[#f0e9d6]">
        <h2 className="text-xl font-semibold mb-4 text-[#bfa76a]">Profile</h2>
        {profileLoading ? (
          <div>Loading profile...</div>
        ) : profileError ? (
          <div className="text-red-600">{profileError}</div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profile).map(([key, value]) => (
              <div key={key}>
                <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</span>
                <span className="ml-2 text-gray-900">{String(value)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Products Section */}
      <section className="bg-white rounded-lg shadow p-6 border border-[#f0e9d6]">
        <h2 className="text-xl font-semibold mb-4 text-[#bfa76a]">Products</h2>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product: any) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No products found.</div>
        )}
      </section>
    </div>
  );
};

export default VendorDashboard;
