import { logger } from "../utils/logger";
import dayjs from "dayjs";

const apiService = {
  // get Total Rewards business logic
  async getTotalRewards(customers, transactions) {
    try {
      const data = customers.map((c) => {
        const customerTransactions = transactions.filter((t) => {
          if (Number(c.id) === Number(t.customerId)) {
            let points = 0;
            let transactionAmount = Math.floor(t.product_price);

            if (transactionAmount > 100) {
              points += 2 * (transactionAmount - 100); // Points for amounts over 100
              transactionAmount = 100;
            }

            if (transactionAmount > 50) {
              points += transactionAmount - 50; // Points for amounts between 51 and 100
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
  // get total transactions logic
  async getTotalTransactions(customers, transactions) {
    try {
      //   const customers = await this.getCustomers();
      //   const transactions = await this.getTransactionsByMonth(
      //     startDate,
      //     endDate
      //   );

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
  // get monthly rewars logic
  async getMonthlyRewards(totalCustomer, transactions, startMonth, endMonth) {
    console.log("hi111");
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

      // Remove 0 Reward Points
      const sanitizeArr = newArr.filter((item) => {
        if (item.rewardPoints > 0) return item;
      });

      // Sort Data by year and month
      const sortedData = sanitizeArr.sort((a, b) => {
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
