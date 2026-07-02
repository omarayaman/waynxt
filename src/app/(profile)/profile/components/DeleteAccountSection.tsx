"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";
import { dangerButtonClassName } from "./form-ui";

export function DeleteAccountSection() {
  const { logout } = useAuthStore();
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;
    setApiError("");
    setIsLoading(true);

    try {
      await userService.deleteAccount();
      await logout();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }; message?: string } } };
      setApiError(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to delete account"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
        <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-red-400 font-medium text-sm">Delete Account</p>
          <p className="text-gray-500 text-xs mt-1">
            This action is permanent. Your account will be soft-deleted and you will be logged out.
          </p>
        </div>
      </div>

      {apiError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {apiError}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm text-gray-400">
          Type <span className="text-red-400 font-mono">DELETE</span> to confirm
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full px-4 py-3 bg-[#181818] rounded-xl border border-red-500/20 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 transition-colors text-sm"
          placeholder="DELETE"
        />
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={confirmText !== "DELETE" || isLoading}
        className={dangerButtonClassName}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Delete My Account"}
      </button>
    </div>
  );
}
