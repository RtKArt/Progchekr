import React, { useState, useEffect } from "react";
import { onInstallAvailable, promptInstall, isStandalone } from "./pwa";
import { Download, X } from "lucide-react";

export function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("progchek_install_dismissed") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Don't show if already installed or user dismissed
    if (isStandalone() || dismissed) return;

    const unsub = onInstallAvailable((available) => {
      setShowBanner(available);
    });
    return unsub;
  }, [dismissed]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    try {
      localStorage.setItem("progchek_install_dismissed", "1");
    } catch {}
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-[#2a2a2a] border border-[#444] rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
        {/* Icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-b from-[#333] to-[#1a1a1a] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 512 512" fill="none">
            <polyline
              points="128,260 215,345 384,170"
              stroke="#00cc44"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className="text-white text-[16px] leading-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Install Progchekr
          </p>
          <p className="text-[#888] text-xs leading-tight mt-0.5">
            Add to home screen for offline access
          </p>
        </div>

        {/* Install button */}
        <button
          onClick={handleInstall}
          className="shrink-0 flex items-center gap-1.5 bg-[#00cc44] hover:bg-[#00b33c] text-black px-3 py-1.5 rounded-lg transition-colors"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          <Download className="w-4 h-4" />
          <span className="text-[14px]">Install</span>
        </button>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="shrink-0 text-[#666] hover:text-[#999] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
