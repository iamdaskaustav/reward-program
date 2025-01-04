import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TotalRewards from "./TotalRewards";
import ApiService from "../../apis/index";
import BusinessLogicService from "../../utils/BusinessLogicService";
import apiService from "../../utils/BusinessLogicService";

jest.mock("../../apis/index", () => ({
  getTotalRewards: jest.fn(),
}));

describe("TotalRewards Component", () => {
  const mockRewardData = [
    { id: "1", customer_name: "John Doe", rewardPoint: 257 },
    { id: "2", customer_name: "Jane Smith", rewardPoint: 1722 },
  ];

  const customers = [
    {
      id: 1,
      customer_name: "John Doe",
    },
    {
      id: 2,
      customer_name: "Jane Smith",
    },
  ];

  const transactions = [
    {
      id: 34,
      purchase_date: 1717305400,
      product_name: "USB Hub",
      product_price: 81.96,
      customerId: 1,
    },
    {
      id: 50,
      purchase_date: 1729148600,
      product_name: "Bluetooth Keyboard",
      product_price: 140.89,
      customerId: 1,
    },
    {
      id: 1,
      purchase_date: 1727144506,
      product_name: "Gaming Headset",
      product_price: 328.23,
      customerId: 2,
    },
    {
      id: 9,
      purchase_date: 1734191363,
      product_name: "Gaming Headset",
      product_price: 277.74,
      customerId: 2,
    },
    {
      id: 28,
      purchase_date: 1719012400,
      product_name: "External Hard Drive",
      product_price: 324.78,
      customerId: 2,
    },
    {
      id: 41,
      purchase_date: 1732155600,
      product_name: "Wireless Mouse",
      product_price: 43.12,
      customerId: 2,
    },
    {
      id: 54,
      purchase_date: 1719148600,
      product_name: "Smartwatch",
      product_price: 232.67,
      customerId: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // renders Skeleton component initially
  test("renders Skeleton initially", async () => {
    render(<TotalRewards />);

    expect(screen.getByTestId("Skeleton-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("Skeleton-loader")).not.toBeInTheDocument();
    });
  });

  // // // displays data correctly after loading
  // test("displays data correctly after loading", async () => {
  //   // await waitFor(() => {
  //   //   ApiService.getCustomers.mockResolvedValueOnce();
  //   //   ApiService.getTransactions.mockResolvedValueOnce();
  //   //   BusinessLogicService.getTotalRewards.mockResolvedValueOnce(
  //   //     mockRewardData
  //   //   );
  //   // });

  //   render(<TotalRewards />);

  //   // await waitFor(() => {
  //   //   expect(BusinessLogicService.getTotalTransactions).toHaveBeenCalledWith(
  //   //     customers,
  //   //     transactions
  //   //   );
  //   // });

  //   await waitFor(() => {
  //     expect(screen.getByText("John Doe")).toBeInTheDocument();
  //     // expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  //   });

  //   // expect(screen.getByText("257")).toBeInTheDocument();
  //   // expect(screen.getByText("1722")).toBeInTheDocument();
  // });

  // //   handles API errors
  // test("handles API errors", async () => {
  //   ApiService.getTotalRewards.mockRejectedValueOnce(new Error("API Error"));

  //   render(<TotalRewards />);

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText(
  //         "It seems like there’s an error occurred in the total rewards"
  //       )
  //     ).toBeInTheDocument();
  //   });
  // });

  // displays NoDataFound if no data is returned
  test("displays NoDataFound if no data is returned", async () => {
    render(<TotalRewards />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });

  // // calculates reward points correctly
  // test("calculates reward points correctly", async () => {
  //   BusinessLogicService.getTotalRewards().mockResolvedValueOnce(
  //     mockRewardData
  //   );

  //   render(<TotalRewards />);

  //   await waitFor(() => {
  //     expect(screen.getByText("1099")).toBeInTheDocument();
  //     expect(screen.getByText("2662")).toBeInTheDocument();
  //   });
  // });
});
