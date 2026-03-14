// test-utils/msw/handlers/index.ts
import type { RequestHandler } from "msw";

// Default handlers — empty. Individual test files mock Convex via vi.mock("convex/react").
// Add non-Convex HTTP handlers here (e.g. upload endpoints, external APIs).
export const defaultHandlers: RequestHandler[] = [];
