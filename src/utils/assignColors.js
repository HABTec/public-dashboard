const ColorPattern = () => (
  <svg>
    <defs>
      <pattern
        id="striped-pattern"
        width="10"
        height="4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="10" y2="0" stroke="#7BB4EC" strokeWidth="4" />
      </pattern>
      <pattern
        id="black-striped-pattern"
        width="10"
        height="4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-45)"
      >
        <line x1="0" y1="0" x2="10" y2="0" stroke="#000" strokeWidth="4" />
      </pattern>
      <pattern
        id="green-striped-pattern"
        width="10"
        height="4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(90)"
      >
        <line x1="0" y1="0" x2="10" y2="0" stroke="#90ED7D" strokeWidth="4" />
      </pattern>
      <pattern
        id="orange-striped-pattern"
        width="10"
        height="3"
        patternUnits="userSpaceOnUse"
      >
        <line x1="0" y1="0" x2="10" y2="0" stroke="#F7A35C" strokeWidth="4" />
      </pattern>
      <pattern
        id="staggered-branch-pattern"
        width="17"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="10"
          y1="0"
          x2="10"
          y2="20"
          stroke="#8085E8"
          stroke-width="4"
        />

        <rect x="2" y="4" width="7" height="10" fill="#8085E8" />

        <rect x="12" y="12" width="10" height="10" fill="#8085E8" />
      </pattern>
      <pattern
        id="zigzag-curve-pattern"
        width="20"
        height="15"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 0 7.5 C 2.5 2.5, 7.5 2.5, 10 7.5 C 12.5 12.5, 17.5 12.5, 20 7.5"
          stroke="#F15E81"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </pattern>
      <pattern
        id="yellow-boxes-pattern"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect
          x="1.5"
          y="1.5"
          width="10"
          height="10"
          fill="none"
          stroke="#E4D354"
          stroke-width="3"
        />
      </pattern>
      <pattern
        id="green-circles-pattern"
        width="13"
        height="13"
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx="6.5"
          cy="6.5"
          r="5"
          fill="none"
          stroke="#2C908F"
          stroke-width="3"
        />
      </pattern>

      <pattern
        id="diagonal-stripe-pattern"
        width="10"
        height="6"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="10" y2="0" stroke="#F35A5B" strokeWidth="4" />
      </pattern>
      <pattern
        id="diagonal-aqua-stripe-pattern"
        width="10"
        height="6"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(-45)"
      >
        <line x1="0" y1="0" x2="10" y2="0" stroke="#91E8E0" strokeWidth="4" />
      </pattern>
    </defs>
  </svg>
);

const defaultColors = [
  "#A7BF25",
  "#518CC2",
  "#D74554",
  "#FE9D22",
  "#968F8F",
  "#BA3AA1",
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
  "#BCF022",
  "#FFFAC4",
];

const basicColors = ["#338F41", "#9F2240", "#DDDDDD", "#B4A269"];
const extendedColors = [
  "#194F8F",
  "#AE1857",
  "#5A7E96",
  "#FEB71B",
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
  "black-striped-pattern",
  "green-striped-pattern",
  "orange-striped-pattern",
  "staggered-branch-pattern",
  "zigzag-curve-pattern",
  "yellow-boxes-pattern",
  "green-circles-pattern",
  "diagonal-stripe-pattern",
  "diagonal-aqua-stripe-pattern",
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
    case "patterns":
      return `url(#${patterns[i % patterns.length]})`;
    default:
      return defaultColors[i % defaultColors.length];
  }
};

export { assignColors, ColorPattern };
