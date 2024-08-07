import React from "react";
import { Description } from "@mui/icons-material";
import { Box } from "@mui/material";

const ResourceComponent = ({ resourcesItems }) => {
  const apiBase = process.env.REACT_APP_BASE_URI;

  const handleItemClick = (id, name) => {
    const url = `${apiBase}api/documents/${id}/data`;
    fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fileName = name;

        return response.blob().then((blob) => ({ blob, fileName }));
      })
      .then(({ blob, fileName }) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const items = resourcesItems;
  return (
    <div>
      {items.map((item) => {
        return (
          <Box
            key={item.id}
            onClick={() => handleItemClick(item.id, item.name)}
            sx={{
              cursor: "pointer",
              color: "blue",
              display: "flex",
              alignItems: "center",
              position: "relative",
              transition: "top 0.1s ease-in-out",
              gap: 1,
              transition: "all 0.01s ease",
              "&:hover": {
                fontWeight: "bold",
                textDecoration: "underline",
              },
              "&:active": {
                top: "2px",
              },
            }}
          >
            <Description /> {item.name}
          </Box>
        );
      })}
    </div>
  );
};

export default ResourceComponent;
