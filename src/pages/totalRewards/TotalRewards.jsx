import React, { useState, useEffect } from "react";
import { Grid2 } from "@mui/material";
import TableSkeleton from "../../components/TableSkeleton";
import DataTableComponent from "../../components/DataTableComponent";
import ApiService from "../../apis/index";
import NoDataFound from "../../components/NoDataFound";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import { logger } from "../../utils/logger";

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
      const transactions = await getTransaction();
      const totalCustomer = await getCustomers();
      await getTotalTransactions(totalCustomer, transactions);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorMsg(
        "It seems like there’s an error occurred in the total rewards"
      );
      logger.error("Error in total rewards", err);
    }
  };

  // Get All Customers
  const getCustomers = async () => {
    try {
      const respo = await ApiService.getCustomers();
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no customer data available.");
      return respo;
    } catch (err) {
      logger.error("Error getting transactions", err);
    }
  };

  // Get Transactions by Seleted Month
  const getTransaction = async () => {
    try {
      const respo = await ApiService.getTransactions();
      if (respo.length == 0)
        setErrorMsg("It seems like there’s is no transactions data available.");
      return respo;
    } catch (err) {
      logger.error("Error getting transactions", err);
    }
  };

  const getTotalTransactions = (totalCustomer, transactions) => {
    const data = totalCustomer.map((c) => {
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

    setTableData(data);
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
