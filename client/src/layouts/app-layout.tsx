import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Bell, UserCircle } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });
  
  // Get the current organization name
  const companyName = "Nexion"; // In a real app, would be dynamic based on user's org

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-stripes">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar companyName={companyName} />
      
      <div className="flex-1 ml-64 min-h-screen bg-stripes">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex justify-end items-center h-12 px-6">
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
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
