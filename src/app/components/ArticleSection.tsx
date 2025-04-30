import React from "react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  imageUrl: string;
}

const articles: Article[] = [
  {
    id: "1",
    title: "Cherishing the Little Things: Putri Sulistyowati’s Family Story",
    imageUrl: "https://images.unsplash.com/photo-1630929436231-91f4c6fe4884?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    title: "Everyday Joys and Meaningful Choices: Titi Barcham’s Family Story",
    imageUrl: "https://images.unsplash.com/photo-1695306441929-0082158cfc27?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    title: "Tradition Meets Modernity: Sari Dewi’s Inspiring Journey",
    imageUrl: "https://plus.unsplash.com/premium_photo-1733306529857-34bd61ff63b7?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "4",
    title: "A Legacy of Love: The Ramadhani Family’s Story",
    imageUrl: "https://images.unsplash.com/photo-1616125162686-770bf85622b9?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function ArticleSection() {
  return (
    <section className="w-full bg-white mt-16">
      <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-0">
        {/* Left: Title and button */}
        <div className="flex flex-col justify-center items-start px-6 py-12 md:px-16 lg:px-24 md:py-8 md:h-screen md:sticky md:top-0 bg-white z-10">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-black">Latest Articles</h2>
          <p className="text-gray-700 mb-8 max-w-md">
            Discover the stories behind our community of artisans and the sustainable practices that make Rupa Rawi special. Scroll to explore our featured articles.
          </p>
          <a
            href="#"
            className="inline-flex bg-black text-white rounded-full px-6 py-3 font-semibold text-sm tracking-wide hover:bg-gray-900 transition"
          >
            VISIT THE BLOG
          </a>
        </div>
        
        {/* Right: Articles grid */}
        <div className="grid grid-cols-1 gap-0 md:min-h-screen md:overflow-y-auto border-t md:border-t-0 border-gray-200 mt-8 md:mt-0">
          {/* First two articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:border-l md:border-gray-200">
            {articles.slice(0, 2).map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group overflow-hidden border-b border-gray-200 relative h-[400px] md:h-[450px] flex flex-col"
              >
                <div className="w-full h-[250px] md:h-[300px] overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center px-6 py-6 bg-white flex-grow">
                  <h3 className="text-lg font-semibold text-black mb-2 leading-snug group-hover:text-[#7C6A0A] transition-colors">
                    {article.title}
                  </h3>
                  <div className="text-sm text-gray-600">Read Article →</div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Remaining articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-gray-200">
            {articles.slice(2).map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group overflow-hidden border-b border-gray-200 relative h-[450px] flex flex-col"
              >
                <div className="w-full h-[300px] overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center px-6 py-6 bg-white flex-grow">
                  <h3 className="text-lg font-semibold text-black mb-2 leading-snug group-hover:text-[#7C6A0A] transition-colors">
                    {article.title}
                  </h3>
                  <div className="text-sm text-gray-600">Read Article →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
