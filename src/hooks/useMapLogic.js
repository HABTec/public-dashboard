import { useState } from "react";
import L from "leaflet";
import chroma from "chroma-js";
import { getItemName } from "../utils/common";

export const useMapLogic = (mapViews, chartDatas, shapes) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  let mapBounds = null;
  console.log("mapViews", mapViews, "chartDatas", chartDatas, "shapes", shapes);

  const colorRange = (minValue, maxValue, ranges) => {
    const interval = (maxValue - minValue) / ranges;
    const colors = ["ffffd4", "fed98e", "fe9929", "d95f0e", "993404"];
    const output = {};

    for (let i = 0; i < ranges; i++) {
      // Loop through the number of ranges
      const start = minValue + i * interval; // Start of the current range
      const end = Math.min(start + interval, maxValue); // End of the current range
      const color = colors[i % colors.length]; // Assign a cyclic color
      output[i] = { start, end, color };
    }

    return output;
  };

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
        console.log("maxValue", maxValue, "minValue", minValue, timePeriodData);
        timePeriodData[timePeriod].forEach((dataPoint) => {
          const colorRange = [
            // "#993404",
            // "#fed98e",
            // "#fe9929",
            // "#d95f0e",
            // "#ffffd4",
            "993404",
            "d95f0e",
            "fe9929",
            "fed98e",
            "ffffd4",
          ];
          const dataLength = timePeriodData[timePeriod].length;

          let color = getColorForValue(
            dataPoint.value,
            minValue,
            maxValue,
            colorRange,
            dataLength
          );
          console.log(
            "color",
            color,
            "dataPoint value",
            dataPoint.value,
            "time",
            timePeriod,
            "maxValue",
            maxValue,
            "minValue",
            minValue
          );

          // Store the color for this region and time period
          if (!regionColors[dataPoint.region]) {
            regionColors[dataPoint.region] = {};
          }
          regionColors[dataPoint.region][timePeriod] = color;
        });
      });

      // Inside your loop where you process each primaryName and subCategoryName
      for (const primaryName in columnSeries) {
        for (const subCategoryName in columnSeries[primaryName]) {
          const sortedDataPoints = columnSeries[primaryName][
            subCategoryName
          ].sort((a, b) => a.time - b.time);

          // Get the data points for each time period
          const dataPoints = chartConfig.yAxis.categories.map((timePeriod) => {
            const foundDataPoint = sortedDataPoints.find(
              (dp) => dp.time === timePeriod
            );
            return foundDataPoint ? foundDataPoint.value : 0;
          });

          // Find the min and max values for this specific subcategory over all time periods
          const maxValue = Math.max(...dataPoints);
          const minValue = Math.min(...dataPoints);

          // Map data points to corresponding colors for each time period
          const colorPerPoint = dataPoints.map((value) => {
            return getColorForValue(value, minValue, maxValue, [
              "#993404",
              "#fed98e",
              "#fe9929",
              "#d95f0e",
              "#ffffd4",
            ]);
          });

          console.log(
            "colorPerPoint",
            colorPerPoint,
            "primaryName",
            primaryName,
            "maximum",
            maxValue,
            "minimum",
            minValue
          );

          chartConfig.series.push({
            name: `${primaryName} (${subCategoryName})`,
            data: dataPoints,
            marker: {
              fillColor: colorPerPoint, // Assign the dynamically computed colors
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

    mapViews.map((mapView, index) => {
      if (
        mapView.renderingStrategy == "TIMELINE" ||
        mapView.renderingStrategy == "SPLIT_BY_PERIOD"
      ) {
        chartConfig.yAxis.categories = chartConfig?.yAxis?.categories.map(
          (time) => {
            return chartDatas[mapView.id].metaData?.items[time].name || time;
          }
        );
      }
    });
    console.log("check chart config", chartConfig);

    return chartConfig;
  };

  const getColorForValue = (value, mn, mx, colorScaleArray) => {
    console.log(
      "value",
      value,
      "mn",
      mn,
      "mx",
      mx,
      "colorScaleArray",
      colorScaleArray
    );
    const intervalCount = colorScaleArray.length / 2;

    let intervals;
    if (mn === mx) {
      // Handle case where mn and mx are the same (special case)
      intervals = [{ start: mn, end: mn + 1 }];
    } else {
      const intervalSize = (mx - mn) / intervalCount;
      intervals = Array.from({ length: intervalCount }, (_, i) => {
        const start = mn + i * intervalSize;
        const end = mn + (i + 1) * intervalSize;
        return { start, end };
      });
    }

    // Calculate the midpoint color for each interval using chroma.js
    const midpointColors = intervals.map(({ start, end }) => {
      const midpoint = (start + end) / 2;
      return chroma.scale(colorScaleArray).domain([mn, mx])(midpoint).hex();
    });

    // Find which interval the given value belongs to
    const matchingIntervalIndex = intervals.findIndex(
      ({ start, end }) => value >= start && value < end
    );

    console.log(
      "matchingIntervalIndex",
      matchingIntervalIndex,
      "value",
      value,
      mx,
      midpointColors,
      colorScaleArray
    );
    // If the value is outside the defined range, return the extreme colors
    if (value <= mn) return colorScaleArray[colorScaleArray.length - 1]; // Return the lowest color
    if (value >= mx) return colorScaleArray[0]; // Return the highest color

    // Return the corresponding midpoint color for the found interval
    return midpointColors[matchingIntervalIndex];
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
    renderingStrategy,
    legendSet = null
  ) => {
    console.log("chartConfig", chartConfig);
    const mapData = chartConfig?.series;
    const regionList = chartConfig?.yAxis?.categories;
    const numColors = regionList?.length;
    // const numColors = 5;
    console.log("mapData to check", mapData);
    let globalMax = -Infinity;
    let globalMin = Infinity;

    mapData?.forEach((series) => {
      const max = Math.max(...series.data);
      const min = Math.min(...series.data);
      if (max > globalMax) globalMax = max;
      if (min < globalMin) globalMin = min;
    });

    const colorReference = colorRange(globalMin, globalMax, 5);

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

    let regionColors;

    if (legendSet) {
      regionColors = regionList?.map((regionName, index) => {
        const value = combinedData[index];
        const color = legendSet.legends.find((legend) => {
          if (legend.startValue <= value && value < legend.endValue) {
            return legend.color;
          }
        });

        return {
          region: regionName,
          value: value,
          color: color?.color,
        };
      });
    } else {
      regionColors = regionList?.map((regionName, index) => {
        const value = combinedData[index];
        let colorIndex = null;

        // Convert colorReference to an array if it's an object
        const colorArray = Object.values(colorReference).reverse();

        // Find the corresponding color interval
        const interval = colorArray.find((interval) => {
          return value >= interval.start && value < interval.end + 0.1;
        });

        // Assign colorIndex if an interval is found
        if (interval) {
          colorIndex = interval.color;
        }
        console.log(
          "colorInterval",
          interval,
          mapData,
          "mapData",
          colorReference,
          "region",
          regionName,
          "value",
          value
        );

        return {
          region: regionName,
          value: value,
          color: colorScale && colorIndex,
        };
      });
    }

    console.log("regionColors", regionColors, mx, mn);

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
      legendSet,
    };
  };

  const layerOrder = ["thematic", "orgUnit", "facility"];

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
        view?.renderingStrategy,
        view?.legendSet
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

  console.log("parsedcomp", parsedMapViews);

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
