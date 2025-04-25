"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="flex min-h-screen bg-white">
      <div className="flex flex-1 items-center h-screen justify-center px-4">
        <div className="w-full max-w-xl ">
          <h1 className="text-4xl font-normal text-black mb-10 mt-1 tracking-tight text-center">
            Login
          </h1>
          <form className="flex flex-col gap-6">
            <label className="uppercase text-base tracking-wider text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="border border-gray-300 focus:border-black rounded-none px-6 py-4 mb-2 text-lg text-black bg-white outline-none transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label className="uppercase text-base tracking-wider text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="border border-gray-300 focus:border-black rounded-none px-6 py-4 mb-2 text-lg text-black bg-white outline-none transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-fit px-12 py-3 bg-black text-white rounded-full font-semibold tracking-wide text-lg hover:bg-gray-900 transition mb-2"
            >
              SIGN IN
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
        </div>
      </div>
    </main>
  );
}
