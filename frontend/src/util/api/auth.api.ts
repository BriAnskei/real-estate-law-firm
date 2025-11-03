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

  /**
   * generates a new acces token for axios intance
   */
  static async refreshToken(userId: string): Promise<string> {
    try {
      const res = await api.post(
        "/auth/refresh",
        { userId },
        { withCredentials: true } // sends the HTTP-only cooker
      );

      return res.data.accessToken;
    } catch (error) {
      throw error;
    }
  }
}
