import React, { useState, useEffect } from "react";
import { Box, Grid2, Button, Paper } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TableSkeleton from "../../components/TableSkeleton";
import DataTableComponent from "../../components/DataTableComponent";
import ApiService from "../../apis/index";
import NoDataFound from "../../components/NoDataFound";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { logger } from "../../utils/logger";

// columns for table header
const columns = [
  {
    name: "Customer Id",
    selector: (row) => row.id,
    sortable: false,
    wrap: true,
  },
  { name: "Name", selector: (row) => row.customer_name, wrap: true },
  {
    name: "Month",
    selector: (row) =>
      dayjs()
        .month(row.monthNum - 1)
        .format("MMMM"),
    wrap: true,
  },
  { name: "Year", selector: (row) => dayjs(row.year).year(), wrap: true },
  { name: "Reward Points", selector: (row) => row.rewardPoints, wrap: true },
];

const MonthlyRewards = () => {
  const [startMonth, setStartMonth] = useState(dayjs().subtract(2, "month"));
  const [endMonth, setEndMonth] = useState(dayjs());
  const [loader, setLoader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    init();
  }, []);

  // Init Functions
  const init = async () => {
    try {
      setErrorMsg("");
      setLoader(true);
      const transactions = await getTransactions();
      const totalCustomer = await getCustomers();
      await getMonthlyTransactions(totalCustomer, transactions);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorMsg(
        "It seems like there’s an error occurred in the monthly rewards"
      );
      logger.error("Error in monthly rewards", err);
    }
  };

  // Get All Customers
  const getCustomers = async () => {
    try {
      const respo = await ApiService.getCustomers();
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no customer data available.");
      setCustomers(respo);
      return respo;
    } catch (err) {
      logger.log("Error in monthly rewards get customer", err);
    }
  };

  // Get Transactions by Seleted Month
  const getTransactions = async () => {
    try {
      const startOfMonth = dayjs(startMonth).startOf("month").unix();
      const endOfMonth = dayjs(endMonth).endOf("month").unix();
      const respo = await ApiService.getTransactionsByMonth(
        startOfMonth,
        endOfMonth
      );

      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no transactions data available.");
      return respo;
    } catch (err) {
      logger.log("Error in monthly rewards get transactions", err);
    }
  };

  // data change handler
  const changeMonth = async () => {
    const transactions = await getTransactions();
    await getMonthlyTransactions(customers, transactions);
  };

  // get month range array from startdate and enddate
  const getMonthsInRange = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const months = [];

    let current = start.startOf("month");
    while (current.isBefore(end) || current.isSame(end, "month")) {
      months.push(current.format("YYYY-MM"));
      current = current.add(1, "month");
    }

    return months;
  };

  // calculate total rewards point by providing month list and transactions list and return result in array of objects
  const accumulateRewardsByMonth = (rewardsByMonth, transactions) => {
    const monthlyRewardObj = transactions.reduce((acc, transaction) => {
      const purchaseDate = new Date(transaction.purchase_date * 1000); // Convert Unix timestamp to milliseconds
      const purchaseMonth = `${purchaseDate.getUTCFullYear()}-${String(
        purchaseDate.getUTCMonth() + 1
      ).padStart(2, "0")}`;

      let points = 0;

      let transactionAmount = Math.floor(transaction.product_price);

      if (transactionAmount <= 0) points = 0;

      if (transactionAmount == 50) points += 1;

      if (transactionAmount > 100) {
        points += 2 * (transactionAmount - 100);
        transactionAmount = 100;
      }

      if (transactionAmount > 50) {
        points += 1 * (transactionAmount - 50);
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
  };

  // main controller - get customers, separate transaction by customer, set data and sort data by time
  const getMonthlyTransactions = (totalCustomer, transactions) => {
    const data = totalCustomer.map((customer) => {
      const months = getMonthsInRange(startMonth, endMonth).reduce(
        (acc, month) => ({ ...acc, [month]: 0 }),
        {}
      );

      const customerTransactions = transactions.filter(
        (transaction) => transaction.customerId == customer.id
      );

      return {
        ...customer,
        monthlyRewards: accumulateRewardsByMonth(
          months,
          customerTransactions,
          customer
        ),
      };
    });

    // Flatten the data manually using reduce and add uniquekey
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

    setTableData(sortedData);
  };

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      style={{ minHeight: "100vh" }}
    >
      <PageBreadcrumb pageName="Monthly Rewards" />

      <Grid2
        item={+true}
        xs={12}
        sm={12}
        md={12}
        lg={12}
        sx={{ marginTop: "10px" }}
      >
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
          elevation={0}
        >
          <Grid2 container spacing={2}>
            <Grid2 item={+true} xs={12}>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disableFuture
                    label="Start Month"
                    views={["month", "year"]}
                    value={startMonth}
                    onChange={(newMonth) => setStartMonth(newMonth)}
                  />
                </LocalizationProvider>
              </Box>
            </Grid2>
            <Grid2 item={+true} xs={12}>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disableFuture
                    label="End Month"
                    views={["month", "year"]}
                    value={endMonth}
                    onChange={(newMonth) => setEndMonth(newMonth)}
                  />
                </LocalizationProvider>
              </Box>
            </Grid2>
            <Grid2 item={+true} xs={12}>
              <Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, mb: 0, backgroundColor: "#0047AB" }}
                  onClick={changeMonth}
                >
                  Submit
                </Button>
              </Box>
            </Grid2>
          </Grid2>
        </Paper>

        <Grid2 xs={12} md={12} sx={{ marginTop: "10px" }}>
          {loader ? (
            <TableSkeleton />
          ) : tableData && tableData.length > 0 ? (
            <DataTableComponent
              // title={"Transaction"}
              columns={columns}
              data={tableData}
              haveExpandableRows={false}
              uniqueKey={"uniqueKey"}
            />
          ) : (
            <NoDataFound subtitle={errorMsg} />
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default MonthlyRewards;
