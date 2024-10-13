import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SvgIcon } from "@mui/material";
import ReactDOMServer from "react-dom/server";
import {
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import Legend from "./Legend";
import { useMapLogic } from "../hooks/useMapLogic";
import RoomIcon from "@mui/icons-material/ControlPoint";
import HealthPostIcon from "@mui/icons-material/MedicalInformation";
import polylabel from "polylabel";
import {
  TileLayerControl,
  BlankWhiteLayer,
  WhiteTileLayer,
} from "./TileComponent";

const createCustomIcon = (iconComponent, color) =>
  new L.DivIcon({
    html: ReactDOMServer.renderToString(
      <SvgIcon component={iconComponent} style={{ color }} />
    ),
    className: "",
    iconSize: [10, 10],
  });

const Map = ({ mapViews, chartDatas, shapes, basemap }) => {
  const [tileLayer, setTileLayer] = useState(
    basemap === "none" ? "osm" : basemap
  );
  const legendData = [];

  const tileLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    },
    osmLight: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    },

    darkBaseMap: {
      url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attributions">CARTO</a>',
    },
    blankWhite: {
      url: null,
      attribution: "",
      layer: new WhiteTileLayer(),
    },
  };

  const {
    parsedMapViews,
    parseCoordinates,
    handleMouseEnter,
    handleMouseLeave,
    hoveredRegion,
    mapBounds,
  } = useMapLogic(mapViews, chartDatas, shapes);

  if (!mapBounds) return null;

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
                    {regionData.label}: {regionData.data[num]}
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
                  {viewData.mapData[0].label}:{" "}
                  {viewData.mapData[0].data[dataIndex]}
                </li>
              )}
            </span>
          </Tooltip>
        </Polygon>
      ));
    });
  };

  // Using manual approach to find the visual center of a polygon

  // const renderBubbleMap = (viewData, orgDrawn) => {
  //   const legendMn = Math.min(
  //     ...viewData.mapData.map((d) => Math.min(...d.data))
  //   );
  //   const legendMx = Math.max(
  //     ...viewData.mapData.map((d) => Math.max(...d.data))
  //   );

  //   const legendRegionColors = viewData.regionColors || [];

  //   legendData.push({
  //     name: "bubble",
  //     displayName: viewData.displayName,
  //     mn: legendMn,
  //     mx: legendMx,
  //     colorScaleArray: viewData.colorScaleArray,
  //     regionColors: legendRegionColors,
  //   });

  //   return viewData?.sortedShape?.map((region, regionIndex) => {
  //     const fetchedCoordinates = parseCoordinates(region.co);

  //     // Calculate visual center for each polygon
  //     const visualCenters = fetchedCoordinates.map(findVisualCenter);

  //     // Use the first visual center (if there are multiple polygons)
  //     const coordinates = visualCenters.length > 0 ? visualCenters[0] : [0, 0];

  //     const regionListIndex = viewData.regionList.indexOf(region.na);

  //     const dataValue =
  //       regionListIndex !== -1 ? viewData.mapData[0].data[regionListIndex] : 0;

  //     // Radius based on the data value
  //     const radius = (dataValue / (legendMx - legendMn)) * 90;

  //     // Color for the region
  //     const regionColor = viewData.regionColors.find(
  //       (rc) => rc.region === region.na
  //     );
  //     const color = regionColor ? regionColor.color : "#3388ff";
  //     const opacity = viewData.opacity;

  //     // Render the polygon structure
  //     const polygons = fetchedCoordinates.map((polygon, polygonIndex) => (
  //       <Polygon
  //         key={`${region.id}-${polygonIndex}-${regionIndex}`}
  //         positions={polygon}
  //         color="#000"
  //         fillOpacity={0}
  //         weight={1}
  //         eventHandlers={{
  //           mouseover: (e) => handleMouseEnter(e, region),
  //           mouseout: (e) => handleMouseLeave(e, 1),
  //         }}
  //       >
  //         <Tooltip>
  //           <span>{region.na}</span>
  //         </Tooltip>
  //       </Polygon>
  //     ));

  //     const dataIndex = viewData.regionList.findIndex(
  //       (name) => name === region.na
  //     );

  //     return (
  //       <>
  //         {orgDrawn ? "" : polygons}
  //         <Circle
  //           key={`${region.id}-${regionIndex}`}
  //           center={coordinates}
  //           radius={radius * 1000}
  //           fillColor={color}
  //           color="#000"
  //           fillOpacity={opacity}
  //           weight={1}
  //           eventHandlers={{
  //             mouseover: (e) => handleMouseEnter(e, region),
  //             mouseout: (e) => handleMouseLeave(e),
  //           }}
  //         >
  //           <Tooltip>
  //             <span>
  //               {region.na}
  //               {dataIndex !== -1 && (
  //                 <li key={`${dataIndex} - ${viewData.regionList[dataIndex]}`}>
  //                   {viewData.mapData[0].label}:{" "}
  //                   {viewData.mapData[0].data[dataIndex]}
  //                 </li>
  //               )}
  //             </span>
  //           </Tooltip>
  //         </Circle>
  //       </>
  //     );
  //   });
  // };

  // // Function to find the visual center of a polygon (simplified quadtree-like approach)
  // function findVisualCenter(polygonCoordinates) {
  //   const bounds = getBoundingBox(polygonCoordinates);
  //   let bestPoint = null;
  //   let maxDistance = -Infinity;

  //   const gridSize = 10; // Adjust this to control precision
  //   const step = Math.max(bounds.width, bounds.height) / gridSize;

  //   for (let x = bounds.minX; x <= bounds.maxX; x += step) {
  //     for (let y = bounds.minY; y <= bounds.maxY; y += step) {
  //       const point = [x, y];
  //       if (isPointInPolygon(point, polygonCoordinates)) {
  //         const distance = calculateDistanceToEdges(point, polygonCoordinates);
  //         if (distance > maxDistance) {
  //           maxDistance = distance;
  //           bestPoint = point;
  //         }
  //       }
  //     }
  //   }

  //   return bestPoint || getCentroid(polygonCoordinates); // Fallback to centroid if no point is found
  // }

  // // Utility functions

  // // Get bounding box for the polygon
  // function getBoundingBox(polygon) {
  //   const xs = polygon.map((p) => p[0]);
  //   const ys = polygon.map((p) => p[1]);
  //   return {
  //     minX: Math.min(...xs),
  //     maxX: Math.max(...xs),
  //     minY: Math.min(...ys),
  //     maxY: Math.max(...ys),
  //     width: Math.max(...xs) - Math.min(...xs),
  //     height: Math.max(...ys) - Math.min(...ys),
  //   };
  // }

  // // Check if a point is inside a polygon
  // function isPointInPolygon(point, polygon) {
  //   const [px, py] = point;
  //   let isInside = false;

  //   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
  //     const [xi, yi] = polygon[i];
  //     const [xj, yj] = polygon[j];

  //     const intersect =
  //       yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
  //     if (intersect) isInside = !isInside;
  //   }

  //   return isInside;
  // }

  // // Calculate the distance from a point to the polygon edges
  // function calculateDistanceToEdges(point, polygon) {
  //   // Calculate the minimum distance from the point to the edges of the polygon
  //   let minDistance = Infinity;
  //   for (let i = 0; i < polygon.length; i++) {
  //     const edgeStart = polygon[i];
  //     const edgeEnd = polygon[(i + 1) % polygon.length];
  //     const distance = pointToSegmentDistance(point, edgeStart, edgeEnd);
  //     minDistance = Math.min(minDistance, distance);
  //   }
  //   return minDistance;
  // }

  // // Calculate the distance from a point to a line segment
  // function pointToSegmentDistance(point, segmentStart, segmentEnd) {
  //   const [px, py] = point;
  //   const [sx, sy] = segmentStart;
  //   const [ex, ey] = segmentEnd;

  //   const segmentLengthSquared = (ex - sx) ** 2 + (ey - sy) ** 2;
  //   if (segmentLengthSquared === 0) return Math.hypot(px - sx, py - sy); // Segment is a point

  //   // Project point onto the line segment, clamping to the segment endpoints
  //   let t =
  //     ((px - sx) * (ex - sx) + (py - sy) * (ey - sy)) / segmentLengthSquared;
  //   t = Math.max(0, Math.min(1, t));

  //   const closestPointOnSegment = [sx + t * (ex - sx), sy + t * (ey - sy)];
  //   return Math.hypot(
  //     px - closestPointOnSegment[0],
  //     py - closestPointOnSegment[1]
  //   );
  // }

  // // Fallback to the centroid calculation if needed
  // function getCentroid(polygon) {
  //   let xSum = 0,
  //     ySum = 0,
  //     n = polygon.length;
  //   polygon.forEach(([x, y]) => {
  //     xSum += x;
  //     ySum += y;
  //   });
  //   return [xSum / n, ySum / n];
  // }

  // Using polylabel to find the visual center of a polygon

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

      // Use polylabel to find the optimal visual center for each polygon
      const visualCenters = fetchedCoordinates.map((polygon) =>
        polylabel([polygon], 0.000001)
      );

      const bestCenter = visualCenters.reduce(
        (best, current) => (current.distance > best.distance ? current : best),
        visualCenters[0]
      );

      console.log("bestCenters", bestCenter, visualCenters);
      // Use the first visual center (if there are multiple polygons)
      // const coordinates = visualCenters.length > 0 ? visualCenters[0] : [0, 0];
      const coordinates = bestCenter;
      const regionListIndex = viewData.regionList.indexOf(region.na);

      const dataValue =
        regionListIndex !== -1 ? viewData.mapData[0].data[regionListIndex] : 0;

      // Radius based on the data value
      const radius = (dataValue / (legendMx - legendMn)) * 90;

      // Color for the region
      const regionColor = viewData.regionColors.find(
        (rc) => rc.region === region.na
      );
      const color = regionColor ? regionColor.color : "#3388ff";
      const opacity = viewData.opacity;

      // Render the polygon structure
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
                    {viewData.mapData[0].label}:{" "}
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

  var orgDrawn = false;
  const defaultBounds = L.latLngBounds([3.0, 33.0], [15.0, 48.0]);
  return (
    <MapContainer
      bounds={mapBounds.isValid() ? mapBounds : defaultBounds}
      style={{ height: "100%", width: "100%" }}
    >
      {tileLayer === "blankWhite" ? (
        <BlankWhiteLayer />
      ) : (
        <TileLayer
          url={tileLayers[tileLayer]?.url}
          attribution={tileLayers[tileLayer]?.attribution}
        />
      )}
      <TileLayerControl
        tileLayer={tileLayer}
        setTileLayer={setTileLayer}
        tileLayers={tileLayers}
      />

      {parsedMapViews?.map((viewData) => {
        console.log("view data", viewData);

        switch (viewData?.layer) {
          case "facility":
            return renderFacilityMarkers(viewData);

          case "orgUnit":
            return renderOrgUnitPolygons(viewData);

          case "thematic":
            if (viewData?.thematicMapType === "CHOROPLETH") {
              orgDrawn = true;
              return renderThematicPolygons(viewData);
            } else if (viewData?.thematicMapType === "BUBBLE") {
              const draw = orgDrawn;
              orgDrawn = true;
              return renderBubbleMap(viewData, draw);
            } else {
              // thematicMapType set the default render to CHOROPLETH
              orgDrawn = true;
              return renderThematicPolygons(viewData);
            }
            break;

          default:
            return null;
        }
      })}

      <Legend legendDatas={legendData} />
    </MapContainer>
  );
};

export default Map;
