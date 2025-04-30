export const articles = [
  {
    id: "1",
    title: "Welcome to the Platform",
    excerpt: "This is your first article. You can edit, publish, or delete articles from the admin dashboard.",
    content: "...", // unchanged
    image: "/sample-article.jpg",
    author: "Admin",
    date: "2025-04-01",
    tags: ["Platform", "Welcome"],
  },
  {
    id: "2",
    title: "Vendor Tips & Tricks",
    excerpt: "Here are some tips and tricks for vendors to succeed on the platform!",
    content: "...", // unchanged
    image: "/sample-article2.jpg",
    author: "Admin",
    date: "2025-04-15",
    tags: ["Vendor", "Tips"],
  },
  {
    id: "3",
    title: "How to Get Verified as a Vendor",
    excerpt: "Getting verified increases your trust and sales.",
    content: "...", // unchanged
    image: "/sample-article3.jpg",
    author: "Support Team",
    date: "2025-04-20",
    tags: ["Vendor", "Verification"],
  },
];

export function getArticleById(id: string) {
  return articles.find((a) => a.id === id) || null;
}
