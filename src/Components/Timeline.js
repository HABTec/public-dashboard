import React, { useState, useEffect } from "react";
import { Box, Button, Icon } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Timeline = ({ timelineData, onTimeChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(
    timelineData[0]?.year + timelineData[0]?.month
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const isLastPeriod = () => {
    const lastPeriod =
      timelineData[timelineData.length - 1]?.year +
      timelineData[timelineData.length - 1]?.month;
    return selectedPeriod === lastPeriod;
  };

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (isLastPeriod()) {
        const firstYear = timelineData[0]?.year;
        const firstMonth = timelineData[0]?.month;
        handleYearChange(firstYear, firstMonth, 0);
      }

      setIsPlaying(true);
    }
  };

  const handleYearChange = (newYear, newMonth, index) => {
    setSelectedPeriod(newYear + newMonth);
    onTimeChange(newYear, newMonth, index);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setSelectedPeriod((prevPeriod) => {
          const currentIndex = timelineData.findIndex(
            (data) => data.year + data.month === prevPeriod
          );
          const nextIndex = currentIndex + 1;

          if (nextIndex >= timelineData.length) {
            clearInterval(interval);
            setIsPlaying(false);
            return prevPeriod;
          }

          const nextYear = timelineData[nextIndex]?.year;
          const nextMonth = timelineData[nextIndex]?.month;
          onTimeChange(nextYear, nextMonth, nextIndex);
          return nextYear + nextMonth; // Move to next period
        });
      }, 1000); // Adjust speed as needed

      return () => clearInterval(interval); // Cleanup interval
    }
  }, [isPlaying, timelineData, onTimeChange]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: "100%",
        overflow: "wrap",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        {timelineData.map((data, index) => (
          <Box
            key={`${data.year} + ${data.month}`}
            sx={{
              flexGrow: 1,
              height: "40px",
              backgroundColor:
                selectedPeriod === data.year + data.month
                  ? "#4287f5"
                  : "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background-color 0.3s",
              padding: "8px",
              border: "1px solid #000",
              borderRight: "none",
            }}
            onClick={() => handleYearChange(data.year, data.month, index)}
            title={data.label}
          />
        ))}
        <Box
          sx={{
            height: "40px",
            width: "0px",
            borderRight: "1px solid #000",
          }}
        />
      </Box>

      <Button variant="outline" onClick={handlePlay}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </Button>
    </Box>
  );
};

export default Timeline;
