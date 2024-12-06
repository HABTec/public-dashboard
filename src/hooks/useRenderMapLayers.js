import { Marker, Polygon, Circle, Tooltip, Popup } from "react-leaflet";
import React, { useState } from "react";
import polylabel from "polylabel";
import { SvgIcon } from "@mui/material";
import {
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import RoomIcon from "@mui/icons-material/ControlPoint";
import HealthPostIcon from "@mui/icons-material/MedicalInformation";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const createCustomIcon = (iconComponent, color) =>
  new L.DivIcon({
    html: ReactDOMServer.renderToString(
      <SvgIcon component={iconComponent} style={{ color }} />
    ),
    className: "",
    iconSize: [10, 10],
  });

export const useRenderMapLayers = (
  legendData,
  parseCoordinates,
  handleMouseEnter,
  handleMouseLeave
) => {
  const ethiopianMonths = [
    "Meskerem",
    "Tikmt",
    "Hidar",
    "Tahisas",
    "Tir",
    "Yekatit",
    "Megabit",
    "Miyazya",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehasse",
  ];

  const shortMonthNameToIndex = {
    Jan: 5,
    Feb: 6,
    Mar: 7,
    Apr: 8,
    May: 9,
    Jun: 10,
    Jul: 11,
    Aug: 12,
    Sep: 1,
    Oct: 2,
    Nov: 3,
    Dec: 4,
  };

  const parsePeriod = (period) => {
    // Split the input into start and end parts
    const [start, end] = period.split("-").map((part) => part.trim());
    // If no "-" is present, `end` will be undefined

    // Function to extract year and month from a part
    const extractDate = (part) => {
      // Match both "Year Month" and "Month Year" formats
      const match = part.match(/(\d{4})\s+(\w+)|(\w+)\s+(\d{4})/);
      if (!match) return null;

      // Extract year and month based on the matched format
      const year = match[1] || match[4];
      const month = match[2] || match[3];
      return { year, month };
    };

    // Extract start and end dates
    const startDate = extractDate(start); // Always parse the start date
    const endDate = end ? extractDate(end) : null; // Parse end only if it exists
    console.log("period", period, "startDate", startDate);
    // Build the final structure
    const result = {
      start: startDate
        ? { year: startDate.year, month: startDate.month }
        : null,
      end: endDate ? { year: endDate.year, month: endDate.month } : null,
      label: period, // The original input label
    };

    return result;
  };

  // const rgbToHex = (rgb) => {
  //   // Extract the RGB values from the string
  //   const rgbValues = rgb.match(/\d+/g);

  //   // Convert each value to hex and pad with '0' if necessary
  //   const hex = rgbValues
  //     .map((value) => {
  //       const hexValue = parseInt(value).toString(16);
  //       return hexValue.length === 1 ? "0" + hexValue : hexValue;
  //     })
  //     .join(""); // Join the hex values into a single string

  //   return `#${hex}`; // Return the hex color
  // };

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
      // output.push({ start, end, color });
    }

    return output;
  };

  const renderFacilityMarkers = (viewData) => {
    legendData.push({
      name: "facility",
      hospital: 0,
      clinic: 0,
      post: 0,
      center: 0,
    });

    return viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const [lat, lng] = coordinates[0][0];
      const regionType = region.na.split(" ").pop().toLowerCase();
      const currentLegendData = legendData[legendData.length - 1];

      if (currentLegendData.hasOwnProperty(regionType)) {
        currentLegendData[regionType] += 1;
      } else {
        currentLegendData["center"] += 1;
      }

      const markerIcons = {
        hospital: createCustomIcon(LocalHospitalIcon, "red"),
        clinic: createCustomIcon(RoomIcon, "red"),
        healthpost: createCustomIcon(HealthPostIcon, "blue"),
        healthcenter: createCustomIcon(HomeIcon, "green"),
      };

      const markerIcon = markerIcons[regionType] || markerIcons.healthcenter;

      return (
        <Marker
          key={`${region.id}-${regionIndex}`}
          position={[lat, lng]}
          icon={markerIcon}
        >
          <Popup>
            <span>{region.na}</span>
          </Popup>
        </Marker>
      );
    });
  };

  const renderOrgUnitPolygons = (viewData) => {
    legendData.push({
      name: "orgUnit",
    });

    return viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const opacity = 0;

      return coordinates.map((polygon, polygonIndex) => (
        <Polygon
          key={`${region.id}-${polygonIndex}-${regionIndex}`}
          positions={polygon}
          color="#000"
          fillOpacity={opacity}
          weight={2}
          eventHandlers={{
            mouseover: (e) => handleMouseEnter(e, region),
            mouseout: (e) => handleMouseLeave(e),
          }}
        >
          <Tooltip>
            {viewData.regionList
              .filter((name) => name === region.na)
              .map((name, num) =>
                viewData.mapData.map((regionData) => (
                  <li key={num}>
                    {regionData.name}: {regionData.data[num]}
                  </li>
                ))
              )}
            <span>{region.na}</span>
          </Tooltip>
        </Polygon>
      ));
    });
  };

  const renderThematicPolygons = (viewData) => {
    console.log("thematic", viewData);
    const legendMn = Math.min(
      ...viewData.mapData.map((d) => Math.min(...d.data))
    );
    const legendMx = Math.max(
      ...viewData.mapData.map((d) => Math.max(...d.data))
    );
    const legendNumColors = viewData.regionColors?.length || 0;
    const legendRegionColors = viewData.regionColors || [];

    legendData.push({
      name: "thematic",
      displayName: viewData.displayName,
      colorScaleArray: viewData.colorScaleArray,
      mn: legendMn,
      mx: legendMx,
      numColors: legendNumColors,
      regionColors: legendRegionColors,
    });

    console.log("legendData", legendData);

    return viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const regionColor = viewData.regionColors.find(
        (rc) => rc.region === region.na
      );

      // console.log(viewData.regionColors, "Region colors", region.co)

      const color = regionColor ? regionColor.color : "";
      const opacity = color ? viewData.opacity : 0;
      // console.log("thematic color", color, "opacity", opacity, ">>", regionColor, "<<");

      const dataIndex = viewData.regionList.findIndex(
        (name) => name === region.na
      );
      // console.log(coordinates, ">>>")
      return coordinates.map((polygon, polygonIndex) => {
        // console.log(">>>>>>>>>>>", polygon[0], polygonIndex, color)

        return (
          <Polygon
            key={`${
              region.id
            }-${polygonIndex}-${regionIndex}-${color}-${regionColor}-${Math.random()}`}
            positions={polygon}
            fillColor={color && color.startsWith("#") ? color : `#${color}`}
            color={"#000"}
            fillOpacity={opacity}
            weight={2}
            eventHandlers={{
              mouseover: (e) => handleMouseEnter(e, region),
              mouseout: (e) => handleMouseLeave(e),
            }}
          >
            <Tooltip>
              <span>
                {region.na}
                {dataIndex !== -1 && (
                  <li key={`${dataIndex} - ${viewData.regionList[dataIndex]}`}>
                    {viewData.mapData[0].name}:{" "}
                    {viewData.mapData[0].data[dataIndex]}
                  </li>
                )}
              </span>
            </Tooltip>
          </Polygon>
        );
      });
    });
  };

  const renderBubbleMap = (viewData, orgDrawn) => {
    console.log("bubble map data", viewData);
    const legendMn = Math.min(
      ...viewData.mapData.map((d) => Math.min(...d.data))
    );
    const legendMx = Math.max(
      ...viewData.mapData.map((d) => Math.max(...d.data))
    );

    const legendRegionColors = viewData.regionColors || [];

    legendData.push({
      name: "bubble",
      displayName: viewData.displayName,
      mn: legendMn,
      mx: legendMx,
      colorScaleArray: viewData.colorScaleArray,
      regionColors: legendRegionColors,
    });

    return viewData?.sortedShape?.map((region, regionIndex) => {
      const fetchedCoordinates = parseCoordinates(region.co);

      const visualCenters = fetchedCoordinates.map((polygon) =>
        polylabel([polygon], 0.000001)
      );

      const bestCenter = visualCenters.reduce(
        (best, current) => (current.distance > best.distance ? current : best),
        visualCenters[0]
      );

      const coordinates = bestCenter;
      console.log("center coord", coordinates);
      const regionListIndex = viewData.regionList.indexOf(region.na);

      const dataValue =
        regionListIndex !== -1 ? viewData.mapData[0].data[regionListIndex] : 0;

      let radius = (dataValue / (legendMx - legendMn)) * 90;

      if (Number.isNaN(radius)) radius = 0;

      console.log(
        "radius",
        radius,
        "dataValue",
        dataValue,
        "legendMx",
        legendMx,
        "legendMn",
        legendMn,
        "centroids",
        coordinates,
        "regions list index",
        regionListIndex,
        viewData.mapData,
        "test"
      );

      const regionColor = viewData.regionColors.find(
        (rc) => rc.region === region.na
      );
      const color = regionColor ? regionColor.color : "#3388ff";
      const opacity = viewData.opacity;
      console.log(
        "bubble color",
        color,
        "region",
        region.na,
        "orgDrawn",
        orgDrawn
      );

      const polygons = fetchedCoordinates.map((polygon, polygonIndex) => (
        <Polygon
          key={`${
            region.id
          }-${polygonIndex}-${regionIndex}-${color}-${Date.now()}-${Math.random()}`}
          positions={polygon}
          color="#000"
          fillOpacity={0}
          weight={1}
          eventHandlers={{
            mouseover: (e) => handleMouseEnter(e, region),
            mouseout: (e) => handleMouseLeave(e, 1),
          }}
        >
          <Tooltip>
            <span>{region.na}</span>
          </Tooltip>
        </Polygon>
      ));

      const dataIndex = viewData.regionList.findIndex(
        (name) => name === region.na
      );

      return (
        <>
          {orgDrawn ? "" : polygons}
          {/* {polygons} */}
          <Circle
            key={`${region.id}-${regionIndex}-${color}`}
            center={coordinates}
            radius={radius * 1000}
            fillColor={color && color.startsWith("#") ? color : `#${color}`}
            color="#000"
            fillOpacity={opacity}
            weight={1}
            eventHandlers={{
              mouseover: (e) => handleMouseEnter(e, region),
              mouseout: (e) => handleMouseLeave(e),
            }}
          >
            <Tooltip>
              <span>
                {region.na}
                {dataIndex !== -1 && (
                  <li key={`${dataIndex} - ${viewData.regionList[dataIndex]}`}>
                    {viewData.mapData[0].name}:{" "}
                    {viewData.mapData[0].data[dataIndex]}
                  </li>
                )}
              </span>
            </Tooltip>
          </Circle>
        </>
      );
    });
  };

  const renderTimelineDatas = (viewData) => {
    console.log("timeline data rendering", viewData);
    const periods = viewData.regionList;
    let minValue = Infinity,
      maxValue = -Infinity;

    // Find the global min and max values across all periods
    periods.forEach((period, periodIndex) => {
      viewData.mapData.forEach((data) => {
        const value = data.data[periodIndex];
        if (value < minValue) minValue = value;
        if (value > maxValue) maxValue = value;
      });
    });

    const intervalCount = 5; // Define the number of intervals for color mapping
    const intervalSize = (maxValue - minValue) / intervalCount;

    // Create color intervals, similar to your legend logic
    const intervals = Array.from({ length: intervalCount }, (_, i) => {
      const start = minValue + i * intervalSize;
      const end = minValue + (i + 1) * intervalSize;
      return { start, end };
    });

    const colorReference = colorRange(minValue, maxValue, 5);

    return periods.map((period, periodIndex) => {
      // Assign colors to each region based on their data values for the current period
      const regionColors = viewData.mapData.map((data) => {
        const value = data.data[periodIndex];
        let colorAssigned;

        if (viewData.legendSet) {
          colorAssigned = viewData.legendSet.legends.find(
            (legend) => value >= legend.startValue && value < legend.endValue
          )?.color;
        } else {
          // Normalize the value between minValue and maxValue
          // const normalizedValue = (value - minValue) / (maxValue - minValue);

          // Use normalized value to find the corresponding color
          // const colorIndex = Math.floor(
          //   normalizedValue * (viewData.colorScaleArray.length - 1)
          // );
          // const color = viewData.colorScaleArray[colorIndex];
          const color = Object.values(colorReference)
            .reverse()
            ?.find(({ start, end }) => value >= start && value < end + 0.1);
          colorAssigned = color?.color;
        }

        return {
          region: data.name.match(/\(([^)]+)\)/)[1], // Extract region name
          value: value,
          color: colorAssigned,
        };
      });

      const regionList = viewData.mapData.map((data) => {
        return data.name.match(/\(([^)]+)\)/)[1];
      });

      let name;
      const data = viewData.mapData.map((data) => {
        name = data.name.split(" (")[0];
        return data.data[periodIndex];
      });

      const timePeriods = viewData.regionList.map((period) => {
        const timePeriod = parsePeriod(period);
        return { timePeriod };
      });

      // const colorReference = colorRange(minValue, maxValue, 5);
      console.log(
        "minimum timeline",
        minValue,
        "maximum timeline",
        maxValue,
        "reference",
        colorReference
      );

      return {
        ...viewData,
        regionList: regionList,
        regionColors: regionColors,
        mapData: [{ name, data }],
        timePeriods: timePeriods,
        // legendDatas : {...colorReference, displayName : viewData?.displayName},
      };
    });
  };

  return {
    renderFacilityMarkers,
    renderOrgUnitPolygons,
    renderThematicPolygons,
    renderBubbleMap,
    renderTimelineDatas,
  };
};
