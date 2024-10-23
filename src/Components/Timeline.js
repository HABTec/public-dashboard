import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Timeline = ({ timelineData, onTimeChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(
    timelineData[0]?.year + timelineData[0]?.month + timelineData[0]?.day
  );
  const [isPlaying, setIsPlaying] = useState(false);

  // Check if the current period is the last period in the timelineData array
  const isLastPeriod = () => {
    const lastPeriod =
      timelineData[timelineData.length - 1]?.year +
      timelineData[timelineData.length - 1]?.month +
      timelineData[timelineData.length - 1]?.day;
    return selectedPeriod === lastPeriod;
  };

  // Handle play/pause button toggle
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (isLastPeriod()) {
        const firstYear = timelineData[0]?.year;
        const firstMonth = timelineData[0]?.month;
        const firstDay = timelineData[0]?.day;
        handleYearChange(firstYear, firstMonth, firstDay, 0);
      }
      setIsPlaying(true);
    }
  };

  // Handle changing the selected period and trigger onTimeChange callback
  const handleYearChange = (newYear, newMonth, newDay = "", index) => {
    setSelectedPeriod(newYear + newMonth + newDay);
    onTimeChange(newYear, newMonth, newDay, index);
  };

  // Automatically play the timeline in intervals
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setSelectedPeriod((prevPeriod) => {
          const currentIndex = timelineData.findIndex(
            (data) => data.year + data.month + data.day === prevPeriod
          );
          const nextIndex = currentIndex + 1;

          if (nextIndex >= timelineData.length) {
            clearInterval(interval);
            setIsPlaying(false);
            return prevPeriod;
          }

          const nextYear = timelineData[nextIndex]?.year;
          const nextMonth = timelineData[nextIndex]?.month;
          const nextDay = timelineData[nextIndex]?.day;
          onTimeChange(nextYear, nextMonth, nextDay, nextIndex);
          return nextYear + nextMonth + nextDay; 
        });
      }, 1000);

      return () => clearInterval(interval); 
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
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        {timelineData.map((data, index) => {
          const displayYear =
            index === 0 || timelineData[index - 1].year !== data.year; 

          return (
            <Box
              key={`${data.year}-${data.month}-${index}`}
              display={"flex"}
              flexDirection={"column"}
              width={"100%"}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  height: "2rem",
                  backgroundColor:
                    selectedPeriod === data.year + data.month + data.day
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
                onClick={() =>
                  handleYearChange(data.year, data.month, data.day, index)
                }
                title={data.label}
              />

              <Box
                sx={{
                  height: "0.5rem",
                  width: "0px",
                  borderRight: "1px solid #000",
                }}
              />
              {displayYear ? (
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "10px",
                    marginBottom: "2px",
                  }}
                >
                  {data.year}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "10px", marginBottom: "2px" }}>
                  {months[data.month - 1]}
                </Typography>
              )}
            </Box>
          );
        })}

        
        <Box
          sx={{
            height: "2.5rem",
            width: "0px",
            borderRight: "1px solid #000",
          }}
        />
      </Box>

      {/* Play/Pause Button */}
      <Button variant="outline" onClick={handlePlay}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </Button>
    </Box>
  );
};

export default Timeline;
