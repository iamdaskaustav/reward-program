import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import dayjs from "dayjs";
// Component
import TransactionPage from "./TransactionPage";
// Services
import BusinessLogicService from "../../utils/BusinessLogicService";
import ApiService from "../../apis";

// Mock
jest.mock("../../apis/index");
jest.mock("../../utils/BusinessLogicService.js");

describe("Transactions Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // check title loaded or not
  test("renders the title correctly", () => {
    render(<TransactionPage />);
    const titleElement = screen.getByText(/Transactions/i);
    expect(titleElement).toBeInTheDocument();
  });

  // render all the field without crashing
  test("should render without crashing", () => {
    render(<TransactionPage />);
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Month")).toBeInTheDocument();
    expect(screen.getByLabelText("End Month")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  // show skeleton loader on init
  test("should show TableSkeleton when loader is true", () => {
    render(<TransactionPage />);
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    // Simulating loader state
    waitFor(() => {
      expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
    });
  });

  //  change date picker and check update value
  test("should update startMonth and endMonth on DatePicker change", () => {
    render(<TransactionPage />);
    const startMonthPicker = screen.getByLabelText("Start Month");
    const endMonthPicker = screen.getByLabelText("End Month");

    // Simulate DatePicker change
    fireEvent.change(startMonthPicker, {
      target: { value: dayjs("2024-01-01") },
    });

    fireEvent.change(endMonthPicker, {
      target: { value: dayjs("2024-03-01") },
    });

    waitFor(() => {
      expect(screen.getByDisplayValue("2024-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-03")).toBeInTheDocument(); // endMonth auto-updated
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
    ]);

    BusinessLogicService.getTotalTransactions.mockResolvedValue([
      {
        id: 5,
        customer_name: "John Doe",
        purchase_date: 1722594600,
        product_name: "Bluetooth Keyboard",
        product_price: 123.05,
        rewardPoints: 96,
      },
    ]);

    render(<TransactionPage />);

    await waitFor(() =>
      expect(ApiService.getCustomers).toHaveBeenCalledTimes(1)
    );
    await waitFor(() =>
      expect(ApiService.getTransactionsByMonth).toHaveBeenCalledTimes(1)
    );
    await waitFor(() =>
      expect(BusinessLogicService.getTotalTransactions).toHaveBeenCalledTimes(1)
    );
  });

  // call getMergeData on submit
  test("should trigger getMergeData on submit", async () => {
    const mockCustomers = [{ id: 1, customer_name: "John Doe" }];
    const mockTransactions = [
      {
        id: 5,
        purchase_date: 1722594600,
        product_name: "Bluetooth Keyboard",
        product_price: 123.05,
        customerId: 1,
      },
    ];

    ApiService.getCustomers.mockResolvedValue(mockCustomers);
    ApiService.getTransactionsByMonth.mockResolvedValue(mockTransactions);
    BusinessLogicService.getTotalTransactions.mockResolvedValue([
      {
        id: 5,
        customer_name: "John Doe",
        purchase_date: 1722594600,
        product_name: "Bluetooth Keyboard",
        product_price: 123.05,
        rewardPoints: 96,
      },
    ]);

    render(<TransactionPage />);
    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(BusinessLogicService.getTotalTransactions).toHaveBeenCalledWith(
        mockCustomers,
        mockTransactions
      )
    );
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    BusinessLogicService.getTotalTransactions.mockResolvedValueOnce([]);

    render(<TransactionPage />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });
});
