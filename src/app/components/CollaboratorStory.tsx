import React from "react";

export default function CollaboratorStory() {
  return (
    <section className="w-full bg-white min-h-screen flex items-stretch">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch min-h-screen">
        {/* Left: Guntur Batik Story */}
        <div className="px-8 md:px-16 py-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 leading-snug">
            Guntur's Batik Journey<br />A Legacy from Jogja
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            Deep in the heart of Jogja, Guntur has spent decades mastering the art of batik. His hands, steady and sure, move with the rhythm of tradition, each stroke a tribute to stories passed down through generations.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            Guntur’s signature pattern, <span className="font-semibold">"Awan Menari"</span> (Dancing Clouds), is more than a design—it is a living memory. Inspired by the shifting skies above his childhood rice fields, every swirl and curve is a reflection of hope, resilience, and the harmony of nature.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4">
            Using only natural dyes, Guntur creates subtle indigos and earth tones, honoring the land that sustains his craft. He believes that true batik is not just seen, but felt: “Each motif carries my family’s story and the spirit of our village,” he says. “When you wear my batik, you carry a piece of Jogja’s soul.”
          </p>
          <div className="bg-[#F9F7F3] border-l-4 border-[#d4b572] p-6 rounded-xl mb-8 shadow-sm">
            <h3 className="text-lg font-semibold text-[#7C6A0A] mb-2">Sneak Peek: The Meaning Behind "Awan Menari"</h3>
            <p className="text-gray-800 mb-2">
              The "Awan Menari" motif tells of clouds that gather, dance, and drift—just as Guntur’s community weathers each season together. The gentle flow of the pattern is a reminder that beauty and strength are found in movement and change.
            </p>
            <p className="text-gray-800">
              “Batik is my way of sharing peace and hope. I want every person who wears my work to feel the calm of the sky and the warmth of home.”
            </p>
          </div>
          <a href="#" className="inline-block bg-black text-white rounded-full px-4 py-2 font-bold text-sm text-center shadow-md hover:bg-gray-900 transition">READ ARTICLE</a>
        </div>
        {/* Right: Image */}
        <div className="flex items-center justify-center bg-black h-full min-h-[400px]">
          <img src="https://plus.unsplash.com/premium_photo-1677829177875-6d44c4c3ce19?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Collaborator Story" className="object-cover object-center w-full h-full max-h-[600px]" />
        </div>
      </div>
    </section>
  );
}
