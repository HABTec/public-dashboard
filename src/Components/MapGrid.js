import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { BlankWhiteLayer, WhiteTileLayer } from "./TileComponent";

const MapGrid = ({
  splitPeriodData,
  renderThematicPolygons,
  renderBubbleMap,
  renderOrgUnitPolygons,
  renderFacilityMarkers,
  basemap,
}) => {
  const [tileLayer, setTileLayer] = useState(
    basemap === "none" ? "osm" : basemap
  );

  const tileLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
    satellite: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenTopoMap contributors",
    },
    osmLight: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; OpenStreetMap contributors & CARTO",
    },
    darkBaseMap: {
      url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap, CARTO",
    },
    blankWhite: {
      url: null,
      attribution: "",
      layer: new WhiteTileLayer(),
    },
  };

  const handleTileLayerChange = (event) => {
    setTileLayer(event.target.value);
  };

  return (
    <Box p={2} height="100vh" width="100%" position="relative">
      {/* Dropdown for Tile Layer Selection */}
      <FormControl
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "4px",
          padding: "4px 8px",
        }}
      >
        <InputLabel>Base Map</InputLabel>
        <Select
          value={tileLayer}
          onChange={handleTileLayerChange}
          style={{ minWidth: 120, backgroundColor: "white" }}
        >
          {Object.keys(tileLayers).map((layerKey) => (
            <MenuItem key={layerKey} value={layerKey}>
              {layerKey}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Map Grid */}
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
          gap: "8px",
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
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={[9.145, 40.489673]}
              zoom={6}
              // scrollWheelZoom={true}
            >
              {tileLayer === "blankWhite" ? (
                <BlankWhiteLayer />
              ) : (
                <TileLayer
                  url={tileLayers[tileLayer]?.url}
                  attribution={tileLayers[tileLayer]?.attribution}
                />
              )}

              {/* Render layers conditionally based on periodData */}
              {periodData.layer === "thematic" &&
                periodData.thematicMapType === "CHOROPLETH" &&
                renderThematicPolygons(periodData)}
              {periodData.layer === "thematic" &&
                periodData.thematicMapType === "BUBBLE" &&
                renderBubbleMap(periodData)}
              {periodData.layer === "orgUnit" &&
                renderOrgUnitPolygons(periodData)}
              {periodData.layer === "facility" &&
                renderFacilityMarkers(periodData)}
            </MapContainer>

            {/* Label overlay */}
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
      </Box>
    </Box>
  );
};

export default MapGrid;


// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";

// const MapGrid = ({
//   splitPeriodData,
//   renderThematicPolygons,
//   renderBubbleMap,
//   renderOrgUnitPolygons,
//   renderFacilityMarkers,
//   basemap,
// }) => {
//  console.log()



//   return (
//     <Box p={2} height="100vh" width="100%" zIndex={1000}>
      
//       <Box
//         style={{
//           display: "grid",
//           gridTemplateColumns: `repeat(${Math.ceil(
//             Math.sqrt(splitPeriodData.length)
//           )}, 1fr)`,
//           gridTemplateRows: `repeat(${Math.ceil(
//             splitPeriodData.length /
//               Math.ceil(Math.sqrt(splitPeriodData.length))
//           )}, 1fr)`,
//           gap: "8px",
//           height: "100%",
//           width: "100%",
//         }}
//       >
//         {splitPeriodData.map((periodData, index) => (
//           <Box
//             key={index}
//             style={{
//               border: "1px solid rgba(0, 0, 0, 0.2)",
//               position: "relative",
//               height: "100%",
//               width: "100%",
//             }}
//           >
           
//               {periodData.layer === "thematic" &&
//                 periodData.thematicMapType === "CHOROPLETH" &&
//                 renderThematicPolygons(periodData)}
//               {periodData.layer === "thematic" &&
//                 periodData.thematicMapType === "BUBBLE" &&
//                 renderBubbleMap(periodData)}
//               {periodData.layer === "orgUnit" &&
//                 renderOrgUnitPolygons(periodData)}
//               {periodData.layer === "facility" &&
//                 renderFacilityMarkers(periodData)}
           
//             <Typography
//               variant="caption"
//               style={{
//                 position: "absolute",
//                 bottom: 8,
//                 left: 8,
//                 background: "rgba(255, 255, 255, 0.8)",
//                 padding: "4px 8px",
//                 borderRadius: 4,
//               }}
//             >
//               {periodData.label}
//             </Typography>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default MapGrid;
