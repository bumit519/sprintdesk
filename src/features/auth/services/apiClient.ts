import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "../auth.store";
import { refreshAccessToken } from "./auth.api";
import { tokenStorage } from "./tokenStorage";

const API_BASE_URL = "https://dummyjson.com";

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const accessToken =
      useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Refresh token when access token expires
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    // Only handle 401 responses
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken =
      tokenStorage.getRefreshToken();

    // No refresh token -> logout
    if (!refreshToken) {
      useAuthStore.getState().clearAuth();
      tokenStorage.clearAll();

      return Promise.reject(error);
    }

    try {
      console.log(
        "Access token expired. Refreshing...",
      );

      // Get new access token
      const data =
        await refreshAccessToken(refreshToken);

      const authStore = useAuthStore.getState();

      if (!authStore.user) {
        throw new Error(
          "Authenticated user not found",
        );
      }

      // Update access token in memory
      authStore.setAuth(
        authStore.user,
        data.accessToken,
      );

      // Save rotated refresh token if returned
      if (data.refreshToken) {
        tokenStorage.setRefreshToken(
          data.refreshToken,
        );
      }

      console.log(
        "Access token refreshed successfully.",
      );

      // Retry original request
      originalRequest.headers.Authorization =
        `Bearer ${data.accessToken}`;

      console.log("Retrying failed request...");

      return apiClient(originalRequest);
    } catch (refreshError) {
      console.error(
        "Token refresh failed:",
        refreshError,
      );

      useAuthStore.getState().clearAuth();
      tokenStorage.clearAll();

      return Promise.reject(refreshError);
    }
  },
);

// Development-only token expiration simulation
export async function simulateTokenExpiration() {
  const authStore = useAuthStore.getState();

  if (!authStore.user) {
    throw new Error("User is not authenticated");
  }

  // Intentionally replace the valid access token
  // with an invalid token.
  authStore.setAuth(
    authStore.user,
    "expired-access-token",
  );

  console.log(
    "TEST: Access token intentionally expired.",
  );

  // This request should receive 401.
  // The interceptor will refresh the token
  // and retry the request.
  return apiClient.get("/auth/me");
}