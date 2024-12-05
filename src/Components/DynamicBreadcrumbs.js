import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const DynamicBreadcrumbs = ({ dashboard }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [defaultDashboard, setDefaultDashboard] = useState(null);
  const [chartName, setChartName] = useState(null);

  useEffect(() => {
    if (dashboard && !defaultDashboard) {
      setDefaultDashboard(dashboard);
    }

    // Extract the dashboardItemId from the URL
    const dashboardItemId = new URLSearchParams(location.search).get(
      "dashboardItemId"
    );

    // Find the chart name based on dashboardItemId
    if (dashboardItemId && dashboard) {
      const foundChartName =
        dashboard.dashboardItems?.find(
          (item) => item.map?.id === dashboardItemId
        )?.map?.displayName ||
        dashboard.dashboardItems?.find((item) => {
          const subType = item[item.type?.toLowerCase()];
          return subType?.id === dashboardItemId;
        })?.[
          dashboard.dashboardItems
            ?.find((item) => {
              const subType = item[item.type?.toLowerCase()];
              return subType?.id === dashboardItemId;
            })
            ?.type?.toLowerCase()
        ]?.displayName;

      setChartName(foundChartName || null);
    }
  }, [location, dashboard, defaultDashboard]);

  const handleClick = (segmentIndex) => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const newPath = "/" + pathSegments.slice(0, segmentIndex + 1).join("/");
    return newPath;
  };

  // Split the pathname into segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Retrieve dashboard name and ID
  const dashboardName = dashboard?.name;
  const dashboardId = dashboard?.id;

  return (
    <Breadcrumbs>
      {/* Home breadcrumb */}
      <Link underline="hover" color="inherit" href="/">
        Home
      </Link>

      {/* Dashboard breadcrumb */}
      {pathSegments.includes("dashboard") ? (
        <Link underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </Link>
      ) : (
        pathSegments.map((segment, index) => (
          <Link key={index} underline="hover" href={handleClick(index)}>
            {segment.charAt(0).toUpperCase() + segment.slice(1)}
          </Link>
        ))
      )}

      {/* Dashboard name breadcrumb */}
      {dashboardName && dashboardId && (
        <Link
          underline="hover"
          color={chartName ? "inherit" : "#1876D1"}
          href={`/dashboard?dashboard=${dashboardId}`}
        >
          {dashboardName}
        </Link>
      )}

      {/* Chart name breadcrumb */}
      {chartName && <Typography color="#1876D1">{chartName}</Typography>}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;
