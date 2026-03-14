/**
 * Password reset email template.
 *
 * Usage (from a Convex action):
 *   import { passwordResetEmail } from "../emails/password-reset";
 *   await ctx.runAction(api.email.sendEmail, {
 *     to: userEmail,
 *     subject: "Reset your password",
 *     html: passwordResetEmail({ resetUrl }),
 *   });
 *
 * Note: @convex-dev/auth handles password reset internally. Use this template
 * when implementing a custom reset flow, or when you want to customise the
 * email sent by the auth library.
 *
 * To use React Email instead:
 *   pnpm add @react-email/components @react-email/render
 *   Convert this file to a React component and call render() to get HTML.
 *   See https://react.email for documentation.
 */

interface PasswordResetEmailProps {
  resetUrl: string;
  appName?: string;
  expiresInMinutes?: number;
}

export function passwordResetEmail({
  resetUrl,
  appName = "prodstack",
  expiresInMinutes = 60,
}: PasswordResetEmailProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your ${appName} password</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;border:1px solid #e5e7eb;padding:40px;">
          <tr>
            <td>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">${appName}</h1>
              <p style="margin:0 0 24px;font-size:16px;color:#6b7280;">Your SaaS, ready to ship.</p>

              <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111827;">Reset your password</h2>
              <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.6;">
                We received a request to reset your password. Click the button below to choose a new password.
                This link expires in ${expiresInMinutes} minutes.
              </p>

              <a href="${resetUrl}"
                 style="display:inline-block;background-color:#18181b;color:#ffffff;font-size:14px;font-weight:600;padding:12px 24px;border-radius:6px;text-decoration:none;">
                Reset Password
              </a>

              <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />
              <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;">
                If you didn't request a password reset, you can safely ignore this email.
                Your password won't change.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                If the button doesn't work, copy this link: ${resetUrl}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
