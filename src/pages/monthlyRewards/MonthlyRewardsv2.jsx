import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { logger } from "../../utils/logger";
// Component Import
import NoDataFound from "../../components/NoDataFound";
import TableSkeleton from "../../components/TableSkeleton";
import DataTableComponent from "../../components/DataTableComponent";
import PageBreadcrumb from "../../components/PageBreadcrumb";
// Material Import
import { Box, Grid2, Button, Paper } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// Service Import
import ApiService from "../../apis/index";
import BusinessLogicService from "../../utils/BusinessLogicService";

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
    selector: (row) => row.startMonthUnix,
    wrap: true,
    sortable: true,
    format: (row) => dayjs(row.startMonthUnix * 1000).format("MMMM"),
  },
  {
    name: "Year",
    selector: (row) => row.startMonthUnix,
    wrap: true,
    center: "true",
    sortable: true,
    format: (row) => dayjs(row.startMonthUnix * 1000).year(),
  },
  {
    name: "Reward Points",
    selector: (row) => row.rewardPoints,
    wrap: true,
    right: "true",
  },
];

const MonthlyRewards = () => {
  const [startMonth, setStartMonth] = useState(dayjs().subtract(2, "month"));
  const [endMonth, setEndMonth] = useState(dayjs());
  const [loader, setLoader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    init();
  }, []);

  // Init Functions
  const init = async () => {
    try {
      setErrorMsg("");
      setLoader(true);
      const customers = await getCustomers();
      const transactions = await getTransactions();
      await getMergeData(customers, transactions);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorMsg(
        "It seems like there’s an error occurred in the monthly rewards"
      );
      logger.error("Error in monthly rewards", err);
    }
  };

  // Merge Customer and Transaction
  const getMergeData = async (customers, transactions) => {
    try {
      const startOfMonth = dayjs(startMonth).startOf("month").unix();
      const endOfMonth = dayjs(endMonth).endOf("month").unix();
      setErrorMsg("");
      setLoader(true);
      const data = await BusinessLogicService.getMonthlyRewardsV2(
        customers,
        transactions,
        startOfMonth,
        endOfMonth
      );
      setTableData(data);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorMsg(
        "It seems like there’s an error occurred in the monthly rewards"
      );
      logger.error("Error in monthly reward merge data", err);
    }
  };

  // get all customer data
  const getCustomers = async () => {
    try {
      const respo = await ApiService.getCustomers();
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no customer data available.");
      setCustomers(respo);
      return respo;
    } catch (err) {
      logger.error("Error in monthly reward get customer", err);
      setErrorMsg(
        "It seems like there’s an error occurred in the monthly rewards"
      );
    }
  };

  // get all transactions data
  const getTransactions = async () => {
    try {
      const startOfMonth = dayjs(startMonth).startOf("month").unix();
      const endOfMonth = dayjs(endMonth).endOf("month").unix();
      const respo = await ApiService.getTransactionsByMonth(
        startOfMonth,
        endOfMonth
      );
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no Transaction data available.");
      return respo;
    } catch (err) {
      logger.error("Error in monthly reward get transactions", err);
      setErrorMsg(
        "It seems like there’s an error occurred in the monthly rewards"
      );
    }
  };

  // change month handler
  const changeMonth = async () => {
    const transactions = await getTransactions();
    await getMergeData(customers, transactions);
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
                    onChange={(newMonth) => {
                      setStartMonth(newMonth);
                      setEndMonth(dayjs(newMonth).add(2, "month"));
                    }}
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
                    disabled
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
