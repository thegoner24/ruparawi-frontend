// Mock data for articles
export const articles = [
  {
    id: "1",
    title: "Welcome to the Platform",
    content: `This is your first article. You can edit, publish, or delete articles from the admin dashboard.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec urna nec urna dictum dictum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`,
    image: "/sample-article.jpg",
    author: "Admin",
    date: "2025-04-01",
  },
  {
    id: "2",
    title: "Vendor Tips & Tricks",
    content: `Here are some tips and tricks for vendors to succeed on the platform!\n\n- Keep your product listings up to date.\n- Respond to customer queries promptly.\n- Use high-quality images for your products.\n- Monitor your sales analytics to improve performance.`,
    image: "/sample-article2.jpg",
    author: "Admin",
    date: "2025-04-15",
  },
  {
    id: "3",
    title: "How to Get Verified as a Vendor",
    content: `Getting verified increases your trust and sales.\n\n1. Complete your profile with accurate business information.\n2. Submit required documents for verification.\n3. Wait for the admin team to review your application.\n4. Once verified, you will receive a badge on your profile.`,
    image: "/sample-article3.jpg",
    author: "Support Team",
    date: "2025-04-20",
  },
];

export function getArticleById(id: string) {
  return articles.find((a) => a.id === id) || null;
}
