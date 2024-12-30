import React from "react";
import { Container, Typography, Box, Grid2 } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      style={{ minHeight: "100vh" }}
    >
      <Container
        maxWidth="sm"
        style={{ textAlign: "center", marginTop: "10%" }}
      >
        <Box display="flex" justifyContent="center" mb={4}></Box>
        <Typography variant="h3" color="primary" gutterBottom>
          404 Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          The page you are looking for does not exist.
        </Typography>
      </Container>
    </Grid2>
  );
};

export default NotFoundPage;
