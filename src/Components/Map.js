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

  const calculatePolygonCentroid = (polygon) => {
    let area = 0;
    let centroidLat = 0;
    let centroidLng = 0;

    // Loop through each vertex of the polygon
    for (let i = 0; i < polygon.length - 1; i++) {
      const [lat1, lng1] = polygon[i];
      const [lat2, lng2] = polygon[i + 1];

      const a = lat1 * lng2 - lat2 * lng1;
      area += a;
      centroidLat += (lat1 + lat2) * a;
      centroidLng += (lng1 + lng2) * a;
    }

    // Finalize centroid calculation
    area = area / 2;
    centroidLat = centroidLat / (6 * area);
    centroidLng = centroidLng / (6 * area);

    return [centroidLat, centroidLng];
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


      // Calculate centroid using manual method for each polygon
      const centroids = fetchedCoordinates.map(calculatePolygonCentroid);

      // Use the first centroid as the center (if there are multiple polygons)
      const coordinates = centroids.length > 0 ? centroids[0] : [0, 0];

      const regionListIndex = viewData.regionList.indexOf(region.na);

      const dataValue =
        regionListIndex !== -1 ? viewData.mapData[0].data[regionListIndex] : 0;

      // Radius based on the data value
      const radius = (dataValue / (legendMx - legendMn)) * 70;

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
