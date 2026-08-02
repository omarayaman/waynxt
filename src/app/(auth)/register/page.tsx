"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/auth.service";
import NavbarRegister from "./NavbarRegister";
import { z } from "zod";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth";
import { PUBLIC_ASSETS } from "@/lib/public-assets";
import { getPostAuthRedirect } from "@/lib/auth-redirect";
import { GsapButton } from "@/components/GsapButton";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postAuthRedirect = getPostAuthRedirect(searchParams);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{name?: string, email?: string, password?: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMessage("");

    const validation = registerSchema.safeParse({ name, email, password });
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      setFieldErrors({
        name: formattedErrors.name?._errors[0],
        email: formattedErrors.email?._errors[0],
        password: formattedErrors.password?._errors[0],
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({full_name: name, email, password });
      // On success, try to login automatically
      await authService.login({ email, password });
      
      // Update global auth state before redirecting
      const { useAuthStore } = await import('@/store/useAuthStore');
      await useAuthStore.getState().fetchCurrentUser();
      
      router.push(postAuthRedirect);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err.response?.data?.message || "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-surface-card text-foreground font-sans overflow-hidden">
      {/* Full-screen Background Image */}
      <div className="absolute inset-0 z-0 dark:opacity-80 bg-black">
        <Image
          src="/images/auth/pharaonic-light-register.jpg"
          alt="Beautiful bright view of the Great Sphinx of Giza and Pyramids"
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

      {/* Theme-aware gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-surface-card/95 from-[35%] via-surface-card/50 via-[50%] to-transparent to-[65%] dark:hidden" />
      <div className="absolute inset-0 z-[1] hidden bg-gradient-to-r from-black/95 from-[35%] via-black/60 via-[50%] to-transparent to-[65%] dark:block" />
      {/* Top Navigation */}
      <NavbarRegister step={1} />
      {/* Form Content */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-40px)]">
        <div className="w-full max-w-[600px] px-8 lg:px-10 ml-[10%]">
          <h1 className="text-[42px] font-bold  text-accent mb-3 tracking-tight">
            Create your account
          </h1>
          <p className="text-muted mb-10 text-[15px] leading-relaxed">
            Start exploring with a personalized experience.
          </p>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label
                className="text-[13px] text-muted block ml-1"
                htmlFor="name"
              >
                Name
              </label>
              <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-border focus-within:border-accent transition-all duration-300">
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
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                  }}
                  placeholder="Enter your full name"
                  className={`w-full bg-transparent text-foreground placeholder:text-muted/50 pl-12 pr-4 py-4 outline-none text-sm rounded-xl ${fieldErrors.name ? 'border border-red-500' : ''}`}
                  
                />
              </div>
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="text-[13px] text-muted block ml-1"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-border focus-within:border-accent transition-all duration-300">
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
              <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-border focus-within:border-accent transition-all duration-300">
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
                  placeholder="At least 6 characters"
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

            {/* Continue Button */}
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
                  <svg className="animate-spin h-5 w-5 text-accent-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Continue
                  <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </GsapButton>

            {/* OR Separator */}
            {isGoogleOAuthConfigured && (
              <>
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 border-t border-border"></div>
                  <span className="text-muted text-sm font-medium">or</span>
                  <div className="flex-1 border-t border-border"></div>
                </div>

                <GoogleLoginButton
                  disabled={isLoading}
                  redirectTo={postAuthRedirect}
                  label="Sign up With Google"
                  onError={setErrorMessage}
                />
              </>
            )}

            {/* Log in link */}
            <p className="text-center text-[14px] text-muted pt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent hover:text-accent-hover font-bold transition-colors underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-card text-muted">
          Loading...
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
