import React from "react";

const CustomBarLabel = (props) => {
  const { x, y, width, height } = props.style;

  const labelY = y.get() - height.get() / 2 - 5;
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Wait for values to initialize

  return (
    <text
      x={x.get()}
      y={labelY} // Adjust label above the bar
      textAnchor="middle"
      fill={props.color || "black"}
      fontSize={"1.1rem"}
    >
      {props.children}
    </text>
  );
};

export default CustomBarLabel;
