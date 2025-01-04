import { logger } from "../utils/logger";

const apiService = {
  // get all customers
  async getCustomers() {
    try {
      const response = await fetch("http://localhost:5000/customers");

      if (!response.ok) {
        throw new Error("Network response was not ok in getCustomers");
      }

      return await response.json();
    } catch (error) {
      logger.error(
        "There was a problem with the fetch operation getCustomers:",
        error
      );
      throw new Error("Network response was not ok in getCustomers");
    }
  },
  // get transactions by startdate and enddate
  async getTransactionsByMonth(startDate, endDate) {
    try {
      const response = await fetch(
        `http://localhost:5000/transactions?purchase_date_gte=${startDate}&purchase_date_lt=${endDate}`
      );

      if (!response.ok) {
        throw new Error(
          "Network response was not ok in getTransactionsByMonth"
        );
      }

      return await response.json();
    } catch (error) {
      logger.error(
        "There was a problem with the fetch operation in getTransactionsByMonth:",
        error
      );
      throw new Error("Network response was not ok in getTransactionsByMonth");
    }
  },
  // get all transactions
  async getTransactions() {
    try {
      const response = await fetch(`http://localhost:5000/transactions`);

      if (!response.ok) {
        throw new Error("Network response was not ok in in getTransactions");
      }

      return await response.json();
    } catch (error) {
      logger.error(
        "There was a problem with the fetch operation in getTransactions:",
        error
      );
      throw new Error("Network response was not ok in getTransactions");
    }
  },
};

export default apiService;
