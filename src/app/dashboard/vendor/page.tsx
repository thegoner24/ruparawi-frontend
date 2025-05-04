"use client";
import React, { useState, useEffect } from "react";
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import { apiRequest, API_BASE_URL } from './apiClient';

// Mock data for Product Orders Table
interface MockOrder {
  id: string;
  product: string;
  customer: string;
  qty: number;
  total: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

const mockOrders: MockOrder[] = [
  {
    id: 'ORD-001',
    product: 'Eco Jacket',
    customer: 'Alice',
    qty: 2,
    total: 500000,
    date: '2025-05-01',
    status: 'Completed',
  },
  {
    id: 'ORD-002',
    product: 'Organic T-Shirt',
    customer: 'Bob',
    qty: 1,
    total: 200000,
    date: '2025-05-02',
    status: 'Pending',
  },
  {
    id: 'ORD-003',
    product: 'Recycled Bag',
    customer: 'Charlie',
    qty: 3,
    total: 450000,
    date: '2025-05-03',
    status: 'Cancelled',
  },
];

// --- Vendor Summary Cards ---
const VendorSummaryCards = () => {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(`${API_BASE_URL}/vendor/stats`, { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        if (isMounted) setStats(data.stats || data);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Error fetching stats');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 text-center border border-[#f0e9d6] animate-pulse">
            <div className="text-gray-400 text-sm mb-2">&nbsp;</div>
            <div className="text-2xl font-bold text-[#bfa76a] bg-gray-100 h-8 w-1/2 mx-auto rounded" />
          </div>
        ))}
      </div>
    );
    
  }
  if (error) {
    return <div className="text-red-500 mb-4">{error}</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6 text-center border border-[#f0e9d6]">
        <div className="text-gray-500 text-sm mb-2">Total Sales</div>
        <div className="text-2xl font-bold text-[#bfa76a]">{stats?.total_sales ?? '-'}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center border border-[#f0e9d6]">
        <div className="text-gray-500 text-sm mb-2">Total Orders</div>
        <div className="text-2xl font-bold text-[#bfa76a]">{stats?.total_orders ?? '-'}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center border border-[#f0e9d6]">
        <div className="text-gray-500 text-sm mb-2">Revenue</div>
        <div className="text-2xl font-bold text-[#bfa76a]">Rp {stats?.revenue ? stats.revenue.toLocaleString('id-ID') : '-'}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center border border-[#f0e9d6]">
        <div className="text-gray-500 text-sm mb-2">Top Product</div>
        <div className="text-2xl font-bold text-[#bfa76a]">{stats?.top_product ?? '-'}</div>
      </div>
    </div>
  );
}

// --- Vendor Analytics Hook ---
function useVendorAnalytics() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [months, setMonths] = React.useState<string[]>([]);
  const [revenueByMonth, setRevenueByMonth] = React.useState<number[]>([]);
  const [ordersByMonth, setOrdersByMonth] = React.useState<number[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(`${API_BASE_URL}/vendor/stats`, { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        const stats = data.stats || data;
        // monthly_orders: [{month: 202401, total_orders: 10}, ...]
        // monthly_revenue: [{month: 202401, total_revenue: 1000000}, ...]
        const orderMap = new Map<number, number>();
        const revenueMap = new Map<number, number>();
        if (Array.isArray(stats.monthly_orders)) {
          stats.monthly_orders.forEach((item: any) => {
            orderMap.set(item.month, item.total_orders || 0);
          });
        }
        if (Array.isArray(stats.monthly_revenue)) {
          stats.monthly_revenue.forEach((item: any) => {
            revenueMap.set(item.month, item.total_revenue || 0);
          });
        }
        // Get all months from both arrays, sort ascending
        const allMonths = Array.from(new Set([
          ...orderMap.keys(),
          ...revenueMap.keys()
        ])).sort();
        // Format months as 'MMM YYYY'
        const monthLabels = allMonths.map(m => {
          const y = Math.floor(m / 100);
          const mo = m % 100;
          const date = new Date(y, mo - 1);
          return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        });
        const orders = allMonths.map(m => orderMap.get(m) || 0);
        const revenue = allMonths.map(m => revenueMap.get(m) || 0);
        if (isMounted) {
          setMonths(monthLabels);
          setOrdersByMonth(orders);
          setRevenueByMonth(revenue);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Error fetching analytics');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);
  return { loading, error, months, revenueByMonth, ordersByMonth };
}

function VendorAnalyticsCharts() {
  const { loading, error, months, revenueByMonth, ordersByMonth } = useVendorAnalytics();
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-[250px] animate-pulse" />
        ))}
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 mb-4">{error}</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <RevenueLineChart months={months} revenueByMonth={revenueByMonth} />
      </div>
      <div>
        <OrdersBarChart months={months} ordersByMonth={ordersByMonth} />
      </div>
    </div>
  );
}

// --- Analytics Chart Components ---
function RevenueLineChart({ months, revenueByMonth }: { months?: string[]; revenueByMonth?: number[] }) {
  if (!Array.isArray(months) || !months.length || !Array.isArray(revenueByMonth) || !revenueByMonth.length) {
    return (
      <div className="flex items-center justify-center h-[220px] text-gray-400 bg-gray-50 rounded-lg border border-gray-100">
        No revenue data available.
      </div>
    );
  }
  return (
    <LineChart
      height={220}
      series={[{ data: revenueByMonth, label: 'Revenue', color: '#bfa76a' }]}
      xAxis={[{ scaleType: 'point', data: months }]}
      margin={{ left: 60, right: 20, top: 20, bottom: 20 }}
    />
  );
}

function OrdersBarChart({ months, ordersByMonth }: { months?: string[]; ordersByMonth?: number[] }) {
  if (!Array.isArray(months) || !months.length || !Array.isArray(ordersByMonth) || !ordersByMonth.length) {
    return (
      <div className="flex items-center justify-center h-[220px] text-gray-400 bg-gray-50 rounded-lg border border-gray-100">
        No orders data available.
      </div>
    );
  }
  return (
    <BarChart
      height={220}
      series={[{ data: ordersByMonth, label: 'Orders', color: '#bfa76a' }]}
      xAxis={[{ scaleType: 'band', data: months }]}
      margin={{ left: 60, right: 20, top: 20, bottom: 20 }}
    />
  );
}

const ProductPieChart = () => (
  <PieChart
    height={220}
    series={[
      {
        data: [
          { id: 0, value: 12, label: 'Jackets', color: '#bfa76a' },
          { id: 1, value: 8, label: 'Shirts', color: '#e0cba8' },
          { id: 2, value: 5, label: 'Accessories', color: '#f6f3ea' },
        ],
      },
    ]}
    margin={{ left: 60, right: 20, top: 20, bottom: 20 }}
  />
);

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


const VendorDashboard = () => {
  // Debug: Show token in localStorage at dashboard mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
    }
  }, []);
  const router = useRouter();

  
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

  // Product form state for add/edit
  const initialProductForm = {
    name: '',
    description: '',
    price: '',
    tags: '', // comma separated for UI, array for API
    sustainability_attributes: '', // comma separated for UI, array for API
    stock_quantity: '',
    min_order_quantity: '',
    primary_image_url: '',
    images: '', // comma separated for UI, array for API
  };
  // Only declare these ONCE in the component!
  const [productForm, setProductForm] = useState<any>(initialProductForm);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [productFormLoading, setProductFormLoading] = useState(false);

  const fetchBusinessSettings = async () => {
    setBusinessSettingsLoading(true);
    setBusinessSettingsError(null);
    try {
      const res = await apiRequest(`${API_BASE_URL}/vendor/profile`, { method: 'GET' });
      if (!res.ok) throw new Error("Failed to fetch business settings");
      const data = await res.json();
      setBusinessSettings(data.vendor);
    } catch (err: any) {
      setBusinessSettingsError(err.message || "Error fetching business settings");
    } finally {
      setBusinessSettingsLoading(false);
    }
  };
  useEffect(() => {
    fetchBusinessSettings();
  }, []);

  // Fetch vendor products
  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await apiRequest(`${API_BASE_URL}/vendor/products`, { method: 'GET' });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setProductsError(err.message || "Error fetching products");
    } finally {
      setProductsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState<'dashboard' | 'profile' | 'products'>('dashboard');
  // Profile edit state
  const [editProfile, setEditProfile] = useState(false);
  const [businessSettingsForm, setBusinessSettingsForm] = useState<any>(null);
  // Product modals
  // (Removed duplicate useState declarations for productForm, showProductForm, editProduct)

  // Sync business settings form with business settings data
  useEffect(() => { if (businessSettings) setBusinessSettingsForm(businessSettings); }, [businessSettings]);

  // Handlers for business settings form
  const handleBusinessSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBusinessSettingsForm({ ...businessSettingsForm, [e.target.name]: e.target.value });
  };
  const handleBusinessSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessSettingsLoading(true);
    setBusinessSettingsError(null);
    try {
      const res = await apiRequest(`${API_BASE_URL}/vendor/profile`, { method: 'PUT', body: JSON.stringify(businessSettingsForm) });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to update profile');
      }
      // Refetch profile data after update
      await fetchBusinessSettings();
      setEditProfile(false);
    } catch (err: any) {
      setBusinessSettingsError(err.message || 'Error updating profile');
    } finally {
      setBusinessSettingsLoading(false);
    }
  };

  // Handlers for product form
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError(null);
    setProductFormLoading(true);
    // Validate required fields
    const requiredFields = [
      'name', 'description', 'price', 'tags', 'sustainability_attributes',
      'stock_quantity', 'min_order_quantity', 'primary_image_url', 'images'
    ];
    for (const field of requiredFields) {
      if (!productForm[field] || productForm[field].toString().trim() === '') {
        setProductFormError('All fields are required.');
        setProductFormLoading(false);
        return;
      }
    }
    // Prepare API body
    const body = {
      name: productForm.name,
      description: productForm.description,
      price: parseInt(productForm.price, 10),
      tags: productForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      sustainability_attributes: productForm.sustainability_attributes.split(',').map((t: string) => t.trim()).filter(Boolean),
      stock_quantity: parseInt(productForm.stock_quantity, 10),
      min_order_quantity: parseInt(productForm.min_order_quantity, 10),
      primary_image_url: productForm.primary_image_url,
      images: productForm.images.split(',').map((t: string) => t.trim()).filter(Boolean),
    };
    try {
      let res;
      if (editProduct && editProduct.id) {
        // Editing: update existing product
        res = await apiRequest(`${API_BASE_URL}/products/${editProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(body)
        });
      } else {
        // Adding: create new product
        res = await apiRequest(`${API_BASE_URL}/products`, {
          method: 'POST',
          body: JSON.stringify(body)
        });
      }
      if (!res.ok) {
        const errorText = await res.text();
        setProductFormError(errorText || (editProduct ? 'Failed to update product' : 'Failed to add product'));
        setProductFormLoading(false);
        return;
      }
      await fetchProducts();
      setShowProductForm(false);
      setEditProduct(null);
      setProductForm(initialProductForm);
    } catch (err: any) {
      setProductFormError(err.message || (editProduct ? 'Error updating product' : 'Error adding product'));
    } finally {
      setProductFormLoading(false);
    }
  };
  const handleEditProduct = (product: any) => {
    setEditProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      sustainability_attributes: Array.isArray(product.sustainability_attributes) ? product.sustainability_attributes.join(', ') : '',
      stock_quantity: product.stock_quantity?.toString() || '',
      min_order_quantity: product.min_order_quantity?.toString() || '',
      primary_image_url: product.primary_image_url || '',
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
    });
    setShowProductForm(true);
    setProductFormError(null);
  };
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await apiRequest(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText || 'Failed to delete product');
        return;
      }
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };
  const handleAddProduct = () => {
    setEditProduct(null);
    setProductForm(initialProductForm);
    setShowProductForm(true);
    setProductFormError(null);
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
            {/* Summary Cards */}
            <VendorSummaryCards />
            {/* Analytics Section */}
            <section className="bg-white rounded-lg shadow p-6 border border-[#f0e9d6] mb-8">
              <h2 className="text-xl font-semibold text-[#bfa76a] mb-6">Analytics</h2>
              {/* MUI X Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Revenue Line Chart */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Revenue (Monthly)</h3>
                  {/* @ts-ignore */}
                  <RevenueLineChart />
                </div>
                {/* Orders Bar Chart */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Orders (Monthly)</h3>
                  {/* @ts-ignore */}
                  <OrdersBarChart />
                </div>
              </div>
              {/* Product Distribution Pie Chart */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-2">Product Distribution</h3>
                {/* @ts-ignore */}
                <ProductPieChart />
              </div>
            </section>

            {/* Product Orders Table */}
            <section className="bg-white rounded-lg shadow p-6 border border-[#f0e9d6] mb-8">
              <h2 className="text-xl font-semibold text-[#bfa76a] mb-6">Product Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#f6f3ea]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {mockOrders.map((order: MockOrder) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.qty}</td>
                        <td className="px-6 py-4 whitespace-nowrap">Rp {Number(order.total).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <h2 className="text-xl font-semibold mb-4 text-[#bfa76a]">Welcome, Vendor!</h2>
            <p className="text-gray-700">Use the sidebar to manage your profile and products.</p>
          </div>
        )}
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#bfa76a]">Profile</h2>
            <section className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 border border-[#f0e9d6]">
              {businessSettingsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <span className="loader border-4 border-[#bfa76a] border-t-transparent rounded-full w-8 h-8 animate-spin"></span>
                  <span className="ml-3 text-[#bfa76a]">Loading profile...</span>
                </div>
              ) : businessSettingsError ? (
                <div className="text-center text-red-500">{businessSettingsError}</div>
              ) : businessSettings ? (
                editProfile ? (
                  <form className="flex flex-col items-center w-full" onSubmit={handleBusinessSettingsSave}>
                    <div className="w-20 h-20 rounded-full bg-[#f6f3ea] flex items-center justify-center mb-4 overflow-hidden">
                      {businessSettingsForm?.business_logo_url ? (
                        <img src={businessSettingsForm.business_logo_url} alt="Business Logo" className="w-20 h-20 object-cover" />
                      ) : (
                        <svg className="w-10 h-10 text-[#bfa76a]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V19.5z" /></svg>
                      )}
                    </div>
                    <div className="w-full">
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Name</label>
                        <input type="text" name="business_name" value={businessSettingsForm?.business_name || ''} onChange={handleBusinessSettingsChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" required />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Email</label>
                        <input type="email" name="business_email" value={businessSettingsForm?.business_email || ''} onChange={handleBusinessSettingsChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" required />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Phone</label>
                        <input type="text" name="business_phone" value={businessSettingsForm?.business_phone || ''} onChange={handleBusinessSettingsChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" required />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Address</label>
                        <input type="text" name="business_address" value={businessSettingsForm?.business_address || ''} onChange={handleBusinessSettingsChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" required />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Description</label>
                        <textarea name="business_description" value={businessSettingsForm?.business_description || ''} onChange={handleBusinessSettingsChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" required rows={3} />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Logo URL</label>
                        <input type="text" name="business_logo_url" value={businessSettingsForm?.business_logo_url || ''} onChange={handleBusinessSettingsChange} className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" required />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button type="submit" className="bg-[#bfa76a] text-white px-6 py-2 rounded shadow hover:bg-[#a48e53]">Save</button>
                      <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded shadow hover:bg-gray-300" onClick={() => setEditProfile(false)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-[#f6f3ea] flex items-center justify-center mb-4 overflow-hidden">
                      {businessSettings?.business_logo_url ? (
                        <img src={businessSettings.business_logo_url} alt="Business Logo" className="w-20 h-20 object-cover" />
                      ) : (
                        <svg className="w-10 h-10 text-[#bfa76a]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V19.5z" /></svg>
                      )}
                    </div>
                    <div className="w-full">
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Name</label>
                        <div className="text-lg font-semibold text-[#bfa76a]">{businessSettings.business_name || '-'}</div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Email</label>
                        <div className="text-base text-gray-700">{businessSettings.business_email || '-'}</div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Phone</label>
                        <div className="text-base text-gray-700">{businessSettings.business_phone || '-'}</div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Address</label>
                        <div className="text-base text-gray-700">{businessSettings.business_address || '-'}</div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Description</label>
                        <div className="text-base text-gray-700">{businessSettings.business_description || '-'}</div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-1">Business Logo URL</label>
                        <div className="text-base text-gray-700 break-all">{businessSettings.business_logo_url || '-'}</div>
                      </div>
                    </div>
                    <button className="mt-4 bg-[#bfa76a] text-white px-6 py-2 rounded shadow hover:bg-[#a48e53]" onClick={() => setEditProfile(true)}>Edit Profile</button>
                  </div>
                )
              ) : (
                <div className="text-center text-gray-500">No profile data available.</div>
              )}
            </section>
          </div>
        )}
        {/* Products Section */}
        {activeSection === 'products' && (
          <section className="bg-white rounded-lg shadow p-6 border border-[#f0e9d6]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-[#bfa76a]">Products</h2>
              <button className="px-6 py-2 bg-gradient-to-r from-[#bfa76a] to-[#e0cba8] text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-[#bfa76a]" onClick={handleAddProduct}>
                + Add Product
              </button>
            </div>
            {productsLoading ? (
              <div className="py-12 text-center text-gray-500">Loading products...</div>
            ) : productsError ? (
              <div className="text-red-600 py-8 text-center">{productsError}</div>
            ) : products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product: any) => {
                  const stock = Number(product.stock);
                  let stockStatus = 'In Stock';
                  let stockColor = 'bg-green-100 text-green-700';
                  if (stock === 0) {
                    stockStatus = 'Out of Stock';
                    stockColor = 'bg-red-100 text-red-700';
                  } else if (stock < 5) {
                    stockStatus = 'Low Stock';
                    stockColor = 'bg-yellow-100 text-yellow-800';
                  }
                  const isDeactive = product.is_active === false;
                  return (
                    <div
                      key={product.id}
                      className={`group rounded-2xl p-0 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-[#ede9dd] overflow-hidden flex flex-col ${isDeactive ? 'opacity-60 grayscale relative pointer-events-none' : ''}`}
                    >
                      <div className="relative w-full aspect-[4/5] min-h-[210px] flex items-end justify-center overflow-hidden bg-gradient-to-br from-[#f8f5f0] to-[#e7e2d1]">
                        {product.primary_image_url ? (
                          <img src={product.primary_image_url} alt={product.name} className="w-full h-full object-cover bg-gray-100 rounded-2xl" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-300 text-6xl">
                            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1M3 7v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7M3 7h18m-9 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 2c0 .943-.658 1.5-1.5 1.5S15 13.943 15 13c0-.943.658-1.5 1.5-1.5S18 12.057 18 13Z"/></svg>
                          </div>
                        )}
                        {isDeactive && (
                          <React.Fragment>
                            <span className="absolute top-2 right-2 px-2 py-1 rounded bg-red-400 text-white text-xs font-semibold z-10">Deactive</span>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex justify-center z-50 filter-none opacity-100">
                              <button
                                className="px-3 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold shadow hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                                style={{ pointerEvents: 'auto' }}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    const res = await apiRequest(`${API_BASE_URL}/products/${product.id}`, {
                                      method: 'PATCH',
                                      body: JSON.stringify({ is_active: true }),
                                    });
                                    if (!res.ok) {
                                      const errorText = await res.text();
                                      alert(errorText || 'Failed to reactivate product');
                                      return;
                                    }
                                    await fetchProducts();
                                  } catch (err: any) {
                                    alert(err.message || 'Error reactivating product');
                                  }
                                }}
                              >
                                Reactivate
                              </button>
                            </div>
                          </React.Fragment>
                        )}
                        {/* Floating edit/delete buttons */}
                        {!isDeactive && (
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button className="p-2 bg-white/80 rounded-full shadow hover:bg-[#f2e6c7]" title="Edit" onClick={() => handleEditProduct(product)}>
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" /></svg>
                            </button>
                            <button className="p-2 bg-white/80 rounded-full shadow hover:bg-[#f2e6c7]" title="Delete" onClick={() => handleDeleteProduct(product.id)}>
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-base text-gray-900 truncate" title={product.name}>{product.name}</h3>
                          {!isDeactive && <span className={`px-2 py-1 rounded text-xs font-medium ${stockColor}`}>{stockStatus}</span>}
                          {isDeactive && <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600 border border-gray-300">Deactive</span>}
                        </div>
                        {/* Images row */}
                        {Array.isArray(product.images) && product.images.length > 0 && (
                          <div className="flex items-center gap-2 overflow-x-auto py-2">
                            {product.images.map((img: string, idx: number) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Product image ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border border-[#ede9dd] mr-2 bg-gray-100"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                              />
                            ))}
                          </div>
                        )}
                        <div className="text-[#bfa76a] font-bold text-lg mb-1">{Number(product.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</div>
                        <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">No products found.</div>
            )}
            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#f0e9d6] animate-fadeIn">
                  <h3 className="text-xl font-bold mb-4 text-[#bfa76a]">{editProduct ? 'Edit Product' : 'Add Product'}</h3>
                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f9f7f3] p-2 rounded-xl">
  {/* Left column */}
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
  <label className="block text-gray-500 text-xs mb-1">Product Name</label>
  <input type="text" name="name" value={productForm.name} onChange={handleProductChange} required className="border border-[#e8d8b9] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white" placeholder="Product Name" />
</div>
    <div className="flex flex-col gap-1">
  <label className="block text-gray-500 text-xs mb-1">Description</label>
  <textarea name="description" value={productForm.description} onChange={handleProductChange} required rows={3} className="border border-[#e8d8b9] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white resize-none" placeholder="Description" />
</div>
    <div className="flex flex-col gap-4">
  <div className="relative">
    <label className="block text-gray-500 text-xs mb-1">Price</label>
    <div className="flex items-center relative">
      <span className="absolute left-3 text-[#bfa76a] font-bold">Rp</span>
      <input type="number" name="price" value={productForm.price} onChange={handleProductChange} min="0" required className="border border-[#e8d8b9] p-3 rounded-lg w-full pl-10 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white" placeholder="Price" />
    </div>
  </div>
  <div className="relative">
    <label className="block text-gray-500 text-xs mb-1">Stock</label>
    <div className="flex items-center relative">
      <span className="absolute left-3 text-[#bfa76a] font-bold">Qty</span>
      <input type="number" name="stock_quantity" value={productForm.stock_quantity} onChange={handleProductChange} min="0" required className="border border-[#e8d8b9] p-3 rounded-lg w-full pl-10 focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white" placeholder="Stock Quantity" />
    </div>
  </div>
</div>
    <div className="flex gap-2">
      <div className="flex flex-col gap-1 flex-1">
  <label className="block text-gray-500 text-xs mb-1">Min Order Qty</label>
  <input type="number" name="min_order_quantity" value={productForm.min_order_quantity} onChange={handleProductChange} min="1" required className="border border-[#e8d8b9] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white" placeholder="Min Order Quantity" />
</div>
    </div>
  </div>
  {/* Right column */}
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
  <label className="block text-gray-500 text-xs mb-1">Tags (comma separated)</label>
  <input type="text" name="tags" value={productForm.tags} onChange={handleProductChange} required className="border border-[#e8d8b9] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white" placeholder="Tags (comma separated)" />
</div>
    <div className="flex flex-col gap-1">
  <label className="block text-gray-500 text-xs mb-1">Sustainability Attributes</label>
  <input type="text" name="sustainability_attributes" value={productForm.sustainability_attributes} onChange={handleProductChange} required className="border border-[#e8d8b9] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white" placeholder="Sustainability Attributes (comma separated)" />
</div>
    {/* Primary Image Preview */}
    <div>
      <label className="block text-gray-500 text-xs mb-1">Primary Image URL</label>
      <div className="flex items-center gap-2">
        <input type="text" name="primary_image_url" value={productForm.primary_image_url} onChange={handleProductChange} required className="border border-[#e8d8b9] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white" placeholder="Primary Image URL" />
        {productForm.primary_image_url && (
          <img src={productForm.primary_image_url} alt="Primary" className="w-16 h-16 object-cover rounded-lg border border-[#ede9dd] bg-gray-100" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
        )}
      </div>
    </div>
    {/* Images array preview */}
    <div>
      <label className="block text-gray-500 text-xs mb-1">Images (comma separated URLs)</label>
      <input type="text" name="images" value={productForm.images} onChange={handleProductChange} required className="border border-[#e8d8b9] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#bfa76a] bg-white mb-2" placeholder="Images (comma separated URLs)" />
      <div className="flex items-center gap-2 overflow-x-auto">
        {productForm.images.split(',').map((img: string, idx: number) => img.trim() && (
          <div key={idx} className="relative group">
            <img src={img.trim()} alt={`Image ${idx+1}`} className="w-12 h-12 object-cover rounded border border-[#ede9dd] bg-gray-100" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
          </div>
        ))}
      </div>
    </div>
  </div>
  {/* Error and buttons full width */}
  <div className="md:col-span-2">
    {productFormError && <div className="text-red-600 text-sm text-center mb-2">{productFormError}</div>}
    <div className="flex gap-2 mt-2">
      <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-[#bfa76a] to-[#e0cba8] text-white rounded-lg font-semibold shadow hover:scale-105 transition-transform flex items-center justify-center disabled:opacity-60" disabled={productFormLoading}>
        {productFormLoading ? (
          <>
            <span className="loader border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin mr-2"></span>
            Saving...
          </>
        ) : (
          'Save'
        )}
      </button>
      <button type="button" className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors" onClick={() => setShowProductForm(false)}>Cancel</button>
    </div>
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
}


export default VendorDashboard;
