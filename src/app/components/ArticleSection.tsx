import React from "react";

interface Article {
  title: string;
  imageUrl: string;
  href?: string;
}

const articles: Article[] = [
  {
    title: "Cherishing the Little Things: Putri Sulistyowati’s Family Story",
    imageUrl: "/article1.jpg",
    href: "#",
  },
  {
    title: "Everyday Joys and Meaningful Choices: Titi Barcham’s Family Story",
    imageUrl: "/article2.jpg",
    href: "#",
  },
  {
    title: "Tradition Meets Modernity: Sari Dewi’s Inspiring Journey",
    imageUrl: "/article3.jpg",
    href: "#",
  },
  {
    title: "A Legacy of Love: The Ramadhani Family’s Story",
    imageUrl: "/article4.jpg",
    href: "#",
  },
];

export default function ArticleSection() {
  return (
    <section className="w-full bg-white min-h-screen flex items-stretch mt-16">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 min-h-screen h-screen">
        {/* Left: Title and button */}
        <div className="flex flex-col justify-center items-start px-8 md:px-24 py-8 h-full min-h-[320px] sticky top-0 bg-white z-10">
          <h2 className="text-4xl font-light mb-8 text-black">Latest Articles</h2>
          <a
            href="#"
            className="inline-flex bg-black text-white rounded-full px-2 py-2 font-semibold text-xs tracking-wide hover:bg-gray-900 transition"
          >
            VISIT THE BLOG
          </a>
        </div>
        {/* Right: Articles grid */}
        <div className="flex flex-col h-[28rem] overflow-y-auto">
          {articles.map((article, idx) => (
            <a
              key={idx}
              href={article.href}
              className="flex flex-col md:flex-row h-1/2 border-b border-l border-gray-200 group overflow-hidden min-h-[7rem]"
            >
              <div className="w-full md:w-2/5 h-48 md:h-full flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center px-6 py-6 bg-white w-full">
                <h3 className="text-lg md:text-xl font-semibold text-black mb-0 leading-snug">
                  {article.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
