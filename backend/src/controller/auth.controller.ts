import { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";

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

  /**Generates new a tokens*/
  static async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;
  }
}
