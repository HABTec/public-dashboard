import React, { useState, useEffect, useMemo } from "react";
import { Paper, Box } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useMap } from "react-leaflet";
import ReactDOM from "react-dom";
import L from "leaflet";
import ThematicLegend from "./ThematicLegend";
import BubbleLegend from "./BubbleLegend";
import FacilityLegend from "./FacilityLegend";
import OrgUnitLegend from "./OrgUnitLegend";
import PredefinedColorLegend from "./PredefinedColorLegend";

const Legend = ({ legendDatas, legendSet = null }) => {
  console.log("single legend", legendDatas);
  const [showDetails, setShowDetails] = useState(false);
  const map = useMap();

  const accumulatedLegendItems = useMemo(() => {
    const items = [];

    legendDatas.forEach((legendData, index) => {
      if (legendData.name === "thematic")
        if (legendSet?.legends) {
          items.push(
            <PredefinedColorLegend
              key={legendSet}
              legendSet={legendSet}
              thematicType={"thematic"}
            />
          );
        } else {
          items.push(<ThematicLegend key={index} legendData={legendData} />);
        }
      else if (legendData.name === "bubble") {
        if (legendSet) {
          items.push(
            <PredefinedColorLegend
              key={legendSet}
              legendSet={legendSet}
              thematicType={"bubble"}
            />
          );
        } else {
          items.push(<BubbleLegend key={index} legendData={legendData} />);
        }
      } else if (legendData.name === "facility")
        items.push(<FacilityLegend key={index} legendData={legendData} />);
      else if (legendData.name === "orgUnit")
        items.push(<OrgUnitLegend key={index} />);
    });
    // }

    return items;
  }, [legendDatas, legendSet]);

  console.log("accumulatedLegendItems");

  useEffect(() => {
    const legendDiv = L.DomUtil.create("div", "info legend");

    ReactDOM.render(
      <Paper
        elevation={1}
        sx={{ p: 0.5 }}
        onClick={() => setShowDetails((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <Box display="flex" alignItems="center" m={0.5}>
          <FormatListBulletedIcon />
          {showDetails && " Legend"}
        </Box>
        {showDetails && accumulatedLegendItems}
      </Paper>,
      legendDiv
    );

    const legendControl = L.control({ position: "bottomleft" });
    legendControl.onAdd = () => legendDiv;
    legendControl.addTo(map);

    return () => {
      legendControl.remove();
    };
  }, [map, showDetails, accumulatedLegendItems]);

  return null;
};

export default Legend;
