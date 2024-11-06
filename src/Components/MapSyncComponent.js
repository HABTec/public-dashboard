import React from "react";
import { useState, useEffect } from "react";
import { useMapEvents, TileLayer } from "react-leaflet";
import { BlankWhiteLayer } from "./TileComponent";

const MapSyncComponent = ({
    center,
    zoom,
    onZoomChange,
    onCenterChange,
    tileLayerUrl,
    periodData,
    renderThematicPolygons,
    renderBubbleMap,
    renderOrgUnitPolygons,
    renderFacilityMarkers,
    mapBounds,
  }) => {
    const [firstRender, setFirstRender] = useState(true);
    const map = useMapEvents({
      move: () => {
        onCenterChange(map.getCenter()); // Real-time update
      },
      zoom: () => {
        onZoomChange(map.getZoom());
      },
    });
  
    // Only update the map view when center or zoom changes
    useEffect(() => {
      map.setView(center, zoom, { animate: true }); 
      if (mapBounds && firstRender) {
        map.fitBounds(mapBounds); // Fit the map to the bounds
        setFirstRender(false);
      }
    }, [map, center, zoom]);
  
    return (
      <>
        {tileLayerUrl ? <TileLayer url={tileLayerUrl} /> : <BlankWhiteLayer />}
        {periodData.layer === "thematic" &&
          periodData.thematicMapType === "CHOROPLETH" &&
          renderThematicPolygons(periodData)}
        {periodData.layer === "thematic" &&
          periodData.thematicMapType === "BUBBLE" &&
          renderBubbleMap(periodData)}
        {periodData.layer === "orgUnit" && renderOrgUnitPolygons(periodData)}
        {periodData.layer === "facility" && renderFacilityMarkers(periodData)}
      </>
    );
  };

  export default MapSyncComponent;