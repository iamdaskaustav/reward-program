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
    center: true,
  },
  {
    name: "Price",
    selector: (row) => row.product_price,
    sortable: false,
    wrap: true,
    right: true,
  },
  {
    name: "Reward Points",
    selector: (row) => row.rewardPoints,
    sortable: false,
    wrap: true,
    right: true,
  },
];

const TransacrionPage = () => {
  const [loader, setLoader] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
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
      await getTransactions();
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorMsg(
        "It seems like there’s an error occurred in the transactions"
      );
      logger.error("Error in Transaction init", err);
    }
  };

  // get all transactions data
  const getTransactions = async () => {
    try {
      const startOfMonth = dayjs(startMonth).startOf("month").unix();
      const endOfMonth = dayjs(endMonth).endOf("month").unix();
      const respo = await ApiService.getTotalTransactions(
        startOfMonth,
        endOfMonth
      );
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no customer data available.");
      setTableData(respo);
      return respo;
    } catch (err) {
      logger.error("Error in transactions get customer", err);
      setErrorMsg(
        "It seems like there’s an error occurred in the transactions"
      );
    }
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
                onClick={getTransactions}
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
