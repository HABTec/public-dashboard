import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

const PredefinedColorLegend = ({ legendSet }) => {
  const sortedLegends = useMemo(() => {
    return [...(legendSet.legends || [])].sort(
      (a, b) => a.startValue - b.startValue
    );
  }, [legendSet.legends]);

  return (
    <TableContainer key="legend-set">
      <Table aria-label="legend table">
        <TableRow>
          <TableCell colSpan={3} align="center">
            {legendSet.name}
          </TableCell>
        </TableRow>
        <TableBody>
          {sortedLegends.map((row) => (
            <TableRow key={row.name}>
              <TableCell sx={{ backgroundColor: row.color, width: "2px" }} />
              <TableCell>
                {row.name} <br />
                <Typography variant="caption">
                  {row.startValue} - {row.endValue}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PredefinedColorLegend;
