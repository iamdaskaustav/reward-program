import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MonthlyRewards from "./MonthlyRewardsv2";
import ApiService from "../../apis/index";
import dayjs from "dayjs";

jest.mock("../../apis/index");
describe("Transaction Component", () => {
  const mockCustomers = [
    {
      id: 1,
      customer_name: "John Doe",
    },
    {
      id: 2,
      customer_name: "Jane Smith",
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

  test("renders the title correctly", () => {
    render(<MonthlyRewards />);
    const titleElement = screen.getByText(/Monthly Rewards/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the date fields and submit button", () => {
    render(<MonthlyRewards />);

    expect(screen.getByLabelText(/start month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end month/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  //   displays data correctly after loading
  test("displays data correctly after loading", async () => {
    const mockStartMonth = dayjs().subtract(2, "month").startOf("month").unix();
    const mockEndMonth = dayjs().endOf("month").unix();

    ApiService.getCustomers.mockResolvedValue(mockCustomers);
    ApiService.getTransactionsByMonth.mockResolvedValue(mockTransactions);

    render(<MonthlyRewards />);

    await waitFor(() => {
      expect(ApiService.getTransactionsByMonth).toHaveBeenCalledWith(
        mockStartMonth,
        mockEndMonth
      );
    });
  });

  it("should update the table data when a new date range is selected", async () => {
    ApiService.getTransactionsByMonth.mockResolvedValue(mockTransactions);
    ApiService.getCustomers.mockResolvedValue(mockCustomers);

    render(<MonthlyRewards />);

    await waitFor(() =>
      expect(ApiService.getTransactionsByMonth).toHaveBeenCalled()
    );

    const startMonthPicker = screen.getByLabelText(/Start Month/i);
    fireEvent.change(startMonthPicker, {
      target: { value: dayjs().subtract(3, "month") },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(ApiService.getTransactionsByMonth).toHaveBeenCalledTimes(2)
    );
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    ApiService.getCustomers.mockResolvedValueOnce([]);
    ApiService.getTransactionsByMonth.mockResolvedValueOnce([]);

    render(<MonthlyRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });
});
