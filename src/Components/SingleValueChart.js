import React from "react";
import Typography from "@mui/material/Typography";
import Legend from "./Legend";

const SingleValueChart = ({ chartData, componentRef, chartInfo }) => {
  try {
    let value = chartData?.rows[0][1];
    let dataElement = chartData?.rows[0][0];
    let textColor = "black";
    let color = "primary";

    const metadata = chartData?.metaData;
    let orgunit = metadata?.dimensions?.ou?.map((ou) => metadata.items[ou]);
    let period = metadata?.dimensions?.pe?.map((p) => metadata.items[p]);

    if (chartInfo.legend?.strategy != "BY_DATA_ITEM") {
      color = chartInfo?.legend?.set?.legends.find(
        (leg) => value >= leg.startValue && value < leg.endValue
      )?.color;

      textColor =
        chartInfo?.legend?.style == "FILL" ? "black" : color || "black";
      if (chartInfo?.legend?.style == "FILL") {
        componentRef.current.style.backgroundColor = color;
        componentRef.current.firstChild.firstChild.firstChild.style.color =
          "black";
      }
    }

    let title =
      chartData &&
      chartData.rows &&
      chartData.rows[0] &&
      dataElement &&
      chartData.metaData.items[dataElement]
        ? chartData.metaData.items[dataElement]?.name
        : "";

    let dataElementMetadata =
      chartData && chartData.metaData.items[dataElement]
        ? chartData.metaData.items[dataElement]
        : "";

    let text = "";

    console.log("chart data", chartData, dataElementMetadata);

    if (dataElementMetadata?.dimensionItemType == "INDICATOR") {
      if (dataElementMetadata?.indicatorType.factor == 100) {
        text = (
          <Typography
            display="flex"
            alignItems="center"
            component="div"
            variant="h1"
            color={textColor}
          >
            {value + "%"}
          </Typography>
        );
      } else {
        text = (
          <>
            <Typography
              display="flex"
              alignItems="center"
              component="div"
              variant="h1"
              color={textColor}
            >
              {value}
            </Typography>
            <Typography>
              {" " + dataElementMetadata?.indicatorType?.name}
            </Typography>
          </>
        );
      }
    } else {
      text = (
        <Typography
          display="flex"
          alignItems="center"
          component="div"
          variant="h1"
          color="primary"
        >
          {value}
        </Typography>
      );
    }

    return (
      <div
        style={{
          minHeight: "85%",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {text}
        <Typography>
          {title} - {period.map((p) => p.name).join(", ")} -{" "}
          {orgunit.map((ou) => ou.name).join(", ")}
        </Typography>
      </div>
    );
  } catch (error) {
    return "No data";
  }
};

export default SingleValueChart;
