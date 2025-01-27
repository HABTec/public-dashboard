import React, { useState, useEffect } from "react";
import ContactUs from "../Components/ContactUs";
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  useTheme,
  Snackbar,
  Alert,
  CardContent,
  Avatar,
  Drawer,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BarChartIcon from "@mui/icons-material/BarChart";
import MapIcon from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";

import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import HomeSlider from "../Components/HomeSlider";

const StyledHeroSection = styled(Box)(() => ({
  minHeight: "92.6vh",
  background: "linear-gradient(353deg, #ceefff 30%, #ffffff 90%)",
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
}));

const SlideShowPage = () => {
  const theme = useTheme();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  React.useEffect(() => {
    // get the url and identify if an id is set and scroll to the element
    const url = window.location.href;
    if (url.split("#").length > 1) {
      console.log(
        "contact item",
        document.getElementById(url.split("#")[1].toLowerCase())
      );
      document
        .getElementById(url.split("#")[1].toLowerCase())
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const navigationItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Features", id: "features" },
    { label: "Key Messages", id: "key messages" },
    { label: "Contact", id: "contact" },
    { label: "             ", id: "none" },
    { label: "             ", id: "none" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderNavItems = () => (
    <List>
      {navigationItems.map((item) =>
        item.to ? (
          <ListItem key={item.label} button>
            <Link
              to={item.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemText primary={item.label} />
            </Link>
          </ListItem>
        ) : (
          <ListItem
            key={item.label}
            button
            onClick={() =>
              document
                .getElementById(item.id)
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ListItemText primary={item.label} />
          </ListItem>
        )
      )}
    </List>
  );

  //load title variable from .env file
  const title = process.env.REACT_APP_TITLE;

  return (
    <Box>
      <AppBar position="sticky" theme={theme}>
        <Container maxWidth="xxl" onClick={handleFullScreen}>
          <Box
            py={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{
              background: "url(/ethiopian-flag.webp)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPositionX: "right",
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", maxWidth: "90%" }}
            >
              <img
                style={{
                  backgroundColor: "#fff",
                  boxShadow: "0 0 10px rgb(255 255 255 / 50%)",
                  borderRadius: "50%",
                }}
                src="./mini-moh.png"
                alt="moh logo"
              />
              <Typography
                alignItems="left"
                component="h1"
                variant="h6"
                noWrap
                sx={{
                  flexGrow: 1,
                  fontSize: "1.2rem",
                  marginLeft: "10px",
                  fontWeight: "normal",
                }}
              >
                {title}
              </Typography>
            </div>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navigationItems.map((item) =>
                item.to ? (
                  <Link
                    to={item.to}
                    style={{ textDecoration: "none", color: "#fff" }}
                    key={item.label}
                  >
                    <Button sx={{ color: "#fff" }}>{item.label}</Button>
                  </Link>
                ) : (
                  <Button
                    key={item.label}
                    sx={{ color: "#fff" }}
                    onClick={() =>
                      document
                        .getElementById(item.id)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    {item.label}
                  </Button>
                )
              )}
            </Box>
            <IconButton
              sx={{ display: { xs: "block", md: "none" }, color: "#fff" }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {renderNavItems()}
      </Drawer>
      <StyledHeroSection>
        <Container maxWidth="xxl">
          <HomeSlider mode="slideshow"></HomeSlider>
        </Container>
      </StyledHeroSection>
    </Box>
  );
};

export default SlideShowPage;
