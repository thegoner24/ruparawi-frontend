import { API_BASE_URL } from "@/app/controllers/authController";

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getCategories(token: string): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/products/category`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  if (data && data.data && Array.isArray(data.data.categories)) return data.data.categories;
return [];
}


// Public: GET /products/category
export async function getPublicCategories(): Promise<Partial<Category>[]> {
  const res = await fetch(`${API_BASE_URL}/products/category`);
  if (!res.ok) throw new Error('Failed to fetch public categories');
  const data = await res.json();
  if (data && data.data && Array.isArray(data.data.categories)) return data.data.categories;
return [];
}


export async function createCategory(category: Partial<Category>, token: string): Promise<Category> {

  const res = await fetch(`${API_BASE_URL}/admin/category`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return await res.json();
}

// Create a subcategory under a parent category
export async function createSubcategory(parentCategoryId: number, subcategory: Partial<Category>, token: string): Promise<Category> {
  const body = {
    ...subcategory,
    parent_category_id: parentCategoryId
  };
  const res = await fetch(`${API_BASE_URL}/admin/category`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to create subcategory');
  return await res.json();
}

export async function updateCategory(categoryId: number, category: Partial<Category>, token: string): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/admin/category/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return await res.json();
}


export async function deleteCategory(categoryId: number, token: string): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/admin/category/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return await res.json();
}

