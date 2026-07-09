"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID, isGoogleOAuthConfigured } from "@/lib/google-oauth";

interface GoogleOAuthProviderWrapperProps {
  children: React.ReactNode;
}

export function GoogleOAuthProviderWrapper({ children }: GoogleOAuthProviderWrapperProps) {
  if (!isGoogleOAuthConfigured) {
    return children;
  }

  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>;
}
