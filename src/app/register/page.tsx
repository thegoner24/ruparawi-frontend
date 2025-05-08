"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthController from "../controllers/authController";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle form submission using AuthController
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Use AuthController to handle registration
      const result = await AuthController.register({
        firstName,
        lastName,
        username,
        email,
        password
      });
      
      if (result.success) {
        // Registration successful
        setSuccess(true);
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Display error message
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  // Carousel logic
  const images = [
    "https://images.unsplash.com/photo-1697002502851-ef0006e8e2f9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1697002503449-344fa66fdbcf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1697095378556-95a9bc1e8d2a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1717765994540-6e464fddb4e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(0);
  const [fade, setFade] = useState(false);

  // Change image every 15 seconds with a seamless fade
  useEffect(() => {
    const interval = setInterval(() => {
      setPrev(current);
      setFade(true);
      setTimeout(() => {
        setCurrent((prevIndex) => (prevIndex + 1) % images.length);
        setFade(false);
      }, 1200); // fade duration (ms)
    }, 15000); // 15 seconds
    return () => clearInterval(interval);
  }, [current, images.length]);

  return (
    <main className="flex h-screen bg-white overflow-hidden">
      {/* Left form section */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-1 items-center h-screen justify-center px-2 sm:px-4 z-10 bg-gradient-to-br from-[#f8f5f0] to-[#ede9dd]"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-xl flex flex-col bg-white/80 backdrop-blur-lg rounded-2xl border border-[#e8d8b9] shadow-2xl p-8 md:p-12"
        >
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Ruparawi" className="w-16 h-16 rounded-full shadow-lg mb-2 border-2 border-[#bfa76a] bg-white" />
          <span className="font-bold text-2xl tracking-tight text-[#bfa76a]">Ruparawi</span>
        </div>
        <h1 className="text-3xl font-semibold text-black mb-8 mt-2 tracking-tight text-center">Create Your Account</h1>
        <form className="w-full flex flex-col gap-5" onSubmit={handleRegister} autoComplete="on" aria-label="Register form">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-2">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="w-full flex flex-col">
            <label className="uppercase text-base tracking-wider text-gray-700 mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              className="bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-md px-4 py-3 text-base text-black outline-none transition placeholder:text-gray-400"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {/* Success message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-2">
              Registration successful! Redirecting to login...
            </div>
          )}
          {/* Name fields in a row */}
          <div className="w-full flex flex-row gap-3">
            <div className="flex-1 flex flex-col">
              <label htmlFor="firstName" className="text-xs font-medium text-gray-600 mb-1 tracking-wide">First Name</label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-md px-4 py-3 text-base text-black outline-none transition placeholder:text-gray-400"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="lastName" className="text-xs font-medium text-gray-600 mb-1 tracking-wide">Last Name</label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-md px-4 py-3 text-base text-black outline-none transition placeholder:text-gray-400"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="email" className="text-xs font-medium text-gray-600 mb-1 tracking-wide">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-md px-4 py-3 text-base text-black outline-none transition placeholder:text-gray-400"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="password" className="text-xs font-medium text-gray-600 mb-1 tracking-wide">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              className="bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-md px-4 py-3 text-base text-black outline-none transition placeholder:text-gray-400"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Left-aligned actions below the form */}
          <div className="flex flex-col items-start gap-1 mt-2 ml-1">
            <button
              type="submit"
              className={`px-12 py-3 bg-black text-white rounded-full font-semibold tracking-wide text-lg hover:bg-gray-900 transition mb-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'CREATING...' : 'CREATE'}
            </button>
            <Link href="/login" className={`text-blue-700 hover:underline text-base mb-1 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
              Back to Login
            </Link>
            <Link href="/" className={`text-blue-700 hover:underline text-base ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
              Return to Store
            </Link>
          </div>
        </form>
        </motion.div>
      </motion.div>
      {/* Right image section (carousel) */}
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.96, filter: 'blur(8px)' }}
        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-1 items-center justify-center bg-gray-50 overflow-hidden relative shadow-[0_8px_32px_0_rgba(232,216,185,0.15)] border-l border-[#e8d8b9]"
        style={{ boxShadow: '0 8px 32px 0 #e8d8b9, 0 1.5px 12px 0 #fffbe6' }}
      >
        {fade ? (
          <>
            {/* Previous image (slides out right, scales down) */}
            <img
              key={`prev-${prev}`}
              src={images[prev]}
              alt={`Register Illustration ${prev + 1}`}
              className={
                `object-cover w-full h-full absolute top-0 left-0 transition-all duration-[1200ms] opacity-0 translate-x-1/2 scale-95 z-10`
              }
              style={{transition: 'all 1.2s cubic-bezier(0.4,0,0.2,1)'}}
            />
            {/* Current image (slides in from left, scales up) */}
            <img
              key={`current-${current}`}
              src={images[current]}
              alt={`Register Illustration ${current + 1}`}
              className={
                `object-cover w-full h-full absolute top-0 left-0 transition-all duration-[1200ms] opacity-100 translate-x-0 scale-100 z-20`
              }
              style={{transition: 'all 1.2s cubic-bezier(0.4,0,0.2,1)'}}
            />
          </>
        ) : (
          <img
            key={`current-static-${current}`}
            src={images[current]}
            alt={`Register Illustration ${current + 1}`}
            className="object-cover w-full h-full absolute top-0 left-0 z-20"
          />
        )}
        {/* Pagination dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === current ? 'bg-[#bfa76a] scale-125 shadow-[0_0_8px_2px_#e8d8b9]' : 'bg-white border border-gray-400'}`}
              style={{ display: 'inline-block' }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </main>
  );
}
