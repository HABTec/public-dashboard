import React, { useState, useEffect } from "react";
import { Paper, Box } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useMap } from "react-leaflet";
import ReactDOM from "react-dom";
import L from "leaflet";
import chroma from "chroma-js";
import LandslideOutlinedIcon from "@mui/icons-material/LandslideOutlined";
import {
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/ControlPoint";
import HealthPostIcon from "@mui/icons-material/MedicalInformation";

const Legend = ({ legendDatas }) => {
 
  const [showDetails, setShowDetails] = useState(false);
  const map = useMap();

  let accumulatedLegendItems = [];

  legendDatas.forEach((legendData, index) => {
    if (legendData.name === "thematic") {
      const intervalCount = legendData.colorScaleArray.length / 3 + 1;

      let intervals;

      if (legendData.mn === legendData.mx) {
        // If mn and mx are the same, create a single interval covering that value
        intervals = [{ start: legendData.mn, end: legendData.mn + 1 }];
      } else {
        const intervalSize = (legendData.mx - legendData.mn) / intervalCount;
        intervals = Array.from({ length: intervalCount }, (_, i) => {
          const start = legendData.mn + i * intervalSize;
          const end = legendData.mn + (i + 1) * intervalSize;
          return { start, end };
        });
      }

      const counts = intervals.map(
        ({ start, end }) =>
          legendData.regionColors?.filter(
            ({ value }) => value >= start && value < end
          ).length
      );
      // console.log("counts", counts, intervals);
      const midpointColors = intervals.map(({ start, end }) => {
        const midpoint = (start + end) / 2;
        return chroma
          .scale(legendData.colorScaleArray)
          .domain([legendData.mn, legendData.mx])(midpoint)
          .hex();
      });

      // Accumulate the thematic legend items
      accumulatedLegendItems = [
        ...accumulatedLegendItems,
        <div key={`thematic-${index}`}>
          <b>{legendData.displayName}</b>

          {intervals.map(({ start, end }, idx) => (
            <div
              key={`thematic-${index}-${idx}`}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                padding: 2,
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: midpointColors[idx],
                  marginRight: "8px",
                  border: "1px solid #999",
                }}
              ></div>
              <span>{`${start.toFixed(2)} - ${end.toFixed(2)} (${
                counts[idx]
              })`}</span>
            </div>
          ))}
        </div>,
      ];
    } else if (legendData.name === "bubble") {
      const intervalCount = 5;
      let intervals;

      if (legendData.mn === legendData.mx) {
        intervals = [{ start: legendData.mn, end: legendData.mn + 1 }];
      } else {
        const intervalSize = (legendData.mx - legendData.mn) / intervalCount;
        intervals = Array.from({ length: intervalCount }, (_, i) => {
          const start = legendData.mn + i * intervalSize;
          const end = legendData.mn + (i + 1) * intervalSize;
          return { start, end };
        });
      }

      // radius and color for the midpoint of each interval
      const bubbleData = intervals.map(({ start, end }, idx) => {
        const midpoint = (start + end) / 2;
        const radius = (idx + 1) * 20;
        const color = chroma
          .scale(legendData.colorScaleArray)
          .domain([legendData.mn, legendData.mx])(midpoint)
          .hex();
        return { radius, color, start, end };
      });

      const maxRadius = Math.max(...bubbleData.map((b) => b.radius));

      accumulatedLegendItems = [
        ...accumulatedLegendItems,
        <div
          key={`bubble-${index}`}
          style={{
            position: "relative",
            height: `${maxRadius + 50}px`,
            overflow: "hidden",
            padding: "10px",
          }}
        >
          <b>{legendData.displayName}</b>
          <Box
            style={{ position: "relative", width: "100%", height: "100%" }}
            marginBottom={"2rem"}
          >
            {bubbleData.reverse().map(({ radius, color, start, end }, idx) => (
              <div
                key={`bubble-${index}-${idx}`}
                style={{
                  width: `${radius}px`,
                  height: `${radius}px`,
                  borderRadius: "50%",
                  backgroundColor: color,
                  position: "absolute",
                  left: "50%",
                  transform: `translateX(-50%)`,
                  bottom: 0,
                  zIndex: idx,
                  border: "1px solid #999",
                  marginBottom: "10px",
                }}
                title={`${start.toFixed(2)} - ${end.toFixed(2)}`}
              ></div>
            ))}
          </Box>
        </div>,
      ];
    } else if (legendData.name === "facility") {
      accumulatedLegendItems.push(
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
    } else if (legendData.name === "orgUnit") {
      accumulatedLegendItems.push(
        <div key={`orgUnit-${index}`}>
          <b>OrgUnit</b>
          <Box paddingLeft={3}>
            <LandslideOutlinedIcon />
          </Box>
        </div>
      );
    }
  });

  const handleClick = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    const legendDiv = L.DomUtil.create("div", "info legend");

    const legendContent = (
      <Paper
        elevation={1}
        sx={{ padding: 0.5 }}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <Box display="flex" alignItems="center" m={0.5}>
          <FormatListBulletedIcon />
          {showDetails ? " Legend" : ""}
        </Box>

        {showDetails && accumulatedLegendItems}
      </Paper>
    );

    ReactDOM.render(legendContent, legendDiv);

    const legendControl = L.control({ position: "bottomleft" });
    legendControl.onAdd = () => legendDiv;
    legendControl.addTo(map);

    return () => {
      legendControl.remove();
    };
  }, [map, showDetails, accumulatedLegendItems]);

  return null;
};

export default Legend;
