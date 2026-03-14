import { vi } from "vitest";

// Enable fake timers globally so convex-test's setTimeout(0) for scheduled
// functions is captured. shouldAdvanceTime keeps Date.now() accurate.
vi.useFakeTimers({ shouldAdvanceTime: true });
