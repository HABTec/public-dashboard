import React, { useState } from "react";
import { Paper, Box } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import {
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/ControlPoint";
import HealthPostIcon from "@mui/icons-material/MedicalInformation";
import LandslideOutlinedIcon from "@mui/icons-material/LandslideOutlined";
import chroma from "chroma-js";

const SplitMapLegend = ({ legendDatas, legendRange = null }) => {
  const [showDetails, setShowDetails] = useState(false);
  console.log("split legendData", legendDatas, legendRange)
  
  const renderLegendItems = () => {
   
    const combinedLegends = [
      ...(legendRange ? [legendRange] : []), 
      ...(legendDatas || []), 
    ];
  
    return combinedLegends.map((legendData, index) => {
      const { displayName, mn, mx, name, regionColors } = legendData;
      console.log("legendsplit", combinedLegends)
  
      if (name === "thematic") {
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
          <div key={`thematic-${index}`} style={{fontSize : "0.8rem"}}>
            <b >{displayName}</b>
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
                <span>{`${start.toFixed(2)} - ${end.toFixed(2)}                 `
                }
                </span>
              </div>
            ))}
          </div>
        );
      } else if (name === "bubble") {
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
            style={{ position: "relative", padding: "10px" }}
          >
            <b>{displayName}</b>
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
                      marginBottom: "10px",
                    }}
                    title={`${start.toFixed(2)} - ${end.toFixed(2)}`}
                  ></div>
                ))}
            </Box>
          </div>
        );
      } else if (name === "facility") {
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
        bottom: "1.5rem",
        left: "1.5rem",
        zIndex: 1001,
        borderRadius: "4px",
        padding: "4px 8px",
      }}
      onClick={() => setShowDetails(!showDetails)}
      style={{ cursor: "pointer" }}
    >
      <Box display="flex" alignItems="center" m={0.5}>
        <FormatListBulletedIcon />
        {showDetails ? " Legend" : ""}
      </Box>
      {showDetails && renderLegendItems()}
    </Paper>
  );
};

export default SplitMapLegend;
