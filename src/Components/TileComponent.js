import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ReactDOM from "react-dom";

const TileLayerControl = ({ tileLayer, setTileLayer, tileLayers }) => {
  const map = useMap();

  useEffect(() => {
    const controlDiv = L.DomUtil.create(
      "div",
      "leaflet-control-layers leaflet-control"
    );

    const formControl = (
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <InputLabel id="tile-layer-select-label">Base Map</InputLabel>
        <Select
          labelId="tile-layer-select-label"
          id="tile-layer-select"
          value={tileLayer}
          onChange={(e) => setTileLayer(e.target.value)}
          label="Base Map"
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
