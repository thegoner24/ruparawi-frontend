export const articles = [
  {
    id: "1",
    title: "Welcome to the Platform",
    excerpt: "This is your first article. You can edit, publish, or delete articles from the admin dashboard.",
    content: "...", // unchanged
    image: "/sample-article.jpg",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
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
    image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
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
    image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80",
    author: "Support Team",
    date: "2025-04-20",
    tags: ["Vendor", "Verification"],
  },
  {
    id: "4",
    title: "Rupa Rawi: Weaving Generations, Dreams, and Friendship",
    excerpt: "Discover the journey of Guntur Wirayuda and Ivan Wibisono as they build a brand that bridges generations and celebrates Indonesian creativity.",
    content: `
A Seed of a Dream

Every great story begins with a spark-a moment when dreams and reality intertwine. For Guntur Wirayuda, that spark was a vision to create something that transcended fashion: a brand that could speak to the heart of every Indonesian generation. Guntur didn’t just want to sell clothes; he wanted to celebrate the stories, diversity, and creative spirit that define Indonesia.

A Chance Encounter

In the midst of his journey, Guntur crossed paths with Ivan Wibisono-a friend whose passion for fashion matched his own, and whose expertise in marketing brought new possibilities to the table. Their friendship was more than a meeting of minds; it was a meeting of hearts, values, and ambitions.

Ivan’s background in marketing wasn’t just a skillset-it was a bridge. Together, they imagined a brand that could connect people from all walks of life, using storytelling and style as the threads that bind.

Building a Brand, Building a Family

What started as a simple idea soon grew into a movement. Guntur and Ivan poured their passion into Rupa Rawi, believing that fashion is not only about what you wear, but also about the stories you carry. They spent late nights sketching, dreaming, and discussing how each collection could reflect the hopes and heritage of Indonesia.

Their journey wasn’t always easy. There were moments of doubt, setbacks, and questions about the future. But what kept them going was their shared belief: that Rupa Rawi could become a home for creativity-a place where artisans, storytellers, and dreamers could come together.

More Than a Brand: A Platform for Stories

At the heart of Rupa Rawi is a simple promise: to honor the stories behind every product. Each piece is a collaboration-a tapestry woven from the hands of local artisans, the vision of its founders, and the dreams of its community.

Guntur and Ivan believe that every generation has a story worth telling. Through Rupa Rawi, they invite everyone-young and old, from every island and background-to join in the conversation, to wear their stories, and to pass them on.

Looking Forward

As Rupa Rawi continues to grow, Guntur and Ivan remain committed to their founding ideals: authenticity, inclusivity, and the celebration of Indonesian creativity. Their friendship is the brand’s compass, guiding every decision and inspiring those around them.

The journey is far from over. In fact, it’s just beginning. With each new collection, each new story, Rupa Rawi weaves another thread into the rich fabric of Indonesia’s future.

"We believe that fashion is not just about trends-it’s about identity, connection, and legacy. Through Rupa Rawi, we hope to inspire generations to come."
    `,
    image: "/your-image.jpg", // Replace with your actual image filename in /public
    author: "Perplexity AI",
    date: "2025-05-05",
    tags: ["Founders", "Brand Story", "Fashion"],
  },
];

export function getArticleById(id) {
  return articles.find((a) => a.id === id) || null;
}
