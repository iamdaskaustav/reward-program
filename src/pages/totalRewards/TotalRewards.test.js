import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
// Component
import TotalRewards from "./TotalRewards";

// Services
import BusinessLogicService from "../../utils/BusinessLogicService";
import ApiService from "../../apis";

// Mock
jest.mock("../../apis/index");
jest.mock("../../utils/BusinessLogicService.js");

describe("TotalRewards Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // check title loaded or not & render without crashing
  test("renders the title correctly", () => {
    render(<TotalRewards />);
    const titleElement = screen.getByText(/Total Rewards/i);
    expect(titleElement).toBeInTheDocument();
  });

  // show skeleton loader on init
  test("should show TableSkeleton when loader is true", () => {
    render(<TotalRewards />);
    expect(screen.getByText("Total Rewards")).toBeInTheDocument();
    // Simulating loader state
    waitFor(() => {
      expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
    });
  });

  // call getCustomer and getTransactions on page init
  test("should call getCustomers and getTransactions on init", async () => {
    ApiService.getCustomers.mockResolvedValue([
      { id: 1, customer_name: "John Doe" },
    ]);
    ApiService.getTransactionsByMonth.mockResolvedValue([
      {
        id: 5,
        purchase_date: 1722594600,
        product_name: "Bluetooth Keyboard",
        product_price: 123.05,
        customerId: 1,
      },
      {
        id: 50,
        purchase_date: 1722784600,
        product_name: "Bluetooth Headphones",
        product_price: 49,
        customerId: 1,
      },
    ]);

    BusinessLogicService.getTotalRewards.mockResolvedValue([
      {
        id: 1,
        customer_name: "John Doe",
        rewardPoints: 96,
      },
    ]);

    render(<TotalRewards />);

    await waitFor(() =>
      expect(ApiService.getCustomers).toHaveBeenCalledTimes(1)
    );
    await waitFor(() =>
      expect(ApiService.getTransactions).toHaveBeenCalledTimes(1)
    );
    await waitFor(() =>
      expect(BusinessLogicService.getTotalRewards).toHaveBeenCalledTimes(1)
    );
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    BusinessLogicService.getTotalRewards.mockResolvedValueOnce([]);

    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });
});
