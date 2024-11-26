import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Chart from "./Chart";
import ReactGA from "react-ga4";
// import MapChart from "./MapChart";
import Footer from "./Footer";
import NavBar from "./AppBar";
import useSettings from "../hooks/useSettings";

const chartData = {
  headers: [
    { name: "id" },
    { name: "name" },
    { name: "latitude" },
    { name: "longitude" },
    { name: "value" },
  ],
  metaData: {
    dimensions: {
      pe: ["202107", "202108"],
      dx: ["dataElement1", "dataElement2"],
    },
  },
  rows: [
    ["1", "Location 1", "34.052235", "-118.243683", "5.0"],
    ["2", "Location 2", "40.712776", "-74.005974", "10.0"],
    ["3", "Location 3", "51.507351", "-0.127758", "15.0"],
    ["4", "Location 4", "48.856613", "2.352222", "20.0"],
    ["5", "Location 5", "35.689487", "139.691711", "25.0"],
  ],
};

const chartInfo = {
  title: "Sample Heatmap",
  description: "This is a sample heatmap visualization.",
};

export default function Dashboard() {
  // Send pageview with a custom path
  ReactGA.send({
    hitType: "pageview",
    page: "/",
    title: "Dashboard Main page",
  });

  const [selectedSavedChart, setSelectedSavedChart] = React.useState(null);
  const [savedReports, setSavedReports] = React.useState(
    JSON.parse(localStorage.getItem("saved_reports"))
  );

  const settings = useSettings();

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar
        savedReports={savedReports}
        setSavedReports={setSavedReports}
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
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, minHeight: "80vh" }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Chart
              settings={settings}
              savedReports={savedReports}
              setSavedReports={setSavedReports}
              selectedSavedChart={selectedSavedChart}
              setSelectedSavedChart={setSelectedSavedChart}
            />
          </Grid>
        </Container>
        <Footer></Footer>
      </Box>
    </Box>
  );
}
