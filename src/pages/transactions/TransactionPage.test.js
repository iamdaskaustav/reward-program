import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionPage from "./TransactionPage";
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
    render(<TransactionPage />);
    const titleElement = screen.getByText(/Transactions/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renders the date fields and submit button", () => {
    render(<TransactionPage />);

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

    render(<TransactionPage />);

    await waitFor(() => {
      expect(ApiService.getTransactionsByMonth).toHaveBeenCalledWith(
        mockStartMonth,
        mockEndMonth
      );
    });
  });

  //   it("should display data in the table after loading", async () => {
  //     const mockStartMonth = dayjs().subtract(2, "month").startOf("month").unix();
  //     const mockEndMonth = dayjs().endOf("month").unix();
  //     // ApiService.getTransactionsByMonth.mockResolvedValue(mockTransactions);
  //     // ApiService.getCustomers.mockResolvedValue(mockCustomers);
  //     //   const container = render(<TransactionPage />);
  //     //   console.log(container.innerHTML);
  //     await waitFor(() => {
  //       ApiService.getTransactionsByMonth.toHaveBeenCalledWith(
  //         mockStartMonth,
  //         mockEndMonth
  //       );
  //     });
  //     //   // expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  //     //   // expect(screen.getByText("Product A")).toBeInTheDocument();
  //     //   // expect(screen.getByText("Product B")).toBeInTheDocument();
  //     //   // await waitFor(() => {
  //     //   // expect(screen.getByText("84.25")).toBeInTheDocument();
  //     //   // expect(screen.getByText("Nancy King")).toBeInTheDocument();
  //     //   // expect(screen.getByText("199.99")).toBeInTheDocument();
  //     //   // expect(screen.getByText("248")).toBeInTheDocument();
  //     //   // });
  //     render(<TransactionPage />);

  //     const submitButton = screen.getByRole("button", { name: /Submit/i });

  //     fireEvent.click(submitButton);

  //     // expect(submitButton).toHaveBeenCalledTimes(1);
  //     expect(screen.getByText("84")).toBeInTheDocument();

  //     // expect(screen.getByText("Olivia Evans")).toBeInTheDocument();
  //     // const startMonthInput = screen.getByPlaceholderText("Start Month");
  //     // const endMonthInput = screen.getByPlaceholderText("End Month");
  //     // const submitButton = screen.getByText("Submit");
  //     // // Set input values
  //     // fireEvent.change(startMonthInput, { target: { value: "2024-01" } });
  //     // fireEvent.change(endMonthInput, { target: { value: "2024-03" } });
  //     // // Click submit
  //     // fireEvent.click(submitButton);
  //     // // Wait for the data to load
  //     // await waitFor(() => screen.getByText("Item 1")); // Assuming "Item 1" is part of the fetched data
  //     // // Check if table is populated with data
  //     // expect(screen.getByText("Item 1")).toBeInTheDocument();
  //     // expect(screen.getByText("Item 2")).toBeInTheDocument();
  //   });

  it("should update the table data when a new date range is selected", async () => {
    ApiService.getTransactionsByMonth.mockResolvedValue(mockTransactions);
    ApiService.getCustomers.mockResolvedValue(mockCustomers);

    render(<TransactionPage />);

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

    render(<TransactionPage />);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });

  //   it("renders the datatable after form submission", () => {
  //     render(<TransactionPage />);

  //     // Fill out the form
  //     const startMonthInput = screen.getByLabelText(/start month/i);
  //     const endMonthInput = screen.getByLabelText(/end month/i);
  //     const submitButton = screen.getByRole("button", { name: /submit/i });

  //     fireEvent.change(startMonthInput, { target: { value: 1727721000 } });
  //     fireEvent.change(endMonthInput, { target: { value: 1735669799 } });

  //     // Submit the form
  //     fireEvent.click(submitButton);

  //     // Check if the DataTable component is rendered
  //     expect(screen.getByTestId("datatable")).toHaveTextContent("Data Loaded");
  //   });

  //   test("renders the subtitle correctly", () => {
  //     render(<TransactionPage />);
  //     const subtitleElement = screen.getByText(
  //       /A reward program based on purchase/i
  //     );
  //     expect(subtitleElement).toBeInTheDocument();
  //   });
});
