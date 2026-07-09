"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { FormField, inputClassName, submitButtonClassName, errorAlertClassName } from "./form-ui";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  city: z.string().optional(),
});

interface EditProfileFormProps {
  initialName: string;
  initialCity?: string;
  onSuccess: (data: { full_name: string; city?: string }) => void;
}

export function EditProfileForm({ initialName, initialCity, onSuccess }: EditProfileFormProps) {
  const [fullName, setFullName] = useState(initialName);
  const [city, setCity] = useState(initialCity || "");
  const [errors, setErrors] = useState<{ full_name?: string; city?: string }>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    const validation = profileSchema.safeParse({ full_name: fullName, city: city || undefined });
    if (!validation.success) {
      const formatted = validation.error.format();
      setErrors({
        full_name: formatted.full_name?._errors[0],
        city: formatted.city?._errors[0],
      });
      return;
    }

    setIsLoading(true);
    try {
      const updated = await userService.updateProfile({
        full_name: fullName,
        city: city || undefined,
      });
      onSuccess({ full_name: updated.full_name, city: updated.city });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }; message?: string } } };
      setApiError(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {apiError && (
        <div className={errorAlertClassName}>
          {apiError}
        </div>
      )}

      <FormField label="Full Name" error={errors.full_name}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputClassName}
          placeholder="Your full name"
        />
      </FormField>

      <FormField label="City" error={errors.city}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={inputClassName}
          placeholder="Where are you based?"
        />
      </FormField>

      <button type="submit" disabled={isLoading} className={submitButtonClassName}>
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Changes"}
      </button>
    </form>
  );
}
