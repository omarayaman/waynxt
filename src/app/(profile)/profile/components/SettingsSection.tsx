"use client";

import React, { useState } from "react";
import { User, Lock, Trash2 } from "lucide-react";
import { EditProfileForm } from "./EditProfileForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { LogoutSection } from "./LogoutSection";

type SettingsTab = "profile" | "security" | "account";

interface SettingsSectionProps {
  fullName: string;
  city?: string;
  onProfileUpdate: (data: { full_name: string; city?: string }) => void;
}

const tabs: { id: SettingsTab; label: string; desc: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", desc: "Name and location", icon: User },
  { id: "security", label: "Security", desc: "Password", icon: Lock },
  { id: "account", label: "Account", desc: "Delete account", icon: Trash2 },
];

export function SettingsSection({ fullName, city, onProfileUpdate }: SettingsSectionProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-medium text-white">Settings</h2>
        <p className="text-sm text-[#666] mt-1">Manage your profile, security, and account.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:w-44 shrink-0">
          {tabs.map(({ id, label, desc, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors whitespace-nowrap lg:whitespace-normal ${
                activeTab === id
                  ? "bg-[#161616] text-white"
                  : "text-[#777] hover:text-[#bbb] hover:bg-[#111]"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              <span>
                <span className="block text-sm">{label}</span>
                <span className="hidden lg:block text-[11px] text-[#555] mt-0.5">{desc}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0 lg:border-l lg:border-border lg:pl-8">
          {activeTab === "profile" && (
            <EditProfileForm initialName={fullName} initialCity={city} onSuccess={onProfileUpdate} />
          )}
          {activeTab === "security" && <ChangePasswordForm onSuccess={() => {}} />}
          {activeTab === "account" && <DeleteAccountSection />}
          <LogoutSection />
        </div>
      </div>
    </div>
  );
}