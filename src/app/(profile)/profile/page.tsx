"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NavbarHome from "@/app/(home)/NavbarHome";
import { useAuthStore } from "@/store/useAuthStore";
import { userService } from "@/services/user.service";
import type { SavedPlaceProfile, UserPreferences, UserStats } from "@/types/user";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileNav, type ProfileSection } from "./components/ProfileNav";
import { ProfileOverview } from "./components/ProfileOverview";
import { SavedPlacesSection } from "./components/SavedPlacesSection";
import { ChatHistorySection } from "./components/ChatHistorySection";
import { PreferencesSection } from "./components/PreferencesSection";
import { TripsSection } from "./components/TripsSection";
import { SettingsSection } from "./components/SettingsSection";

const PLACES_PER_PAGE = 8;

const VALID_SECTIONS: ProfileSection[] = [
  "overview",
  "saved-places",
  "chat-history",
  "preferences",
  "trips",
  "settings",
];

function parseSection(param: string | null): ProfileSection {
  if (param && VALID_SECTIONS.includes(param as ProfileSection)) {
    return param as ProfileSection;
  }
  return "overview";
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090909] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[#555]" />
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const { user, setUser } = useAuthStore();
  const [activeSection, setActiveSection] = useState<ProfileSection>(() =>
    parseSection(searchParams.get("tab"))
  );
  const [stats, setStats] = useState<UserStats | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlaceProfile[]>([]);
  const [placesPage, setPlacesPage] = useState(1);
  const [placesTotal, setPlacesTotal] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    setActiveSection(parseSection(searchParams.get("tab")));
  }, [searchParams]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await userService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchSavedPlaces = useCallback(async (page: number) => {
    setIsLoadingPlaces(true);
    try {
      const response = await userService.getSavedPlaces({ page, perPage: PLACES_PER_PAGE });
      setSavedPlaces(response.data);
      setPlacesTotal(response.meta.total);
    } catch (error) {
      console.error("Error fetching saved places", error);
    } finally {
      setIsLoadingPlaces(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchStats();
  }, [user, fetchStats]);

  useEffect(() => {
    if (!user || activeSection !== "saved-places") return;
    fetchSavedPlaces(placesPage);
  }, [user, activeSection, placesPage, fetchSavedPlaces]);

  const handleAvatarChange = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be under 5MB");
      return;
    }
    setAvatarError("");
    setIsUploadingAvatar(true);
    try {
      const updated = await userService.uploadAvatar(file);
      if (user) {
        setUser({ ...user, avatar_url: updated.avatar_url });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string }; message?: string } } };
      setAvatarError(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to upload avatar"
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleProfileUpdate = (data: { full_name: string; city?: string }) => {
    if (user) {
      setUser({ ...user, full_name: data.full_name, city: data.city });
    }
  };

  const handlePreferencesUpdate = (preferences: UserPreferences) => {
    if (user) {
      setUser({ ...user, preferences });
    }
  };

  const handleNavigate = (section: ProfileSection) => {
    setActiveSection(section);
    const url = section === "overview" ? "/profile" : `/profile?tab=${section}`;
    window.history.replaceState(null, "", url);
    if (section === "saved-places" && savedPlaces.length === 0 && !isLoadingPlaces) {
      fetchSavedPlaces(placesPage);
    }
  };

  if (!user) return null;

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const totalPages = Math.max(1, Math.ceil(placesTotal / PLACES_PER_PAGE));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#090909] text-white">
        <NavbarHome />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-[120px] pb-16">
          <ProfileHeader
            fullName={user.full_name}
            email={user.email}
            city={user.city}
            avatarUrl={user.avatar_url}
            joinedDate={joinedDate}
            isUploadingAvatar={isUploadingAvatar}
            onAvatarChange={handleAvatarChange}
          />

          {avatarError && (
            <div className="mt-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
              {avatarError}
            </div>
          )}

          <div className="mt-8 flex flex-col lg:flex-row gap-8">
            <ProfileNav
              active={activeSection}
              onChange={handleNavigate}
              counts={{
                savedPlaces: stats?.saved_places_count,
                chatSessions: stats?.chat_sessions_count,
                trips: stats?.ai_plans_created,
              }}
            />

            <div className="flex-1 min-w-0">
              {activeSection === "overview" && (
                <ProfileOverview
                  stats={stats}
                  isLoading={isLoadingStats}
                  onNavigate={handleNavigate}
                />
              )}

              {activeSection === "saved-places" && (
                <SavedPlacesSection
                  places={savedPlaces}
                  isLoading={isLoadingPlaces}
                  currentPage={placesPage}
                  totalPages={totalPages}
                  totalCount={placesTotal}
                  onPageChange={setPlacesPage}
                />
              )}

              {activeSection === "chat-history" && (
                <ChatHistorySection totalCount={stats?.chat_sessions_count} />
              )}

              {activeSection === "preferences" && (
                <PreferencesSection
                  preferences={user.preferences}
                  onPreferencesUpdate={handlePreferencesUpdate}
                />
              )}

              {activeSection === "trips" && (
                <TripsSection totalCount={stats?.ai_plans_created} />
              )}

              {activeSection === "settings" && (
                <SettingsSection
                  fullName={user.full_name}
                  city={user.city}
                  onProfileUpdate={handleProfileUpdate}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
