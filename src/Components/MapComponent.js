import React, { useEffect, useState } from "react";
import { getFilters, getDimensions, getOuDimensions } from "../utils/filters";
import Map from "./Map";
import { useSnackbar } from "material-ui-snackbar-provider";

function MapComponent({
  data,
  setMapData,
  mainProps,
  setLoading,
  setChartData,
  setChartInfo,
  chartInfo,
}) {
  const apiBase = process.env.REACT_APP_BASE_URI;
  const [shapes, setShapes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const snackbar = useSnackbar();
  const [chartData_, setChartData_] = useState({});
  let url = apiBase + "api/40/analytics.json?";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Order mapViews by layer type
        const orderedMapViews = [...data.mapViews].sort((a, b) => {
          const order = ["orgUnit", "facility", "thematic"];
          return order.indexOf(a.layer) - order.indexOf(b.layer);
        });

        // Process ordered mapViews
        const promises = orderedMapViews.map(async (view) => {
          console.log("view++", view);
          let filters = getFilters(view.filters, mainProps?.filters);
          if (view.renderingStrategy == "TIMELINE") {
            filters.replace("filter", "dimension");
          }
          let dimension = getDimensions(view);
          let aggregationTypeFilter = view.aggregationType
            ? "&aggregationType=" + view.aggregationType
            : "";
          let ou_dimension = getOuDimensions(view.rows, { type: "MAP" });

          let geoFeaturesUrl = `${apiBase}api/geoFeatures.json?ou=${ou_dimension}&displayProperty=NAME`;
          console.log("geoFeaturesUrl", geoFeaturesUrl);
          const response = await fetch(encodeURI(geoFeaturesUrl));
          const shapeData = await response.json();
          if (view.layer == "thematic") {
            if (
              view.renderingStrategy === "TIMELINE" ||
              view.renderingStrategy == "SPLIT_BY_PERIOD"
            ) {
              filters = filters.replace("filter", "dimension");
            }
            try {
              // url += dimension + filters;
              let analyticsData = await fetch(
                encodeURI(url + dimension + filters + aggregationTypeFilter)
              );
              let chartData_ = await analyticsData.json();
              console.log("chartData", analyticsData, chartData_);
              console.log("url guessed", url + dimension + filters);
              setChartData(chartData_);
              setChartInfo((prevChartInfo) => ({
                ...prevChartInfo,
                interpretations: data?.interpretations,
                description: data?.description,
              }));
              setChartData_((prevChartData) => ({
                ...prevChartData,
                [view.id]: chartData_,
              }));
            } catch (error) {
              console.error("Error fetching data:", error);
              snackbar.showMessage(
                "Error fetching data",
                undefined,
                undefined,
                {
                  type: "error",
                }
              );
            }
          }
          setLoading(false);
          setShapes((prevShapes) => ({
            ...prevShapes,
            [view.id]: shapeData,
          }));
        });

        await Promise.all(promises);
        setIsLoading(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        snackbar.showMessage("Error fetching data", undefined, undefined, {
          type: "error",
        });
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mainProps.filters, data, setMapData, setLoading, setShapes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("data", data, "shapes", shapes, "chartData_", chartData_);

  return (
    <Map
      key={data.id}
      mapViews={data.mapViews}
      chartDatas={chartData_}
      shapes={shapes}
      basemap={data.basemap}
    />
  );
}

export default MapComponent;
