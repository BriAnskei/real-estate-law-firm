import { SignInInputType } from "../../hooks/useSignInVerification";
import { ApiResponseeType } from "./apiResponseType";
import api from "./axiosInstance";

export class AuthApi {
  static async signIn(
    payload: SignInInputType
  ): Promise<ApiResponseeType<string>> {
    try {
      console.log("res: ");
      const res = await api.post("/api/auth/signin", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return { success: true, data: res.data.data };
    } catch (error) {
      throw error;
    }
  }

  static async refreshAccessToken(): Promise<string> {
    try {
      const res = await api.post(
        "/api/auth/refresh",
        {},
        { withCredentials: true } // sends the HTTP-only cooker
      );

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      return res.data.accessToken;
    } catch (error) {
      throw error;
    }
  }
}
