import { API_BASE_URL } from "@/app/controllers/authController";

export interface Article {
  author_id: number;
  content: string;
  created_at: string;
  id: number;
  title: string;
  updated_at: string;
  [property: string]: any;
}

export interface ApidogModel {
  article: Article;
  message: string;
  success: boolean;
  [property: string]: any;
}


export async function fetchArticles() {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE_URL}/admin/article`, { headers });
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json(); // Returns ApidogModel
}

export async function fetchArticleById(articleId: number) {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE_URL}/admin/article/${articleId}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json(); // Returns ApidogModel
}


export async function createArticle(data: any) {
  const token = localStorage.getItem("authToken");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE_URL}/admin/article`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create article");
  return res.json(); // Returns ApidogModel
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
  return res.json(); // Returns ApidogModel
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
  return res.json(); // Returns ApidogModel
}
