import React, { useMemo } from "react";
import { LineChart } from "@mui/x-charts";
import { assignColors } from "../utils/assignColors";

const YearOverYearLineChart = ({ processedData, periodNames, colorSet }) => {
  const lineSeries = processedData.map((yearData, index_) => ({
    data: yearData.data.map((d) => d.value),
    label: yearData.year,
    color:assignColors(colorSet, index_),
  }));

  lineSeries.sort((a, b) => a.label - b.label);
  console.log("entrance line line lineSeries2", lineSeries);
  return (
    <LineChart
      xAxis={[
        {
          data: periodNames.map((_, i) => i),
          valueFormatter: (v) => periodNames[v] || `Period ${v + 1}`,
          scaleType: "point",
        },
      ]}
      series={lineSeries}
      height={400}
      margin={{ left: 70 }}
    />
  );
};

export default YearOverYearLineChart;
