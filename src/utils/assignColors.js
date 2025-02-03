{
  /* <svg width="400" height="110">
    <defs>
      <pattern
        id="striped-pattern"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="10" y2="0" stroke="#3f51b5" stroke-width="4" />
      </pattern>
      <pattern
        id="diagonal-stripe-pattern"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-45)"
      >
        <line x1="0" y1="0" x2="10" y2="0" stroke="#FF5722" stroke-width="4" />
      </pattern>
      <pattern
        id="grid-pattern"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <rect x="0" y="0" width="10" height="10" fill="#E0E0E0" />
        <line x1="0" y1="0" x2="10" y2="0" stroke="#616161" stroke-width="2" />
        <line x1="0" y1="0" x2="0" y2="10" stroke="#616161" stroke-width="2" />
      </pattern>
      <pattern
        id="dot-pattern"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="5" cy="5" r="2" fill="#9C27B0" />
      </pattern>
    </defs>
  </svg>; */
}

const defaultColors = [
  "#A7BF25",
  "#518CC2",
  "#D74554",
  "#FE9D22",
  "#968F8F",
  "#968F8F",
  "#FFD955",
  "#46BDAE",
  "#B97F38",
  "#676767",
  "#6A2DD4",
  "#47792C",
  "#FBBDBC",
  "#830001",
  "#A4FFC0",
  "#000078",
  "#817C01",
  "#BCF021",
  "#FFFAC4",
];

const basicColors = ["#338F41", "#9F2240", "#DDDDDD", "#B4A269"];
const extendedColors = [
  "#194F8F",
  "#AE1857",
  "#5A7E96",
  "#FFB71B",
  "#1BCAD3",
  "#FE5B35",
  "#8F4899",
  "#DAE343",
  "#385CAC",
  "#E81E76",
  "#009383",
  "#522B39",
];
const brightColors = [
  "#FD7F6F",
  "#8BD3C7",
  "#BEB9DA",
  "#7EB0D4",
  "#FFB55A",
  "#FCCCE5",
  "#FFFFAF",
  "#D9D9D9",
  "#BD7EBE",
  "#CAECC3",
  "#9FE778",
  "#FEEF65",
];
const darkColors = [
  "#115688",
  "#217619",
  "#B51207",
  "#7F3D00",
  "#5E3389",
  "#058A7F",
  "#56A2CD",
  "#73B62F",
  "#DB0505",
  "#E68900",
  "#9E6FB3",
  "#AAAD00",
];
const grayColors = ["#CFCFCF", "#8F8682", "#414451", "#A4ACAF", "#606369"];
const colorBlindColors = [
  "#CFCFCF",
  "#FFBC79",
  "#A2C8EC",
  "#898989",
  "#C85100",
  "#5F9DD1",
  "#595959",
  "#ABABAB",
  "#FF800E",
  "#016AA3",
];
const patterns = [
  "striped-pattern",
  "diagonal-stripe-pattern",
  "grid-pattern",
  "dot-pattern",
];

const assignColors = (colorSet, i) => {
  switch (colorSet.toLowerCase()) {
    case "default":
      return defaultColors[i % defaultColors.length];
    case "basic":
      return basicColors[i % basicColors.length];
    case "extended":
      return extendedColors[i % extendedColors.length];
    case "bright":
      return brightColors[i % brightColors.length];
    case "dark":
      return darkColors[i % darkColors.length];
    case "gray":
      return grayColors[i % grayColors.length];
    case "colorblind":
      return colorBlindColors[i % colorBlindColors.length];
    // case "patterns":
    //   return `url(#${patterns[i % patterns.length]})`;
    default:
      return defaultColors[i % defaultColors.length];
  }
};

export default assignColors;
