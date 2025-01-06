import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MonthlyRewards from "./MonthlyRewardsv2";
import BusinessLogicService from "../../utils/BusinessLogicService";

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

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    BusinessLogicService.getMonthlyRewards.mockResolvedValueOnce([]);

    render(<MonthlyRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });
});
