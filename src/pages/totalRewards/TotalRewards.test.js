import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TotalRewards from "./TotalRewards";
import ApiService from "../../apis/index";

jest.mock("../../apis/index", () => ({
  getTotalRewards: jest.fn(),
}));

describe("TotalRewards Component", () => {
  const mockRewardData = [
    { id: "1", customer_name: "John Doe", rewardPoint: 1099 },
    { id: "2", customer_name: "Jane Smith", rewardPoint: 2662 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // renders Skeleton component initially
  test("renders Skeleton initially", async () => {
    ApiService.getTotalRewards.mockResolvedValueOnce(mockRewardData);

    render(<TotalRewards />);

    expect(screen.getByTestId("Skeleton-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("Skeleton-loader")).not.toBeInTheDocument();
    });
  });

  // displays data correctly after loading
  test("displays data correctly after loading", async () => {
    ApiService.getTotalRewards.mockResolvedValueOnce(mockRewardData);

    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("1099")).toBeInTheDocument();
    expect(screen.getByText("2662")).toBeInTheDocument();
  });

  //   handles API errors
  test("handles API errors", async () => {
    ApiService.getTotalRewards.mockRejectedValueOnce(new Error("API Error"));

    render(<TotalRewards />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "It seems like there’s an error occurred in the total rewards"
        )
      ).toBeInTheDocument();
    });
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    ApiService.getTotalRewards.mockResolvedValueOnce([]);

    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });

  // calculates reward points correctly
  test("calculates reward points correctly", async () => {
    ApiService.getTotalRewards.mockResolvedValueOnce(mockRewardData);

    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText("1099")).toBeInTheDocument();
      expect(screen.getByText("2662")).toBeInTheDocument();
    });
  });
});
