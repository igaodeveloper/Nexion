import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Bell, UserCircle } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useZenMode } from "@/lib/zen-mode-provider";
import { ZenModeToggle } from "@/components/zen-mode-toggle";
import { BrowserTabs } from "@/components/browser-tabs";
import { QuickCapture } from "@/components/quick-capture";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { zenMode } = useZenMode();

  // Get the current organization name
  const companyName = "Nexion"; // In a real app, would be dynamic based on user's org

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-stripes">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden app-container">
      <Sidebar companyName={companyName} className="fixed h-screen z-20" />

      <div
        className={cn(
          "flex-1 pl-[70px] min-h-screen bg-stripes flex flex-col w-full",
          zenMode && "zen-mode-content",
          "transition-all duration-300 ease-in-out",
        )}
      >
        <div
          className={cn(
            "sticky top-0 z-10 bg-white border-b border-gray-200 flex justify-between items-center h-12 px-6 w-full",
          )}
        >
          <div className="flex items-center">
            <ZenModeToggle />
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/profile">
              <a className="text-gray-600 hover:text-primary">
                <UserCircle className="h-5 w-5" />
              </a>
            </Link>
          </div>
        </div>

        {/* Browser Tabs */}
        <div className={cn(zenMode ? "hidden" : "block", "w-full")}>
          <BrowserTabs />
        </div>

        <div
          className={cn("flex-1 p-6 overflow-y-auto w-full", zenMode && "p-0")}
        >
          {children}

          {/* Zen mode exit button (only visible in zen mode) */}
          {zenMode && (
            <div className="zen-exit-button">
              <ZenModeToggle variant="ghost" />
            </div>
          )}
        </div>
      </div>

      {/* Global Quick Capture */}
      <QuickCapture />
    </div>
  );
}
