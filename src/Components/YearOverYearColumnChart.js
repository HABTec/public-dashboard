import React, { useMemo } from "react";
import { BarChart } from "@mui/x-charts";
import { assignColors } from "../utils/assignColors";

const YearOverYearColumnChart = ({ processedData, periodNames, colorSet }) => {
  const yoyGrowth = processedData.map((currentYear, idx) => ({
    year: currentYear.year,
    data: currentYear.data.map((currentD, i) => {
      const prevD = processedData[idx].data[i];
      const currentValue = currentD.value;
      const prevValue = prevD?.value;

      if ([currentValue, prevValue].some((v) => v === null || isNaN(v)))
        return null;
      if (prevValue === 0) return currentValue === 0 ? 0 : null;

      return currentValue;
    }),
  }));

  yoyGrowth.sort((a, b) => a.year - b.year);

  return (
    <BarChart
      xAxis={[
        {
          data: periodNames.map((_, i) => i),
          valueFormatter: (v) => periodNames[v] || `Period ${v + 1}`,
          scaleType: "band",
        },
      ]}
      series={yoyGrowth.map((yearData, index_) => ({
        data: yearData.data,
        label: `${yearData.year}`,

        valueFormatter: (v) => (v !== null ? `${v}` : "N/A"),
        color: assignColors(colorSet, index_),
      }))}
      height={400}
      margin={{ left: 70}}
    />
  );
};

export default YearOverYearColumnChart;
