import React from "react";
import type { View } from "../types";

interface LandingPageProps {
  onNavigate: (v: View) => void;
  onAdminLogin: (code: string) => Promise<void>;
  onGuestLogin: (ref: string, surname: string, pass: string) => Promise<void>;
}

export default function LandingPage({
  onNavigate,
}: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[#f5f1ec]">
      
      <h1 className="text-4xl font-bold">MCN Manager</h1>

      <div className="flex gap-6">

        <button
          onClick={() => onNavigate("BRIDE_GROOM_PORTAL" as any)}
          className="px-8 py-6 bg-[#c9a96e] text-white rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Couples Login
        </button>

        <button
          onClick={() => onNavigate("ADMIN_DASHBOARD" as any)}
          className="px-8 py-6 bg-[#3e2f26] text-white rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Staff Access
        </button>

      </div>
    </div>
  );
}