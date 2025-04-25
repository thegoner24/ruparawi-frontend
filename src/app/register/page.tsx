"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-4 flex flex-col">
        <h1 className="text-4xl font-normal text-black mb-12 mt-4 tracking-tight text-center">
          Create Account
        </h1>
        <form className="w-full flex flex-col gap-6">
          <div className="w-full flex flex-col">
            <label className="uppercase text-base tracking-wider text-gray-700 mb-1" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              required
              className="border border-gray-300 focus:border-black rounded-none px-6 py-4 mb-2 text-lg text-black bg-white outline-none transition"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="uppercase text-base tracking-wider text-gray-700 mb-1" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              required
              className="border border-gray-300 focus:border-black rounded-none px-6 py-4 mb-2 text-lg text-black bg-white outline-none transition"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col">
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
          </div>
          <div className="w-full flex flex-col">
            <label className="uppercase text-base tracking-wider text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              className="border border-gray-300 focus:border-black rounded-none px-6 py-4 mb-2 text-lg text-black bg-white outline-none transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Left-aligned actions below the form */}
          <div className="flex flex-col items-start gap-1 mt-2 ml-1">
            <button
              type="submit"
              className="px-12 py-3 bg-black text-white rounded-full font-semibold tracking-wide text-lg hover:bg-gray-900 transition mb-2"
            >
              CREATE
            </button>
            <Link href="/login" className="text-blue-700 hover:underline text-base mb-1">
              Back to Login
            </Link>
            <Link href="/" className="text-blue-700 hover:underline text-base">
              Return to Store
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
