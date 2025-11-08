import nodemailer from "nodemailer";
import { registration_request } from "../model/registration_request.model.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class MailerUtil {
  static async adminApprovalEmail(registrationRequest: registration_request) {
    try {
      const mail: MailOptions = {
        to: registrationRequest.email,
        subject:
          "Registration Approved – Welcome to Anino Real Estate Law Firm!",
        text: `Dear ${registrationRequest.firstName || "User"},

We are pleased to inform you that your registration with Anino Real Estate Law Firm has been approved!

You can now log in to your account and start.

Welcome aboard.

Best regards,
Anino Real Estate Law Firm Team`,
        html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #1a73e8;">ANINO REAL ESTATE LAW FIRM</h2>
      <p>Dear ${registrationRequest.firstName || "User"},</p>
      <p>
        We are pleased to inform you that your registration with
        <strong>Anino Real Estate Law Firm</strong> has been
        <strong style="color: #1a73e8;">approved!</strong>
      </p>
      <p>
          You can now log in to your account and start.
      </p>
      <p>
        Welcome aboard.
      </p>
      <p>Best regards,<br/><strong>Anino Real Estate Law Firm Team</strong></p>
      <hr style="border:none; border-top:1px solid #ccc; margin:20px 0;" />
      <p style="font-size: 12px; color: #777;">
        This is an automated message from Anino Real Estate Law Firm. Please do not reply directly to this email.
      </p>
    </div>
  `,
      };

      await this.sendEmail(mail);
    } catch (error) {
      console.error("❌ Error sending approval email:", error);
      throw error;
    }
  }

  static async adminRejectionEmail(
    registrationRequest: registration_request,
    reason: string
  ) {
    try {
      const mail: MailOptions = {
        to: registrationRequest.email,
        subject: "Registration Update – Application Rejected",
        text: `Dear ${registrationRequest.firstName || "User"},

We regret to inform you that your registration with Anino Real Estate Law Firm has been rejected.

Reason for rejection:
"${reason}"

If you believe this was a mistake or would like to reapply, please contact us.

Thank you for your understanding.

Best regards,
Anino Real Estate Law Firm Team`,
        html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #d93025;">ANINO REAL ESTATE LAW FIRM</h2>
      <p>Dear ${registrationRequest.firstName || "User"},</p>
      <p>
        We regret to inform you that your registration with
        <strong>Anino Real Estate Law Firm</strong> has been
        <strong style="color: #d93025;">rejected</strong>.
      </p>
      <p><strong>Reason for rejection:</strong></p>
      <blockquote style="border-left: 4px solid #d93025; padding-left: 10px; color: #555; font-style: italic;">
        ${reason || "No specific reason was provided."}
      </blockquote>
      <p>
        If you believe this was an error or wish to reapply, please contact our
        support team or submit a new registration.
      </p>
      <p>Thank you for your understanding.</p>
      <p>Best regards,<br/><strong>Anino Real Estate Law Firm Team</strong></p>
      <hr style="border:none; border-top:1px solid #ccc; margin:20px 0;" />
      <p style="font-size: 12px; color: #777;">
        This is an automated message from Anino Real Estate Law Firm. Please do not reply directly to this email.
      </p>
    </div>
  `,
      };

      await this.sendEmail(mail);
    } catch (error) {
      console.error("❌ Error sending rejection email:", error);
      throw error;
    }
  }

  static async signUpEmailRequest(registrationRequest: registration_request) {
    try {
      const mail: MailOptions = {
        to: registrationRequest.email,
        subject: "Registration Successful – Pending Approval",
        text: `Dear ${registrationRequest.firstName || "User"},

Thank you for signing up with Anino Real Estate Law Firm. Your registration has been received successfully.

Our Founding Manager/Admin will review your request shortly. Please wait for the approval process to complete — we’ll notify you by email once your account has been approved.

Thank you for your patience and interest in joining us.

Best regards,
Anino Real Estate Law Firm Team`,
        html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #1a73e8;">ANINO REAL ESTATE LAW FIRM</h2>
      <p>Dear ${registrationRequest.firstName || "User"},</p>
      <p>
        Thank you for signing up with <strong>Anino Real Estate Law Firm</strong>.
        Your registration has been received successfully.
      </p>
      <p>
        Our Founding Manager/Admin will review your request shortly. Please wait for
        the approval process to complete — we’ll notify you by email once your
        account has been approved.
      </p>
      <p>Thank you for your patience and interest in joining us.</p>
      <p>Best regards,<br/><strong>Anino Real Estate Law Firm Team</strong></p>
      <hr style="border:none; border-top:1px solid #ccc; margin:20px 0;" />
      <p style="font-size: 12px; color: #777;">
        This is an automated message from Anino Real Estate Law Firm. Please do not reply directly to this email.
      </p>
    </div>
  `,
      };

      await this.sendEmail(mail);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }

  private static async sendEmail({ to, subject, text, html }: MailOptions) {
    try {
      const info = await transporter.sendMail({
        from: `"ANINO Real estate official" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });

      console.log("✅ Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw error;
    }
  }
}
