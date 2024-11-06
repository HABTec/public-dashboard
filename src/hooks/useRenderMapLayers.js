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

  const rgbToHex = (rgb) => {
    // Extract the RGB values from the string
    const rgbValues = rgb.match(/\d+/g);

    // Convert each value to hex and pad with '0' if necessary
    const hex = rgbValues
      .map((value) => {
        const hexValue = parseInt(value).toString(16);
        return hexValue.length === 1 ? "0" + hexValue : hexValue;
      })
      .join(""); // Join the hex values into a single string

    return `#${hex}`; // Return the hex color
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
            key={`${region.id}-${polygonIndex}-${regionIndex}-${color}`}
            positions={polygon}
            fillColor={color}
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
      // console.log("bubble color", color, "region", region.na);

      const polygons = fetchedCoordinates.map((polygon, polygonIndex) => (
        <Polygon
          key={`${region.id}-${polygonIndex}-${regionIndex}-${color}`}
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
          <Circle
            key={`${region.id}-${regionIndex}-${color}`}
            center={coordinates}
            radius={radius * 1000}
            fillColor={color}
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

    return periods.map((period, periodIndex) => {
      // Assign colors to each region based on their data values for the current period
      const regionColors = viewData.mapData.map((data) => {
        const value = data.data[periodIndex];

        // Normalize the value between minValue and maxValue
        const normalizedValue = (value - minValue) / (maxValue - minValue);

        // Use normalized value to find the corresponding color
        const colorIndex = Math.floor(
          normalizedValue * (viewData.colorScaleArray.length - 1)
        );
        const color = viewData.colorScaleArray[colorIndex];

        return {
          region: data.name.match(/\(([^)]+)\)/)[1], // Extract region name
          value: value,
          color: color,
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
        let year, month, day, label;
        day = "";
        if (period.length === 6) {
          year = period.substring(0, 4);
          month = period.substring(4, 6);
          label = `${ethiopianMonths[parseInt(month, 10) - 1]} ${year}`;
        } else if (period.length === 9) {
          year = period.substring(0, 4);
          const shortMonth = period.substring(4, 7);
          day = period.substring(7);
          const quarter = period.substring(7);
          const monthIndex = shortMonthNameToIndex[shortMonth];
          month = monthIndex;
          label = `${ethiopianMonths[monthIndex - 1]} ${year} ${quarter}`;
        }

        return { year, month, day, label };
      });

      return {
        ...viewData,
        regionList: regionList,
        regionColors: regionColors,
        mapData: [{ name, data }],
        timePeriods: timePeriods,
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
