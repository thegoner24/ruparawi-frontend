import React from "react";

export default function CollaboratorStory() {
  return (
    <section className="w-full bg-white min-h-screen flex items-stretch">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch min-h-screen">
        {/* Left: Text Content */}
        <div className="px-8 md:px-16 py-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 leading-snug">
            Rupa Rawi<br />A Celebration of Art and Craftsmanship
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            Rupa Rawi, in collaboration with Eko Nugroho, presents a special exhibition exploring the intersection of <strong>fashion, art, and craftsmanship</strong>.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            Discover <strong>25 curated fashion and art pieces</strong>, first showcased at DFK 2024, now displayed in an intimate setting where every detail tells a story. This exhibition invites you to take a closer look at the designs, unravel their meaning, and appreciate the thoughtfulness behind each creation.
          </p>
          <ul className="text-base md:text-lg text-gray-700 mb-4 list-none">
            <li className="flex items-center mb-1"><span className="mr-2 text-pink-500">📍</span> <span>The Space, Plaza Indonesia – Level 2</span></li>
            <li className="flex items-center mb-1"><span className="mr-2 text-blue-500">📅</span> <span>February 20 – April 30, 2025</span></li>
            <li className="flex items-center mb-1"><span className="mr-2 text-red-500">⏰</span> <span>10:00 AM – 10:00 PM WIB</span></li>
          </ul>
          <p className="text-base md:text-lg text-gray-700 mb-8">
            Experience the dialogue between art and textiles—see, feel, and connect with each piece.
          </p>
          <a href="#" className="inline-block bg-black text-white rounded-full px-4 py-2 font-bold text-sm text-center shadow-md hover:bg-gray-900 transition">READ ARTICLE</a>
        </div>
        {/* Right: Image */}
        <div className="flex items-center justify-center bg-black h-full min-h-[400px]">
          <img src="/collab-story.jpg" alt="Collaborator Story" className="object-cover object-center w-full h-full max-h-[600px]" />
        </div>
      </div>
    </section>
  );
}
