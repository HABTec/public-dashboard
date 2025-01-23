import React, { Component } from "react";
import Slider from "react-slick";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { DashboardItem } from "./DashboardItem";

const apiBase = process.env.REACT_APP_BASE_URI;
const url =
  apiBase +
  "api/dashboards.json?paging=false&fields=id,name,favorite,displayDescription,dashboardItems[id,resources[id,%20name],type,shape,x,y,width,height,text,visualization[id,displayName,displayDescription],map[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]&filter=favorite:eq:true";
function HomeSlider() {
  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  const [dashboard, setDashboard] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  //load the list of charts
  React.useEffect(() => {
    fetch(encodeURI(url))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data?.dashboards.length > 0) {
          setDashboard(data.dashboards[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="slider-container">
      <Typography
        sx={{ textAlign: "center" }}
        variant="h2"
        component="h1"
        gutterBottom
        color="black"
      >
        Your Gateway to National Health Trends and Insights
      </Typography>
      <Slider {...settings}>
        {loading && <div>Loading...</div>}
        {dashboard?.dashboardItems?.map((item) => (
          <div>
            <Grid p={1} container key={item.id} spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="h5" paragraph color="black">
                  Health Data Hub: Empowering Communities with Data Transparency
                </Typography>
                <Typography variant="h6" paragraph color="black">
                  {item.visualization?.displayDescription}
                </Typography>
                <Link to="/dashboard" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#ff9800",
                      "&:hover": { backgroundColor: "#f57c00" },
                    }}
                  >
                    Explore Health Data
                  </Button>
                </Link>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box
                  alt="Hero section illustration"
                  sx={{ width: "100%", height: "auto" }}
                  loading="lazy"
                >
                  <DashboardItem
                    item={item}
                    fullWidth={true}
                    homePageMode={true}
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeSlider;
