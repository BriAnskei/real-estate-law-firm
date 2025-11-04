import { DecodedIdToken } from "firebase-admin/auth";
import admin from "../config/firebaseAdmin.js";
import { registration_request } from "../model/registration_request.model.js";
import { RegistrationRequestService } from "./registration_request.service.js";
import { UsersService } from "./user.service.js";
import { SignInPayload, ResponseType } from "../types/auth.types.js";
import { TokenUtils } from "../util/token.util.js";
import { TokenService } from "./token.service.js";

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

  /**
   *
   * issue a refresh and access tokens, saves the refreshToken in the DB
   */
  private static async handleSigninTokens(payload: {
    userId: string;
    rememberMe: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { userId, rememberMe } = payload;
      const tokens = await TokenService.generateTokens({
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

  private static async saveRefreshToken(payload: {
    userId: string;
    refreshToken: string;
    rememberMe: boolean;
  }): Promise<void> {
    try {
      const { refreshToken, rememberMe, userId } = payload;

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
        token: refreshToken,
        userId,
        expiresAt: expirationDate,
        rememberMeIssued: rememberMe,
      });
    } catch (error) {
      throw new Error("saveRefreshToken -> " + error);
    }
  }

  /**
   *
   * find token if it exist, handles token rotation
   * @returns new generatedTokens
   */
  static async refreshUserTokens(refreshToken: string): Promise<
    ResponseType<{
      accessToken: string;
      refreshToken: string;
      rememberMe: boolean;
    }>
  > {
    try {
      const validationResponse = await TokenService.validateRefreshToken(
        refreshToken
      );

      // if it exist or expired
      if (!validationResponse.success) {
        return { success: false, message: validationResponse.message };
      }

      const generatedTokens = await TokenService.handleTokenRotation({
        userId: validationResponse.data?.decodedUserId!,
        rememberMeIssued: validationResponse.data?.rememberMe!,
      });

      return {
        success: true,
        data: {
          ...generatedTokens,
          rememberMe: validationResponse.data?.rememberMe!,
        },
      };
    } catch (error) {
      throw new Error("refreshUserTokens -> " + error);
    }
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
