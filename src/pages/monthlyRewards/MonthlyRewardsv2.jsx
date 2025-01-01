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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    init();
  }, []);

  // Init Functions
  const init = async () => {
    try {
      setErrorMsg("");
      setLoader(true);
      await getMonthlyRewards();
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
  const getMonthlyRewards = async () => {
    try {
      const startOfMonth = dayjs(startMonth).startOf("month").unix();
      const endOfMonth = dayjs(endMonth).endOf("month").unix();
      const respo = await ApiService.getMonthlyRewards(
        startOfMonth,
        endOfMonth
      );
      if (respo.length == 0)
        setErrorMsg(
          "It seems like there’s is no monthly reward data available."
        );
      setTableData(respo);
      return respo;
    } catch (err) {
      logger.log("Error in monthly rewards get monthly reward", err);
      setErrorMsg(
        "It seems like there’s an error occurred in the monthly rewards"
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
                  onClick={getMonthlyRewards}
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
