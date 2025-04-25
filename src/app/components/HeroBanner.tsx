"use client";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-start bg-[#F9F8F6] overflow-hidden">
      {/* Background image (family moment) */}
      <img
        src="/hero.jpg"
        alt="For Family Moments That Matter"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{ background: '#F9F8F6' }}
      />
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
      {/* Left-aligned text */}
      <div className="relative z-10 flex flex-col items-start justify-center text-left px-6 md:px-16 py-20 md:py-32 max-w-xl"
        style={{ background: 'rgba(255,255,255,0.0)' }}
      >
        <h1 className="font-serif text-white text-3xl md:text-5xl font-normal mb-6 leading-tight drop-shadow-sm" style={{textShadow: '0 2px 8px rgba(0,0,0,0.10)'}}>For Family Moments<br />That Matter</h1>
        <a
          href="#family"
          className="mt-4 inline-block px-7 py-2.5 border border-white text-white text-base rounded-full font-sans font-normal hover:bg-white hover:text-black transition-colors duration-200"
          style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
