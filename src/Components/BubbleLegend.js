import React from "react";
import { Box } from "@mui/material";
import chroma from "chroma-js";
import { Typography } from "@mui/material";

const BubbleLegend = ({ legendData }) => {
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

  return (
    <Box
      sx={{
        position: "relative",
        height: `${maxRadius + 50}px`,
        overflow: "scroll",
        p: 1,
      }}
    >
      <b>{legendData.displayName}</b>
      <Typography fontSize={12} margin={0.5}>
        {legendData?.periodName}
      </Typography>
      <Box sx={{ position: "relative", width: "100%", height: "100%", mb: 4 }}>
        {bubbleData.reverse().map(({ radius, color, start, end }, idx) => (
          <Box
            key={idx}
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
          />
        ))}
      </Box>
    </Box>
  );
};

export default BubbleLegend;
