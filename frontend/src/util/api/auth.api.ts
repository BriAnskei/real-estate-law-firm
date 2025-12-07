import { SignInInputType } from "../../hooks/useSignInVerification";
import { SignUpInputType } from "../../hooks/useSignUpVerification";
import { ApiResponseType } from "./apiResponseType";
import api from "./axiosInstance";

export class AuthApi {
  static async signIn(
    payload: SignInInputType
  ): Promise<ApiResponseType<string>> {
    try {
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

  static async googleSignIn(payload: {
    token: string;
    rememberMe: boolean;
  }): Promise<ApiResponseType<string>> {
    try {
      const { token, rememberMe } = payload;

      const res = await api.post(
        "/api/auth/signin/google",
        { rememberMe },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return { success: true, data: res.data.data };
    } catch (error) {
      throw error;
    }
  }

  static async signUp(
    signinInput: SignUpInputType
  ): Promise<ApiResponseType<undefined>> {
    try {
      const res = await api.post("/api/auth/signup", signinInput);

      if (!res.data.success)
        return { success: false, message: res.data.message };

      return { success: true, message: res.data.message };
    } catch (error) {
      throw error;
    }
  }

  static async googleSignUp(payload: {
    token: string;
    role: string;
  }): Promise<ApiResponseType<undefined>> {
    const { role, token } = payload;

    try {
      const res = await api.get("/api/auth/signup/google", {
        params: { role },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  static async onSignOut(): Promise<void> {
    try {
      const res = await api.post("/api/auth/signout", {});

      if (!res.data.success) {
        throw new Error(res.data.message);
      }
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
        throw new Error(res.data.message || undefined);
      }

      return res.data.accessToken;
    } catch (error) {
      throw error;
    }
  }
}
