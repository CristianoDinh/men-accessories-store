// Unit tests for: RefundManager

import React from "react";
import { render, screen } from "@testing-library/react";
import { RefundManager } from "../RefundManager";
import "@testing-library/jest-dom";

// Mock components used within RefundManager
jest.mock("../../../components/navbar/Dashnav", () => ({
  Dashnav: () => <div data-testid="dashnav">Dashnav Component</div>,
}));

jest.mock("../../../components/private/refund/RefundList", () => ({
  RefundList: () => <div data-testid="refund-list">RefundList Component</div>,
}));

jest.mock("../../../components/modal/RefundDetail", () => ({
  RefundDetail: () => (
    <div data-testid="refund-detail">RefundDetail Component</div>
  ),
}));

describe("RefundManager() RefundManager method", () => {
  // Happy Path Tests
  describe("Happy Path", () => {
    beforeEach(() => {
      // Mock localStorage for user data
      const user = { fullName: "John Doe", email: "john.doe@example.com" };
      localStorage.setItem("user", JSON.stringify(user));
    });

    it("should render the RefundManager component with user information", () => {
      // Render the component
      render(<RefundManager />);

      // Check if the RefundDetail component is rendered
      expect(screen.getByTestId("refund-detail")).toBeInTheDocument();

      // Check if the Dashnav component is rendered
      expect(screen.getByTestId("dashnav")).toBeInTheDocument();

      // Check if the user information is displayed correctly
      expect(screen.getByText("Hi, John Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle missing user data gracefully", () => {
      // Clear localStorage to simulate missing user data
      localStorage.removeItem("user");

      // Render the component
      render(<RefundManager />);

      // Check if the user information section is empty or displays default text
      expect(screen.queryByText("Hi,")).not.toBeInTheDocument();
    });

    it("should handle malformed user data gracefully", () => {
      // Set malformed user data in localStorage
      localStorage.setItem("user", "malformed data");

      // Render the component
      render(<RefundManager />);

      // Check if the user information section is empty or displays default text
      expect(screen.queryByText("Hi,")).not.toBeInTheDocument();
    });
  });
});

// End of unit tests for: RefundManager
