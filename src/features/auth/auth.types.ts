export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthUser {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
  }
  
  export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }
  
  export interface RefreshResponse {
    accessToken: string;
    refreshToken?: string;
  }