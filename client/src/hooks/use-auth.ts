import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { logout } from "@/lib/auth";
import { useLocation } from "wouter";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [_, setLocation] = useLocation();

  const {
    data: user,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

  const isAuthenticated = isSuccess && !!user;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isError) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isLoading, isError]);

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading && !isError && !isSuccess,
    logout: handleLogout,
  };
}
