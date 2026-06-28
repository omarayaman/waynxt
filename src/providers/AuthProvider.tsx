"use client";

import React, { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const fetched = useRef(false);

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchCurrentUser();
    }
  }, [fetchCurrentUser]);

  return <>{children}</>;
}
