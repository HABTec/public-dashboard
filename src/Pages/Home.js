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
  minHeight: "100vh",
  background: "linear-gradient(353deg, #ceefff 30%, #ffffff 90%)",
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
}));

const StyledSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  scrollMarginTop: "64px",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
  },
}));

const Home = () => {
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

  const features = [
    {
      icon: <MapIcon />,
      title: "Interactive Map with Key Health Metrics",
      description:
        "An engaging map displaying regional health data, such as disease prevalence, immunization coverage, and facility distribution.",
    },
    {
      icon: <BarChartIcon />,
      title: "Key Performance Indicators (KPIs)",
      description:
        "Highlight essential health statistics at a glance, such as: Maternal mortality rate. Vaccination coverage percentage. Disease case counts (e.g., malaria or TB).",
    },
    {
      icon: <PhoneAndroidIcon />,
      title: "User-Centric",
      description:
        "Focused on delivering the best user experience, Supporing both the web and mobile platform.",
    },
    {
      icon: <AccountTreeIcon />,
      title: "Organization unit selector",
      description:
        "Let users select specific regions (national, regional, or facility level) to customize their data view.",
    },
  ];

  const testimonials = [
    {
      name: "Mesoud Mohammed ",
      role: "Strategic Affairs Executive Office, Ministry of Health",
      quote:
        "Our commitment is to ensure transparency and accountability through accessible health data for every citizen. This public dashboard is a reflection of our efforts to provide accurate, timely, and actionable information to empower individuals, communities, and decision-makers. We believe that when people have access to health data, they can advocate for better services, hold systems accountable, and contribute to the development of a healthier society",
      avatar: "/mesud.png",
    },
    {
      name: "Gemechis Melkamu",
      role: "Digital Health Lead Executive Officer, Ministry of Health",
      quote:
        "Data is the cornerstone of effective decision-making. It enables us to identify challenges, measure progress, and allocate resources where they are needed most. This dashboard is more than just a collection of numbers—it’s a tool for collaboration and innovation. Together, we can use these insights to address health disparities, enhance service delivery, and build a future where every individual has the opportunity to live a healthy and fulfilling life.",
      avatar: "/gemechu.png",
    },
  ];

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
      <AppBar position="sticky">
        <Container>
          <Box
            py={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
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
        <Container>
          <HomeSlider></HomeSlider>
        </Container>
      </StyledHeroSection>

      <StyledSection id="features">
        <Container>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            className="animate-on-scroll"
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard className="animate-on-scroll">
                  <Box fontSize="3rem" color="primary.main" mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </StyledSection>

      <StyledSection id="key messages" sx={{ backgroundColor: "#f5f5f5" }}>
        <Container>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            className="animate-on-scroll"
          >
            Key Messages
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">{testimonial.name}</Typography>
                        <Typography color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      "{testimonial.quote}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </StyledSection>

      <StyledSection id="contact">
        <ContactUs setSnackbar={setSnackbar}></ContactUs>
      </StyledSection>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx global>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <Footer />
    </Box>
  );
};

export default Home;
