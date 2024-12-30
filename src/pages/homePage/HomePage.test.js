import React from "react";
import { render, screen } from "@testing-library/react";
import Homepage from "./Homepage";
describe("Homepage Component", () => {
  test("renders the title correctly", () => {
    render(<Homepage />);
    const titleElement = screen.getByText(/Welcome to Reward Program/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the subtitle correctly", () => {
    render(<Homepage />);
    const subtitleElement = screen.getByText(
      /A reward program based on purchase/i
    );
    expect(subtitleElement).toBeInTheDocument();
  });
});
