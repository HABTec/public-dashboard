import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

const sampleData = [
  { year: 2016, label: 'Meskerem 2016' },
  { year: 2017, label: 'Meskerem 2017' },
  { year: 2018, label: 'Meskerem 2018' },
  { year: 2019, label: 'Meskerem 2019' },
  { year: 2020, label: 'Meskerem 2020' },
  { year: 2021, label: 'Meskerem 2021' },
  { year: 2022, label: 'Meskerem 2022' },
];

const Timeline = ({ mapData_ = sampleData, onTimeChange }) => {
  const [selectedYear, setSelectedYear] = useState(mapData_[0]?.year || 2020);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    onTimeChange(newYear);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setSelectedYear((prevYear) => {
          const currentIndex = mapData_.findIndex((data) => data.year === prevYear);
          const nextIndex = currentIndex + 1;

          if (nextIndex >= mapData_.length) {
            clearInterval(interval);
            setIsPlaying(false);
          } else {
            const nextYear = mapData_[nextIndex]?.year;
            onTimeChange(nextYear);
            return nextYear;
          }

          return prevYear;
        });
      }, 1000); // Adjust speed as needed
      return () => clearInterval(interval);
    }
  }, [isPlaying, mapData_, onTimeChange]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', overflow:"wrap" }}>
      {/* Rectangular timeline boxes */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {mapData_.map((data) => (
          <Box
            key={data.year}
            sx={{
              flexGrow: 1,
              height: '40px',
              backgroundColor: selectedYear === data.year ? '#4caf50' : '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              padding: '8px',
              border: '1px solid #000',  // Add a black border between boxes
              borderRight: 'none', // Remove the right border for all except the last box
            }}
            onClick={() => handleYearChange(data.year)}
            title={data.label}
          >
            {/* {data.label} */}
          </Box>
        ))}
        {/* Add right border to the last box */}
        <Box
          sx={{
            height: '40px',
            width: '0px',
            borderRight: '1px solid #000',
          }}
        />
      </Box>

      {/* Play/Pause Button */}
      <Button variant="contained" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </Box>
  );
};

export default Timeline;
