import { logger } from "../utils/logger";
import dayjs from "dayjs";

const businessLogicService = {
  // calculate rewards points
  calculateRewardPoint(price) {
    let points = 0;
    let transactionAmount = Math.floor(price);

    if (transactionAmount > 100) {
      points += 2 * (transactionAmount - 100); // Points for amounts over 100
      transactionAmount = 100;
    }

    if (transactionAmount > 50) {
      points += transactionAmount - 50; // Points for amounts between 51 and 100
    }

    return points;
  },
  // get Total Rewards business logic
  getTotalRewards(customers, transactions) {
    try {
      const data = customers.map((c) => {
        // Get all transactions by customerId using filter, calculate each transactions reward point and map into transactions
        const customerTransactions = transactions.filter((t) => {
          if (Number(c.id) === Number(t.customerId)) {
            t.rewardPoint = this.calculateRewardPoint(t.product_price);
            return t;
          }
        });

        // Accumulate total reward points
        const totalReward = customerTransactions.reduce(
          (acc, item) => acc + item.rewardPoint,
          0
        );

        c.rewardPoint = totalReward;
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
  getTotalTransactions(customers, transactions) {
    try {
      const data = transactions.map((t) => {
        // map customer with transaction with customer id, calculate rewards points for each transaction
        const customerExists = customers.find(
          (c) => Number(c.id) === Number(t.customerId)
        );
        if (customerExists) {
          t.name = customerExists?.customer_name;
          t.rewardPoints = this.calculateRewardPoint(t.product_price);
        }
        return t;
      });

      // sort by date in descending order
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
  // get monthly rewards logic
  getMonthlyRewardsV2(totalCustomer, transactions, startMonth, endMonth) {
    const start = dayjs(startMonth * 1000);
    const end = dayjs(endMonth * 1000);

    // get month range in [2024-03, 2024-02] from start date to end date
    let monthArr = [];
    let current = start.startOf("month");
    while (current.isBefore(end) || current.isSame(end, "month")) {
      monthArr.push(current.format("YYYY-MM"));
      current = current.add(1, "month");
    }

    const data = totalCustomer.map((customer) => {
      // convert month arr [2024-03, 2024-02] to object like {2024-03 : 0, 2024-02 : 0}
      const months = monthArr.reduce(
        (acc, month) => ({ ...acc, [month]: 0 }),
        {}
      );

      // filter transactions using customer id
      const customerTransactions = transactions.filter(
        (transaction) => transaction.customerId == customer.id
      );

      // calculate each transaction reward point and accumulate into each month then map with month object {2024-03 : 10, 2024-02 : 30}
      const monthlyRewardObj = customerTransactions.reduce(
        (acc, transaction) => {
          const purchaseDate = new Date(transaction.purchase_date * 1000); // Convert Unix timestamp to milliseconds
          const purchaseMonth = `${purchaseDate.getUTCFullYear()}-${String(
            purchaseDate.getUTCMonth() + 1
          ).padStart(2, "0")}`; // convert 1-9 month into 2 digit

          if (acc[purchaseMonth] !== undefined) {
            acc[purchaseMonth] += this.calculateRewardPoint(
              transaction.product_price
            );
          }

          return acc;
        },
        months
      );

      // return monthly reward points with sprading customer object
      return {
        ...customer,
        monthlyRewards: Object.entries(monthlyRewardObj).map(
          ([month, rewardPoints]) => ({
            month,
            rewardPoints,
          })
        ),
      };
    });

    if (data) {
      // Flatten the data manually using reduce and add unique key for data rendering
      const newArr = data.reduce((acc, customer) => {
        const customerRewards = customer.monthlyRewards.map(
          ({ month, rewardPoints }) => {
            return {
              id: customer.id,
              uniqueKey: `${customer.id}${month}`,
              customer_name: customer.customer_name,
              startMonthUnix: dayjs(month, "YYYY-MM").startOf("month").unix(),
              month,
              rewardPoints,
            };
          }
        );
        return acc.concat(customerRewards);
      }, []);

      // Remove 0 Reward Points data from the data
      const sanitizeArr = newArr.filter((item) => {
        if (item.rewardPoints > 0) return item;
      });

      // Sort Data by year and month
      const sortedData = sanitizeArr.sort((a, b) => {
        return b.startMonthUnix - a.startMonthUnix;
      });

      return sortedData;
    }
  },
};

export default businessLogicService;
