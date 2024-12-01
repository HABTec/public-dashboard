import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ReactDOM from "react-dom";

const TileLayerControl = ({ tileLayer, setTileLayer, tileLayers }) => {
  const map = useMap();

  useEffect(() => {
    const controlDiv = L.DomUtil.create(
      "div",
      "leaflet-control-layers leaflet-control"
    );

    const formControl = (
      <FormControl
        style={{
          position: "absolute",
          top: 3,
          right: -8,
          zIndex: 1000,
          borderRadius: "4px",
          padding: "4px 8px",
        }}
      >
        <InputLabel sx={{ marginBottom: 2 }}>
          <Typography>Base Map</Typography>
        </InputLabel>
        <Select
          value={tileLayer}
          onChange={(e) => setTileLayer(e.target.value)}
          style={{ minWidth: 120, backgroundColor: "white" }}
        >
          {Object.keys(tileLayers).map((layer) => (
            <MenuItem key={layer} value={layer}>
              {layer}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );

    ReactDOM.render(formControl, controlDiv);

    const customControl = L.control({ position: "topright" });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);

    return () => {
      customControl.remove();
    };
  }, [map, tileLayer, setTileLayer, tileLayers]);

  return null;
};

const WhiteTileLayer = L.GridLayer.extend({
  createTile: function (coords) {
    const tile = document.createElement("div");
    tile.style.width = "256px";
    tile.style.height = "256px";
    tile.style.background = "white";
    return tile;
  },
});

const BlankWhiteLayer = () => {
  const map = useMap();

  useEffect(() => {
    const whiteLayer = new WhiteTileLayer();
    whiteLayer.addTo(map);

    return () => {
      map.removeLayer(whiteLayer);
    };
  }, [map]);

  return null;
};

export { TileLayerControl, BlankWhiteLayer, WhiteTileLayer };
