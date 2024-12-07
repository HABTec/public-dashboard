import React, { useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

const PredefinedColorLegend = ({ legendSet, thematicType = null }) => {
  // const legendSet = {...legendSet, legends : legendSet.legends.reverse()};
  console.log("legendSet for predefined", legendSet, thematicType);
  const sortedLegends = useMemo(() => {
    return [...(legendSet.legends || [])].sort(
      (a, b) => a.startValue - b.startValue
    );
  }, [legendSet.legends]);
  console.log("sortedLegends", sortedLegends);

  // Calculate dynamic radii for bubble sizes
  const calculateBubbleRadius = (endValue, maxEndValue) => {
    // console.log("endValue", endValue, "maxEndValue", maxEndValue);
    const minRadius = 20;
    const maxRadius = 80;
    return minRadius + (endValue / maxEndValue) * (maxRadius - minRadius);
  };

  // Thematic legend rendering
  const renderThematicLegend = () => (
    <TableContainer key="legend-set">
      <Table aria-label="legend table">
        <TableRow>
          <TableCell colSpan={3} align="center">
            {legendSet.name}
          </TableCell>
        </TableRow>
        <TableBody>
          {sortedLegends.map((row) => (
            <TableRow key={row.name}>
              <TableCell sx={{ backgroundColor: row.color, width: "2px" }} />
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

  // Bubble legend rendering
  const renderBubbleLegend = () => {
    // const maxEndValue = Math.max(
    //   ...sortedLegends.map((legend) => legend.endValue)
    // );
    // const maxRadius = calculateBubbleRadius(maxEndValue, maxEndValue);

    const maxRadius = Math.max(
      ...sortedLegends.map((legend) =>
        calculateBubbleRadius(legend.startValue, legend.endValue)
      )
    );
    return (
      <Box
        sx={{
          position: "relative",
          height: `${maxRadius * 2 + 20}px`,
          // overflow: "visible",
          overflow: "wrap",
          p: 1,
          m: "1rem",
        }}
      >
        <b>{legendSet.name}</b>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            pb: "4rem",
          }}
        >
          {sortedLegends.map((legend, idx) => {
            const radius = calculateBubbleRadius(
              legend.startValue,
              legend.endValue
            );
            // const dashLength = Math.ceil(maxRadius / 3);
            const dashedLine = ".".repeat(20);
            const isRightAligned = idx % 2 === 0;
            // console.log("dashedLine", dashedLine, dashLength);
            return (
              <React.Fragment key={idx}>
                {/* Dashed Line and Label */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: `${radius + radius / 2}px`, // Place it at the top of the circle
                    transform: isRightAligned
                      ? "translateY(-50%)"
                      : "translateX(-100%) translateY(-50%)",
                    zIndex: sortedLegends.length - idx, // Higher zIndex for smaller circles
                    mb: "0.3rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isRightAligned
                    ? `${dashedLine} ${legend.endValue}`
                    : `${legend.endValue} ${dashedLine}`}
                </Box>
                {/* Circle */}
                <Box
                  sx={{
                    width: `${radius + radius / 2}px`,
                    height: `${radius + radius / 2}px`,
                    borderRadius: "50%",
                    bgcolor: legend.color,
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: 0,
                    zIndex: sortedLegends.length - idx,
                    border: "1px solid #999",
                    mb: "1.5rem",
                    padding: "0.5rem",
                  }}
                  title={`${legend.startValue.toFixed(
                    2
                  )} - ${legend.endValue.toFixed(2)}`}
                />
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    );
  };

  return thematicType === "bubble"
    ? renderBubbleLegend()
    : renderThematicLegend();
};

export default PredefinedColorLegend;
