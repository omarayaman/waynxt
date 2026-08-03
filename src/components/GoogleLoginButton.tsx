"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "@/services/auth.service";

const DEFAULT_GOOGLE_BUTTON_CLASS =
  "w-full flex items-center justify-center gap-3 bg-transparent border border-border hover:border-accent/50 hover:bg-surface-elevated text-foreground py-3.5 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed";

interface GoogleLoginButtonProps {
  disabled?: boolean;
  label?: string;
  className?: string;
  redirectTo?: string;
  onError?: (message: string) => void;
}

export function GoogleLoginButton({
  disabled = false,
  label = "Log in With Google",
  className = DEFAULT_GOOGLE_BUTTON_CLASS,
  redirectTo = "/planner",
  onError,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      onError?.("");

      try {
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        if (!userInfoRes.ok) {
          throw new Error("Failed to fetch user info from Google");
        }
        
        const userInfo = await userInfoRes.json();

        await authService.googleLogin({
          email: userInfo.email,
          full_name: userInfo.name,
          provider_id: userInfo.sub,
          access_token: tokenResponse.access_token,
        });

        const { useAuthStore } = await import("@/store/useAuthStore");
        await useAuthStore.getState().fetchCurrentUser();
        router.push(redirectTo);
      } catch (error: unknown) {
        console.error("Backend auth error:", error);
        const err = error as { response?: { data?: { message?: string } } };
        onError?.(
          err.response?.data?.message || "Backend rejected Google login. Please try again."
        );
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google popup error:", error);
      onError?.("Google popup closed or failed to initialize.");
    },
  });

  return (
    <button
      type="button"
      onClick={() => handleGoogleLogin()}
      disabled={isGoogleLoading || disabled}
      className={className}
    >
      {isGoogleLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      )}
      <span className="text-[14.5px] font-medium tracking-wide">
        {isGoogleLoading ? "Connecting..." : label}
      </span>
    </button>
  );
}
