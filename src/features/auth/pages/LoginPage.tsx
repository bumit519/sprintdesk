import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuthStore } from "../auth.store";
import { loginUser } from "../services/auth.api";
import { tokenStorage } from "../services/tokenStorage";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      const data = await loginUser({
        username,
        password,
      });

      // Store access token in memory
      setAuth(data.user, data.accessToken);
      console.log(
        "AFTER LOGIN:",
        useAuthStore.getState()
      );
      // Store refresh token in localStorage
      tokenStorage.setRefreshToken(data.refreshToken);
      tokenStorage.setUser(data.user);
      // Redirect after successful login
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("STATUS:", error.response?.status);
        console.log("SERVER RESPONSE:", error.response?.data);
      } else {
        console.error("UNKNOWN ERROR:", error);
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to SprintDesk
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to your workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}