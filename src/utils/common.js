import * as science from "science";

const getObjectItems = function (obj, prop, dataDimensionItems) {
  let res = [];
  if (dataDimensionItems) {
    for (let i = 0; i < obj.items.length; i++) {
      const item = obj.items[i];
      if (
        item[prop] &&
        dataDimensionItems[i] &&
        dataDimensionItems[i].reportingRate &&
        dataDimensionItems[i].reportingRate.dimensionItem
      ) {
        res.push(dataDimensionItems[i].reportingRate.dimensionItem);
      } else if (item[prop]) {
        res.push(item[prop]);
      }
    }
  } else
    for (const item of obj.items) {
      if (item[prop]) {
        res.push(item[prop]);
      }
    }

  return res;
};

const toCSVText = function (chartConfig, title) {
  if (!chartConfig) return "";

  let csvString = title + "\n,";

  if (chartConfig.data) {
    // it is a pie chart
    csvString +=
      "\n" +
      chartConfig.data.reduce(
        (alldata, data) => alldata + data.label + "," + data.value + "\n",
        ""
      );
  }

  if (chartConfig.yAxis) {
    // it is not a pie chart

    csvString +=
      chartConfig.series.reduce((x, y) => y.label + "," + x, "") + "\n"; // table header

    csvString += chartConfig.yAxis.categories.reduce((alldata, category, i) => {
      return (
        alldata +
        category +
        "," +
        chartConfig.series.reduce((y, series, seriesIndex) => {
          let retString = y;
          if (series.data[i]) retString += series.data[i] + ",";
          else retString += ",";
          return retString;
        }, "") +
        "\n"
      );
    }, "");
  }

  return csvString;
};

// LOESS function
const loess = function (xval, yval, bandwidth) {
  return science.stats.loess().bandwidth(bandwidth)(xval, yval);
};

const getItemName = function (obj, key) {
  if (
    obj &&
    obj.metaData &&
    obj.metaData.items &&
    obj.metaData.items[key] &&
    obj.metaData.items[key].name
  ) {
    return obj.metaData.items[key].name;
  }
  return key;
};

const getHexColor = function (color) {
  // canvas to convert named colors to their hex equivalent
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color;
  return ctx.fillStyle;
};

const getLuminance = function (color) {
  // Convert named color to hex if necessary
  color = getHexColor(color);

  // Ensure the color is in hex format
  const rgb = color
    .replace(/^#/, "")
    .match(/.{2}/g)
    .map((hex) => parseInt(hex, 16) / 255);

  const [r, g, b] = rgb.map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastColor = function (bgColor) {
  const luminance = getLuminance(bgColor);
  return luminance > 0.5 ? "black" : "white";
};

export { toCSVText, getObjectItems, loess, getItemName, getContrastColor };
