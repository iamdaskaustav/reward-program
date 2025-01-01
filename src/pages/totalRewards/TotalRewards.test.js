import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TotalRewards from "./TotalRewards";
import ApiService from "../../apis/index";

jest.mock("../../apis/index", () => ({
  getCustomers: jest.fn(),
  getTransactions: jest.fn(),
}));

describe("TotalRewards Component", () => {
  const mockCustomers = [
    { id: 1, customer_name: "John Doe" },
    { id: 2, customer_name: "Jane Smith" },
    {
      id: "3",
      customer_name: "Michael Johnson",
    },
    {
      id: "4",
      customer_name: "Emily Davis",
    },
    {
      id: "5",
      customer_name: "David Miller",
    },
  ];

  const mockTransactions = [
    {
      id: 1,
      purchase_date: 1698796800,
      product_name: "Wireless Mouse",
      product_price: 120.5,
      customerId: 1,
    },
    {
      id: 2,
      purchase_date: 1701398400,
      product_name: "Laptop Stand",
      product_price: 80.25,
      customerId: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // renders Skeleton component initially
  test("renders Skeleton initially", async () => {
    ApiService.getCustomers.mockResolvedValueOnce(mockCustomers);
    ApiService.getTransactions.mockResolvedValueOnce(mockTransactions);

    render(<TotalRewards />);

    expect(screen.getByTestId("Skeleton-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("Skeleton-loader")).not.toBeInTheDocument();
    });
  });

  // displays data correctly after loading
  test("displays data correctly after loading", async () => {
    ApiService.getCustomers.mockResolvedValueOnce(mockCustomers);
    ApiService.getTransactions.mockResolvedValueOnce(mockTransactions);

    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  //   handles API errors
  test("handles API errors", async () => {
    ApiService.getCustomers.mockRejectedValueOnce(new Error("API Error"));

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
    ApiService.getCustomers.mockResolvedValueOnce([]);
    ApiService.getTransactions.mockResolvedValueOnce([]);

    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });

  // calculates reward points correctly
  test("calculates reward points correctly", async () => {
    ApiService.getCustomers.mockResolvedValueOnce(mockCustomers);
    ApiService.getTransactions.mockResolvedValueOnce(mockTransactions);

    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText("90")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });
});
