"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthController from "../controllers/authController";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle login form submission using AuthController
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Use AuthController to handle login
      const result = await AuthController.login({
        email,
        password
      });
      
      if (result.success && result.user) {
        // Extract user info for context
        const userObj = result.user as any;
        const username = userObj.username || "";
        const avatar = userObj.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
        const name =
          (userObj.first_name || userObj.firstName || "") +
          ((userObj.last_name || userObj.lastName) ? " " + (userObj.last_name || userObj.lastName) : "");
        const userInfo = { name, username, avatar };
        // Handle multiple roles
        let roles: string[] = [];
        if (Array.isArray(userObj.roles)) {
          // If roles is an array of objects (e.g., [{ role: 'admin' }, ...]), extract the role strings
          if (userObj.roles.length > 0 && typeof userObj.roles[0] === 'object' && userObj.roles[0] !== null && 'role' in userObj.roles[0]) {
            roles = userObj.roles.map((r: any) => r.role).filter((r: any) => typeof r === 'string');
          } else {
            roles = userObj.roles;
          }
        } else if (userObj.role) {
          roles = [userObj.role];
        }
        // Fetch user profile with roles from /auth/me
        const profileResult = await AuthController.getUserProfileWithRoles();
        let profileRoles: string[] = [];

        const nestedUser = profileResult.user?.user;

        if (
          profileResult.success &&
          nestedUser &&
          Array.isArray(nestedUser.role)
        ) {
          profileRoles = nestedUser.role
            .map((r: any) => r.name)
            .filter((name: any) => typeof name === 'string');
        }
        if (result.access_token) {
          localStorage.setItem('authToken', result.access_token);
        }
        setAuth(result.access_token ?? '', profileRoles as ('admin'|'buyer'|'vendor')[], userInfo);
        // Wait for the token to be set before navigating (guarantee async storage)
        setTimeout(() => {
          router.push('/shop');
        }, 100);

      } else {
        // Display error message
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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
      {/* Left image section (carousel) */}
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.96, filter: 'blur(8px)' }}
        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-1 items-center justify-center bg-gray-50 overflow-hidden relative shadow-[0_8px_32px_0_rgba(232,216,185,0.15)] border-r border-[#e8d8b9]"
        style={{ boxShadow: '0 8px 32px 0 #e8d8b9, 0 1.5px 12px 0 #fffbe6' }}
      >
        {/* Previous image (fading out) */}
        {fade ? (
          <>
            {/* Previous image (slides out left, scales down) */}
            <img
              key={`prev-${prev}`}
              src={images[prev]}
              alt={`Login Illustration ${prev + 1}`}
              className={
                `object-cover w-full h-full absolute top-0 left-0 transition-all duration-[1200ms] opacity-0 -translate-x-1/2 scale-95 z-10`
              }
              style={{transition: 'all 1.2s cubic-bezier(0.4,0,0.2,1)'}}
            />
            {/* Current image (slides in from right, scales up) */}
            <img
              key={`current-${current}`}
              src={images[current]}
              alt={`Login Illustration ${current + 1}`}
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
            alt={`Login Illustration ${current + 1}`}
            className="object-cover w-full h-full absolute top-0 left-0 z-20"
          />
        )}
        {/* Pagination dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === current ? 'bg-black scale-110' : 'bg-white border border-gray-400'}`}
              style={{ display: 'inline-block' }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>
      {/* Right form section */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-1 items-center h-screen justify-center px-4 z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-xl flex flex-col bg-white/70 backdrop-blur-lg rounded-xl border border-[#e8d8b9] p-8"
        >
          <h1 className="text-4xl font-normal text-black mb-10 mt-1 tracking-tight text-center">
            Login
          </h1>
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-2">
                {error}
              </div>
            )}
            
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

            <label htmlFor="password" className="text-xs font-medium text-gray-600 mb-1 tracking-wide">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-md px-4 py-3 text-base text-black outline-none transition placeholder:text-gray-400"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <button
              type="submit"
              className={`w-fit px-12 py-3 bg-black text-white rounded-full font-semibold tracking-wide text-lg hover:bg-gray-900 transition mb-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>

            {/* Links below the button, left-aligned */}
            <div className="flex flex-col items-start gap-1 text-base ml-1">
              <span>
                New customer?{" "}
                <Link href="/register" className="text-blue-700 hover:underline">
                  Sign up for an account
                </Link>
              </span>
              <Link href="/" className="text-blue-700 hover:underline">
                Return to Store
              </Link>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </main>
  );
}
