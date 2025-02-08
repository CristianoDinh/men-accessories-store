// Unit tests for: LoginPage

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginPage } from "../../pages/auth/LoginPage";
import "@testing-library/jest-dom";

// Mock the useMutation hook from react-query
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

// Mock the AccountService
jest.mock("../../../service/account/account", () => ({
  loginService: jest.fn(),
}));

describe("LoginPage() LoginPage method", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should render the login page correctly", () => {
      // Render the component
      render(
        <Router>
          <LoginPage />
        </Router>
      );

      // Check if the elements are rendered
      expect(screen.getByPlaceholderText("Enter email...")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter password...")
      ).toBeInTheDocument();
      expect(screen.getByText("Sign in")).toBeInTheDocument();
    });

    it("should allow user to toggle password visibility", () => {
      render(
        <Router>
          <LoginPage />
        </Router>
      );

      const toggleButton = screen.getByText("Show password");
      const passwordInput = screen.getByPlaceholderText("Enter password...");

      // Initially, the password should be hidden
      expect(passwordInput).toHaveAttribute("type", "password");

      // Click to show password
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      // Click to hide password again
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should submit the form with valid inputs", async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue({ code: "SUCCESS" });
      useMutation.mockReturnValue({
        mutateAsync: mockMutateAsync,
      });

      render(
        <Router>
          <LoginPage />
          <ToastContainer />
        </Router>
      );

      fireEvent.change(screen.getByPlaceholderText("Enter email..."), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByText("Sign in"));

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(
        screen.getByText("Login successful, redirect to homepage")
      ).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should show error when email is invalid", async () => {
      render(
        <Router>
          <LoginPage />
          <ToastContainer />
        </Router>
      );

      fireEvent.change(screen.getByPlaceholderText("Enter email..."), {
        target: { value: "invalid-email" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByText("Sign in"));

      await waitFor(() => {
        expect(
          screen.getByText("Please enter a valid email address")
        ).toBeInTheDocument();
      });
    });

    it("should show error when password is less than 8 characters", async () => {
      render(
        <Router>
          <LoginPage />
          <ToastContainer />
        </Router>
      );

      fireEvent.change(screen.getByPlaceholderText("Enter email..."), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
        target: { value: "short" },
      });

      fireEvent.click(screen.getByText("Sign in"));

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 8 characters long")
        ).toBeInTheDocument();
      });
    });

    it("should show error when fields are empty", async () => {
      render(
        <Router>
          <LoginPage />
          <ToastContainer />
        </Router>
      );

      fireEvent.click(screen.getByText("Sign in"));

      await waitFor(() => {
        expect(screen.getByText("Please input all fields")).toBeInTheDocument();
      });
    });

    it("should show error when login fails with wrong credentials", async () => {
      const mockMutateAsync = jest
        .fn()
        .mockResolvedValue({ code: "USERNAME_OR_PASSWORD_WRONG" });
      useMutation.mockReturnValue({
        mutateAsync: mockMutateAsync,
      });

      render(
        <Router>
          <LoginPage />
          <ToastContainer />
        </Router>
      );

      fireEvent.change(screen.getByPlaceholderText("Enter email..."), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter password..."), {
        target: { value: "wrongpassword" },
      });

      fireEvent.click(screen.getByText("Sign in"));

      await waitFor(() => {
        expect(
          screen.getByText("Wrong email or password, try again")
        ).toBeInTheDocument();
      });
    });
  });
});

// End of unit tests for: LoginPage
