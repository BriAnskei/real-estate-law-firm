import { DecodedIdToken } from "firebase-admin/auth";
import admin from "../config/firebaseAdmin.js";
import { registration_request } from "../model/registration_request.model.js";
import { RegistrationRequestService } from "./registration_request.service.js";
import { UsersService } from "./user.service.js";
import { SignInPayload, ResponseType } from "../types/auth.types.js";
import { TokenUtils } from "../util/token.util.js";
import { TokenService } from "./token.service.js";
import { MailerUtil } from "../util/mailer.util.js";
import { PasswordUtils } from "../util/password.util.js";

export class AuthService {
  static async signInVerification(
    payload: SignInPayload
  ): Promise<ResponseType<{ accessToken: string; refreshToken?: string }>> {
    try {
      const res = await UsersService.verifySignInCredentials(payload);
      if (!res.success) {
        return { success: false, message: res.message };
      }

      const tokens = await this.handleRequesTokens({
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

  static async googleSignin(payload: {
    data: admin.auth.DecodedIdToken;
    rememberMe: boolean;
  }): Promise<ResponseType<{ accessToken: string; refreshToken: string }>> {
    try {
      const { data, rememberMe } = payload;

      const userData = await UsersService.findUserByEmail(data.email!);

      // if the user does not exist
      if (!userData) {
        return { success: false, message: "User does not exist" };
      }

      // check if user using OAuth
      if (userData.provider !== "google") {
        return {
          success: false,
          message: "Please sign in with email and password instead.",
        };
      }

      const tokens = await this.handleRequesTokens({
        userId: userData.id!,
        rememberMe,
      });

      return { success: true, data: tokens };
    } catch (error) {
      throw error;
    }
  }

  static async signUp(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "founding-manager/admin" | "lawyer" | "paralegal" | "process-server";
  }): Promise<ResponseType<string>> {
    try {
      const { email, password, firstName, lastName, role } = payload;

      const isEmailExist = await this.ExistingEmail(email);

      if (isEmailExist) {
        return {
          success: false,
          message:
            "This email address is already in use. Please contact the Administrator.",
        };
      }

      await this.processRegistrationRequest({
        email,
        password_hash: await PasswordUtils.hashPassword(password),
        firstName,
        lastName,
        role,
        provider: "manual",
      });

      return { success: true };
    } catch (error) {
      throw new Error("signUp -> " + error);
    }
  }

  static async handleSignOut(refreshToken: string) {
    try {
      const hashedToken = TokenUtils.hashToken(refreshToken);

      await TokenService.deleteByToken(hashedToken);
    } catch (error) {
      throw new Error("handleSignOut -> " + error);
    }
  }

  static async googleSignupVerification(
    data: admin.auth.DecodedIdToken,
    role: "founding-manager/admin" | "lawyer" | "paralegal" | "process-server"
  ): Promise<ResponseType<{ acessToken: string; refreshToken: string }>> {
    try {
      const isExisting = await this.ExistingEmail(data.email);
      if (isExisting) {
        return {
          success: false,
          message:
            "This email address is already in use. Please contact the Administrator.",
        };
      }

      await this.processRegistrationRequest(
        this.decodeSignUpProvider(data, role)
      );

      return { success: true };
    } catch (error) {
      throw new Error("googleSignup -> " + error);
    }
  }

  private static async processRegistrationRequest(
    registrationRequest: registration_request
  ) {
    try {
      await RegistrationRequestService.createRegistrationRequest(
        registrationRequest
      );

      // send email after creating
      await MailerUtil.signUpEmailRequest(registrationRequest);
    } catch (error) {
      throw error;
    }
  }

  /**
   *  finds registration email on request or user tables if it exist
   */
  private static async ExistingEmail(
    email: string | undefined
  ): Promise<boolean> {
    if (!email) {
      throw new Error("No Provided email");
    }

    const userData = await UsersService.findUserByEmail(email);

    const registrationReqData =
      await RegistrationRequestService.findRegistrationByEmail(email);

    return Boolean(userData) || Boolean(registrationReqData);
  }

  /**
   *
   * issue a refresh and access tokens, saves the refreshToken in the DB
   */
  private static async handleRequesTokens(payload: {
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
      throw new Error("handleRequesTokens -> " + error);
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
      console.log(
        "validating refresh token -------------------------------------------"
      );
      const validationResponse = await TokenService.validateRefreshToken(
        refreshToken
      );
      const { success, message, data } = validationResponse;

      // if it exist or expired
      if (!validationResponse.success) {
        return { success, message };
      }

      const generatedTokens = await TokenService.handleTokenRotation({
        userId: data?.decodedUserId!,
        rememberMeIssued: data?.rememberMe!,
      });

      console.log(
        "fetched new refresh token -------------------------------------------"
      );
      return {
        success: true,
        data: {
          ...generatedTokens,
          rememberMe: validationResponse.data?.rememberMe!,
        },
      };
    } catch (error) {
      console.error("Failed to fetch token: ", error);

      throw error;
    }
  }

  async signUpProvider(
    providerToken: string
  ): Promise<ResponseType<DecodedIdToken>> {
    try {
      return {
        success: true,
        message: "Form submitted to admin, please wait for approval",
      };
    } catch (error) {
      throw error;
    }
  }

  private static decodeSignUpProvider(
    data: admin.auth.DecodedIdToken,
    role: "founding-manager/admin" | "lawyer" | "paralegal" | "process-server"
  ): registration_request {
    const [firstName, lastName] = data.name.split(" ");

    return {
      uid: data.uid,
      email: data.email!,
      firstName: firstName,
      lastName: lastName,
      role,
      provider: "google",
    };
  }
}
