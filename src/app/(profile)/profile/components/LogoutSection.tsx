"use client";

import React, { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export function LogoutSection() {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-6 mt-6 border-t border-border">
      <h3 className="text-sm font-medium text-foreground mb-1">Sign out</h3>
      <p className="text-xs text-muted mb-4">Log out of your Waynx account on this device.</p>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-muted border border-border rounded-lg hover:bg-surface-elevated hover:text-foreground transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <LogOut size={15} />
        )}
        Log out
      </button>
    </div>
  );
}
