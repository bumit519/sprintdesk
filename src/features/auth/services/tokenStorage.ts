const REFRESH_TOKEN_KEY = "sprintdesk_refresh_token";
const USER_KEY = "sprintdesk_user";

import type { AuthUser } from "../auth.types";

export const tokenStorage = {
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  },

  setUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  clearAll(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};