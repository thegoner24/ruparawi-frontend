"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/controllers/authController";

export default function VendorApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    business_address: "",
    business_description: "",
    business_logo_url: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // Remove business_logo_url if empty
      const { business_logo_url, ...rest } = form;
      const payload = business_logo_url ? { ...rest, business_logo_url } : rest;
      const res = await fetch(`${API_BASE_URL}/vendor/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${localStorage.getItem('authToken')}`},
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit application");
      }
      setSuccess("Your vendor application has been submitted! We will contact you soon.");
      setForm({
        business_name: "",
        business_email: "",
        business_phone: "",
        business_address: "",
        business_description: "",
        business_logo_url: ""
      });
      // Redirect to landing page after a brief delay
      setTimeout(() => {
        router.push("/");
      }, 1800);
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7ef] py-16 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-3xl font-extrabold text-[#d4b572] mb-6 text-center">Apply as a Vendor</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Business Name</label>
            <input
              type="text"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              required
              className="w-full border border-[#f5e6b2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
              placeholder="Your business name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Business Email</label>
            <input
              type="email"
              name="business_email"
              value={form.business_email}
              onChange={handleChange}
              required
              className="w-full border border-[#f5e6b2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
              placeholder="Contact email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Business Phone</label>
            <input
              type="tel"
              name="business_phone"
              value={form.business_phone}
              onChange={handleChange}
              required
              className="w-full border border-[#f5e6b2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
              placeholder="Contact phone"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Business Address</label>
            <input
              type="text"
              name="business_address"
              value={form.business_address}
              onChange={handleChange}
              required
              className="w-full border border-[#f5e6b2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
              placeholder="Business address"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Business Description</label>
            <textarea
              name="business_description"
              value={form.business_description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-[#f5e6b2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
              placeholder="Tell us about your business, products, or motivation..."
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Business Logo URL <span className="text-xs text-gray-400">(optional)</span></label>
            <input
              type="url"
              name="business_logo_url"
              value={form.business_logo_url}
              onChange={handleChange}
              className="w-full border border-[#f5e6b2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4b572]"
              placeholder="https://your-logo-url.com/logo.png"
            />
          </div>
          {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
          {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#d4b572] hover:bg-[#fff7e0] text-white font-bold py-3 px-6 rounded-lg transition-all duration-150 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Apply Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
