import { ReactNode } from "react";
import { Logo } from "@/components/logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-[420px] p-10 bg-background rounded-xl">
        <div className="flex justify-center mb-8">
          <Logo size="lg" variant="full" />
        </div>
        {children}
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Nexion. All rights reserved.</p>
      </div>
    </div>
  );
}
