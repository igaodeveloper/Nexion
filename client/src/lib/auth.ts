import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { LoginData, InsertUser } from "@shared/schema";

export async function login(data: LoginData): Promise<boolean> {
  try {
    await apiRequest("POST", "/api/auth/login", data);
    queryClient.invalidateQueries();
    return true;
  } catch (error) {
    return false;
  }
}

export async function register(data: Omit<InsertUser, "confirmPassword"> & { confirmPassword: string }): Promise<boolean> {
  try {
    const { confirmPassword, ...userData } = data;
    await apiRequest("POST", "/api/auth/register", userData);
    queryClient.invalidateQueries();
    return true;
  } catch (error) {
    return false;
  }
}

export async function logout(): Promise<boolean> {
  try {
    await apiRequest("POST", "/api/auth/logout", {});
    queryClient.clear();
    return true;
  } catch (error) {
    return false;
  }
}

export async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetch("/api/user", {
      credentials: "include",
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}
