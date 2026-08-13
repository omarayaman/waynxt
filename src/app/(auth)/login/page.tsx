"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import Navbar from "@/app/(auth)/login/Navbar";
import { z } from "zod";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { GsapButton } from "@/components/GsapButton";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth";
import { getPostAuthRedirect } from "@/lib/auth-redirect";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postAuthRedirect = getPostAuthRedirect(searchParams);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAccountNotFound, setIsAccountNotFound] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMessage("");
    setIsAccountNotFound(false);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      setFieldErrors({
        email: formattedErrors.email?._errors[0],
        password: formattedErrors.password?._errors[0],
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.login({ email, password });
      
      // Update global auth state before redirecting
      const { useAuthStore } = await import('@/store/useAuthStore');
      await useAuthStore.getState().fetchCurrentUser();
      
      window.location.href = postAuthRedirect;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string, detail?: string | string[], error?: string } } };
      const data = err.response?.data;
      
      let msg: string = "An error occurred during login. Please try again.";
      if (data) {
        if (typeof data.message === 'string') msg = data.message;
        else if (data.message && typeof data.message === 'object' && (data.message as unknown as { message?: string }).message) msg = (data.message as unknown as { message: string }).message;
        else if (typeof data.detail === 'string') msg = data.detail;
        else if (Array.isArray(data.detail) && (data.detail[0] as unknown as { msg?: string })?.msg) msg = (data.detail[0] as unknown as { msg: string }).msg;
        else if (typeof data.error === 'string') msg = data.error;
        else if (data.error && typeof data.error === 'object' && (data.error as unknown as { message?: string }).message) msg = (data.error as unknown as { message: string }).message;
        else if (typeof data.message === 'object') msg = JSON.stringify(data.message);
      }
      
      setErrorMessage(String(msg));
      
      // Always show the sign up button on error since we might not get a specific "not found" message
      setIsAccountNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-surface-card text-foreground font-sans overflow-hidden">
      {/* Full-screen Background Image */}
      <div className="absolute inset-0 z-0 dark:opacity-80 bg-black">
        <Image
          src="/images/auth/temple-Light.png"
          alt="Ancient Egyptian temple with palm trees and sandy landscape"
          fill
          quality={100}
          sizes="100vw"
          className="object-cover object-right lg:object-center dark:hidden brightness-90"
          priority
        />
        <Image
          src="/images/auth/pharaonic-night.jpg"
          alt="Majestic night view of the Pyramids of Giza"
          fill
          quality={100}
          sizes="100vw"
          className="hidden object-cover object-right lg:object-center dark:block brightness-[0.80]"
          priority
        />
      </div>

      {/* Dark mode gradient overlay */}
      <div className="absolute inset-0 z-[1] hidden bg-gradient-to-r from-black/85 from-[5%] via-black/25 via-[30%] to-transparent to-[55%] dark:block" />

      <Navbar />

      {/* Form Content */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-40px)]">
        <div className="w-full max-w-[600px] px-8 lg:px-10 ml-[10%]">
          <h1 className="text-[42px] font-bold text-accent mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted mb-10 text-[15px] leading-relaxed pr-8">
            Your saved places, conversations, and discoveries are waiting.
          </p>

          {errorMessage && (
            <div className="mb-6 flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {errorMessage}
              </div>
              {isAccountNotFound && (
                <Link
                  href={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                  className="w-full flex justify-center items-center gap-2 bg-transparent border border-accent text-accent hover:bg-accent/10 font-bold text-[15px] py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_10px_color-mix(in srgb, var(--accent) %, transparent)] hover:shadow-[0_0_15px_color-mix(in srgb, var(--accent) %, transparent)]"
                >
                  Create a new account
                </Link>
              )}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="text-[13px] text-muted block ml-1"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-border focus-within:border-accent focus-within:bg-surface transition-all duration-300 shadow-sm">
                <div className="absolute left-4 text-muted">
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  placeholder="name@example.com"
                  className={`w-full bg-transparent text-foreground placeholder:text-muted/50 pl-12 pr-4 py-4 outline-none text-sm rounded-xl ${fieldErrors.email ? 'border border-red-500' : ''}`}
                  
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="text-[13px] text-muted block ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-border focus-within:border-accent focus-within:bg-surface transition-all duration-300 shadow-sm">
                <div className="absolute left-4 text-muted">
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
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  placeholder="Enter your password"
                  className={`w-full bg-transparent text-foreground placeholder:text-muted/50 pl-12 pr-12 py-4 outline-none text-sm rounded-xl ${fieldErrors.password ? 'border border-red-500' : ''}`}
                  
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-muted hover:text-accent transition-all duration-300 hover:scale-110 active:scale-90"
                >
                  {showPassword ? (
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
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
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
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <GsapButton
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent after:absolute after:inset-0 after:rounded-xl after:border-2 after:border-accent after:pointer-events-none after:z-[10] font-normal dark:font-medium text-[15px] py-4 rounded-xl mt-4 dark:shadow-[0_0_15px_color-mix(in_srgb,var(--accent)_35%,transparent)] dark:hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_45%,transparent)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              innerBgClass="bg-accent dark:bg-[#0a0a0a]"
              blobClass="bg-white dark:bg-accent"
              magneticFill={true}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </GsapButton>

            {/* OR Separator */}
            {isGoogleOAuthConfigured && (
              <>
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 border-t border-border"></div>
                  <span className="text-muted text-sm font-medium pb-1">or</span>
                  <div className="flex-1 border-t border-border"></div>
                </div>

                <GoogleLoginButton
                  disabled={isLoading}
                  redirectTo={postAuthRedirect}
                  onError={(message) => {
                    setErrorMessage(message);
                    setIsAccountNotFound(false);
                  }}
                />
              </>
            )}

            {/* Sign up link */}
            <p className="text-center text-[14px] text-muted pt-6">
              Don&apos;t have an account?{" "}
              <Link
                href={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                className="text-accent hover:text-accent-hover font-bold transition-colors underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-card text-muted">
          Loading...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
