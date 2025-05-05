import { API_BASE_URL } from "@/app/controllers/authController";

export interface ApidogModel {
  article: Article;
  message: string;
  success: boolean;
  [property: string]: any;
}

export interface Article {
  author_id: number;
  content: string;
  created_at: string;
  id: number;
  title: string;
  updated_at: string;
  [property: string]: any;
}

export async function fetchArticles() {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE_URL}/admin/article`, { headers });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function createArticle(data: any) {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
  console.log('Creating article with data:', data);
  const res = await fetch(`${API_BASE_URL}/admin/article`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let msg = "Failed to create article";
    try {
      const err = await res.json();
      console.error('Backend error response:', err);
      if (err && err.detail) msg += `: ${err.detail}`;
      else if (err && err.message) msg += `: ${err.message}`;
      else if (err && typeof err === "string") msg += `: ${err}`;
      else msg += ': Unknown backend error';
    } catch {
      msg += ': Unknown backend error';
    }
    throw new Error(msg);
  }
  return res.json();
// NOTE: If you continue to get 400 Bad Request, check your backend for required fields. Common required fields: title, content, author. Ensure all are provided and non-empty.
}

export async function updateArticle(articleId: number, data: any) {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE_URL}/admin/article/${articleId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Failed to update article");
  return res.json();
}

export async function deleteArticle(articleId: number) {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE_URL}/admin/article/${articleId}`,
    {
      method: "DELETE",
      headers,
    }
  );
  if (!res.ok) throw new Error("Failed to delete article");
  return res.json();
}
