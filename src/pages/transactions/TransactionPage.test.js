import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionPage from "./TransactionPage";
import BusinessLogicService from "../../utils/BusinessLogicService";
import ApiService from "../../apis/index";
import dayjs from "dayjs";

jest.mock("../../utils/BusinessLogicService.js");
jest.mock("../../apis/index");
describe("Transaction Component", () => {
  const mockTransactionData = [
    {
      id: 26,
      purchase_date: 1735218400,
      product_name: "Smartwatch",
      product_price: 179.34,
      customerId: 4,
      name: "Emily Davis",
      rewardPoints: 208,
    },
    {
      id: 17,
      purchase_date: 1735183070,
      product_name: "Wireless Charger",
      product_price: 278.42,
      customerId: 11,
      name: "William Jackson",
      rewardPoints: 406,
    },
    {
      id: 9,
      purchase_date: 1734191363,
      product_name: "Gaming Headset",
      product_price: 277.74,
      customerId: 2,
      name: "Jane Smith",
      rewardPoints: 404,
    },
    {
      id: 19,
      purchase_date: 1734158462,
      product_name: "Wireless Mouse",
      product_price: 39.46,
      customerId: 10,
      name: "Laura Thomas",
      rewardPoints: 0,
    },
    {
      id: 25,
      purchase_date: 1733209460,
      product_name: "Gaming Headset",
      product_price: 294.88,
      customerId: 14,
      name: "Elizabeth Clark",
      rewardPoints: 438,
    },
    {
      id: 47,
      purchase_date: 1733205600,
      product_name: "Portable Speaker",
      product_price: 118.78,
      customerId: 12,
      name: "Linda White",
      rewardPoints: 86,
    },
    {
      id: 64,
      purchase_date: 1733121600,
      product_name: "Smartwatch",
      product_price: 305.72,
      customerId: 10,
      name: "Laura Thomas",
      rewardPoints: 460,
    },
    {
      id: 10,
      purchase_date: 1733044468,
      product_name: "Portable Speaker",
      product_price: 113.78,
      customerId: 9,
      name: "Daniel Anderson",
      rewardPoints: 76,
    },
  ];

  const customer = [
    {
      id: 1,
      customer_name: "John Doe",
    },
    {
      id: 2,
      customer_name: "Jane Smith",
    },
    {
      id: 3,
      customer_name: "Michael Johnson",
    },
    {
      id: 4,
      customer_name: "Emily Davis",
    },
    {
      id: 5,
      customer_name: "David Miller",
    },
    {
      id: 6,
      customer_name: "Sarah Wilson",
    },
    {
      id: 7,
      customer_name: "James Brown",
    },
    {
      id: 8,
      customer_name: "Patricia Taylor",
    },
    {
      id: 9,
      customer_name: "Daniel Anderson",
    },
    {
      id: 10,
      customer_name: "Laura Thomas",
    },
    {
      id: 11,
      customer_name: "William Jackson",
    },
    {
      id: 12,
      customer_name: "Linda White",
    },
    {
      id: 13,
      customer_name: "Robert Harris",
    },
    {
      id: 14,
      customer_name: "Elizabeth Clark",
    },
    {
      id: 15,
      customer_name: "Joseph Lewis",
    },
  ];

  const transactions = [
    [
      {
        id: 9,
        purchase_date: 1734191363,
        product_name: "Gaming Headset",
        product_price: 277.74,
        customerId: 2,
      },
      {
        id: 10,
        purchase_date: 1733044468,
        product_name: "Portable Speaker",
        product_price: 113.78,
        customerId: 9,
      },
      {
        id: 17,
        purchase_date: 1735183070,
        product_name: "Wireless Charger",
        product_price: 278.42,
        customerId: 11,
      },
      {
        id: 19,
        purchase_date: 1734158462,
        product_name: "Wireless Mouse",
        product_price: 39.46,
        customerId: 10,
      },
      {
        id: 25,
        purchase_date: 1733209460,
        product_name: "Gaming Headset",
        product_price: 294.88,
        customerId: 14,
      },
      {
        id: 26,
        purchase_date: 1735218400,
        product_name: "Smartwatch",
        product_price: 179.34,
        customerId: 4,
      },
      {
        id: 47,
        purchase_date: 1733205600,
        product_name: "Portable Speaker",
        product_price: 118.78,
        customerId: 12,
      },
      {
        id: 64,
        purchase_date: 1733121600,
        product_name: "Smartwatch",
        product_price: 305.72,
        customerId: 10,
      },
    ],
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

  // // displays data correctly after loading
  // test("displays data correctly after loading2", async () => {
  //   // const mockStartMonth = dayjs().subtract(2, "month").startOf("month").unix();
  //   // const mockEndMonth = dayjs().endOf("month").unix();

  //   // BusinessLogicService.getTotalTransactions.mockResolvedValue(
  //   //   mockTransactionData
  //   // );

  //   render(<TransactionPage />);

  //   // await waitFor(() => {
  //   //   expect(BusinessLogicService.getTotalTransactions).toHaveBeenCalledWith(
  //   //     customer,
  //   //     transactions
  //   //   );
  //   // });

  //   await waitFor(() => {
  //     // expect(screen.getByText("Emily Davis")).toBeInTheDocument();
  //     // expect(screen.getByText("Sarah Wilson")).toBeInTheDocument();
  //     expect(screen.getByText("208")).toBeInTheDocument();
  //   });

  //   // expect(screen.getByText("126")).toBeInTheDocument();
  // });

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
      expect(BusinessLogicService.getTotalTransactions).toHaveBeenCalledTimes(2)
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
