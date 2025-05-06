"use client";
import React, { useEffect, useState } from "react";
import { fetchVendorStats } from "./vendorStatsApi";
import { OrderActivity, StoreStatistic } from "./VendorSummary";
import DateRangePicker from "@/app/components/ui/DateRangePicker";
import { VendorStats } from "./vendorStatsTypes";
import { useAuth } from "@/app/context/AuthContext";

export default function VendorDashboardPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const { token } = useAuth();
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("Not authenticated");
        const data = await fetchVendorStats(token);
        setStats(data.vendor_stats);
      } catch (e: any) {
        setError(e.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-[#b49a4d]">Vendor Dashboard</h1>
      <p className="mb-8">Welcome to the Vendor Dashboard. Use the sidebar to manage your profile, orders, and products.</p>
      {loading && <div className="py-12 text-center text-[#b49a4d]">Loading analytics...</div>}
      {error && (
        <div className="py-12 text-center text-red-500">
          {error.includes("Vendor not approved") || error.includes("403") ? (
            <>
              <div className="text-2xl font-bold mb-2">Vendor Not Approved</div>
              <div className="text-base">Your vendor account is not approved. Please contact support or wait for admin approval before accessing analytics.</div>
            </>
          ) : error}
        </div>
      )}
      {stats && (
        <>
          <OrderActivity stats={stats} />
          <StoreStatistic
            stats={stats}
            dateRange={dateRange}
            onDateChange={setDateRange}
          />
        </>
      )}
    </div>
  );
}

