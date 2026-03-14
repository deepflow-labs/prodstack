import { vi, describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "sonner";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => "/settings",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn().mockResolvedValue(undefined)),
  useAction: vi.fn(() => vi.fn().mockResolvedValue(undefined)),
  useConvexAuth: vi.fn(() => ({ isLoading: false, isAuthenticated: true })),
}));

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: vi.fn(() => ({ signOut: vi.fn() })),
}));

import { useQuery, useMutation } from "convex/react";
const mockUseQuery = vi.mocked(useQuery);
const mockUseMutation = vi.mocked(useMutation);

import { testUser } from "@/test-utils/msw/handlers/users";
import SettingsPage from "@/app/(authenticated)/settings/page";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <>
      {ui}
      <Toaster />
    </>
  );
}

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue(vi.fn().mockResolvedValue(undefined) as never);
  });

  test("shows user email in account section", () => {
    const user = testUser();
    mockUseQuery.mockReturnValue(user);

    renderWithProviders(<SettingsPage />);

    // Email is displayed in a read-only Input — use getByDisplayValue
    expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
  });

  test("clicking 'Delete my account' opens confirmation dialog", async () => {
    const user = testUser();
    mockUseQuery.mockReturnValue(user);

    renderWithProviders(<SettingsPage />);

    const deleteButton = screen.getByRole("button", { name: /delete my account/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  test("confirm button is disabled until correct email is typed", async () => {
    const user = testUser();
    mockUseQuery.mockReturnValue(user);

    renderWithProviders(<SettingsPage />);

    const deleteButton = screen.getByRole("button", { name: /delete my account/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole("button", { name: /delete permanently/i });
    expect(confirmButton).toBeDisabled();

    const emailInput = screen.getByLabelText(/type your email to confirm/i);
    await userEvent.type(emailInput, "wrong@email.com");
    expect(confirmButton).toBeDisabled();

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, user.email);
    expect(confirmButton).not.toBeDisabled();
  });

  test("shows error toast when delete mutation fails", async () => {
    const user = testUser();
    mockUseQuery.mockReturnValue(user);
    const mockDeleteMutation = vi.fn().mockRejectedValue(new Error("Delete failed"));
    mockUseMutation.mockReturnValue(mockDeleteMutation as never);

    renderWithProviders(<SettingsPage />);

    const deleteButton = screen.getByRole("button", { name: /delete my account/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/type your email to confirm/i);
    await userEvent.type(emailInput, user.email);

    const confirmButton = screen.getByRole("button", { name: /delete permanently/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });
  });
});
