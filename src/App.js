import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import SavedReports from "./Pages/SavedReports";
import SlideShowPage from "./Pages/SlideShowPage";
import RequestForm from "./Pages/RequestForm";
import useServiceWorker from "./hooks/useServiceWorker";
import ReactGA from "react-ga4";
import Home from "./Pages/Home";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { createTheme } from "@mui/material/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function App() {
  const GAKey = process.env.REACT_APP_GA_ID;
  ReactGA.initialize(GAKey);

  useServiceWorker();

  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/slide-show" element={<SlideShowPage />} />
            <Route path="/request-form" element={<RequestForm />} />
            <Route path="/saved-report" element={<SavedReports />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
