"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { FormField, inputClassName, submitButtonClassName } from "./form-ui";

const passwordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "New password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    setErrors({});

    const validation = passwordSchema.safeParse({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setSuccessMessage("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onSuccess();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }; message?: string } } };
      setApiError(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {apiError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {apiError}
        </div>
      )}
      {successMessage && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {successMessage}
        </div>
      )}

      <FormField label="Current Password" error={errors.old_password}>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className={inputClassName}
          placeholder="Enter current password"
        />
      </FormField>

      <FormField label="New Password" error={errors.new_password}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClassName}
          placeholder="At least 6 characters"
        />
      </FormField>

      <FormField label="Confirm New Password" error={errors.confirm_password}>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClassName}
          placeholder="Re-enter new password"
        />
      </FormField>

      <button type="submit" disabled={isLoading} className={submitButtonClassName}>
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Update Password"}
      </button>
    </form>
  );
}
