import React, { createContext, useContext, useEffect, useState } from "react";

type ZenModeContextType = {
  zenMode: boolean;
  toggleZenMode: () => void;
  enableZenMode: () => void;
  disableZenMode: () => void;
};

const ZenModeContext = createContext<ZenModeContextType | undefined>(undefined);

export function ZenModeProvider({ children }: { children: React.ReactNode }) {
  const [zenMode, setZenMode] = useState(false);

  const toggleZenMode = () => setZenMode(!zenMode);
  const enableZenMode = () => setZenMode(true);
  const disableZenMode = () => setZenMode(false);

  // Handle keyboard shortcut (Ctrl+Shift+Z) to toggle zen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle zen mode on Ctrl+Shift+Z
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        toggleZenMode();
      }

      // Exit zen mode on Escape key when zen mode is active
      if (e.key === "Escape" && zenMode) {
        disableZenMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zenMode]);

  // Apply zen mode effect to body element for global styling
  useEffect(() => {
    if (zenMode) {
      document.body.classList.add("zen-mode");
    } else {
      document.body.classList.remove("zen-mode");
    }
  }, [zenMode]);

  return (
    <ZenModeContext.Provider
      value={{ zenMode, toggleZenMode, enableZenMode, disableZenMode }}
    >
      {children}
    </ZenModeContext.Provider>
  );
}

export function useZenMode() {
  const context = useContext(ZenModeContext);
  if (context === undefined) {
    throw new Error("useZenMode must be used within a ZenModeProvider");
  }
  return context;
}
