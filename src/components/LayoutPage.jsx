import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  MenuOpen as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  Home as HomeIcon,
  Addchart as AddchartIcon,
  RequestPage as RequestPageIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const drawerItems = [
  {
    index: 0,
    name: "Dashboard",
    path: "/",
    icon: <HomeIcon />,
  },
  {
    index: 1,
    name: "Monthly Rewards",
    path: "/monthly-rewards",
    icon: <EventIcon />,
  },
  {
    index: 2,
    name: "Total Rewards",
    path: "/total-rewards",
    icon: <RequestPageIcon />,
  },
  {
    index: 3,
    name: "Transactions",
    path: "/transaction",
    icon: <AddchartIcon />,
  },
];

export default function LayoutPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [pageNavName, setPageNavName] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigateToRoute = (route) => {
    navigate(route);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedIndex(0);
      setPageNavName("Dashboard");
    }

    const currentPage = drawerItems.find((r) => {
      return r.path === location.pathname;
    });

    if (currentPage) {
      setSelectedIndex(currentPage.index);
      setPageNavName(currentPage.name);
    }
  }, [location]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "#0047AB", // Custom color
          color: "#ffffff", // Text color
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {pageNavName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          sx={{
            backgroundColor: "#0047AB", // Custom color
            color: "#ffffff", // Text color
          }}
        >
          <Typography variant="h6" gutterBottom>
            Reward Program &nbsp;
          </Typography>
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              color: "#ffffff",
            }}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {drawerItems.map((item) => (
            <ListItem
              key={item.name}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigateToRoute(item.path)}
            >
              <Tooltip title={item.name} placement="right">
                <ListItemButton
                  selected={selectedIndex === item.index}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: "initial",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1, mt: 8, backgroundColor: "#F0F0F0" }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
