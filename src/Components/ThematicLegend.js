import React from "react";
import { Box, Typography } from "@mui/material";
import chroma from "chroma-js";

const ThematicLegend = ({ legendData }) => {
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

  return (
    <div>
      <b>{legendData.displayName}</b>
      {intervals.map(({ start, end }, idx) => (
        <Box
          key={idx}
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
          />
          <Typography variant="body2">{`${start.toFixed(2)} - ${end.toFixed(
            2
          )} (${counts[idx]})`}</Typography>
        </Box>
      ))}
    </div>
  );
};

export default ThematicLegend;
