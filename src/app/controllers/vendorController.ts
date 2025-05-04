import { API_BASE_URL } from "@/app/controllers/authController";

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: string;
  application_reason?: string;
  created_at?: string;
  [key: string]: any;
}

// Get all vendors
export async function getVendors(token: string): Promise<Vendor[]> {
  const res = await fetch(`${API_BASE_URL}/admin/vendors`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch vendors');
  const data = await res.json();
  // Handle grouped by status: { vendors: { approved: [...], pending: [...], rejected: [...] } }
  if (data && data.vendors && typeof data.vendors === 'object') {
    const all: Vendor[] = [];
    for (const status of Object.keys(data.vendors)) {
      const arr = data.vendors[status];
      if (Array.isArray(arr)) {
        all.push(...arr.map((v: any) => ({ ...v, status: status })));
      }
    }
    return all;
  }
  return [];
}


// Review a vendor application
export async function reviewVendorApplication(userId: number, review: { status: string; note?: string }, token: string): Promise<any> {
  // Map status to action
  let action = review.status;
  if (action === "approved") action = "approve";
  if (action === "rejected") action = "reject";
  const body: any = { action };
  if (review.note) body.note = review.note;
  const res = await fetch(`${API_BASE_URL}/admin/vendor/${userId}/review`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to review vendor application');
  return await res.json();
}
