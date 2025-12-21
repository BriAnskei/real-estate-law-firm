import axios from "axios";
import { Store } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../store/store";
import { clearAuth, refreshTokens } from "../../store/Slice/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:4000",
  withCredentials: true,
});

export function setupAxiosInterceptors(store: Store) {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      // Get fresh token from store on each request
      const { accessToken } = (store.getState() as RootState).auth;

      if (accessToken && !config.headers["token"]) {
        config.headers["token"] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;

      if (error?.response?.status === 403 && !originalRequest?._retry) {
        originalRequest._retry = true;

        try {
          await (store.dispatch as AppDispatch)(refreshTokens()).unwrap();
          const { accessToken } = (store.getState() as RootState).auth;

          // Update the original request with new token
          if (accessToken) {
            originalRequest.headers["token"] = `Bearer ${accessToken}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          (store.dispatch as AppDispatch)(clearAuth());
          // If refresh fails, reject and let AuthContext handle redirect
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
}

export default api;
