import { logger } from "../utils/logger";
import dayjs from "dayjs";

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
  async getTotalRewards() {
    try {
      const customers = await this.getCustomers();
      const transactions = await this.getTransactions();
      const data = customers.map((c) => {
        const customerTransactions = transactions.filter((t) => {
          if (Number(c.id) === Number(t.customerId)) {
            let points = 0;

            let transactionAmount = Math.floor(t.product_price);

            if (transactionAmount <= 0) points = 0;

            if (transactionAmount == 50) points += 1;

            if (transactionAmount > 100) {
              points += 2 * (transactionAmount - 100);
              transactionAmount = 100;
            }

            if (transactionAmount > 50) {
              points += 1 * (transactionAmount - 50);
            }

            t.rewardPoint = points;

            return t;
          }
        });

        const re = customerTransactions.reduce(
          (acc, item) => acc + item.rewardPoint,
          0
        );

        c.rewardPoint = re;
        return c;
      });

      return data;
    } catch (error) {
      logger.error(
        "There was a problem with the fetch operation in total rewards",
        error
      );
      throw new Error("Network response was not ok in total rewards");
    }
  },
  async getTotalTransactions(startDate, endDate) {
    try {
      const customers = await this.getCustomers();
      const transactions = await this.getTransactionsByMonth(
        startDate,
        endDate
      );

      const data = transactions.map((t) => {
        const customerExists = customers.find(
          (c) => Number(c.id) === Number(t.customerId)
        );
        if (customerExists) {
          t.name = customerExists?.customer_name;

          let points = 0;
          let transactionAmount = Math.floor(t.product_price);

          if (transactionAmount > 100) {
            points += 2 * (transactionAmount - 100); // Points for amounts over 100
            transactionAmount = 100;
          }

          if (transactionAmount > 50) {
            points += transactionAmount - 50; // Points for amounts between 51 and 100
          }

          t.rewardPoints = points;
        }
        return t;
      });

      const sortDataByDate = data.sort(
        (a, b) => Number(b.purchase_date) - Number(a.purchase_date)
      );

      return sortDataByDate;
    } catch (error) {
      logger.error(
        "There was a problem with the fetch operation in getTotalTransactions",
        error
      );
      throw new Error("Network response was not ok in getTotalTransactions");
    }
  },
  async getMonthlyRewards(startDate, endDate) {
    try {
      const customers = await this.getCustomers();
      const transactions = await this.getTransactionsByMonth(
        startDate,
        endDate
      );
      const data = this.getMonthlyTransactions(
        customers,
        transactions,
        startDate,
        endDate
      );
      return data;
    } catch (error) {
      logger.error(
        "There was a problem with the fetch operation in total rewards",
        error
      );
      throw new Error("Network response was not ok in total rewards");
    }
  },
  getMonthlyTransactions(totalCustomer, transactions, startMonth, endMonth) {
    const data = totalCustomer.map((customer) => {
      const months = this.getMonthsInRange(startMonth, endMonth).reduce(
        (acc, month) => ({ ...acc, [month]: 0 }),
        {}
      );

      const customerTransactions = transactions.filter(
        (transaction) => transaction.customerId == customer.id
      );

      return {
        ...customer,
        monthlyRewards: this.accumulateRewardsByMonth(
          months,
          customerTransactions,
          customer
        ),
      };
    });

    // Flatten the data manually using reduce and add uniquekey
    if (data) {
      const newArr = data.reduce((acc, customer) => {
        const customerRewards = customer.monthlyRewards.map(
          ({ month, rewardPoints }) => {
            const [year, monthNum] = month.split("-");
            return {
              id: customer.id,
              uniqueKey: `${customer.id}${monthNum}${year}`,
              customer_name: customer.customer_name,
              year,
              monthNum,
              rewardPoints,
            };
          }
        );
        return acc.concat(customerRewards);
      }, []);

      const sortedData = newArr.sort((a, b) => {
        // compare year
        if (b.year !== a.year) {
          return b.year - a.year;
        }
        // compare months
        return b.monthNum - a.monthNum;
      });

      return sortedData;
    }
  },

  getMonthsInRange(startDate, endDate) {
    const start = dayjs(startDate * 1000);
    const end = dayjs(endDate * 1000);

    const months = [];

    let current = start.startOf("month");
    while (current.isBefore(end) || current.isSame(end, "month")) {
      months.push(current.format("YYYY-MM"));
      current = current.add(1, "month");
    }

    return months;
  },

  // calculate total rewards point by providing month list and transactions list and return result in array of objects
  accumulateRewardsByMonth(rewardsByMonth, transactions) {
    const monthlyRewardObj = transactions.reduce((acc, transaction) => {
      const purchaseDate = new Date(transaction.purchase_date * 1000); // Convert Unix timestamp to milliseconds
      const purchaseMonth = `${purchaseDate.getUTCFullYear()}-${String(
        purchaseDate.getUTCMonth() + 1
      ).padStart(2, "0")}`;

      let points = 0;
      let transactionAmount = Math.floor(transaction.product_price);

      if (transactionAmount > 100) {
        points += 2 * (transactionAmount - 100); // Points for amounts over 100
        transactionAmount = 100;
      }

      if (transactionAmount > 50) {
        points += transactionAmount - 50; // Points for amounts between 51 and 100
      }

      if (acc[purchaseMonth] !== undefined) {
        acc[purchaseMonth] += points;
      }

      return acc;
    }, rewardsByMonth);

    return Object.entries(monthlyRewardObj).map(([month, rewardPoints]) => ({
      month,
      rewardPoints,
    }));
  },
};

export default apiService;
