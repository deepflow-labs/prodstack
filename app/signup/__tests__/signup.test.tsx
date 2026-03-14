import { vi, describe, test, expect, beforeEach } from "vitest";
import { renderPage, screen, waitFor } from "@/test-utils/render";
import userEvent from "@testing-library/user-event";

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: vi.fn(),
}));

import SignupPage from "../page";
import { useAuthActions } from "@convex-dev/auth/react";

const mockUseAuthActions = vi.mocked(useAuthActions);

describe("SignupPage", () => {
  beforeEach(() => {
    mockUseAuthActions.mockReturnValue({
      signIn: vi.fn().mockRejectedValue(new Error("User already exists")),
      signOut: vi.fn(),
    } as unknown as ReturnType<typeof useAuthActions>);
  });

  test("renders email and password fields", () => {
    renderPage(<SignupPage />);
    expect(screen.getByRole("heading", { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  test("shows duplicate email error message on failed signup", async () => {
    const user = userEvent.setup();
    renderPage(<SignupPage />);

    await user.type(screen.getByLabelText(/email address/i), "existing@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/an account with this email already exists/i)).toBeInTheDocument();
    });
  });
});
