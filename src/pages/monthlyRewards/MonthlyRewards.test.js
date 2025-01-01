import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MonthlyRewards from "./MonthlyRewardsv2";
import ApiService from "../../apis/index";
import dayjs from "dayjs";

jest.mock("../../apis/index");
describe("Transaction Component", () => {
  // dummy data
  const mockMonthlyRewardData = [
    {
      id: "1",
      uniqueKey: "1012025",
      customer_name: "John Doe",
      year: "2025",
      monthNum: "01",
      rewardPoints: 470,
    },

    {
      id: "2",
      uniqueKey: "2012025",
      customer_name: "Jane Smith",
      year: "2025",
      monthNum: "01",
      rewardPoints: 0,
    },
  ];

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

  //   displays data correctly after loading
  test("displays data correctly after loading", async () => {
    const mockStartMonth = dayjs().subtract(2, "month").startOf("month").unix();
    const mockEndMonth = dayjs().endOf("month").unix();

    ApiService.getMonthlyRewards.mockResolvedValue(mockMonthlyRewardData);

    render(<MonthlyRewards />);

    await waitFor(() => {
      expect(ApiService.getMonthlyRewards).toHaveBeenCalledWith(
        mockStartMonth,
        mockEndMonth
      );
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("470")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  //   handles API errors
  test("handles API errors", async () => {
    ApiService.getMonthlyRewards.mockRejectedValueOnce(new Error("API Error"));

    render(<MonthlyRewards />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "It seems like there’s an error occurred in the monthly rewards"
        )
      ).toBeInTheDocument();
    });
  });

  // data update on date range change
  it("should update the table data when a new date range is selected", async () => {
    ApiService.getMonthlyRewards.mockResolvedValue(mockMonthlyRewardData);

    render(<MonthlyRewards />);

    await waitFor(() =>
      expect(ApiService.getMonthlyRewards).toHaveBeenCalled()
    );

    const startMonthPicker = screen.getByLabelText(/Start Month/i);
    fireEvent.change(startMonthPicker, {
      target: { value: dayjs().subtract(3, "month") },
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(ApiService.getMonthlyRewards).toHaveBeenCalledTimes(2)
    );
  });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    ApiService.getMonthlyRewards.mockResolvedValueOnce([]);

    render(<MonthlyRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });
});
