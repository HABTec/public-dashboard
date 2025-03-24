import {
  Grid,
  Link,
  Typography,
  Box,
  Container,
  IconButton,
} from "@mui/material";

import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";

function Copyright(props) {
  return (
    <Typography variant="body2" align="center" {...props}>
      Copyright © {new Date().getFullYear()}{" "}
      {/* <Link color="inherit" href="https://moh.gov.et/">
        Ministry of Health
      </Link>{" "} */}
      {"."} All rights reserved. Powered by{" "}
      <Link color="inherit" href="https://habtechsolution.com/">
        HABTech solutions
      </Link>
    </Typography>
  );
}

function Footer1() {
  return (
    <Grid container sx={{ my: 8 }}>
      <Grid
        lg="6"
        xs={12}
        sx={{
          textAlign: "center",
          pt: 4,
        }}
      >
        <Grid
          item
          sx={{
            textAlign: "center",
          }}
        >
          <Copyright />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{
          textAlign: "center",
          pt: 4,
        }}
        color="text.secondary"
        lg="6"
      >
        <Grid item xs={12} sm={4} md={2}>
          <Link
            color="text.secondary"
            underline="none"
          >
            Home
          </Link>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Link href="http://ermp.moh.gov.et" underline="none" color="inherit">
            ERMP
          </Link>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Link href="http://pts.moh.gov.et" underline="none" color="inherit">
            PTS
          </Link>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Link href="https://cpd.moh.gov.et" underline="none" color="inherit">
            CPD
          </Link>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Link
            href="http://196.188.120.145:8000"
            underline="none"
            color="inherit"
          >
            LIPH
          </Link>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Link href="/en/contact" underline="none" color="inherit">
            Contact
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

function Footer2() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "primary.main", color: "white", py: 6, mt: 8 }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              <img src="./generic-logo.png" alt="logo" width="100%" />
            </Typography>
            <Typography variant="body2">
            Our Vision is to see Healthy, Productive, and Prosperous People.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" component="div">
              <Box component="span" sx={{ display: "block", mb: 1 }}>
                <Link
                  color="inherit"
                  href="https://moh.gov.et"
                  underline="none"
                >
                  Home
                </Link>
              </Box>
              <Box component="span" sx={{ display: "block", mb: 1 }}>
                <Link
                  href="#"
                  underline="none"
                  color="inherit"
                >
                  About Us
                </Link>
              </Box>
              
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box justifyContent="center" gap={2}>
              <Box component="span" sx={{ display: "block" }}>
                <Link
                  href="#"
                  underline="none"
                  color="inherit"
                >
                  <IconButton color="inherit" aria-label="Facebook">
                    <Facebook />
                  </IconButton>
                </Link>
              </Box>
              <Box component="span" sx={{ display: "block" }}>
                <Link
                  href="#"
                  underline="none"
                  color="inherit"
                >
                  <IconButton color="inherit" aria-label="Twitter">
                    <Twitter />
                  </IconButton>
                </Link>
              </Box>
              <Box component="span" sx={{ display: "block" }}>
                <Link
                  href="#"
                  underline="none"
                  color="inherit"
                >
                  <IconButton color="inherit" aria-label="YouTube">
                    <YouTube />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          <Copyright />
        </Typography>
      </Container>
    </Box>
  );
}

export default function Footer() {
  return <Footer2 />;
}
