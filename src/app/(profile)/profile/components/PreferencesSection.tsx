"use client";

import React from "react";
import { PreferencesForm } from "./PreferencesForm";
import type { UserPreferences } from "@/types/user";

interface PreferencesSectionProps {
  preferences?: UserPreferences;
  onPreferencesUpdate: (preferences: UserPreferences) => void;
}

export function PreferencesSection({ preferences, onPreferencesUpdate }: PreferencesSectionProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-medium text-foreground">Travel preferences</h2>
        <p className="text-sm text-muted mt-1">
          Customize how Waynx recommends places and builds your itineraries.
        </p>
      </div>
      <PreferencesForm initialPreferences={preferences} onSuccess={onPreferencesUpdate} />
    </div>
  );
}
