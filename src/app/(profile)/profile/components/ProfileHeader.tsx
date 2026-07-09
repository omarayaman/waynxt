"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  city?: string;
  avatarUrl?: string;
  joinedDate: string;
  isUploadingAvatar: boolean;
  onAvatarChange: (file: File) => void;
}

export function ProfileHeader({
  fullName,
  email,
  city,
  avatarUrl,
  joinedDate,
  isUploadingAvatar,
  onAvatarChange,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAvatarChange(file);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-5 pb-8 border-b border-border">
      <div className="relative shrink-0">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#161616] group">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-medium text-[#666]">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
            aria-label="Change avatar"
          >
            {isUploadingAvatar ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Camera className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-semibold text-white truncate">{fullName}</h1>
        <p className="text-sm text-[#777] truncate mt-0.5">{email}</p>
        <p className="text-xs text-[#555] mt-1.5">
          {[city, `Member since ${joinedDate}`].filter(Boolean).join(" · ")}
        </p>
      </div>
    </div>
  );
}
