import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Dashboard from "./Components/Dashboard";
import RequestForm from "./Pages/RequestForm";
import useInstallPrompt from "./hooks/useInstallPrompt";
import useServiceWorker from "./hooks/useServiceWorker";
import ReactGA from "react-ga4";
import Home from "./Pages/Home";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { createTheme } from "@mui/material/styles";
import FeedBack from "./Pages/Feedback";
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
            <Route path="/request-form" element={<RequestForm />} />
            <Route path="/feedback" element={<FeedBack />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
