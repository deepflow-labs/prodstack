# Admin Panel

prodstack includes a minimal admin panel at `/admin` for user management.

## Access

Only users with `isAdmin: true` can access `/admin`.
Regular users are redirected away.

## Features

- **User list** — paginated list of all users (25 per page)
- **Search** — filter users by email (client-side on current page)
- **Ban/unban** — ban a user with a reason; unban at any time
- **Toggle admin** — grant or revoke admin privileges

## Making a user an admin

### Option 1: Convex dashboard

1. Go to your Convex deployment → Data → users table
2. Find the user by email
3. Set `isAdmin: true`

### Option 2: Via the admin panel

Once you have one admin, use the "Make admin" button in the UI to promote other users.

### Option 3: Create test users

`pnpm create-test-users` creates test users. After running it, manually set
`isAdmin: true` for the admin user in the Convex dashboard.

## Convex helpers

```typescript
import { requireAdminUser } from "./utils";

// In any Convex function — throws "Forbidden" if user is not admin:
const userId = await requireAdminUser(ctx);
```

## Extending the admin panel

### Add a new column

1. Add the field to the users schema in `convex/schema.ts`
2. Add it to `convex/admin.ts` queries if needed
3. Add the column to the table in `app/(authenticated)/admin/page.tsx`

### Add a new action (e.g. email user)

1. Add a mutation in `convex/admin.ts`
2. Add a button + handler in the admin page
3. Follow the existing ban/unban pattern

### Add a new admin section (e.g. reports)

1. Add a Convex table + functions with `requireAdminUser` guard
2. Create a new admin sub-page: `app/(authenticated)/admin/reports/page.tsx`
3. Add a nav link in the admin layout
