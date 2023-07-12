import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useReward } from "react-rewards";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import Overview from "./Overview";
import UserReports from "./UserReports";
import MachineReports from "./MachineReports";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { reward: notifReward, isAnimating } = useReward("notifReward", "emoji", {
    emoji: ["🔔", "🚨", "📣"],
    angle: -180,
    elementSize: 50,
    spread: 30,
    elementCount: 8,
    lifetime: 400,
  });

  const [page, setPage] = useState("overview");

  const renderPage = () => {
    if (page == "overview") {
      return <Overview />;
    } else if (page == "user") {
      return <UserReports />;
    } else if (page == "machine") {
      return <MachineReports />;
    } else {
      return <></>;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Warehouse Status Platform
            </Typography>
            <div id="notifReward">
              <IconButton color="inherit" onClick={notifReward}>
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton
              onClick={() => {
                setPage("overview");
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Overview" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setPage("user");
              }}
              disabled={true}
            >
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="User Reports" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setPage("machine");
              }}
              disabled={true}
            >
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Machine Reports" />
            </ListItemButton>
            <ListItemButton disabled={true}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>
            <ListItemButton disabled={true}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItemButton>
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {renderPage()}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
