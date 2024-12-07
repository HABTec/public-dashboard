import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Timeline = ({ timelineData, onTimeChange }) => {
  console.log("current timeline update", timelineData);
  const [label, setLabel] = useState(timelineData[0]?.timePeriod.label);

  const [selectedPeriod, setSelectedPeriod] = useState(
    timelineData[0]?.timePeriod?.start?.year +
      timelineData[0]?.timePeriod?.start?.month +
      (timelineData[0]?.timePeriod?.start?.day || "")
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const shortMonthsName = {
    Meskerem: "Mes",
    Tikemet: "Tik",
    Hidar: "Hid",
    Tahesas: "Tah",
    Yekatit: "Yek",
    Megabit: "Meg",
    Miazia: "Mia",
    Ginbot: "Gin",
    Sene: "Sen",
    Hamle: "Ham",
    Nehase: "Neh",
  };

  // Check if the current period is the last in the timelineData array
  const isLastPeriod = () => {
    const lastPeriod =
      timelineData[timelineData.length - 1]?.timePeriod?.start?.year +
      timelineData[timelineData.length - 1]?.timePeriod?.start?.month +
      (timelineData[timelineData.length - 1]?.timePeriod?.start?.day || "");
    return selectedPeriod === lastPeriod;
  };

  // Handle play/pause toggle

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (isLastPeriod()) {
        const firstTimePeriod = timelineData[0]?.timePeriod?.start;
        const firstLabel = timelineData[0]?.timePeriod?.label;
        handleYearChange(
          firstTimePeriod?.year,
          firstTimePeriod?.month,
          firstTimePeriod?.day || "",
          firstLabel,
          0
        );
      }
      setIsPlaying(true);
    }
  };

  // Handle year change and trigger onTimeChange callback
  const handleYearChange = (year, month, day = "", label, index) => {
    setSelectedPeriod(year + month + day);
    onTimeChange(year, month, day, index);
    setLabel(label);
  };

  // Automatically play the timeline
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setSelectedPeriod((prevPeriod) => {
          const currentIndex = timelineData.findIndex(
            (data) =>
              data.timePeriod.start.year +
                data.timePeriod.start.month +
                (data.timePeriod.start.day || "") ===
              prevPeriod
          );

          const nextIndex = currentIndex + 1;

          if (nextIndex >= timelineData.length) {
            clearInterval(interval);
            setIsPlaying(false);
            setLabel(timelineData[0]?.timePeriod.label); // Reset label to the first entry
            return prevPeriod;
          } else {
            setLabel(timelineData[nextIndex]?.timePeriod.label); // Update label for next entry
          }

          const nextTimePeriod = timelineData[nextIndex]?.timePeriod.start;
          onTimeChange(
            nextTimePeriod.year,
            nextTimePeriod.month,
            nextTimePeriod.day || "",
            nextIndex
          );
          return (
            nextTimePeriod.year +
            nextTimePeriod.month +
            (nextTimePeriod.day || "")
          );
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, timelineData, onTimeChange]);

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          bottom: "6rem",
          left: "46%",
          backgroundColor: "white",
          width: "fit-content",
          height: "fit-content",
          zIndex: 1000,
          padding: "0.5rem",
          boxShadow: 2,
          borderRadius: "12px",
        }}
      >
        <Typography sx={{ fontSize: "0.9rem", marginBottom: "2px" }}>
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
          overflow: "wrap",
          paddingTop: "0.5rem",
        }}
      >
        {/* Play/Pause Button */}
        <Button variant="outline" onClick={handlePlay}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </Button>
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
            const start = data.timePeriod.start;
            const displayYear =
              index === 0 ||
              timelineData[index - 1].timePeriod.start.year !== start.year ||
              index === data.length - 1;

            return (
              <Box
                key={`${start.year}-${start.month}-${index}`}
                display={"flex"}
                flexDirection={"column"}
                width={"100%"}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    height: "1rem",
                    backgroundColor:
                      selectedPeriod ===
                      start?.year + start?.month + (start?.day || "")
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
                    handleYearChange(
                      start.year,
                      start.month,
                      start.day || "",
                      data.timePeriod.label,
                      index
                    )
                  }
                  title={data.timePeriod.label}
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
                    {start.year || " "}
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: "10px", marginBottom: "2px" }}>
                    {start.month.length > 3
                      ? shortMonthsName[start.month] + " " + (start.day || "")
                      : start.month + " " + (start.day || "")}
                  </Typography>
                )}
              </Box>
            );
          })}

          <Box
            sx={{
              height: "1.1rem",
              width: "0px",
              borderRight: "1px solid #000",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Timeline;
