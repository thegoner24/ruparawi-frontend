import type { ApidogModel } from "./vendorStatsTypes";

import { API_BASE_URL } from "@/app/controllers/authController";

export async function fetchVendorStats(token: string): Promise<ApidogModel> {
  const res = await fetch(`${API_BASE_URL}/vendor/stats`, {
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include",
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Vendor stats fetch failed:", res.status, errorText);
    throw new Error("Failed to fetch vendor stats");
  }
  return res.json();
}

