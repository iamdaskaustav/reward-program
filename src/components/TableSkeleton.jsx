import React from "react";
import { Paper, Skeleton, Box } from "@mui/material";

const TableSkeleton = () => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Skeleton
          data-testid="Skeleton-loader"
          animation="wave"
          variant="rectangular"
          height={40}
        />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
        <Skeleton animation="wave" height={40} />
      </Box>
    </Paper>
  );
};

export default TableSkeleton;
