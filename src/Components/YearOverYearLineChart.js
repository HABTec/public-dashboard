import React, { useMemo } from "react";
import { LineChart } from "@mui/x-charts";

const YearOverYearLineChart = ({ processedData, periodNames }) => {
  const lineSeries = processedData.map((yearData) => ({
    data: yearData.data.map((d) => d.value),
    label: yearData.year,
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
