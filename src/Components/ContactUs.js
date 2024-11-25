import * as React from "react";
import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

function ContactUs({ setSnackbar }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
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
  return (
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
  );
}

export default ContactUs;
