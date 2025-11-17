import { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";
import { AuthRequest } from "../types/express.types.js";

export class AuthController {
  static async signIn(req: Request, res: Response): Promise<any> {
    const { email, password, role, rememberMe } = req.body;

    const response = await AuthService.signInVerification({
      email,
      password,
      role,
      rememberMe,
    });

    if (!response.success) {
      return res.json({ success: false, message: response.message });
    }

    res.cookie("refreshToken", response.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined,
    });

    res.json({
      success: true,
      data: response.data?.accessToken,
    });
  }

  static async googleSignin(req: AuthRequest, res: Response): Promise<any> {
    const decodedUser = req.user;
    const { rememberMe } = req.body;

    const response = await AuthService.googleSignin({
      data: decodedUser,
      rememberMe,
    });

    if (!response.success) {
      return res.json({ success: false, message: response.message! });
    }

    res.cookie("refreshToken", response.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined,
    });

    res.json({ success: true, data: response.data?.accessToken });
  }

  static async signUp(req: AuthRequest, res: Response): Promise<any> {
    const { firstName, lastName, password, role, email } = req.body;

    const response = await AuthService.signUp({
      firstName,
      lastName,
      password,
      role,
      email,
    });

    if (!response.success) {
      return res.json({ success: false, message: response.message });
    }

    res.json({
      success: true,
      message:
        "Submission successful. Please wait for the Administrator’s approval.",
    });
  }

  static async googleSignup(req: AuthRequest, res: Response): Promise<any> {
    const userData = req.user;
    const role = req.query.role as any;

    const response = await AuthService.googleSignupVerification(userData, role);

    if (!response.success) {
      return res.json({ success: false, message: response.message });
    }

    res.json({
      success: true,
      message:
        "Submission successful. Please wait for the Administrator’s approval.",
    });
  }

  /**
   * drop refreshToken and deletes http coodie
   */
  static async onSignOut(req: AuthRequest, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;
    await AuthService.handleSignOut(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ success: true, message: "Logged out successfully" });
  }

  /**Issue new tokens*/
  static async refreshToken(req: Request, res: Response): Promise<any> {
    const refreshToken = req.cookies.refreshToken;
    console.log("refreshing token: ", refreshToken);

    // no token to refresh
    if (!refreshToken)
      return res.json({ success: false, message: "Error please login again" });

    const response = await AuthService.refreshUserTokens(refreshToken);

    if (!response.success) {
      return res.json({ success: false, message: response.message });
    }

    res.cookie("refreshToken", response.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: response.data?.rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined,
    });

    // only return the access token
    res.json({ success: true, accessToken: response.data?.accessToken });
  }
}
