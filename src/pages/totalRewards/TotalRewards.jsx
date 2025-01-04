import React, { useState, useEffect } from "react";
import { logger } from "../../utils/logger";
// Component Import
import DataTableComponent from "../../components/DataTableComponent";
import TableSkeleton from "../../components/TableSkeleton";
import NoDataFound from "../../components/NoDataFound";
import PageBreadcrumb from "../../components/PageBreadcrumb";
// Material Import
import { Grid2 } from "@mui/material";
// Service Import
import ApiService from "../../apis/index";
import BusinessLogicService from "../../utils/BusinessLogicService";

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
          "It seems like there’s an error occurred in the total rewards"
        );
        logger.error("Error in total rewards", err);
      }
    };
    init();
  }, []);

  // Merge Customer and Transaction
  const getMergeData = async (customers, transactions) => {
    try {
      setErrorMsg("");
      setLoader(true);
      const data = await BusinessLogicService.getTotalRewards(
        customers,
        transactions
      );
      setTableData(data);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorMsg(
        "It seems like there’s an error occurred in the total rewards"
      );
      logger.error("Error in the total rewards merge data", err);
    }
  };

  // get all customer data
  const getCustomers = async () => {
    try {
      const respo = await ApiService.getCustomers();
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no customer data available.");
      return respo;
    } catch (err) {
      logger.error("Error in the total rewards get customer", err);
      setErrorMsg(
        "It seems like there’s an error occurred in the total rewards"
      );
    }
  };

  // get all transactions data
  const getTransactions = async () => {
    try {
      const respo = await ApiService.getTransactions();
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no Transaction data available.");
      return respo;
    } catch (err) {
      logger.error("Error in the total rewards get transactions", err);
      setErrorMsg(
        "It seems like there’s an error occurred in the total rewards"
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
