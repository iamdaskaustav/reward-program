import React from "react";
import { Container, Typography, Box, Grid2, Paper } from "@mui/material";
import PropTypes from "prop-types";
// import NoDataImage from "../assets/images/9170826.jpg";

const NoDataFound = ({ subtitle }) => {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      style={{ minHeight: "100vh" }}
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
        <Container
          maxWidth="sm"
          style={{ textAlign: "center", marginTop: "10%" }}
        >
          <Box display="flex" justifyContent="center" mb={4}>
            {/* <img
              src={NoDataImage}
              alt="No Data Found"
              style={{ width: "150px", height: "150px", objectFit: "contain" }}
            /> */}
          </Box>
          <Typography variant="h3" color="primary" gutterBottom>
            No Data Found
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginBottom: 4 }}
          >
            {subtitle}
          </Typography>
          <Box sx={{ height: 100 }} />
        </Container>
      </Paper>
    </Grid2>
  );
};

NoDataFound.propTypes = {
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

export default NoDataFound;
