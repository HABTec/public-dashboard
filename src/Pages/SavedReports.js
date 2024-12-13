import { React, useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Chart from "../Components/Chart";
import Footer from "../Components/Footer";
import NavBar from "../Components/AppBar";

import { useLocation } from "react-router-dom";

const defaultTheme = createTheme();

export default function SavedReports() {
  const location = useLocation();

  const [selectedSavedChart, setSelectedSavedChart] = useState(
    location.state?.selectedSavedChart || null
  );
  const [showChart, setShowChart] = useState(
    location.state?.showChart || false
  );
  const [savedReports, setSavedReports] = useState(
    JSON.parse(localStorage.getItem("saved_reports"))
  );

  useEffect(() => {
    if (location.state?.selectedSavedChart) {
      setSelectedSavedChart(location.state.selectedSavedChart);
      setShowChart(location.state.showChart);
    }
  }, [location.state]);

  console.log(
    "Selected Saved Chart:",
    selectedSavedChart,
    "Show Chart:",
    showChart
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <NavBar
          setSelectedSavedChart={setSelectedSavedChart}
          savedReports={savedReports}
          setSavedReports={setSavedReports}
          setShowChart={setShowChart}
        />
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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, p: 4 }}>
            <Grid container spacing={3}>
              <Chart
                savedReports={savedReports}
                setSavedReports={setSavedReports}
                selectedSavedChart={selectedSavedChart}
                setSelectedSavedChart={setSelectedSavedChart}
                breadCrumbsVisible={false}
              />
            </Grid>
          </Container>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
