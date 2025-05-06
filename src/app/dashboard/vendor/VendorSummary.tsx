import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { VendorStats } from "./vendorStatsTypes";

import { FaMoneyBillWave, FaShoppingCart, FaClipboardList, FaUsers } from "react-icons/fa";

export function OrderActivity({ stats }: { stats: VendorStats }) {
  const summary = [
    {
      icon: <FaMoneyBillWave className="text-2xl" />, label: "Total Revenue", value: `Rp ${Number(stats.total_revenue).toLocaleString()}`,
      bg: "bg-yellow-100", text: "text-yellow-700", iconBg: "text-yellow-200", labelText: "text-yellow-700 font-bold"
    },
    {
      icon: <FaShoppingCart className="text-2xl" />, label: "Total Sales", value: stats.total_sales,
      bg: "bg-gray-50", text: "text-gray-700", iconBg: "text-gray-200", labelText: "text-gray-700 font-bold"
    },
    {
      icon: <FaClipboardList className="text-2xl" />, label: "Total Orders", value: stats.total_orders,
      bg: "bg-yellow-100", text: "text-yellow-700", iconBg: "text-yellow-200", labelText: "text-yellow-700 font-bold"
    },
    {
      icon: <FaUsers className="text-2xl" />, label: "Total Customers", value: stats.total_customers,
      bg: "bg-gray-50", text: "text-gray-700", iconBg: "text-gray-200", labelText: "text-gray-700 font-bold"
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {summary.map((item, idx) => (
        <div
          key={item.label}
          className="bg-white rounded-xl p-5 shadow flex flex-col items-center gap-2 border border-gray-100 min-w-[170px]"
        >
          <div className="text-2xl mb-1">{item.icon}</div>
          <div className="text-gray-500 text-sm mb-2 text-center font-semibold">{item.label}</div>
          <div className="text-2xl font-bold text-gray-800 mb-0 text-center">{item.value}</div>
        </div>
      ))}
    </div>
  );
}



import DateRangePicker from "@/app/components/ui/DateRangePicker";

export function StoreStatistic({ stats, dateRange, onDateChange }: { stats: VendorStats, dateRange: { from: Date | undefined; to: Date | undefined }, onDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void }) {
  // Mock percent changes and prior period data for demo
  const percentChange = {
    revenue: 25.56,
    viewed: -10.89,
    sold: 15.24,
  };
  const statCards = [
    {
      label: "Sales Potential",
      value: `RP${Number(stats.total_revenue).toLocaleString()}`,
      change: percentChange.revenue,
      positive: percentChange.revenue > 0,
    },
    {
      label: "Products viewed",
      value: "12,934", // Mock value
      change: percentChange.viewed,
      positive: percentChange.viewed > 0,
    },
    {
      label: "Product sold",
      value: stats.total_sales,
      change: percentChange.sold,
      positive: percentChange.sold > 0,
    },
  ];
  // Mock chart data
  const chartData = Array.from({ length: 10 }).map((_, i) => ({
    date: `Nov ${13 + i}`,
    current: 20000000 + i * 2000000 + (i % 2 === 0 ? 4000000 : 0),
    prior: 15000000 + i * 1000000,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="text-xl font-bold text-gray-800 mb-1">Store Statistic</div>
          <div className="text-gray-400 text-sm">Statistics for your store performance</div>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={onDateChange} />
          <button className="ml-2 px-4 py-2 bg-[#b49a4d] text-white rounded-lg font-semibold shadow hover:bg-yellow-700 transition">
            Download report
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={card.label} className="bg-gray-50 rounded-xl p-5 shadow flex flex-col gap-2 border border-gray-100">
            <div className="text-2xl font-bold text-gray-800">{card.value}</div>
            <div className="text-gray-500 text-sm">{card.label}</div>
            <div className={`text-sm font-semibold flex items-center gap-1 ${card.positive ? "text-green-600" : "text-red-500"}`}>
              {card.positive ? (
                <span>▲</span>
              ) : (
                <span>▼</span>
              )}
              {Math.abs(card.change)}% {card.positive ? <span className="ml-1">from last 7 days</span> : <span className="ml-1">from last 7 days</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-gray-700">Sales Trend</div>
          <div className="flex gap-2 items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-[#4f8cff] inline-block" /> This period
            <span className="w-3 h-3 rounded-full bg-[#b49a4d] inline-block ml-4" /> Prior period
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#bdbdbd" }} />
            <YAxis tickFormatter={v => `Rp${(v / 1e6).toFixed(0)}jt`} tick={{ fontSize: 12, fill: "#bdbdbd" }} />
            <Tooltip formatter={(v: number) => `Rp${Number(v).toLocaleString()}`} />
            <Bar dataKey="current" fill="#4f8cff" radius={[4, 4, 0, 0]} barSize={18} />
            <Bar dataKey="prior" fill="#b49a4d" radius={[4, 4, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

