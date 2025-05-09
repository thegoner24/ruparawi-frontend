import React from "react";

interface HighlightedProductProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonHref?: string;
      }

export default function HighlightedProduct({
  imageUrl,
  title,
  subtitle,
  buttonText = "Shop Now",
  buttonHref = "#",
}: HighlightedProductProps) {
  return (
    <section className="relative w-full min-h-screen h-screen flex items-center justify-start bg-gray-100 overflow-hidden group">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1444362408440-274ecb6fc730?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      {/* Overlay for text visibility with hover effect */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300 z-10" />
      {/* Centered text block */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <h2 className="text-white text-[2.2rem] md:text-[2.8rem] font-bold mb-4 drop-shadow-xl leading-tight text-center">
          Rupa Rawi Batik Parang Pattern
        </h2>
        <p className="mt-2 text-lg md:text-xl text-white/90 font-normal text-center max-w-2xl drop-shadow-xl">
          Discover the timeless beauty of Batik Parang, a symbol of resilience and continuity. Each piece in the Rupa Rawi collection is crafted to honor tradition while embracing modern elegance. Wear a story woven through generations.
        </p>
      </div>
    </section>
  );
}
