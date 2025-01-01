import React, { useState, useEffect } from "react";
import { Grid2 } from "@mui/material";
import TableSkeleton from "../../components/TableSkeleton";
import DataTableComponent from "../../components/DataTableComponent";
import ApiService from "../../apis/index";
import NoDataFound from "../../components/NoDataFound";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { logger } from "../../utils/logger";

// columns for header
const columns = [
  {
    name: "Id",
    selector: (row) => row.id,
    sortable: true,
    wrap: true,
  },
  {
    name: "Customer Name",
    selector: (row) => row.customer_name,
    sortable: true,
    wrap: true,
  },
  {
    name: "Reward Points",
    selector: (row) => row.rewardPoint,
    wrap: true,
  },
];

const TotalRewards = () => {
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
      await getTotalRewards();
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorMsg(
        "It seems like there’s an error occurred in the total rewards"
      );
      logger.error("Error in total rewards", err);
    }
  };

  // Get All Rewards data
  const getTotalRewards = async () => {
    try {
      const respo = await ApiService.getTotalRewards();
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no customer data available.");
      setTableData(respo);
    } catch (err) {
      setErrorMsg(
        "It seems like there’s an error occurred in the total rewards"
      );
      logger.error("Error getting transactions", err);
    }
  };

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      style={{ minHeight: "100vh" }}
    >
      <PageBreadcrumb pageName="Total Rewards" />
      <Grid2 xs={12} md={12} sx={{ marginTop: "10px" }}>
        {loader ? (
          <TableSkeleton />
        ) : tableData && tableData.length > 0 ? (
          <DataTableComponent
            // title={"Total Rewards"}
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

export default TotalRewards;
