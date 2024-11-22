// require('dotenv').config();
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems } from "../Components/listItems";
import Chart from "../Components/Chart";
import SecondaryListItems from "../Components/SecondaryListItems";
import ReactGA from "react-ga4";
import Footer from "../Components/Footer";
import { Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function FeedBack() {
  ReactGA.send({
    hitType: "pageview",
    page: "/feedback",
    title: "Feedback Collection page",
  });

  const [showChart, setShowChart] = React.useState(false);

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [savedReports, setSavedReports] = React.useState(
    JSON.parse(localStorage.getItem("saved_reports"))
  );

  const iframeRef = React.useRef(null);

  const handleSavedReportClick = () => {
    setShowChart(true);
  };
  const [selectedSavedChart, setSelectedSavedChart] = React.useState(null);
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
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              HMIS Insights: Exploring Health Metrics with Interactive
              Visualizations
            </Typography>
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
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems
              savedReports={savedReports}
              setSavedReports={setSavedReports}
              setSelectedSavedChart={setSelectedSavedChart}
              onSavedReportClick={handleSavedReportClick}
            />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
          width="100%"
        >
          <Container width="100%" sx={{ mt: 4, mb: 4, p: 4 }}>
            {showChart ? (
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  {/* Chart */}
                  <Chart
                    savedReports={savedReports}
                    setSavedReports={setSavedReports}
                    selectedSavedChart={selectedSavedChart}
                    setSelectedSavedChart={setSelectedSavedChart}
                  />
                </Grid>
              </Container>
            ) : (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                padding={4}
                rowSpacing={2}
                spacing={4}
                sx={{ padding: "10px", marginTop: "2rem" }}
                sm={12}
                width="100%"
              >
                <Paper
                  elevation={3}
                  width="100%"
                  sx={{ width: "100%", paddingTop: "2rem" }}
                >
                  <iframe
                    id="myIframe"
                    src="https://docs.google.com/forms/d/e/1FAIpQLSeMDVXsEF2hNBdKf4XKRuGhbiDZxiN_gfqosz7sqrOHgx5otg/viewform?embedded=true"
                    width="100%"
                    height="1880"
                    frameborder="0"
                    marginheight="0"
                    marginwidth="0"
                  >
                    Loading…
                  </iframe>
                </Paper>
              </Grid>
            )}
          </Container>

          <Footer></Footer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
