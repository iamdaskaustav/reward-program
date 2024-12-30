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
    {
      id: 3,
      purchase_date: 1704076800,
      product_name: "Mechanical Keyboard",
      product_price: 250.99,
      customerId: 3,
    },
    {
      id: 4,
      purchase_date: 1706755200,
      product_name: "Bluetooth Headphones",
      product_price: 300.75,
      customerId: 4,
    },
    {
      id: 5,
      purchase_date: 1709347200,
      product_name: "USB-C Cable",
      product_price: 15.1,
      customerId: 5,
    },
    {
      id: 6,
      purchase_date: 1712025600,
      product_name: "External Hard Drive",
      product_price: 349.49,
      customerId: 6,
    },
    {
      id: 7,
      purchase_date: 1714617600,
      product_name: "Portable Charger",
      product_price: 50.99,
      customerId: 7,
    },
    {
      id: 8,
      purchase_date: 1717296000,
      product_name: "Smartphone Case",
      product_price: 20.75,
      customerId: 8,
    },
    {
      id: 9,
      purchase_date: 1719974400,
      product_name: "Wireless Earbuds",
      product_price: 199.99,
      customerId: 9,
    },
    {
      id: 10,
      purchase_date: 1722566400,
      product_name: "Tablet Stand",
      product_price: 45.2,
      customerId: 10,
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
