// require('dotenv').config();
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems } from "./listItems";
import Chart from "./Chart";
import SecondaryListItems from "./SecondaryListItems";
import ReactGA from "react-ga4";
import Footer from "./Footer";
import { Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function RequestForm() {
  ReactGA.send({
    hitType: "pageview",
    page: "/request-form",
    title: "request for additional information",
  });

  const form = React.useRef();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [affiliation, setAffiliation] = React.useState("");
  const [request, setRequest] = React.useState("");
  const [showChart, setShowChart] = React.useState(false);
  const [requester, setRequester] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [dataType, setDataType] = React.useState("");
  const [formatOfDataRequested, setFormatOfDataRequested] = React.useState("");
  const [requestingOrganaization, setRequestingOrganization] =
    React.useState("");
  const [age, setAge] = React.useState("");
  const [sex, setSex] = React.useState("");
  const [academicBackground, setAcademicBackground] = React.useState("");
  const [profession, setProfession] = React.useState("");
  const [purpose, setPurpose] = React.useState("");
  const [datasetName, setDatasetName] = React.useState("");
  const [geographicDisaggregation, setGeographicDisaggregation] =
    React.useState("");
  const [ageDisaggration, setAgeDisaggration] = React.useState("");
  const [sexDisaggration, setSexDisaggration] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  const handleSexDisaggrationChange = (event) => {
    setSexDisaggration(event.target.value);
  };
  const handleAgeDisaggrationChange = (event) => {
    setAgeDisaggration(event.target.value);
  };

  const handleGeographicDisaggregationChange = (event) => {
    setGeographicDisaggregation(event.target.value);
  };

  const handleDatasetNameChange = (event) => {
    setDatasetName(event.target.value);
  };

  const handlePurposeChange = (event) => {
    setPurpose(event.target.value);
  };
  const handleProfessionChange = (event) => {
    setProfession(event.target.value);
  };

  const handleSexChange = (event) => {
    setSex(event.target.value);
  };

  const handleAcademicBackgroundChange = (event) => {
    setAcademicBackground(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleRequestingOrganizationChange = (event) => {
    setRequestingOrganization(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleFormatOfDataRequestedChange = (event) => {
    setFormatOfDataRequested(event.target.value);
  };

  const handleDataTypeChange = (event) => {
    setDataType(event.target.value);
  };

  const handelPositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleRequesterChange = (event) => {
    setRequester(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAffiliationChange = (event) => {
    setAffiliation(event.target.value);
  };

  const handleRequestChange = (event) => {
    setRequest(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const recipient = process.env.REACT_APP_EMAIL_ADRESS;
    window.open(
      `mailto:${recipient}?subject=Request on ${affiliation}&body=${request}`
    );
  };

  const handleSavedReportClick = () => {
    setShowChart(true);
  };

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [savedReports, setSavedReports] = React.useState(
    JSON.parse(localStorage.getItem("saved_reports"))
  );

  const [selectedSavedChart, setSelectedSavedChart] = React.useState(null);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              HMIS Insights: Exploring Health Metrics with Interactive
              Visualizations
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            <SecondaryListItems
              savedReports={savedReports}
              setSavedReports={setSavedReports}
              setSelectedSavedChart={setSelectedSavedChart}
              onSavedReportClick={handleSavedReportClick}
            />
          </List>
        </Drawer>
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
            {showChart ? (
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  {/* Chart */}
                  <Chart
                    savedReports={savedReports}
                    setSavedReports={setSavedReports}
                    selectedSavedChart={selectedSavedChart}
                    setSelectedSavedChart={setSelectedSavedChart}
                  />
                </Grid>
              </Container>
            ) : (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                padding={4}
                rowSpacing={2}
                spacing={4}
                sx={{ padding: "10px", marginTop: "5rem" }}
              >
                <Paper elevation={3}>
                  <Typography
                    variant="h6"
                    align="left"
                    gutterBottom
                    sx={{ m: 2 }}
                  >
                    Request Form
                  </Typography>
                  <form ref={form} onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ padding: "15px" }}>
                      <Grid item xs={12}>
                        <TextField
                          name="affiliation"
                          label="Name of organization/Department/person requesting the Data/Information"
                          variant="outlined"
                          required
                          fullWidth
                          value={affiliation}
                          onChange={handleAffiliationChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="requester-select-label">
                            Requester
                          </InputLabel>
                          <Select
                            labelId="requester-select-label"
                            id="requester-select"
                            label="Requester"
                            value={requester}
                            onChange={handleRequesterChange}
                          >
                            <MenuItem value="Individual (for private/personal purpose)">
                              Individual (for private/personal purpose)
                            </MenuItem>
                            <MenuItem value="Organization">
                              Organization
                            </MenuItem>
                            <MenuItem value="Unit/Department within organization ">
                              Unit/Department within organization
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="type-of-data-select-label">
                            Type of data reqeusted
                          </InputLabel>
                          <Select
                            labelId="type-of-data-select-label"
                            id="type-of-data-select"
                            label="Type of data requested:"
                            value={dataType}
                            onChange={handleDataTypeChange}
                          >
                            <MenuItem value="Data set">Data set</MenuItem>
                            <MenuItem value="Report/Text Document">
                              Report/Text Document
                            </MenuItem>
                            <MenuItem value="Audio">Audio</MenuItem>
                            <MenuItem value="Video">Video</MenuItem>
                            <MenuItem value="Graphics/image/cartography">
                              Graphics/image/cartography
                            </MenuItem>
                            <MenuItem value="Biologic specimen">
                              Biologic specimen
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="requesting-organization-label">
                            Requesting Organization
                          </InputLabel>
                          <Select
                            labelId="requesting-organization-label"
                            id="requesting-organization"
                            label="Requesting Organization"
                            value={requestingOrganaization}
                            onChange={handleRequestingOrganizationChange}
                          >
                            <MenuItem value="MOH Agency">MOH Agency</MenuItem>
                            <MenuItem value="Health facility">
                              Health facility
                            </MenuItem>
                            <MenuItem value=" Research Institute ">
                              Research Institute
                            </MenuItem>
                            <MenuItem value="Academic institution">
                              Academic institution
                            </MenuItem>
                            <MenuItem value="Implementing partner">
                              Implementing partner
                            </MenuItem>
                            <MenuItem value="Donor">Donor</MenuItem>
                            <MenuItem value="Professional Association">
                              Professional Association
                            </MenuItem>
                            <MenuItem value="Media">Media</MenuItem>
                            <MenuItem value=" Private/Consulting firm">
                              Private/Consulting firm
                            </MenuItem>
                            <MenuItem value="NGO">NGO</MenuItem>
                            <MenuItem value="International /Foreign Organization">
                              International /Foreign Organization
                            </MenuItem>
                            <MenuItem value="Other /specify/">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="format-of-data-select-label">
                            Format of data
                          </InputLabel>
                          <Select
                            labelId="format-of-data-select-label"
                            id="format-of-data-select"
                            label="Format of data request"
                            value={formatOfDataRequested}
                            onChange={handleFormatOfDataRequestedChange}
                          >
                            <MenuItem value="Print/paper-based">
                              Print/paper-based
                            </MenuItem>
                            <MenuItem value="Electronic (Digital)">
                              Electronic (Digital)
                            </MenuItem>
                            <MenuItem value="Biologic sample">
                              Biologic sample
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Requesting Person
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          name="Age of the requestering person"
                          label="Age of the requestering person"
                          variant="outlined"
                          required
                          type="number"
                          fullWidth
                          value={age}
                          onChange={handleAgeChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel id="sex-of-requesing-person-select-label">
                            Sex of requesting person
                          </InputLabel>
                          <Select
                            labelId="sex-of-requesing-person-select-label"
                            id="sex-of-requesing-person-select"
                            label="Sex of requesting person"
                            value={sex}
                            onChange={handleSexChange}
                          >
                            <MenuItem value="Print/paper-based">Male</MenuItem>
                            <MenuItem value="Electronic (Digital)">
                              Female
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          name="Phone number"
                          label="Phone number"
                          variant="outlined"
                          required
                          fullWidth
                          type="number"
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="academic-background-of-requesing-person-select-label">
                            Academic Background of requesting person
                          </InputLabel>
                          <Select
                            labelId="academic-background-of-requesing-person-select-label"
                            id="academic-background-of-requesing-person-select"
                            label="Academic Background of requesting person"
                            value={academicBackground}
                            onChange={handleAcademicBackgroundChange}
                          >
                            <MenuItem value="Certificate">Certificate</MenuItem>
                            <MenuItem value="Diploma">Diploma</MenuItem>
                            <MenuItem value="Degree">Degree</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="profession-of-requesing-person-select-label">
                            Profession of requesting person
                          </InputLabel>
                          <Select
                            labelId="profession-of-requesing-person-select-label"
                            id="profession-of-requesing-person-select"
                            label="Profession of requesting person"
                            value={profession}
                            onChange={handleProfessionChange}
                          >
                            <MenuItem value="Researcher">Researcher</MenuItem>
                            <MenuItem value="Consultant">Consultant</MenuItem>
                            <MenuItem value="Healthcare Worker">
                              Healthcare Worker
                            </MenuItem>
                            <MenuItem value="University / College Student">
                              University / College Student
                            </MenuItem>
                            <MenuItem value="Journalist/Media professional">
                              Journalist/Media professional
                            </MenuItem>
                            <MenuItem value="Politician">Politician</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="email"
                          label="Email"
                          variant="outlined"
                          required
                          fullWidth
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel htmlFor="request">
                            Purpose of data request *
                          </InputLabel>
                          <OutlinedInput
                            name="Purpose"
                            id="Purpose"
                            multiline
                            rows={4}
                            required
                            label="Purpose of data request"
                            value={purpose}
                            onChange={handlePurposeChange}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name="The name of the dataset and year of undertaking"
                          label="The name of the dataset and year of undertaking"
                          variant="outlined"
                          required
                          fullWidth
                          value={datasetName}
                          onChange={handleDatasetNameChange}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Particulars/ Disaggregation of data requested
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          name="Geographic (National, regional, zonal, Woreda, Kebele)"
                          label="Geographic (National, regional, zonal, Woreda, Kebele)"
                          variant="outlined"
                          fullWidth
                          value={geographicDisaggregation}
                          onChange={handleGeographicDisaggregationChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="Age (Specify)"
                          label="Age (Specify)"
                          variant="outlined"
                          fullWidth
                          value={ageDisaggration}
                          onChange={handleAgeDisaggrationChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="Sex (Specify)"
                          label="Sex (Specify)"
                          variant="outlined"
                          fullWidth
                          value={sexDisaggration}
                          onChange={handleSexDisaggrationChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="Other demographic and socio-economic parameter/s"
                          label="Other demographic and socio-economic parameter/s"
                          variant="outlined"
                          fullWidth
                          value={sexDisaggration}
                          onChange={handleSexDisaggrationChange}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Consent
                        </Typography>
                        I/we the undersigned solemnly agree that I/we use the
                        data only for the purpose I/we requested for. I/we
                        appropriately acknowledge the data owner/source that
                        provided me/us access to this data in any publication or
                        communication. I/we will not share the data to a third
                        party without the consent of the data owner. I/we agree
                        to be held accountable by any legal or administrative
                        measures if I breach any of the above vows. <br />
                        <FormControlLabel
                          required
                          control={<Checkbox />}
                          label="I/we agree to the above vows."
                        />
                        <br />
                        Note: All the variables with asterisk (*) are mandatory
                        fields.
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Submit Request
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            )}
          </Container>

          <Footer></Footer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
