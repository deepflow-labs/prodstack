# Email

prodstack uses [Resend](https://resend.com) for transactional email
and [React Email](https://react.email) for templates.

## Setup

### 1. Create a Resend account

Go to [resend.com](https://resend.com) and create a free account.

### 2. Add a verified sending domain

In the Resend dashboard → Domains, add and verify your domain.
During development you can send to your own email using the `resend.dev` sandbox
(no domain required), but the `from` address must use `@resend.dev`.

### 3. Create an API key

In Resend → API Keys, create a new key with "Sending access".

### 4. Add RESEND_API_KEY to Convex dashboard

Go to your Convex deployment → Settings → Environment Variables.
Add `RESEND_API_KEY` with your key.

**Note:** This goes in the Convex dashboard, NOT in `.env.local`.

### 5. Update the from address

Open `convex/email.ts` and update the `from` field:

```typescript
from: "Your App <noreply@yourdomain.com>",
```

## Sending an email

Call `api.email.sendEmail` from any Convex action or mutation:

```typescript
import { api } from "./_generated/api";

// In a Convex action:
await ctx.runAction(api.email.sendEmail, {
  to: "user@example.com",
  subject: "Welcome to My App",
  html: "<h1>Welcome!</h1><p>Thanks for signing up.</p>",
});
```

## Using React Email templates

Templates live in the `emails/` directory. They're standard React components.

```tsx
// emails/welcome.tsx
import { Html, Body, Text } from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Body>
        <Text>Hello {name}, welcome to prodstack!</Text>
      </Body>
    </Html>
  );
}
```

To render and send a template, use `@react-email/render` in a Convex action:

```typescript
import { render } from "@react-email/render";
import { WelcomeEmail } from "../emails/welcome";

// In a Convex action:
const html = render(<WelcomeEmail name={userName} />);
await ctx.runAction(api.email.sendEmail, {
  to: userEmail,
  subject: "Welcome!",
  html,
});
```

## Adding @react-email/render

Install if not already present:

```bash
pnpm add @react-email/render @react-email/components
```

## Existing templates

| Template       | File                        | Triggered by           |
| -------------- | --------------------------- | ---------------------- |
| Welcome        | `emails/welcome.tsx`        | First sign-in (manual) |
| Password reset | `emails/password-reset.tsx` | @convex-dev/auth       |
