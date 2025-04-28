"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  quote: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Siti Rahayu",
    role: "Batik Artisan",
    location: "Yogyakarta",
    quote: "Rupa Rawi has transformed my small batik business. Now my designs reach customers across Indonesia, and I can share the stories behind each pattern. It's not just a marketplace—it's a community that values our heritage.",
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Budi Santoso",
    role: "Weaving Craftsman",
    location: "Bali",
    quote: "For generations, my family has preserved traditional Balinese weaving techniques. Through Rupa Rawi, we've connected with people who truly appreciate the time and skill behind each piece. It's given new life to our craft.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "Maya Wijaya",
    role: "Natural Dye Specialist",
    location: "Surakarta",
    quote: "Working with Rupa Rawi has allowed me to maintain my commitment to sustainable practices. They understand the value of natural dyes and traditional methods, and help me reach customers who share these values.",
    imageUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=1989&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function CommunityVoices() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="w-full bg-[#F9F7F3] pt-16 pb-0 md:pt-24 md:pb-0">
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-16 md:pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2A27] mb-4">Community Voices</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Hear from the artisans and vendors who bring Rupa Rawi to life. Their stories inspire us every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Testimonial Content */}
          <motion.div 
            className="md:col-span-7 bg-white p-8 md:p-12 rounded-2xl shadow-md relative"
            key={activeTestimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="absolute top-6 left-6 w-12 h-12 text-[#E6D8B1] opacity-30" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            
            <div className="pt-6">
              <p className="text-lg md:text-xl text-gray-800 mb-8 italic relative z-10">
                "{activeTestimonial.quote}"
              </p>
              
              <div className="flex items-center">
                <div className="mr-4">
                  <img 
                    src={activeTestimonial.imageUrl} 
                    alt={activeTestimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#E6D8B1]" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#7C6A0A]">{activeTestimonial.name}</h4>
                  <p className="text-sm text-gray-600">{activeTestimonial.role}, {activeTestimonial.location}</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Image and Navigation */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full h-64 md:h-80 mb-6 overflow-hidden rounded-xl">
              <motion.img 
                src="https://images.unsplash.com/photo-1621353269062-6aa0165576f2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Artisan at work" 
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm font-medium">Our community of artisans preserves traditional craftsmanship while embracing sustainable innovation.</p>
              </div>
            </div>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center gap-3 w-full">
              <button 
                onClick={prevTestimonial}
                className="bg-white hover:bg-[#E6D8B1] text-[#7C6A0A] w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors"
                aria-label="Previous testimonial"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeIndex ? 'bg-[#7C6A0A] w-4' : 'bg-[#E6D8B1]'}`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextTestimonial}
                className="bg-white hover:bg-[#E6D8B1] text-[#7C6A0A] w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors"
                aria-label="Next testimonial"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
