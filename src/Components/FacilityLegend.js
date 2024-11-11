import React from "react";
import { Box } from "@mui/material";
import {
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/ControlPoint";
import HealthPostIcon from "@mui/icons-material/MedicalInformation";

const FacilityLegend = ({ legendData }) => (
  <Box display="flex" flexDirection="column" sx={{ bgcolor: "white", p: 1 }}>
    <b>Facilities</b>
    {[
      { label: "Clinics", icon: <RoomIcon />, count: legendData.clinic },
      {
        label: "Hospitals",
        icon: <LocalHospitalIcon />,
        count: legendData.hospital,
      },
      { label: "Health Centers", icon: <HomeIcon />, count: legendData.center },
      {
        label: "Health Posts",
        icon: <HealthPostIcon />,
        count: legendData.posts,
      },
    ].map(({ label, icon, count }) => (
      <Box key={label} display="flex" alignItems="center">
        {label}: {icon} {count || "0"}
      </Box>
    ))}
  </Box>
);

export default FacilityLegend;
