import React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  Toolbar,
  Typography,
  Skeleton,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const LayoutSkeleton = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6"></Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Drawer
        sx={{
          width: 50,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 65,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ width: 50 }}>
          <Skeleton variant="text" width={30} height={50} />

          <List>
            <Skeleton variant="text" width={30} height={30} />
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          //   marginLeft: 30,
        }}
      >
        <Skeleton variant="text" width="30" height={40} />
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ my: 2 }}
        />
        <Skeleton variant="text" width="60%" height={40} />
      </Box>
    </Box>
  );
};

export default LayoutSkeleton;
