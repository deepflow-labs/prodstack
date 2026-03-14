# Convex Backend

This directory contains the Convex backend functions for the application.

## Structure

- `schema.ts` - Database schema definition
- `auth.config.ts` - Clerk authentication configuration
- `utils.ts` - Shared utility functions for auth
- `userSettings.ts` - User settings/preferences functions
- `items.ts` - Example CRUD operations for items table
- `_generated/` - Auto-generated types (do not edit)

## Getting Started

1. Create a Convex project at https://dashboard.convex.dev
2. Add your `NEXT_PUBLIC_CONVEX_URL` to `.env.local`
3. Configure Clerk issuer URL in Convex dashboard environment variables
4. Run `pnpm dev:convex` to start the Convex dev server

## Authentication

This template uses Clerk for authentication. The auth flow:

1. User signs in via Clerk
2. Clerk provides a JWT token
3. Convex validates the token using `auth.config.ts`
4. Backend functions can access user identity via `ctx.auth.getUserIdentity()`

## Example: Items CRUD

The `items.ts` file demonstrates a complete CRUD pattern:

- `list` - Get all items for the current user
- `get` - Get a single item by ID
- `create` - Create a new item
- `update` - Update an existing item
- `remove` - Delete an item
- `toggleComplete` - Toggle item completion status

All operations are scoped to the authenticated user.
