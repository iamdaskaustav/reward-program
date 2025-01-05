import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionPage from "./TransactionPage";
import BusinessLogicService from "../../utils/BusinessLogicService";
import dayjs from "dayjs";

jest.mock("../../utils/BusinessLogicService.js");

describe("Transaction Component", () => {
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

  // check data update or not on new date range
  it("should update the table data when a new date range is selected", async () => {
    render(<TransactionPage />);

    await waitFor(() =>
      expect(BusinessLogicService.getTotalTransactions).toHaveBeenCalled()
    );

    const startMonthPicker = screen.getByLabelText(/Start Month/i);
    fireEvent.change(startMonthPicker, {
      target: { value: dayjs().subtract(3, "month") },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(BusinessLogicService.getTotalTransactions).toHaveBeenCalledTimes(4)
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
