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
    <section className="relative w-full min-h-screen h-screen flex items-center justify-start bg-gray-100 overflow-hidden">
      {/* Background image */}
      <img
        src="/hero.jpg"
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      {/* Overlay for text visibility */}
      <div className="absolute inset-0 bg-black/20 z-10" />
      {/* Top-left text block */}
      <div className="absolute top-16 left-8 md:top-20 md:left-16 z-20 flex flex-col items-start max-w-xl">
        <h2 className="text-white text-[2rem] md:text-[2.5rem] font-light mb-2 drop-shadow-xl leading-tight">
          Traditional Motifs,<br />
          <span className="font-semibold">Timeless</span> Elegance
        </h2>
        {/* Decorative squiggly lines can be added as SVG or left out for now */}
      </div>
      {/* Bottom-left button */}
      <a
        href={buttonHref}
        className="absolute left-8 bottom-12 md:left-16 md:bottom-16 z-20 border border-white text-white px-8 py-2 rounded-full text-lg font-normal bg-white/10 hover:bg-white hover:text-black transition-all duration-200 shadow-md backdrop-blur-sm"
        style={{ borderWidth: 2 }}
      >
        {buttonText}
      </a>
    </section>
  );
}
