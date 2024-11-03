import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useMap } from "react-leaflet";
import ReactDOM from "react-dom";
import L from "leaflet";
import chroma from "chroma-js";
import {
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/ControlPoint";
import HealthPostIcon from "@mui/icons-material/MedicalInformation";
import LandslideOutlinedIcon from "@mui/icons-material/LandslideOutlined";

const Legend = ({ legendDatas, legendSet = null }) => {
  const [showDetails, setShowDetails] = useState(false);
  const map = useMap();

  const accumulatedLegendItems = useMemo(() => {
    const items = [];

    if (legendSet) {
      items.push(
        <TableContainer key="legend-set">
          <Table aria-label="legend table">
            <TableRow>
              <TableCell colSpan={3} align="center">
                {legendSet.name}
              </TableCell>
            </TableRow>
            <TableBody>
              {legendSet.legends?.map((row) => (
                <TableRow key={row.name}>
                  <TableCell
                    sx={{ backgroundColor: row.color, width: "2px" }}
                  ></TableCell>
                  <TableCell>
                    {row.name} <br />
                    <Typography variant="caption">
                      {row.startValue} - {row.endValue}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      legendDatas.forEach((legendData, index) => {
        if (legendData.name === "thematic") {
          const intervalCount = legendData.colorScaleArray.length / 3 + 1;
          const intervals =
            legendData.mn === legendData.mx
              ? [{ start: legendData.mn, end: legendData.mn + 1 }]
              : Array.from({ length: intervalCount }, (_, i) => ({
                  start:
                    legendData.mn +
                    (i * (legendData.mx - legendData.mn)) / intervalCount,
                  end:
                    legendData.mn +
                    ((i + 1) * (legendData.mx - legendData.mn)) / intervalCount,
                }));
          const midpointColors = intervals.map(({ start, end }) =>
            chroma
              .scale(legendData.colorScaleArray)
              .domain([legendData.mn, legendData.mx])((start + end) / 2)
              .hex()
          );
          const counts = intervals.map(
            ({ start, end }) =>
              legendData.regionColors?.filter(
                ({ value }) => value >= start && value < end
              ).length || 0
          );

          items.push(
            <div key={`thematic-${index}`}>
              <b>{legendData.displayName}</b>
              {intervals.map(({ start, end }, idx) => (
                <Box
                  key={`thematic-${index}-${idx}`}
                  display="flex"
                  alignItems="center"
                  sx={{ bgcolor: "white", p: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: midpointColors[idx],
                      mr: 1,
                      border: "1px solid #999",
                    }}
                  ></Box>
                  <Typography variant="body2">
                    {`${start.toFixed(2)} - ${end.toFixed(2)} (${counts[idx]})`}
                  </Typography>
                </Box>
              ))}
            </div>
          );
        } else if (legendData.name === "bubble") {
          const intervalCount = 5;
          const intervals =
            legendData.mn === legendData.mx
              ? [{ start: legendData.mn, end: legendData.mn + 1 }]
              : Array.from({ length: intervalCount }, (_, i) => ({
                  start:
                    legendData.mn +
                    (i * (legendData.mx - legendData.mn)) / intervalCount,
                  end:
                    legendData.mn +
                    ((i + 1) * (legendData.mx - legendData.mn)) / intervalCount,
                }));
          const bubbleData = intervals.map(({ start, end }, idx) => ({
            radius: (idx + 1) * 20,
            color: chroma
              .scale(legendData.colorScaleArray)
              .domain([legendData.mn, legendData.mx])((start + end) / 2)
              .hex(),
            start,
            end,
          }));
          const maxRadius = Math.max(...bubbleData.map((b) => b.radius));

          items.push(
            <Box
              key={`bubble-${index}`}
              sx={{
                position: "relative",
                height: `${maxRadius + 50}px`,
                overflow: "hidden",
                p: 1,
              }}
            >
              <b>{legendData.displayName}</b>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  mb: 4,
                }}
              >
                {bubbleData
                  .reverse()
                  .map(({ radius, color, start, end }, idx) => (
                    <Box
                      key={`bubble-${index}-${idx}`}
                      sx={{
                        width: `${radius}px`,
                        height: `${radius}px`,
                        borderRadius: "50%",
                        bgcolor: color,
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        bottom: 0,
                        zIndex: idx,
                        border: "1px solid #999",
                        mb: 1,
                      }}
                      title={`${start.toFixed(2)} - ${end.toFixed(2)}`}
                    ></Box>
                  ))}
              </Box>
            </Box>
          );
        } else if (legendData.name === "facility") {
          items.push(
            <Box
              key={`facility-${index}`}
              display="flex"
              flexDirection="column"
              sx={{ bgcolor: "white", p: 1 }}
            >
              <b>Facilities</b>
              {[
                {
                  label: "Clinics",
                  icon: <RoomIcon />,
                  count: legendData.clinic,
                },
                {
                  label: "Hospitals",
                  icon: <LocalHospitalIcon />,
                  count: legendData.hospital,
                },
                {
                  label: "Health Centers",
                  icon: <HomeIcon />,
                  count: legendData.center,
                },
                {
                  label: "Health Posts",
                  icon: <HealthPostIcon />,
                  count: legendData.posts,
                },
              ].map(({ label, icon, count }) => (
                <Box key={label} display="flex" alignItems="center">
                  {label}: {icon}
                  {count || "0"}
                </Box>
              ))}
            </Box>
          );
        } else if (legendData.name === "orgUnit") {
          items.push(
            <Box key={`orgUnit-${index}`}>
              <b>OrgUnit</b>
              <Box pl={3}>
                <LandslideOutlinedIcon />
              </Box>
            </Box>
          );
        }
      });
    }

    return items;
  }, [legendDatas, legendSet]);

  useEffect(() => {
    const legendDiv = L.DomUtil.create("div", "info legend");

    ReactDOM.render(
      <Paper
        elevation={1}
        sx={{ p: 0.5 }}
        onClick={() => setShowDetails((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <Box display="flex" alignItems="center" m={0.5}>
          <FormatListBulletedIcon />
          {showDetails && " Legend"}
        </Box>
        {showDetails && accumulatedLegendItems}
      </Paper>,
      legendDiv
    );

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