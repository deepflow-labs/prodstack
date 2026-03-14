import { vi, describe, test, expect, beforeEach } from "vitest";
import { renderPage, screen, waitFor } from "@/test-utils/render";
import userEvent from "@testing-library/user-event";

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: vi.fn(),
}));

import LoginPage from "../page";
import { useAuthActions } from "@convex-dev/auth/react";

const mockUseAuthActions = vi.mocked(useAuthActions);

describe("LoginPage", () => {
  beforeEach(() => {
    mockUseAuthActions.mockReturnValue({
      signIn: vi.fn().mockRejectedValue(new Error("Invalid credentials")),
      signOut: vi.fn(),
    } as unknown as ReturnType<typeof useAuthActions>);
  });

  test("renders email and password fields", () => {
    renderPage(<LoginPage />);

    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("shows error message on failed sign in", async () => {
    const user = userEvent.setup();
    renderPage(<LoginPage />);

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.clear(emailInput);
    await user.type(emailInput, "wrong@example.com");
    await user.clear(passwordInput);
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("shows disabled state while signing in", async () => {
    // Make signIn hang so we can observe the loading state
    let resolveSignIn: () => void;
    const hangingPromise = new Promise<void>(resolve => {
      resolveSignIn = resolve;
    });

    mockUseAuthActions.mockReturnValue({
      signIn: vi.fn().mockReturnValue(hangingPromise),
      signOut: vi.fn(),
    } as unknown as ReturnType<typeof useAuthActions>);

    const user = userEvent.setup();
    renderPage(<LoginPage />);

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");
    await user.clear(passwordInput);
    await user.type(passwordInput, "testpassword");
    await user.click(submitButton);

    await waitFor(() => {
      // While loading, button text changes to "Signing in…" — query by type/disabled state
      const btn = screen.getByRole("button", { name: /sign/i });
      expect(btn).toBeDisabled();
    });

    // Resolve to avoid unhandled promise rejections
    resolveSignIn!();
  });
});
