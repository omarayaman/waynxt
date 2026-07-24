"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { z } from "zod";
import { Mail, Lock, User, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, authModalView, closeAuthModal, openAuthModal, redirectAfterAuth } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{name?: string, email?: string, password?: string}>({});

  // Reset state when modal opens/closes or view changes
  useEffect(() => {
    setErrorMessage("");
    setFieldErrors({});
    if (!isAuthModalOpen) {
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [isAuthModalOpen, authModalView]);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalView === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMessage("");

    if (isLogin) {
      const validation = loginSchema.safeParse({ email, password });
      if (!validation.success) {
        const formattedErrors = validation.error.format();
        setFieldErrors({
          email: formattedErrors.email?._errors[0],
          password: formattedErrors.password?._errors[0],
        });
        return;
      }
    } else {
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
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await authService.login({ email, password });
      } else {
        await authService.register({ full_name: name, email, password });
        await authService.login({ email, password });
      }
      
      await useAuthStore.getState().fetchCurrentUser();
      closeAuthModal();
      
      if (redirectAfterAuth) {
        router.push(redirectAfterAuth);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number, data?: { message?: string } } };
      const defaultMsg = isLogin 
        ? "An error occurred during login. Please try again."
        : "An error occurred during registration. Please try again.";
      setErrorMessage(err.response?.data?.message || defaultMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={closeAuthModal}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-sm rounded-[32px] bg-surface-card/95 border border-border p-8 shadow-2xl backdrop-blur-3xl overflow-hidden">
        
        {/* Soft Glow behind modal elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150px] bg-accent/10 blur-[60px] rounded-full pointer-events-none" />
        
        {/* Close Button */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-muted hover:text-foreground hover:bg-surface-elevated p-1.5 rounded-full transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="relative z-10 text-center mb-8 mt-2">
          <h2 className="text-2xl font-bold text-accent mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-muted">
            {isLogin ? "Log in to continue your journey" : "Start exploring with us"}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm text-center relative z-10">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          
          {/* Name Field (Register only) */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[13px] text-muted block ml-1">Name</label>
              <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-border focus-within:border-accent transition-all duration-300">
                <div className="absolute left-4 text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                  }}
                  placeholder="Full Name"
                  className="w-full bg-transparent text-foreground placeholder:text-muted/50 pl-12 pr-4 py-3.5 outline-none text-sm rounded-xl"
                />
              </div>
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[13px] text-muted block ml-1">Email</label>
            <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-border focus-within:border-accent transition-all duration-300">
              <div className="absolute left-4 text-muted">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                }}
                placeholder="name@example.com"
                className="w-full bg-transparent text-foreground placeholder:text-muted/50 pl-12 pr-4 py-3.5 outline-none text-sm rounded-xl"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-[13px] text-muted block ml-1">Password</label>
            <div className="relative flex items-center bg-[var(--input-bg)] rounded-xl border border-border focus-within:border-accent transition-all duration-300">
              <div className="absolute left-4 text-muted">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                }}
                placeholder="Password"
                className="w-full bg-transparent text-foreground placeholder:text-muted/50 pl-12 pr-12 py-3.5 outline-none text-sm rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-muted hover:text-accent transition-colors text-[10px] font-bold"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Remember me & Forgot Password */}
          {isLogin && (
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-border bg-transparent text-accent focus:ring-accent cursor-pointer" />
                <span className="text-[13px] text-muted group-hover:text-foreground transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-[13px] text-accent hover:text-accent-hover transition-colors font-medium">
                Forgot Password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-[15px] py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_color-mix(in srgb, var(--accent) %, transparent)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Please wait...
              </>
            ) : (
              isLogin ? "Log in" : "Sign up"
            )}
          </button>
          
          <div className="text-center pt-2">
             <button
                type="button"
                onClick={() => openAuthModal(isLogin ? 'register' : 'login', redirectAfterAuth)}
                className="text-sm text-muted hover:text-foreground transition-colors"
             >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-accent font-bold underline underline-offset-4">{isLogin ? "Sign up" : "Log in"}</span>
             </button>
          </div>
          
          {isGoogleOAuthConfigured && (
            <div className="pt-2">
               <GoogleLoginButton 
                 redirectTo={redirectAfterAuth} 
                 onError={(msg) => setErrorMessage(msg)} 
                 label={isLogin ? "Continue with Google" : "Sign up with Google"}
               />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
