import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TotalRewards from "./TotalRewards";

jest.mock("../../apis/index", () => ({
  getTotalRewards: jest.fn(),
}));

describe("TotalRewards Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // renders Skeleton component initially
  test("renders Skeleton initially", async () => {
    render(<TotalRewards />);

    expect(screen.getByTestId("Skeleton-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("Skeleton-loader")).not.toBeInTheDocument();
    });
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });
});
