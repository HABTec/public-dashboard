import React, { useEffect, useState, useMemo } from "react";
import { getDimensions, getFilters } from "../utils/filters";
import YearOverYearLineChart from "./YearOverYearLineChart";
import YearOverYearColumnChart from "./YearOverYearColumnChart";

const apiBase = process.env.REACT_APP_BASE_URI;

const YearOverYearChartComponent = ({
  yearsData,
  chartInfo,
  filters_,
  setLoading,
  chartType,
}) => {
  const [chartDatas, setChartDatas] = useState([]);

  const dimension = getDimensions(chartInfo);
  const filters = getFilters(
    chartInfo?.filters,
    filters_,
    chartInfo?.aggregationType
  );

  useEffect(() => {
    setChartDatas([]);
    yearsData?.metaData?.dimensions?.pe?.forEach((year) => {
      let url = `${apiBase}api/analytics.json?${dimension}${filters}&relativePeriodDate=${year.substring(
        0,
        4
      )}-02-06&includeMetadataDetails=true`;

      fetch(encodeURI(url))
        .then((response) => response.json())
        .then((analyticsData) => {
          setChartDatas((prevData) => [...prevData, analyticsData]);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [yearsData, filters_]);

  // Process chart data
  const processedData = useMemo(() => {
    return chartDatas.map((dataEntry) => {
      const periods = dataEntry.metaData?.dimensions?.pe || [];
      const valueMap = {};

      dataEntry.rows?.forEach((row) => {
        const periodId = row[0];
        valueMap[periodId] = parseFloat(row[1]);
      });

      return {
        year: periods[periods.length - 1]?.substring(0, 4) || "Unknown",
        data: periods.map((periodId) => ({
          periodId,
          value: valueMap[periodId] ?? null,
        })),
      };
    });
  }, [chartDatas]);
  console.log("entrance line line chartDatas", chartInfo);

  const periodNames = useMemo(() => {
    if (!chartDatas.length) return [];
    const firstEntry = chartDatas[0];

    return (firstEntry.metaData?.dimensions?.pe || []).map((periodId) => {
      const periodData = firstEntry.metaData.items[periodId];
      if (!periodData?.name) return periodId;

      const nameParts = periodData.name.replace(/\d+/g, "");
      return nameParts;
    });
  }, [chartDatas]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {chartType === "year_over_year_line" ? (
        <YearOverYearLineChart
          processedData={processedData}
          periodNames={periodNames}
          colorSet={chartInfo.colorSet}
        />
      ) : (
        <YearOverYearColumnChart
          processedData={processedData}
          periodNames={periodNames}
          colorSet={chartInfo.colorSet}
        />
      )}
    </div>
  );
};

export default YearOverYearChartComponent;
