// apiClient.ts
// Centralized API request wrapper with automatic token refresh for vendor dashboard

const API_BASE_URL = "https://mad-adriane-dhanapersonal-9be85724.koyeb.app";

// Helper to refresh JWT
async function refreshToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
}

// Main API request wrapper
export async function apiRequest(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> {
  let token = localStorage.getItem("authToken");
  console.log("[apiRequest] Token:", token);
  const headers = {
    ...(init.headers || {}),
    "Authorization": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
  console.log("[apiRequest] Authorization Header:", headers["Authorization"]);
  let res = await fetch(input, { ...init, headers, credentials: "include" });
  if ((res.status === 401 || res.status === 422) && retry) {
    const newToken = await refreshToken();
    if (!newToken) {
      // Could not refresh, force logout
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }
    // Retry original request with new token
    const retryHeaders = {
      ...headers,
      "Authorization": `Bearer ${newToken}`,
    };
    res = await fetch(input, { ...init, headers: retryHeaders, credentials: "include" });
  }
  return res;
}

export { refreshToken, API_BASE_URL };
