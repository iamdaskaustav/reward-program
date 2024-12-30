import { logger } from "../utils/logger";

const apiService = {
  async getCustomers() {
    try {
      const response = await fetch("http://localhost:5000/customers");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      logger.error("There was a problem with the fetch operation:", error);
    }
  },
  async getTransactionsByMonth(startDate, endDate) {
    try {
      const response = await fetch(
        `http://localhost:5000/transactions?purchase_date_gte=${startDate}&purchase_date_lt=${endDate}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      logger.error("There was a problem with the fetch operation:", error);
    }
  },
  async getTransactions() {
    try {
      const response = await fetch(`http://localhost:5000/transactions`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      logger.error("There was a problem with the fetch operation:", error);
    }
  },
};

export default apiService;
