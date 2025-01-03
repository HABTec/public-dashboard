import React, { useState } from "react";
import { Paper, Box, Typography } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/ControlPoint";
import HealthPostIcon from "@mui/icons-material/MedicalInformation";
import LandslideOutlinedIcon from "@mui/icons-material/LandslideOutlined";
import chroma from "chroma-js";
import PredefinedColorLegend from "./PredefinedColorLegend";

const SplitMapLegend = ({
  legendDatas,
  legendRange = null,
  legendSet = null,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const thematicType = legendRange?.name.toLowerCase();

  console.log(
    "split legendData",
    legendDatas,
    legendRange,
    "legend set",
    legendSet
  );

  const renderLegendItems = () => {
    if (legendSet?.legends) {
      return (
        <PredefinedColorLegend
          key={legendSet}
          legendSet={{...legendSet, periodName : legendSet.periodName.name}}
          thematicType={thematicType}
        />
      );
    }

    const combinedLegends = [
      ...(legendRange ? [legendRange] : []),
      ...(legendDatas || []),
    ];

    return combinedLegends.map((legendData, index) => {
      const { displayName, mn, mx, name, regionColors, periodName } =
        legendData;
      console.log("legendsplit", combinedLegends, legendData.periodName);

      if (name.toLowerCase() === "choropleth") {
        // Thematic legend logic
        const intervalCount = 5;
        const intervalSize = (mx - mn) / intervalCount;

        const intervals = Array.from({ length: intervalCount }, (_, i) => {
          const start = mn + i * intervalSize;
          const end = start + intervalSize;
          return { start, end };
        });

        const colors = ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"];
        const counts = intervals.map(
          ({ start, end }) =>
            regionColors?.filter(
              ({ value }) => value >= start && value < end + 0.1
            ).length || 0
        );

        return (
          <div key={`thematic-${index}`} style={{ fontSize: "0.8rem" }}>
            <b>{displayName}</b>
            {periodName && (
              <Typography fontSize={12} margin={0.5}>
                {periodName}
              </Typography>
            )}
            {intervals.map(({ start, end }, idx) => (
              <div
                key={`thematic-${index}-${idx}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: "2px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: colors[idx],
                    marginRight: "8px",
                    border: "1px solid #999",
                  }}
                ></div>
                <span>{`${start.toFixed(2)} - ${end.toFixed(2)}`}</span>
              </div>
            ))}
          </div>
        );
      } else if (name.toLowerCase() === "bubble") {
        // Bubble legend logic
        const bubbleData = Array.from({ length: 5 }, (_, idx) => {
          const midpoint = mn + idx * ((mx - mn) / 5);
          return {
            radius: (idx + 1) * 20,
            color: chroma
              .scale(["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"])
              .domain([mn, mx])(midpoint)
              .hex(),
            start: midpoint,
            end: midpoint + (mx - mn) / 5,
          };
        });

        return (
          <div
            key={`bubble-${index}`}
            style={{
              position: "relative",
              padding: "10px",
              height: "9.7rem",
              marginBottom: "1rem",
            }}
          >
            <b>{displayName}</b>
            {periodName && (
              <Typography fontSize={12} margin={0.5}>
                {periodName}
              </Typography>
            )}
            <Box
              style={{ position: "relative", width: "100%", height: "100%" }}
              marginBottom="2rem"
            >
              {bubbleData
                .reverse()
                .map(({ radius, color, start, end }, idx) => (
                  <div
                    key={`bubble-${index}-${idx}`}
                    style={{
                      width: `${radius}px`,
                      height: `${radius}px`,
                      borderRadius: "50%",
                      backgroundColor: color,
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      bottom: 0,
                      zIndex: idx,
                      border: "1px solid #999",
                      marginBottom: "27px",
                    }}
                    title={`${start.toFixed(2)} - ${end.toFixed(2)}`}
                  ></div>
                ))}
            </Box>
          </div>
        );
      } else if (name.toLowerCase() === "facility") {
        // Facility legend logic
        return (
          <div
            key={`facility-${index}`}
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              padding: 2,
            }}
          >
            <b>Facilities</b>
            <span style={{ display: "flex", alignItems: "center" }}>
              Clinics: <RoomIcon style={{ marginLeft: 4 }} />{" "}
              {legendData["clinic"] || "0"}
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              Hospitals: <LocalHospitalIcon style={{ marginLeft: 4 }} />{" "}
              {legendData["hospital"] || "0"}
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              Health Centers: <HomeIcon style={{ marginLeft: 4 }} />{" "}
              {legendData["center"] || "0"}
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              Health Posts: <HealthPostIcon style={{ marginLeft: 4 }} />{" "}
              {legendData["posts"] || "0"}
            </span>
          </div>
        );
      } else if (name === "orgUnit") {
        // OrgUnit legend logic
        return (
          <div key={`orgUnit-${index}`}>
            <b>OrgUnit</b>
            <Box paddingLeft={3}>
              <LandslideOutlinedIcon />
            </Box>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        position: "absolute",
        bottom: 13,
        left: 13,
        zIndex: 1001,
        borderRadius: "4px",
        padding: "3px 5px",
      }}
      onClick={() => setShowDetails(!showDetails)}
      style={{ cursor: "pointer" }}
    >
      <Box display="flex" alignItems="center" m={0.5}>
        <FormatListBulletedIcon />
        {showDetails ? " Legend" : ""}
      </Box>
      <Box></Box>
      {showDetails && renderLegendItems()}
    </Paper>
  );
};

export default SplitMapLegend;
