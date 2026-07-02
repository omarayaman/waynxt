"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      theme="dark"
      toastOptions={{
        classNames: {
          toast: "bg-[#141414] border border-[#2a2a2a] text-white",
          success: "border-[#DFD616]/30",
          error: "border-red-500/30",
        },
      }}
    />
  );
}
