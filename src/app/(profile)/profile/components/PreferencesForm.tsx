"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import type { UserPreferences } from "@/types/user";
import {
  INTEREST_OPTIONS,
  COMPANION_OPTIONS,
  BUDGET_OPTIONS,
  AGE_OPTIONS,
  CROWD_OPTIONS,
  SEASON_OPTIONS,
} from "../constants";
import { OptionChip, submitButtonClassName } from "./form-ui";

interface PreferencesFormProps {
  initialPreferences?: UserPreferences;
  onSuccess: (preferences: UserPreferences) => void;
}

export function PreferencesForm({ initialPreferences, onSuccess }: PreferencesFormProps) {
  const [interests, setInterests] = useState<string[]>(initialPreferences?.interests || []);
  const [travelCompanion, setTravelCompanion] = useState(initialPreferences?.travel_companion);
  const [budget, setBudget] = useState(initialPreferences?.budget);
  const [ageGroup, setAgeGroup] = useState(initialPreferences?.age_group);
  const [crowdPreference, setCrowdPreference] = useState(initialPreferences?.crowd_preference);
  const [season, setSeason] = useState(initialPreferences?.season);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);

    const payload: UserPreferences = {
      interests,
      travel_companion: travelCompanion,
      budget,
      age_group: ageGroup,
      crowd_preference: crowdPreference,
      season,
    };

    try {
      const updated = await userService.updatePreferences(payload);
      onSuccess(updated.preferences || payload);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }; message?: string } } };
      setApiError(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to update preferences"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {apiError}
        </div>
      )}

      <div>
        <p className="text-sm text-gray-300 mb-3">Interests</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              icon={opt.icon}
              isActive={interests.includes(opt.id)}
              onClick={() => toggleInterest(opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-300 mb-3">Travel Companion</p>
        <div className="grid grid-cols-2 gap-2">
          {COMPANION_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              desc={opt.desc}
              icon={opt.icon}
              isActive={travelCompanion === opt.id}
              onClick={() => setTravelCompanion(opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-300 mb-3">Budget</p>
        <div className="grid grid-cols-3 gap-2">
          {BUDGET_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              desc={opt.desc}
              icon={opt.icon}
              isActive={budget === opt.id}
              onClick={() => setBudget(opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-300 mb-3">Age Group</p>
        <div className="grid grid-cols-3 gap-2">
          {AGE_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              desc={opt.desc}
              icon={opt.icon}
              isActive={ageGroup === opt.id}
              onClick={() => setAgeGroup(opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-300 mb-3">Crowd Preference</p>
        <div className="grid grid-cols-3 gap-2">
          {CROWD_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              desc={opt.desc}
              icon={opt.icon}
              isActive={crowdPreference === opt.id}
              onClick={() => setCrowdPreference(opt.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-300 mb-3">Preferred Season</p>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map((opt) => (
            <OptionChip
              key={opt.id}
              label={opt.label}
              icon={opt.icon}
              isActive={season === opt.id}
              onClick={() => setSeason(opt.id)}
            />
          ))}
        </div>
      </div>

      <button type="submit" disabled={isLoading} className={submitButtonClassName}>
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Preferences"}
      </button>
    </form>
  );
}
