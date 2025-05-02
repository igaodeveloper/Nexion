import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRoutes } from "./routes";
import { WelcomeScreen } from "@/components/welcome-screen";
import { Router, useLocation } from "wouter";

function App() {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Check if this is the first time the user is visiting the app
    const hasSeenWelcome = localStorage.getItem('nexion_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcomeScreen(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem('nexion_welcome_seen', 'true');
    setShowWelcomeScreen(false);
    // Navigate to login page instead of directly to dashboard
    setLocation("/login");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {showWelcomeScreen ? (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        ) : (
          <AppRoutes />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
