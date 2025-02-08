// Unit tests for: App

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-multi-carousel/lib/styles.css";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { App } from "../../App";
import "@testing-library/jest-dom";

// Mocking the useMutation hook from react-query
jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
}));

// Mocking the AccountService
jest.mock("../service/account/account", () => ({
  authenticateService: jest.fn(),
}));

describe("App() App method", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should render the Navbar and Footer components", () => {
      // Arrange: Render the App component within a Router
      render(
        <Router>
          <App />
        </Router>
      );

      // Assert: Check if Navbar and Footer are rendered
      expect(
        screen.getByText(/Every man deserves accessories/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Sign up for our newsletter/i)
      ).toBeInTheDocument();
    });

    it("should call the authenticateService when token is present", async () => {
      // Arrange: Mock localStorage and useMutation
      const mockMutateAsync = jest.fn();
      localStorage.setItem("token", "test-token");
      useMutation.mockReturnValue({ mutateAsync: mockMutateAsync });

      // Act: Render the App component
      render(
        <Router>
          <App />
        </Router>
      );

      // Assert: Check if authenticateService is called with the token
      expect(mockMutateAsync).toHaveBeenCalledWith("test-token");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle absence of token gracefully", () => {
      // Arrange: Ensure no token is in localStorage
      localStorage.removeItem("token");
      const mockMutateAsync = jest.fn();
      useMutation.mockReturnValue({ mutateAsync: mockMutateAsync });

      // Act: Render the App component
      render(
        <Router>
          <App />
        </Router>
      );

      // Assert: Check that authenticateService is not called
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it("should handle errors during authentication", async () => {
      // Arrange: Mock an error during authentication
      const mockMutateAsync = jest
        .fn()
        .mockRejectedValue(new Error("Authentication failed"));
      localStorage.setItem("token", "test-token");
      useMutation.mockReturnValue({ mutateAsync: mockMutateAsync });

      // Act: Render the App component
      render(
        <Router>
          <App />
        </Router>
      );

      // Assert: Check that the error is logged (console.log is not tested here)
      expect(mockMutateAsync).toHaveBeenCalledWith("test-token");
    });
  });
});

// End of unit tests for: App
