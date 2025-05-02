import { ReactNode } from "react";
import { Logo } from "@/components/logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stripes">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
