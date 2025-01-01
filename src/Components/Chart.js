import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  ButtonGroup,
  Button,
} from "@mui/material";
import { DashboardItems, DashboardItem } from "./DashboardItem";
import Title from "./Title";
import { useSnackbar } from "material-ui-snackbar-provider";
import ReactGA from "react-ga4";
import DynamicBreadcrumbs from "./DynamicBreadcrumbs";

const apiBase = process.env.REACT_APP_BASE_URI;

const url =
  apiBase +
  "api/dashboards.json?paging=false&fields=id,name,favorite,displayDescription,dashboardItems[id,resources[id, name],type,shape,x,y,width,height,text,visualization[id,displayName],map[id,displayName],eventReport[id,displayName],eventChart[id,displayName]]";

export default function Chart({
  settings,
  savedReports,
  setSavedReports,
  selectedSavedChart,
  setSelectedSavedChart,
  breadCrumbsVisible = true,
}) {
  const theme = useTheme();
  const [dashboard, setDashbaord] = React.useState({ id: "" });
  const [dashboards, setDashboards] = React.useState([]);
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState(true); // State variable for loading indicator
  const [filters, setFilters] = React.useState(null);

  //load the list of charts
  React.useEffect(() => {
    fetch(encodeURI(url))
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        let jsonData = JSON.parse(data);
        let dashboards_json = jsonData.dashboards.map((_dashboard) => {
          return {
            ..._dashboard,
            dashboardItems: _dashboard.dashboardItems.map((item) => {
              return { ...item, _id: item.id };
            }),
          };
        });
        setDashboards(dashboards_json);
        setLoading(false);
        const params = new URLSearchParams(window.location.search);
        const dashboardId = params.get("dashboard");
        const dashboardItemId = params.get("dashboardItemId");
        const favoriteDashboard = dashboards_json.find(
          (_dashboard) => _dashboard.favorite
        );

        if (favoriteDashboard && !dashboardId) {
          setDashbaord(favoriteDashboard);
          if (window.location.pathname != "/saved-report") {
            const newUrl = `${window.location.origin}${window.location.pathname}?dashboard=${favoriteDashboard.id}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
          }
        }
        if (dashboardId) {
          const selectedDashboard = dashboards_json.find(
            (d) => d.id === dashboardId
          );
          if (selectedDashboard && dashboardItemId) {
            const selectedDashboardItem = selectedDashboard.dashboardItems.find(
              (d) =>
                d._id === dashboardItemId ||
                d[d.type.toLowerCase()].id === dashboardItemId
            );

            setDashbaord({
              ...selectedDashboard,
              dashboardItems: [selectedDashboardItem],
            });
          } else if (selectedDashboard) {
            setDashbaord(selectedDashboard);
          }
        }
      })
      .catch(() => {
        snackbar.showMessage(
          "Failed to load dashboards",
          undefined,
          undefined,
          { type: "error" }
        );
        setLoading(false);
      });
  }, []);

  const handleChartChange = (data) => {
    let dashboard = dashboards.find(
      (dashboard) => dashboard.id === data.target.value
    );
    setDashbaord(dashboard);
    console.log("look setted", dashboard);
    setSelectedSavedChart(null);

    // Send a custom event
    ReactGA.event({
      category: "select_dashboard",
      action: "select_dashboard",
      value: 1,
      label: dashboard.name + "[" + dashboard.id + "]",
      nonInteraction: false,
      transport: "xhr",
    });

    const newUrl = `${window.location.origin}${window.location.pathname}?dashboard=${dashboard.id}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const dashboardMenuList = () => {
    const dashboardToRender = dashboards.filter(
      (dashboard) => dashboard.name.slice(-1) === "."
    );

    return dashboardToRender.map((dashboard) => (
      <Button
        key={dashboard.id}
        value={dashboard.id}
        onClick={() => {
          handleChartChange({ target: { value: dashboard.id } });
        }}
      >
        {dashboard.name}
      </Button>
    ));
  };


  return (
    <React.Fragment>
      <Grid item xs={12} md={10} lg={10}>
        {breadCrumbsVisible && (
          <Grid item xs={12} md={12} lg={12} marginBottom={2}>
            <DynamicBreadcrumbs dashboard={dashboard} />
          </Grid>
        )}
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "row",
            height: "400",
            flexWrap: "nowrap",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "2%",
          }}
        >
          <FormControl fullWidth>
            <ButtonGroup variant="outlined" aria-label="Select Dashbaord here">
              {loading ? <CircularProgress size={24} /> : dashboardMenuList()}
            </ButtonGroup>
          </FormControl>

        </Paper>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {dashboard && dashboard.displayDescription && (
            <p>{dashboard.displayDescription}</p>
          )}
        </Box>
      </Grid>

      <DashboardItems
        savedReports={savedReports}
        setSavedReports={setSavedReports}
        settings={settings}
        items={
          selectedSavedChart ? selectedSavedChart : dashboard?.dashboardItems
        }
        filters={filters}
        dashboard={dashboard}
      > </DashboardItems>
    </React.Fragment>
  );
}
