import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Grid2, Paper } from "@mui/material";
import PageBreadcrumb from "../../components/PageBreadcrumb";

// Main Component
const NestedTable = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/total-rewards");
  }, []);

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      style={{ minHeight: "100vh" }}
    >
      {/* <PageBreadcrumb pageName="Dashboard" />
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
        <Container
          maxWidth="sm"
          style={{ textAlign: "center", marginTop: "10%" }}
        >
          <Box display="flex" justifyContent="center" mb={4}></Box>
          <Typography variant="h4" color="primary" gutterBottom>
            Welcome to Reward Program
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginBottom: 4 }} // Adds vertical space
          >
            A reward program based on purchase
          </Typography>
          <Box sx={{ height: 100 }} />
        </Container>
      </Paper> */}
    </Grid2>
  );
};

export default NestedTable;
