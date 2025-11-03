import { DecodedIdToken } from "firebase-admin/auth";
import admin from "../config/firebaseAdmin.js";
import { registration_request } from "../model/registration_request.model.js";
import { RegistrationRequestService } from "./registration_request.service.js";
import { UsersService } from "./user.service.js";
import { SignInPayload, ResponseType } from "../types/auth.types.js";
import { TokenUtils } from "../util/token.util.js";
import { TokenService } from "./token.service.js";
import { refreshToken } from "../model/refreshToken.model.js";

export class AuthService {
  static async signInVerification(
    payload: SignInPayload
  ): Promise<ResponseType<{ accessToken: string; refreshToken?: string }>> {
    try {
      const res = await UsersService.verifySignInCredentials(payload);
      if (!res.success) {
        return { success: false, message: res.message };
      }

      const tokens = await this.handleSigninTokens({
        userId: res.data?.id!,
        rememberMe: payload.rememberMe,
      });

      return {
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (error) {
      throw new Error("-> signInVerification" + error);
    }
  }

  private static async handleSigninTokens(payload: {
    userId: string;
    rememberMe: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { userId, rememberMe } = payload;
      const tokens = await this.generateTokens({
        userId,
        rememberMe,
      });

      await this.saveRefreshToken({
        userId,
        refreshToken: tokens.refreshToken,
        rememberMe,
      });

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new Error("handleSigninTokens -> " + error);
    }
  }

  private static async generateTokens(payload: {
    userId: string;
    rememberMe: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { userId, rememberMe } = payload;

      let refreshToken = TokenUtils.generateRefreshToken({
        userId,
        rememberMe,
      });
      let accessToken = TokenUtils.generateAccessToken(payload.userId);

      return { refreshToken, accessToken };
    } catch (error) {
      throw new Error("generateTokens -> " + error);
    }
  }

  private static async saveRefreshToken(payload: {
    userId: string;
    refreshToken: string;
    rememberMe: boolean;
  }): Promise<void> {
    try {
      const { refreshToken, rememberMe, userId } = payload;

      const hashedRefreshtoken = TokenUtils.hashToken(refreshToken);

      // calculates expiration date
      const today = new Date();
      const expirationDate = new Date(today);
      if (rememberMe) {
        // +7 days
        expirationDate.setDate(today.getDate() + 7);
      } else {
        // +1 hour
        expirationDate.setHours(today.getHours() + 1);
      }

      await TokenService.createRefreshToken({
        token: hashedRefreshtoken,
        userId,
        expiresAt: expirationDate,
      });
    } catch (error) {
      throw new Error("saveRefreshToken -> " + error);
    }
  }

  static async refreshUserTokens(payload: {
    userId: string;
    oldRefreshToken: string;
  }): Promise<ResponseType<{ accessToken: string; refreshToken: string }>> {
    try {
      const { userId, oldRefreshToken } = payload;

      const fecthTokenResponse = await TokenService.findByToken(
        oldRefreshToken
      );

      if (!fecthTokenResponse.success) {
        return { success: false, message: fecthTokenResponse.message! };
      }

      const tokens = await AuthService.handleTokenRoatation({
        fecthTokenResponse,
        userId,
        oldRefreshToken,
      });

      return {
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (error) {
      throw new Error("refreshUserTokens -> " + error);
    }
  }

  private static async handleTokenRoatation(payload: {
    fecthTokenResponse: ResponseType<refreshToken>;
    userId: string;
    oldRefreshToken: string;
  }) {
    const { fecthTokenResponse, userId, oldRefreshToken } = payload;

    // valdate rememberMe option
    // if token expires > 1hr new refreshToken expires for 7 days again
    // otherwise new refreshToken expires for 1h
    const now = new Date();
    const oneHour = 60 * 60 * 1000; // 1h in milliseconds;
    const timeUntilExpiry =
      fecthTokenResponse.data!.expiresAt.getTime() - now.getTime();

    const rememberMe = timeUntilExpiry > oneHour;

    // calculate expiration date for the new token(refreshTon in DB)
    const today = new Date();
    const expirationDate = new Date(today);
    if (rememberMe) {
      // +7 days
      expirationDate.setDate(today.getDate() + 7);
    } else {
      // +1 hour
      expirationDate.setHours(today.getHours() + 1);
    }

    const tokens = await this.generateTokens({ userId, rememberMe });
    await TokenService.refreshOldToken({
      oldToken: oldRefreshToken,
      userId,
      newToken: tokens.refreshToken,
      expiresAt: expirationDate,
    });
    return tokens;
  }

  async signUpProvider(
    providerToken: string
  ): Promise<ResponseType<DecodedIdToken>> {
    try {
      const { success, message, data } = await this.verifySignUpProvider(
        providerToken
      );
      if (!success) {
        return { success, message };
      }

      await RegistrationRequestService.createRegistrationRequest(
        this.decodeSignUpProvider(data!, "google")
      );

      return {
        success: true,
        message: "Form submitted to admin, please wait for approval",
      };
    } catch (error) {
      throw error;
    }
  }

  async verifySignUpProvider(
    providerToken: string
  ): Promise<ResponseType<DecodedIdToken>> {
    try {
      const decoded = await this.decodeProviderToken(providerToken);
      const isExisting = await this.isProviderUidExist(decoded.uid);

      if (isExisting) {
        return {
          success: false,
          message:
            "This email is already in the request, please wait for Founder/Admin approval",
        };
      }

      return { success: true, data: decoded };
    } catch (error) {
      throw error;
    }
  }

  private async isProviderUidExist(uid: string): Promise<boolean> {
    try {
      const data = await RegistrationRequestService.getRegistrationRequestByUid(
        uid
      );
      return Boolean(data);
    } catch (error) {
      throw error;
    }
  }

  private async decodeProviderToken(token: string): Promise<DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (error) {
      throw error;
    }
  }

  private decodeSignUpProvider(
    data: DecodedIdToken,
    provider: "manual" | "google"
  ): registration_request {
    return {
      uid: data.uid,
      email: data.email!,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      provider,
    };
  }
}
