"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { userService } from "@/services/user.service";
import { UserStats } from "@/types/user";
import { Place } from "@/types/places";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MapPin, Target, Trophy, Settings, Camera, LogOut } from "lucide-react";
import NavbarHome from "@/app/(home)/NavbarHome";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      try {
        const [statsData, placesData] = await Promise.all([
          userService.getStats(),
          userService.getSavedPlaces(1, 10)
        ]);
        setStats(statsData);
        setSavedPlaces(placesData.data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      } finally {
        setIsLoadingStats(false);
      }
    }
    fetchProfileData();
  }, [user]);

  if (!user) return null; // ProtectedRoute will handle redirect

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative pb-20">
        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#DFD616]/5 to-transparent pointer-events-none z-0"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#DFD616]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
        
        <NavbarHome />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-[150px]">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-[#333] pb-10">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-[#DFD616] overflow-hidden group">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={user.full_name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">{user.full_name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              {/* Overlay for avatar edit */}
              <button className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left mt-2">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold font-serif">{user.full_name}</h1>
                {user.badge_type === "explorer" || user.badge_type === "PRO EXPLORER" ? (
                  <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#DFD616] border border-[#DFD616]/30 bg-[#DFD616]/10 rounded-full flex items-center gap-1">
                    <Trophy size={12} /> PRO EXPLORER
                  </span>
                ) : null}
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Member since {joinedDate} • Based in {user.city || "Earth"}
              </p>
              
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <button className="px-6 py-2 bg-transparent border border-gray-600 hover:border-white hover:text-white text-gray-300 rounded-full text-sm font-medium transition-colors">
                  Edit Profile
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-600 hover:border-white flex items-center justify-center text-gray-300 hover:text-white transition-colors">
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl relative overflow-hidden group hover:border-[#333] transition-colors">
              <div className="absolute top-4 left-4 w-8 h-8 bg-[#DFD616]/10 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#DFD616]" />
              </div>
              <div className="mt-10">
                <h3 className="text-4xl font-bold font-serif mb-1">{isLoadingStats ? "-" : stats?.destinations_visited || 0}</h3>
                <p className="text-gray-500 text-sm">Destinations Visited</p>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl relative overflow-hidden group hover:border-[#333] transition-colors">
              <div className="absolute top-4 left-4 w-8 h-8 bg-[#DFD616]/10 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-[#DFD616]" />
              </div>
              <div className="mt-10">
                <h3 className="text-4xl font-bold font-serif mb-1">{isLoadingStats ? "-" : stats?.ai_plans_created || 0}</h3>
                <p className="text-gray-500 text-sm">AI Plans Created</p>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#222] p-6 rounded-2xl relative overflow-hidden group hover:border-[#333] transition-colors">
              <div className="absolute top-4 left-4 w-8 h-8 bg-[#DFD616]/10 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[#DFD616]" />
              </div>
              <div className="mt-10">
                <h3 className="text-4xl font-bold text-[#DFD616] font-serif mb-1">
                  {isLoadingStats ? "-" : (stats?.explorer_points || 0) >= 1000 ? `${((stats?.explorer_points || 0) / 1000).toFixed(1)}k` : stats?.explorer_points || 0}
                </h3>
                <p className="text-gray-500 text-sm">Explorer Points</p>
              </div>
            </div>
          </div>

          {/* Saved Places Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-[#DFD616]" /> Saved Places
            </h2>
            
            {savedPlaces.length === 0 ? (
              <div className="bg-[#141414] border border-[#222] rounded-2xl p-12 text-center">
                <p className="text-gray-400">You haven't saved any places yet.</p>
                <button className="mt-4 px-6 py-2 bg-[#DFD616] text-black font-medium rounded-full hover:bg-yellow-400 transition-colors">
                  Explore Places
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlaces.map(place => (
                  <div key={place.id} className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden group">
                    <div className="h-48 relative overflow-hidden">
                      {place.thumbnail_url ? (
                        <Image src={place.thumbnail_url} alt={place.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gray-800" />
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-lg mb-1">{place.name}</h4>
                      <p className="text-sm text-gray-400 mb-3">{place.city}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-[#222] px-2 py-1 rounded text-gray-300 capitalize">{place.category}</span>
                        <span className="text-xs bg-[#222] px-2 py-1 rounded text-gray-300 capitalize">{place.budget_level} Budget</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modals could be extracted to separate components in a real app, placed here for completeness */}
      {/* TODO: Add SettingsModals component handling the 4 forms: Profile, Preferences, Password, Delete Account */}
    </ProtectedRoute>
  );
}
