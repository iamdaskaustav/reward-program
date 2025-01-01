globalThis.fetch = jest.fn();

import apiService from "./index";

describe("API fetchData", () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it("should fetch data successfully from getCustomers API", async () => {
    const mockData = [
      {
        id: 1,
        customer_name: "John Doe",
      },
      {
        id: 2,
        customer_name: "Jane Smith",
      },
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const data = await apiService.getCustomers();
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/customers");
  });

  it("should throw an error if the network response is not ok from getCustomers API", async () => {
    fetch.mockResolvedValue({
      ok: false,
    });

    await expect(apiService.getCustomers()).rejects.toThrow(
      "Network response was not ok in getCustomers"
    );
  });

  it("should fetch data successfully from getTransactions API", async () => {
    const mockData = [
      {
        id: 1,
        purchase_date: 1727144506,
        product_name: "Gaming Headset",
        product_price: 328.23,
        customerId: 2,
      },
      {
        id: 2,
        purchase_date: 1717519810,
        product_name: "External Hard Drive",
        product_price: 233.44,
        customerId: 12,
      },
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const data = await apiService.getTransactions();
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/transactions");
  });

  it("should throw an error if the network response is not ok from getTransactions API", async () => {
    fetch.mockResolvedValue({
      ok: false,
    });

    await expect(apiService.getTransactions()).rejects.toThrow(
      "Network response was not ok in getTransactions"
    );
  });

  it("should fetch data successfully from getTransactionsByMonth API", async () => {
    const mockData = [
      {
        id: "9",
        purchase_date: 1734191363,
        product_name: "Gaming Headset",
        product_price: 277.74,
        customerId: 2,
      },
      {
        id: "10",
        purchase_date: 1733044468,
        product_name: "Portable Speaker",
        product_price: 113.78,
        customerId: 9,
      },
    ];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const data = await apiService.getTransactionsByMonth(
      1732991400,
      1738348199
    );
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/transactions?purchase_date_gte=1732991400&purchase_date_lt=1738348199"
    );
  });

  it("should throw an error if the network response is not ok from getTransactionsByMonth API", async () => {
    fetch.mockResolvedValue({
      ok: false,
    });

    await expect(apiService.getTransactionsByMonth()).rejects.toThrow(
      "Network response was not ok in getTransactionsByMonth"
    );
  });
});
