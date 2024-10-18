import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Legend from "./Legend";
import { useMapLogic } from "../hooks/useMapLogic";
import {
  TileLayerControl,
  BlankWhiteLayer,
  WhiteTileLayer,
} from "./TileComponent";
import Timeline from "./Timeline";
import { useRenderMapLayers } from "../hooks/useRenderMapLayers";

const Map = ({ mapViews, chartDatas, shapes, basemap }) => {
  const [tileLayer, setTileLayer] = useState(
    basemap === "none" ? "osm" : basemap
  );
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [timelineDataPeriod, setTimelineDataPeriod] = useState(null);
  const legendData = [];
  console.log("mapViews__", mapViews, selectedTimeline);

  const handleTimeChange = (year, month, day, index) => {
    setSelectedYear(year + month + day);

    const newTimeline = timelineData[index];
    console.log("timelineData__ to be rendered", newTimeline, index);

    if (newTimeline) {
      setSelectedTimeline(newTimeline);
    }
  };

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

  const {
    renderFacilityMarkers,
    renderOrgUnitPolygons,
    renderThematicPolygons,
    renderBubbleMap,
    renderTimelineDatas,
  } = useRenderMapLayers(
    legendData,
    parseCoordinates,
    handleMouseEnter,
    handleMouseLeave
  );

  console.log("parsedMapViews__", parsedMapViews);

  // Set timeline data only once when mapViews change
  useEffect(() => {
    const timelineViewData = parsedMapViews?.find(
      (viewData) => viewData?.renderingStrategy === "TIMELINE"
    );
    if (timelineViewData) {
      const timeline = renderTimelineDatas(timelineViewData);
      setTimelineData(timeline);
      setTimelineDataPeriod(timeline[0].timePeriods);
      setSelectedTimeline(timeline[0]); // Set initial selected timeline
    }
  }, []);

  if (!mapBounds) return null;

  var orgDrawn = false;

  const defaultBounds = L.latLngBounds([3.0, 33.0], [15.0, 48.0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <MapContainer
          key={selectedTimeline ? selectedTimeline + mapViews.id : mapViews.id}
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
            console.log("viewData__", viewData);
            if (!selectedTimeline) {
              switch (viewData?.layer) {
                case "facility":
                  return renderFacilityMarkers(viewData);

              
                case "orgUnit":
                  return renderOrgUnitPolygons(viewData);

                case "thematic":
                  if (viewData?.thematicMapType === "CHOROPLETH" || selectedTimeline?.thematicMapType === undefined) {
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
            } else {
              // Use the timeline data if available
              console.log("selectedTimeline", selectedTimeline);
              switch (selectedTimeline?.layer) {
                case "facility":
                  return renderFacilityMarkers(selectedTimeline);

                case "orgUnit":
                  return renderOrgUnitPolygons(selectedTimeline);

                case "thematic":
                  if (selectedTimeline?.thematicMapType === "CHOROPLETH") {
                    orgDrawn = true;
                    console.log("rendering agai", selectedTimeline)
                    return renderThematicPolygons(selectedTimeline);
                  } else if (selectedTimeline?.thematicMapType === "BUBBLE") {
                    const draw = orgDrawn;
                    orgDrawn = true;
                    return renderBubbleMap(selectedTimeline, draw);
                  }
                  break;

                default:
                  return null;
              }
            }
          })}

          <Legend legendDatas={legendData} />
        </MapContainer>
      </div>
      {timelineData && (
        <Timeline
          timelineData={timelineDataPeriod}
          onTimeChange={handleTimeChange}
        />
      )}
    </div>
  );
};

export default Map;
