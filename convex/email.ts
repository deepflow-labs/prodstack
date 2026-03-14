import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Send a transactional email via Resend.
 *
 * Usage (from a Convex mutation/action):
 *   await ctx.runAction(api.email.sendEmail, {
 *     to: "user@example.com",
 *     subject: "Welcome to prodstack",
 *     html: "<p>Hello!</p>",
 *   });
 *
 * Requires RESEND_API_KEY in Convex environment variables.
 * Update the `from` address to your verified Resend sender domain.
 * See docs/email.md for setup instructions.
 */
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey)
      throw new Error("RESEND_API_KEY is not configured in Convex environment variables");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // TODO: Update to your verified Resend sender domain
        from: "prodstack <noreply@yourdomain.com>",
        to: args.to,
        subject: args.subject,
        html: args.html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend error ${res.status}: ${body}`);
    }

    return await res.json();
  },
});
