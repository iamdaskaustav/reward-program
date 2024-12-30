import React from "react";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import PropTypes from "prop-types";

// Expendable components inside table
const ExpandedComponent = React.memo(({ data }) => (
  <div style={{ padding: "10px 20px", backgroundColor: "#f9f9f9" }}>
    <h4>Monthly Rewards</h4>
    <DataTable
      columns={[
        { name: "Month", selector: (row) => dayjs(row.month).format("MMMM") },
        { name: "Year", selector: (row) => dayjs(row.month).year() },
        { name: "Reward Points", selector: (row) => row.rewardPoints },
      ]}
      data={data.monthlyRewards}
      noHeader
      striped
    />
  </div>
));

const DataTableComponent = React.memo(
  ({ title, columns, data, haveExpandableRows, uniqueKey }) => {
    // console.log("Datatable component is rendering");

    return (
      <div>
        <DataTable
          responsive
          data-testid="datatable"
          title={haveExpandableRows ? title : undefined}
          columns={columns}
          data={data}
          pagination
          expandableRows={haveExpandableRows}
          expandableRowsComponent={
            haveExpandableRows ? ExpandedComponent : undefined
          }
          paginationPerPage="5"
          keyField={uniqueKey}
          paginationRowsPerPageOptions={[5, 10, 15, 50, 100]}
        />
      </div>
    );
  }
);

DataTableComponent.displayName = "DataTableComponent";
ExpandedComponent.displayName = "ExpandedComponent";

// propsTypes
ExpandedComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      // Total Rewards
      PropTypes.shape({
        id: PropTypes.string,
        customer_name: PropTypes.string,
        rewardPoint: PropTypes.number,
        monthlyRewards: PropTypes.shape({
          month: PropTypes.string,
          rewardPoint: PropTypes.number,
        }),
      }),
    ])
  ).isRequired,
};

DataTableComponent.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  columns: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        selector: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
          .isRequired,
        sortable: PropTypes.oneOfType([
          PropTypes.oneOf([null]),
          PropTypes.bool,
        ]),
        wrap: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.bool]),
      }),
    ])
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([
      // Transactions
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        purchase_date: PropTypes.number,
        product_name: PropTypes.string,
        product_price: PropTypes.product_price,
        rewardPoints: PropTypes.number,
      }),
      // Total Rewards
      PropTypes.shape({
        id: PropTypes.string,
        customer_name: PropTypes.string,
        rewardPoint: PropTypes.number,
      }),
      // Total Rewards
      PropTypes.shape({
        id: PropTypes.string,
        customer_name: PropTypes.string,
        rewardPoint: PropTypes.number,
        monthlyRewards: PropTypes.shape({
          month: PropTypes.string,
          rewardPoint: PropTypes.number,
        }),
      }),
    ])
  ).isRequired,
  haveExpandableRows: PropTypes.bool,
  uniqueKey: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

export default DataTableComponent;
