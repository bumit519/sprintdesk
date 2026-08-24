import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
  } from "vitest";
  
  import MockAdapter from "axios-mock-adapter";
  
  import { apiClient } from "./apiClient";
  import { refreshAccessToken } from "./auth.api";
  import { tokenStorage } from "./tokenStorage";
  import { useAuthStore } from "../auth.store";
  
  vi.mock("./auth.api", () => ({
    refreshAccessToken: vi.fn(),
  }));
  
  describe("Auth interceptor", () => {
    let mock: MockAdapter;
  
    beforeEach(() => {
      mock = new MockAdapter(apiClient);
  
      vi.clearAllMocks();
  
      tokenStorage.setRefreshToken("refresh-token");
  
      useAuthStore.getState().setAuth(
        {
          id: 1,
          username: "testuser",
          email: "test@test.com",
          firstName: "Test",
          lastName: "User",
          image: "",
        },
        "expired-token",
      );
    });
  
    it("refreshes token and retries the request after 401", async () => {
      vi.mocked(refreshAccessToken).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });
  
      mock.onGet("/auth/me")
        .replyOnce(401)
        .onGet("/auth/me")
        .replyOnce(200, {
          id: 1,
          username: "testuser",
        });
  
      const response = await apiClient.get("/auth/me");
  
      expect(response.status).toBe(200);
  
      expect(refreshAccessToken).toHaveBeenCalledWith(
        "refresh-token",
      );
  
      expect(
        useAuthStore.getState().accessToken,
      ).toBe("new-access-token");
    });
  
    it("does not refresh when there is no refresh token", async () => {
      tokenStorage.clearAll();
  
      mock.onGet("/auth/me").reply(401);
  
      await expect(
        apiClient.get("/auth/me"),
      ).rejects.toBeDefined();
  
      expect(refreshAccessToken).not.toHaveBeenCalled();
    });
  
    afterEach(() => {
      mock.restore();
    });
  });