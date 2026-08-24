import axios from "axios";

import type {
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
} from "../auth.types";

const AUTH_BASE_URL = "https://dummyjson.com";

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await axios.post(
    `${AUTH_BASE_URL}/auth/login`,
    {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30,
    },
  );

  const data = response.data;

  const loginResponse: LoginResponse = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,

    user: {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    },
  };

  console.log("LOGIN API RESPONSE:", loginResponse);

  return loginResponse;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshResponse> {
  const response = await axios.post<RefreshResponse>(
    `${AUTH_BASE_URL}/auth/refresh`,
    {
      refreshToken,
      expiresInMins: 30,
    },
  );

  return response.data;
}