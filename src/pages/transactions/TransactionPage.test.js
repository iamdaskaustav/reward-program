import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionPage from "./TransactionPage";
import ApiService from "../../apis/index";
import dayjs from "dayjs";

jest.mock("../../apis/index");
describe("Transaction Component", () => {
  const mockTransactionData = [
    {
      id: "52",
      purchase_date: 1736145600,
      product_name: "USB Hub",
      product_price: 95.34,
      customerId: 14,
      name: "Elizabeth Clark",
      rewardPoints: 45,
    },
    {
      id: "66",
      purchase_date: 1736135600,
      product_name: "Portable Speaker",
      product_price: 138.99,
      customerId: 6,
      name: "Sarah Wilson",
      rewardPoints: 126,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // check data loaded or not
  test("renders the title correctly", () => {
    render(<TransactionPage />);
    const titleElement = screen.getByText(/Transactions/i);
    expect(titleElement).toBeInTheDocument();
  });

  // render date field and sumbit button
  test("renders the date fields and submit button", () => {
    render(<TransactionPage />);

    expect(screen.getByLabelText(/start month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end month/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  // displays data correctly after loading
  test("displays data correctly after loading", async () => {
    const mockStartMonth = dayjs().subtract(2, "month").startOf("month").unix();
    const mockEndMonth = dayjs().endOf("month").unix();

    ApiService.getTotalTransactions.mockResolvedValue(mockTransactionData);

    render(<TransactionPage />);

    await waitFor(() => {
      expect(ApiService.getTotalTransactions).toHaveBeenCalledWith(
        mockStartMonth,
        mockEndMonth
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Elizabeth Clark")).toBeInTheDocument();
      expect(screen.getByText("Sarah Wilson")).toBeInTheDocument();
    });

    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("126")).toBeInTheDocument();
  });

  // check data update or not on new date range
  it("should update the table data when a new date range is selected", async () => {
    ApiService.getTotalTransactions.mockResolvedValue(mockTransactionData);

    render(<TransactionPage />);

    await waitFor(() =>
      expect(ApiService.getTotalTransactions).toHaveBeenCalled()
    );

    const startMonthPicker = screen.getByLabelText(/Start Month/i);
    fireEvent.change(startMonthPicker, {
      target: { value: dayjs().subtract(3, "month") },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(ApiService.getTotalTransactions).toHaveBeenCalledTimes(2)
    );
  });

  // handles API errors
  test("handles API errors", async () => {
    ApiService.getTotalTransactions.mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<TransactionPage />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "It seems like there’s an error occurred in the transactions"
        )
      ).toBeInTheDocument();
    });
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    ApiService.getTotalTransactions.mockResolvedValueOnce([]);

    render(<TransactionPage />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });
});
