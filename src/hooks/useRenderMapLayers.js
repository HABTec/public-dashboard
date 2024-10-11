import { Marker, Polygon, Circle, Tooltip, Popup } from "react-leaflet";
import React from "react";
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

    return viewData.sortedShape.map((region, regionIndex) => {
      const coordinates = parseCoordinates(region.co);
      const regionColor = viewData.regionColors.find(
        (rc) => rc.region === region.na
      );
      const color = regionColor ? regionColor.color : "";
      const opacity = color ? viewData.opacity : 0;

      const dataIndex = viewData.regionList.findIndex(
        (name) => name === region.na
      );

      return coordinates.map((polygon, polygonIndex) => (
        <Polygon
          key={`${region.id}-${polygonIndex}-${regionIndex}`}
          positions={polygon}
          fillColor={color}
          color="#000"
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
      ));
    });
  };

  const renderBubbleMap = (viewData, orgDrawn) => {
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
      const regionListIndex = viewData.regionList.indexOf(region.na);

      const dataValue =
        regionListIndex !== -1 ? viewData.mapData[0].data[regionListIndex] : 0;

      const radius = (dataValue / (legendMx - legendMn)) * 90;

      const regionColor = viewData.regionColors.find(
        (rc) => rc.region === region.na
      );
      const color = regionColor ? regionColor.color : "#3388ff";
      const opacity = viewData.opacity;

      const polygons = fetchedCoordinates.map((polygon, polygonIndex) => (
        <Polygon
          key={`${region.id}-${polygonIndex}-${regionIndex}`}
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
            key={`${region.id}-${regionIndex}`}
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
    return periods.map((period, periodIndex) => {
      const regionColors = viewData.mapData.map((data, dataIndex) => {
        return {
          region: data.name.match(/\(([^)]+)\)/)[1],
          value: data.data[periodIndex],
          color: data.marker.fillColor[periodIndex],
        };
      });

      const regionList = viewData.mapData.map((data, dataIndex) => {
        return data.name.match(/\(([^)]+)\)/)[1];
      });
      var name;
      const data = viewData.mapData.map((data, dataIndex) => {
        name = data.name.split(" (")[0];
        return data.data[periodIndex];
      });

      // const mapData = viewData.mapData.map((data, dataIndex) => {
      //   return { name: data.name.split(" (")[0], data: data.data[periodIndex] };
      // });

      const timePeriods = viewData.regionList.map((period) => {
        const year = period.substring(0, 4);
        const month = period.substring(4, 6);
        const label = `${ethiopianMonths[parseInt(month, 10) - 1]} ${year}`;

        return { year, month, label };
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
