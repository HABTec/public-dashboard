import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import HomeIcon from "@mui/icons-material/Home";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import { Link } from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItemButton>
    <ListItemButton component={Link} to="/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/request-form">
      <ListItemIcon>
        <SendTimeExtensionIcon />
      </ListItemIcon>
      <ListItemText primary="Request Form" />
    </ListItemButton>

    <ListItemButton component={Link} to="/#contact">
      <ListItemIcon>
        <PermContactCalendarIcon />
      </ListItemIcon>
      <ListItemText primary="Contact Us" />
    </ListItemButton>
    <ListItemButton component={Link} to="/feedback">
      <ListItemIcon>
        <FeedbackIcon />
      </ListItemIcon>
      <ListItemText primary="Feedback" />
    </ListItemButton>
  </React.Fragment>
);
