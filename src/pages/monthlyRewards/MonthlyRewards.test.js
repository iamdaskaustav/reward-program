import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MonthlyRewards from "./MonthlyRewardsv2";
import BusinessLogicService from "../../utils/BusinessLogicService";
import dayjs from "dayjs";

jest.mock("../../utils/BusinessLogicService.js");

describe("Transaction Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // check title loaded or not
  test("renders the title correctly", () => {
    render(<MonthlyRewards />);
    const titleElement = screen.getByText(/Monthly Rewards/i);
    expect(titleElement).toBeInTheDocument();
  });

  // render data field and submit button
  test("renders the date fields and submit button", () => {
    render(<MonthlyRewards />);

    expect(screen.getByLabelText(/start month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end month/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
  it("should update the table data when a new date range is selected", async () => {
    render(<MonthlyRewards />);

    await waitFor(() =>
      expect(BusinessLogicService.getMonthlyRewards).toHaveBeenCalled()
    );

    const startMonthPicker = screen.getByLabelText(/Start Month/i);
    fireEvent.change(startMonthPicker, {
      target: { value: dayjs().subtract(3, "month") },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(BusinessLogicService.getMonthlyRewards).toHaveBeenCalledTimes(4)
    );
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    BusinessLogicService.getMonthlyRewards.mockResolvedValueOnce([]);

    render(<MonthlyRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });
});
