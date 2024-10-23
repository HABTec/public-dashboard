import React from "react";
import Typography from "@mui/material/Typography";

const SingleValueChart = ({ chartData, componentRef, chartInfo }) => {
  try {
    let value = chartData?.rows[0][1];
    let dataElement = chartData?.rows[0][0];

    let color = chartInfo?.legend?.set?.legends.find(
      (leg) => value >= leg.startValue && value <= leg.endValue
    )?.color;

    let textColor =
      chartInfo?.legend?.style == "FILL" ? "black" : color || "black";
    if (chartInfo?.legend?.style == "FILL") {
      componentRef.current.style.backgroundColor = color;
      componentRef.current.firstChild.firstChild.firstChild.style.color =
        "black";
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
          minHeight: "100%",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {text}
        <Typography>{title}</Typography>
      </div>
    );
  } catch (error) {
    return "No data";
  }
};

export default SingleValueChart;
