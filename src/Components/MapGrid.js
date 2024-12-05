import React, { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { WhiteTileLayer } from "./TileComponent";
import debounce from "lodash.debounce";
import SplitMapLegend from "./SplitMapLegend";
import MapSyncComponent from "./MapSyncComponent";

const MapGrid = ({
  splitPeriodData,
  renderThematicPolygons,
  renderBubbleMap,
  renderOrgUnitPolygons,
  renderFacilityMarkers,
  basemap,
  mapBounds,
  legendData,
  legendRange,
}) => {
  const [tileLayer, setTileLayer] = useState(
    basemap === "none" ? "osm" : basemap
  );
  const [center, setCenter] = useState([9.145, 40.489673]);
  const [zoom, setZoom] = useState(4);
  const legendSet = splitPeriodData[0]?.legendSet || null;

  console.log(
    "split grid",
    legendData,
    legendRange,
    "split map data here",
    splitPeriodData,
    legendSet
  );

  const tileLayers = {
    osm: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
    satellite: { url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" },
    osmLight: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    },
    darkBaseMap: {
      url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    },
    blankWhite: {
      url: null,
      attribution: "",
      layer: new WhiteTileLayer(),
    },
  };

  const debouncedCenterChange = useCallback(debounce(setCenter, 50), []);
  const debouncedZoomChange = useCallback(debounce(setZoom, 50), []);

  return (
    <Box height="100vh" width="100%" position="relative">
      <FormControl
        style={{
          position: "absolute",
          top: 10,
          right: 3,
          zIndex: 1000,
          borderRadius: "4px",
          padding: "4px 8px",
        }}
      >
        <InputLabel>Base Map</InputLabel>
        <Select
          value={tileLayer}
          onChange={(e) => setTileLayer(e.target.value)}
          style={{ minWidth: 120, backgroundColor: "white" }}
        >
          {Object.keys(tileLayers).map((layerKey) => (
            <MenuItem key={layerKey} value={layerKey}>
              {layerKey}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          position: "absolute",
          top: 3,
          left: 3,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          // gap: "1px",
          background: "white",
          borderRadius: "4px",
          margin: "4px 8px",
          border: "2px solid #C8C8C6",
          width: "2.1rem",
          height: "fit-content",
        }}
      >
        <IconButton
          onClick={() => setZoom((prev) => prev + 1)}
          size="small"
          sx={{ height: "1.8rem" }}
        >
          <Add sx={{ color: "#000" }} />
        </IconButton>
        <Divider />
        <IconButton
          onClick={() => setZoom((prev) => prev - 1)}
          size="small"
          sx={{ height: "1.8rem" }}
        >
          <Remove sx={{ color: "#000" }} />
        </IconButton>
      </Box>

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.ceil(
            Math.sqrt(splitPeriodData.length)
          )}, 1fr)`,
          gridTemplateRows: `repeat(${Math.ceil(
            splitPeriodData.length /
              Math.ceil(Math.sqrt(splitPeriodData.length))
          )}, 1fr)`,
          gap: "0",
          height: "100%",
          width: "100%",
        }}
      >
        {splitPeriodData.map((periodData, index) => (
          <Box
            key={index}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.2)",
              position: "relative",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: "1rem",
                left: "40%",
                backgroundColor: "white",
                width: "fit-content",
                height: "fit-content",
                zIndex: 1000,
                padding: "0.5rem",
                boxShadow: 2,
                borderRadius: "12px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  wordWrap: "break-word",
                  // marginBottom: "2px"
                }}
              >
                {periodData.timePeriods[index].timePeriod.label}
              </Typography>
            </Box>
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={center}
              zoomControl={false}
              attributionControl={false}
            >
              <MapSyncComponent
                center={center}
                zoom={zoom}
                onZoomChange={debouncedZoomChange}
                onCenterChange={debouncedCenterChange}
                tileLayerUrl={tileLayers[tileLayer]?.url}
                periodData={periodData}
                renderThematicPolygons={renderThematicPolygons}
                renderBubbleMap={renderBubbleMap}
                renderOrgUnitPolygons={renderOrgUnitPolygons}
                renderFacilityMarkers={renderFacilityMarkers}
                mapBounds={mapBounds}
              />
            </MapContainer>
            <Typography
              variant="caption"
              style={{
                position: "absolute",
                bottom: 8,
                left: 8,
                background: "rgba(255, 255, 255, 0.8)",
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              {periodData.label}
            </Typography>
          </Box>
        ))}
        <SplitMapLegend
          legendData={legendData}
          legendRange={legendRange}
          legendSet={legendSet}
        />
      </Box>
    </Box>
  );
};

export default MapGrid;
