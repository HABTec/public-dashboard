import { useState } from "react";
import L from "leaflet";
import chroma from "chroma-js";
import { getItemName } from "../utils/common";

export const useMapLogic = (mapViews, chartDatas, shapes) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  let mapBounds = null;

  const processChartData = (chartData) => {
    console.log("deep chart data", chartData);

    const chartConfig = {
      series: [],
      yAxis: {
        categories: [],
        crosshair: true,
      },
    };

    if (!chartData || !Array.isArray(chartData.rows)) {
      return chartConfig;
    }

    const rows = chartData.rows?.toSorted((a, b) => {
      let avalue = Number(a.length > 1 ? a[1] : a[0]);
      let bvalue = Number(b.length > 1 ? b[1] : b[0]);
      return avalue - bvalue;
    });

    let columnSeries = {};
    let allTimePeriods = new Set();
    let regionColors = {}; // To store the colors for each region and period

    // Check for new data format (rows with 4 elements)
    const isTimelineData = rows[0]?.length === 4;

    if (isTimelineData) {
      // Handle timeline data (4 elements: category, subcategory, time, value)
      for (const row of rows) {
        const [primaryCategory, subCategory, timePeriod, value] = row;

        const primaryName = getItemName(chartData, primaryCategory);
        const subCategoryName = getItemName(chartData, subCategory);

        // Initialize series for the primary category if it doesn't exist
        if (!columnSeries[primaryName]) {
          columnSeries[primaryName] = {};
        }

        // Initialize data array for the subcategory (timeline series) if not exists
        if (!columnSeries[primaryName][subCategoryName]) {
          columnSeries[primaryName][subCategoryName] = [];
        }

        // Add time period to the global set of time periods
        allTimePeriods.add(timePeriod);

        // Add value to the corresponding time period
        columnSeries[primaryName][subCategoryName].push({
          time: timePeriod,
          value: Number(value),
        });
      }

      // Convert Set to a sorted array of time periods and assign to yAxis categories
      chartConfig.yAxis.categories = Array.from(allTimePeriods).sort();

      // Process region values by time period for color assignment
      let timePeriodData = {}; // Store all data for each time period
      chartConfig.yAxis.categories.forEach((timePeriod) => {
        timePeriodData[timePeriod] = [];

        // Collect data for each time period
        for (const primaryName in columnSeries) {
          for (const subCategoryName in columnSeries[primaryName]) {
            const sortedDataPoints = columnSeries[primaryName][
              subCategoryName
            ].filter((dp) => dp.time === timePeriod);

            if (sortedDataPoints.length) {
              const value = sortedDataPoints[0].value;
              timePeriodData[timePeriod].push({
                region: primaryName,
                subCategory: subCategoryName,
                value: value,
              });
            }
          }
        }

        // Rank or normalize values for each region in the specific time period
        const maxValue = Math.max(
          ...timePeriodData[timePeriod].map((d) => d.value)
        );
        const minValue = Math.min(
          ...timePeriodData[timePeriod].map((d) => d.value)
        );

        timePeriodData[timePeriod].forEach((dataPoint) => {
          // Handle case where maxValue == minValue to avoid division by zero
          let normalizedValue =
            maxValue === minValue
              ? 0.5
              : (dataPoint.value - minValue) / (maxValue - minValue);
          let color = getColorForValue(normalizedValue); // Define a function for the color

          // Store the color for this region and time period
          if (!regionColors[dataPoint.region]) {
            regionColors[dataPoint.region] = {};
          }
          regionColors[dataPoint.region][timePeriod] = color;
        });
      });

      // Prepare final series data for the chartConfig
      for (const primaryName in columnSeries) {
        for (const subCategoryName in columnSeries[primaryName]) {
          const sortedDataPoints = columnSeries[primaryName][
            subCategoryName
          ].sort((a, b) => a.time - b.time);

          const dataPoints = chartConfig.yAxis.categories.map((timePeriod) => {
            const foundDataPoint = sortedDataPoints.find(
              (dp) => dp.time === timePeriod
            );
            return foundDataPoint ? foundDataPoint.value : 0;
          });

          // Create color mapping for each point
          const colorPerPoint = chartConfig.yAxis.categories.map(
            (timePeriod) => regionColors[primaryName]?.[timePeriod] || "#000000"
          );

          chartConfig.series.push({
            name: `${primaryName} (${subCategoryName})`,
            data: dataPoints,
            marker: {
              fillColor: colorPerPoint, // Set the color for each data point
            },
          });
        }
      }
    } else {
      // Handle original data format (3 elements: category, subcategory, value)
      for (const row of rows) {
        let primaryName = getItemName(chartData, row[0]);
        let subCategoryName = getItemName(chartData, row[1]);

        if (!columnSeries[primaryName]) {
          columnSeries[primaryName] = [];
        }
        columnSeries[primaryName].push(Number(row[2]));

        if (chartConfig.yAxis.categories.indexOf(subCategoryName) === -1) {
          chartConfig.yAxis.categories.push(subCategoryName);
        }
      }

      for (const key in columnSeries) {
        chartConfig.series.push({
          name: key,
          data: columnSeries[key],
        });
      }
    }

    return chartConfig;
  };

  // Helper function to get a color based on normalized value
  const getColorForValue = (value) => {
    // Example: interpolate between blue (low) and red (high)
    const lowColor = [0, 0, 255]; // Blue
    const highColor = [255, 0, 0]; // Red

    const r = Math.round(lowColor[0] + value * (highColor[0] - lowColor[0]));
    const g = Math.round(lowColor[1] + value * (highColor[1] - lowColor[1]));
    const b = Math.round(lowColor[2] + value * (highColor[2] - lowColor[2]));

    return `rgb(${r},${g},${b})`;
  };

  const flattenCoordinates = (arr) => {
    if (!Array.isArray(arr[0])) {
      return [arr];
    }

    return arr?.reduce(
      (acc, val) =>
        Array.isArray(val[0])
          ? acc.concat(flattenCoordinates(val))
          : acc.concat([val]),
      []
    );
  };

  const parseCoordinates = (co) => {
    let parsed = JSON.parse(co);
    if (!Array.isArray(parsed[0])) {
      parsed = [parsed];
    }
    return parsed.map((polygon) =>
      flattenCoordinates(polygon).map(([lng, lat]) => [lat, lng])
    );
  };

  const handleMouseEnter = (e, region) => {
    setHoveredRegion(region);
    e.target.setStyle({
      weight: 3,
    });
  };

  const handleMouseLeave = (e, weight = 2) => {
    setHoveredRegion(null);
    e.target.setStyle({
      weight: weight,
    });
  };

  const calculatePolygonArea = (polygon) => {
    let area = 0;
    const numPoints = polygon.length;
    for (let i = 0; i < numPoints; i++) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[(i + 1) % numPoints];
      area += x1 * y2 - y1 * x2;
    }
    return Math.abs(area / 2);
  };

  const processMapLayer = (
    chartConfig,
    displayName,
    shape,
    colorScale,
    opacity,
    layer,
    thematicMapType,
    renderingStrategy
  ) => {
    console.log("chartConfig", chartConfig);
    const mapData = chartConfig?.series;
    const regionList = chartConfig?.yAxis?.categories;
    const numColors = regionList?.length;

    const combinedData = mapData?.reduce((acc, series) => {
      return series.data.map((value, index) => (acc[index] || 0) + value);
    }, []);

    let mn, mx, range;
    let colorScaleArray;
    if (combinedData.length > 0) {
      mn = Math.min(...combinedData);
      mx = Math.max(...combinedData);
      range = mx - mn;
      colorScaleArray = chroma
        .scale(colorScale?.split(","))
        .domain([mn, mx])
        .colors(numColors);
    }

    const regionColors = regionList?.map((regionName, index) => {
      const value = combinedData[index];
      const colorIndex = Math.floor(((value - mn) / range) * (numColors - 1));
      return {
        region: regionName,
        value: value,
        color: colorScale && colorScaleArray[colorIndex],
      };
    });

    const sortedShape = shape.slice().sort((a, b) => {
      const areaA = parseCoordinates(a.co).reduce(
        (sum, polygon) => sum + calculatePolygonArea(polygon),
        0
      );
      const areaB = parseCoordinates(b.co).reduce(
        (sum, polygon) => sum + calculatePolygonArea(polygon),
        0
      );
      return areaB - areaA;
    });

    mapBounds = null;
    let bounds = L.latLngBounds([]);
    shape.forEach((region) => {
      let coordinates = parseCoordinates(region.co);
      coordinates.forEach((polygon) => {
        bounds.extend(polygon);
      });
    });
    mapBounds = bounds;

    return {
      sortedShape,
      displayName,
      regionColors,
      colorScaleArray,
      regionList,
      mapData,
      opacity,
      layer,
      thematicMapType,
      renderingStrategy,
    };
  };

  const layerOrder = ["orgUnit", "thematic", "facility"];

  const parsedMapViews = mapViews
    ?.map((view) => {
      const chartConfig = processChartData(chartDatas[view.id]);

      if (view.layer === "thematic" && chartConfig.series.length === 0) {
        return null;
      }

      return processMapLayer(
        chartConfig,
        view?.displayName,
        shapes[view.id],
        view?.colorScale ?? "#ffffd4,#fed98e,#fe9929,#d95f0e,#993404",
        view?.opacity,
        view.layer,
        view?.thematicMapType,
        view?.renderingStrategy
      );
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.layer === "thematic" && b.layer === "thematic") {
        const thematicOrder = ["CHOROPLETH", "BUBBLE"];
        return (
          thematicOrder.indexOf(a.thematicMapType) -
          thematicOrder.indexOf(b.thematicMapType)
        );
      }
      return layerOrder.indexOf(a.layer) - layerOrder.indexOf(b.layer);
    });

  // console.log("parsedcomp", parsedMapViews)

  return {
    parsedMapViews,
    parseCoordinates,
    handleMouseEnter,
    handleMouseLeave,
    hoveredRegion,
    mapBounds,
  };
};

export default useMapLogic;
