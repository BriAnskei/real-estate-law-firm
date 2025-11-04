import axios from "axios";
import { AuthApi } from "./auth.api";
import { setTokens } from "../../store/Slice/authSlice";
import { Store } from "@reduxjs/toolkit";
import { useToast } from "../../hooks/useToast";

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

// Handle expired token on 401
export async function responseIntercepter(store: Store) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      // const originalRequest = error.config;
      // if (error.response?.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true;
      //   // If another request is already refreshing
      //   if (isRefreshing) {
      //     return new Promise((resolve) => {
      //       refreshSubscribers.push((token) => {
      //         originalRequest.headers.Authorization = `Bearer ${token}`;
      //         resolve(api(originalRequest)); // retries all request
      //       });
      //     });
      //   }
      //   isRefreshing = true;
      //   try {
      //     const { errorToast } = useToast();
      //     const response = await AuthApi.refreshToken(
      //       store.getState().user.curUserId
      //     );
      //     if (!response.success) {
      //       return errorToast(response.message!);
      //     }
      //     store.dispatch(setTokens(response.data!));
      //     isRefreshing = false;
      //     onRefreshed(response.data!);
      //     originalRequest.headers.Authorization = `Bearer ${response.data!}`;
      //     return api(originalRequest);
      //   } catch (err) {
      //     isRefreshing = false;
      //     // store.dispatch(logout());
      //     return Promise.reject(err);
      //   }
      // }
      // return Promise.reject(error); // caller backend issues case
    }
  );
}

export default api;
