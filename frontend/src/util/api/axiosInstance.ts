import axios from "axios";
import { Store } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

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

export function axiosInterceptor(store: Store) {
  // Attach token
  api.interceptors.request.use(
    (config) => {
      const token = (store.getState() as RootState).auth.accessToken;

      if (token) config.headers["token"] = token;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // // Handle 401 refresh logic
  // api.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const originalRequest = error.config;

  //     if (error.response?.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;

  //       if (isRefreshing) {
  //         return new Promise((resolve) => {
  //           refreshSubscribers.push((token) => {
  //             originalRequest.headers["token"] = token;
  //             resolve(api(originalRequest));
  //           });
  //         });
  //       }

  //       isRefreshing = true;

  //       try {
  //         const userId = store.getState().user.curUserId;
  //         const res = await AuthApi.refreshToken(userId);

  //         if (!res.success) {
  //           store.dispatch(logout());
  //           return Promise.reject(res.message);
  //         }

  //         const newToken = res.data;
  //         store.dispatch(setTokens(newToken));
  //         onRefreshed(newToken);
  //         originalRequest.headers["token"] = newToken;
  //         return api(originalRequest);
  //       } catch (err) {
  //         store.dispatch(logout());
  //         return Promise.reject(err);
  //       } finally {
  //         isRefreshing = false;
  //       }
  //     }

  //     return Promise.reject(error);
  //   }
  // );
}

export default api;
