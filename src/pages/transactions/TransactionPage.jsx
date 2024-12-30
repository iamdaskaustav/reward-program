import React, { useState, useEffect } from "react";
import { Box, Grid2, Button, Paper } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DataTableComponent from "../../components/DataTableComponent";
import NoDataFound from "../../components/NoDataFound";
import TableSkeleton from "../../components/TableSkeleton";
import ApiService from "../../apis/index";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { logger } from "../../utils/logger";

// columns for header
const columns = [
  {
    name: "Transaction Id",
    selector: (row) => row.id,
    sortable: false,
    wrap: true,
  },
  {
    name: "Customer Name",
    selector: (row) => row.name,
    sortable: false,
    wrap: true,
  },
  {
    name: "Purchase Date",
    selector: (row) =>
      dayjs(Number(row.purchase_date) * 1000).format("MMM D, YYYY h:mm A"),
    sortable: false,
    wrap: true,
  },
  {
    name: "Product purchased",
    selector: (row) => row.product_name,
    sortable: false,
    wrap: true,
  },
  {
    name: "Price",
    selector: (row) => row.product_price,
    sortable: false,
    wrap: true,
  },
  {
    name: "Reward Points",
    selector: (row) => row.rewardPoints,
    sortable: false,
    wrap: true,
  },
];

const TransacrionPage = () => {
  const [loader, setLoader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [customers, setCustomers] = useState([]);
  const [startMonth, setStartMonth] = useState(dayjs().subtract(2, "month"));
  const [endMonth, setEndMonth] = useState(dayjs());

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

      await getTransactionWithCustomer(totalCustomer, transactions);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorMsg(
        "It seems like there’s an error occurred in the transactions"
      );
      logger.error("Error in Transaction init", err);
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
      logger.error("Error in transactions get customer", err);
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
      logger.error("Error in transactions get transactions", err);
    }
  };

  // month change handler
  const changeMonth = async () => {
    const transactions = await getTransactions();
    await getTransactionWithCustomer(customers, transactions);
  };

  // main controller - get customers and transactions, map customer to transactions
  const getTransactionWithCustomer = (totalCustomer, transactions) => {
    setLoader(true);
    const data = transactions.map((t) => {
      const customerExists = totalCustomer.find(
        (c) => Number(c.id) === Number(t.customerId)
      );
      if (customerExists) {
        t.name = customerExists?.customer_name;

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

        t.rewardPoints = points;
      }
      return t;
    });

    const sortDataByDate = data.sort(
      (a, b) => Number(b.purchase_date) - Number(a.purchase_date)
    );
    setLoader(false);
    if (sortDataByDate) setTableData(sortDataByDate);
    // setTableData([]);
  };

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      style={{ minHeight: "100vh" }}
    >
      <PageBreadcrumb pageName="Transactions" />

      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: "10px",
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
            uniqueKey={"id"}
          />
        ) : (
          <NoDataFound subtitle={errorMsg} />
        )}
      </Grid2>
    </Grid2>
  );
};

export default TransacrionPage;
