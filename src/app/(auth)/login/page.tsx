import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/(auth)/login/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#050505] text-white font-sans">
      <Navbar />

      {/* Left Section - Form */}
    <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-8 sm:px-16 relative z-0 mt-20 lg:mt-0">
        <div className="max-w-[420px] w-full mx-auto">
          <h1 className="text-[40px] font-bold text-[#E3D010] mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray-300 mb-10 text-[15px] leading-relaxed pr-8">
            Your saved places, conversations, and discoveries are waiting.
          </p>

          <form className="space-y-5" action="#">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="text-[13px] text-gray-300 block ml-1"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative flex items-center bg-[#181818] rounded-xl border border-transparent focus-within:border-[#E3D010] focus-within:bg-[#1a1a1a] transition-all duration-300 shadow-sm">
                <div className="absolute left-4 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="Jhonsmith@gmail.com"
                  className="w-full bg-transparent text-white placeholder-gray-500 pl-12 pr-4 py-4 outline-none text-sm rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="text-[13px] text-gray-300 block ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center bg-[#181818] rounded-xl border border-transparent focus-within:border-[#E3D010] focus-within:bg-[#1a1a1a] transition-all duration-300 shadow-sm">
                <div className="absolute left-4 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full bg-transparent text-white placeholder-gray-500 pl-12 pr-12 py-4 outline-none text-sm rounded-xl"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 text-gray-400 hover:text-[#E3D010] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex justify-between items-center pt-1 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded-[4px] border border-gray-600 bg-[#181818] flex items-center justify-center group-hover:border-[#E3D010] transition-colors">
                  {/* checked icon could go here */}
                </div>
                <span className="text-[13px] text-gray-400 select-none group-hover:text-gray-200 transition-colors">
                  Remember me
                </span>
                {/* Hidden actual checkbox */}
                <input type="checkbox" className="hidden" />
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] text-gray-400 hover:text-white transition-colors"
              >
                Forget Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-[15px] py-4 rounded-xl mt-4 transition-all duration-300 shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)]"
            >
              Log in
            </button>

            {/* OR Separator */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 border-t border-[#222]"></div>
              <span className="text-gray-500 text-sm font-medium pb-1">or</span>
              <div className="flex-1 border-t border-[#222]"></div>
            </div>
              
            {/* Google Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-transparent border border-[#333] hover:border-gray-500 hover:bg-[#111] text-gray-200 py-3.5 rounded-xl transition-all duration-300"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-[14.5px] font-medium tracking-wide">
                Log in With Google
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Image Background */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent z-10"></div>
        <Image
          src="/bg-pharaoh.png"
          alt="Ancient Egyptian pharaoh statue in a modern museum"
          fill
          className="object-cover object-center"
          priority
        />
      </div>      
  
    </div>
  );
}
