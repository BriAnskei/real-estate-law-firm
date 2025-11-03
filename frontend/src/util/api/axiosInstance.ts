import axios from "axios";
import { store } from "../../store/store";
import { AuthApi } from "./auth.api";
import { setTokens } from "../../store/Slice/authSlice";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.request.use(async (config) => {
  let token = store.getState().auth.accessToken;

  // If no access token (e.g., user just refreshed the page)
  if (!token) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newAccessToken = await AuthApi.refreshToken();
        store.dispatch(setTokens(newAccessToken));
        token = newAccessToken;
      } catch (error) {
        console.error("Failed to refresh before request:", error);
      } finally {
        isRefreshing = false;
      }
    }
  }

  // Attach the token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If another request is already refreshing
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest)); // retries all request
          });
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await AuthApi.refreshToken();
        store.dispatch(setTokens(newAccessToken));
        isRefreshing = false;
        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        // store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error); // caller backend issues case
  }
);

export default api;
