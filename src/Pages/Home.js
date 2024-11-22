import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  CardContent,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BarChartIcon from "@mui/icons-material/BarChart";
import MapIcon from "@mui/icons-material/Map";

import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import HomeSlider from "../Components/HomeSlider";

const StyledHeroSection = styled(Box)(({ theme }) => ({
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

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: "#f5f5f5",
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields",
        severity: "error",
      });
      return;
    }
    const recipient = process.env.REACT_APP_EMAIL_ADRESS;
    const body = `Name: ${formData.name}
                  Email: ${formData.email}
                  Message: ${formData.message}
                  
                  Regards!`.trim();

    window.open(
      `mailto:${recipient}?subject=Contact us form &body=${encodeURIComponent(
        body
      )}`
    );

    setSnackbar({
      open: true,
      message: "Message sent to your email client!",
      severity: "success",
    });
    setFormData({ name: "", email: "", message: "" });
  };

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
            <Typography variant="span">
              HMIS Insights: Exploring Health Metrics with Interactive
              Visualizations
            </Typography>
            <Box>
              <Link
                to="/dashboard"
                color="#fff"
                style={{ textDecoration: "none" }}
              >
                <Button sx={{ color: "#fff" }} key={100}>
                  Dashboard
                </Button>
              </Link>
              {["Features", "key messages", "Contact"].map((item) => (
                <Button
                  key={item}
                  color="inherit"
                  onClick={() =>
                    document
                      .getElementById(item.toLowerCase())
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
      </AppBar>

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
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            className="animate-on-scroll"
          >
            Contact Us
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="animate-on-scroll"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
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
