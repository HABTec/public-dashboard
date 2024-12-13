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
import NavBar from "../Components/AppBar";
import DynamicBreadcrumbs from "../Components/DynamicBreadcrumbs";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function FeedBack() {
  ReactGA.send({
    hitType: "pageview",
    page: "/feedback",
    title: "Feedback Collection page",
  });

  const [showChart, setShowChart] = React.useState(false);

  const [savedReports, setSavedReports] = React.useState(
    JSON.parse(localStorage.getItem("saved_reports"))
  );

  const handleSavedReportClick = () => {
    setShowChart(true);
  };
  const [selectedSavedChart, setSelectedSavedChart] = React.useState(null);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <NavBar
          setSavedReports={selectedSavedChart}
          savedReports={savedReports}
          setSelectedSavedChart={setSelectedSavedChart}
        ></NavBar>
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
          <Grid item xs={12} md={12} lg={12} marginTop={2} paddingTop={3} marginLeft={-2.5}>
            <DynamicBreadcrumbs dashboards={null} />
          </Grid>
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
