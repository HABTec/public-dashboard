import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import OrgUnitFilter from "./OrgUnitFilter";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import useSetting from "../hooks/useSettings";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const useCache = (key, fetcher, dependencies = []) => {
  const [cachedData, setCachedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem(key);

      if (storedData) {
        setCachedData(JSON.parse(storedData));
      } else {
        try {
          const data = await fetcher();
          localStorage.setItem(key, JSON.stringify(data));
          console.log("orgUnitData", data, localStorage.getItem(key));
          setCachedData(data);
        } catch (error) {
          console.error(`Error fetching data for ${key}:`, error);
        }
      }
    };

    fetchData();
  }, [key, ...dependencies]);

  return cachedData;
};

const OrgUnitFilterModal = ({ onConfirmed, settings }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const apiBase = process.env.REACT_APP_BASE_URI;
  const [selected, setSelected] = useState([]);
  const [selectedOrgUnitGroup, setSelectedOrgUnitGroup] = useState([]);
  const [selectedOrgUnitLevel, setSelectedOrgUnitLevel] = useState([]);
  const [hideEmptyCharts, setHideEmptyCharts] = useState(false);

  useEffect(() => {
    if (!settings) return;

    // Function to clear the relevant cached items
    const invalidateCache = () => {
      console.log("Invalidating cache due to settings change");
      localStorage.removeItem("orgUnitData");
      localStorage.removeItem("orgUnitGroups");
      localStorage.removeItem("orgUnitLevels");
    };

    invalidateCache();
  }, [settings]);

  const fetchData = async () => {
    const url = `${apiBase}api/organisationUnits/b3aCK1PTn5S?fields=displayName,path,id,children[id,path,displayName]&paging=false$${
      settings?.orgUnitLimit?.level
        ? `&filter=children.level:lt:${settings?.orgUnitLimit?.level}`
        : ""
    }`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch organisation units");
      const fetchedData = await response.json();
      const updatedData = await hasChildren(fetchedData.children);
      setData({ ...fetchedData, children: updatedData });
      console.log(
        "real orgUnitData",
        { ...fetchedData, children: updatedData },
        "fetchedData",
        fetchedData
      );
      localStorage.setItem(
        "orgUnitData",
        JSON.stringify({ ...fetchedData, children: updatedData })
      );
    } catch (error) {
      console.error("Error fetching organisation units:", error);
    }
  };

  const fetchOrgUnitGroups = async () => {
    if (settings?.orgUnitLimit?.groups) {
      return settings.orgUnitLimit.groups;
    } else {
      const url = `${apiBase}api/organisationUnitGroups?paging=false`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      return data.organisationUnitGroups;
    }
  };

  const fetchOrgUnitLevels = async () => {
    console.log("settings loaded: ", settings);
    const url = `${apiBase}api/organisationUnitLevels?paging=false${
      settings?.orgUnitLimit?.level
        ? `&filter=level:lt:${settings?.orgUnitLimit?.level}`
        : ""
    }`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data.organisationUnitLevels;
  };

  const orgUnitGroups = useCache("orgUnitGroups", fetchOrgUnitGroups, [
    settings,
  ]);
  const orgUnitLevels = useCache("orgUnitLevels", fetchOrgUnitLevels, [
    settings,
  ]);

  const hasChildren = async (nodes) => {
    console.log("nodes:", nodes);
    for (const node of nodes) {
      const urlChildren = `${apiBase}api/organisationUnits/${
        node.id
      }?fields=path,children%3A%3Asize${
        settings?.orgUnitLimit?.level
          ? `&filter=children.level:lt:${settings?.orgUnitLimit?.level}&filter=level:lt:${settings?.orgUnitLimit?.level}`
          : ""
      }`;

      const response = await fetch(urlChildren);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      let dataLoaded = await response.text();

      if ("" === dataLoaded) {
        node.hasChildren = false;
      } else {
        const data = JSON.parse(dataLoaded);
        if (parseInt(data.children) > 0) {
          node.hasChildren = true;
        }
      }
    }
    return nodes;
  };

  useEffect(() => {
    if (settings == null || !open || (open && data != null)) return;

    const cachedOrgUnitData = localStorage.getItem("orgUnitData");
    if (cachedOrgUnitData) {
      setData(JSON.parse(cachedOrgUnitData));
    } else {
      fetchData();
    }
  }, [settings, open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirmed(
      selected,
      selectedOrgUnitGroup,
      selectedOrgUnitLevel,
      hideEmptyCharts
    );
    setOpen(false);
  };

  const handelClearFitler = () => {
    setSelected(() => []);
    setSelectedOrgUnitGroup(() => []);
    setSelectedOrgUnitLevel(() => []);
    setHideEmptyCharts(false);
    onConfirmed([], [], [], false);
  };

  const filterCount =
    selected.length +
    selectedOrgUnitGroup.length +
    selectedOrgUnitLevel.length +
    hideEmptyCharts;
  const hasFilters = filterCount > 0;

  return (
    <Box minHeight="2rem">
      {/*<div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
          marginRight: " 2%",
          gap: "2%",
        }}
      >
         <Tooltip
          arrow={false}
          color="neutral"
          placement="bottom"
          size="sm"
          variant="plain"
          title="Apply Filter"
        >
          <IconButton
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleClickOpen}
            aria-label="filter org unit"
          >
            <Badge
              badgeContent={filterCount}
              color="secondary"
              visiable={hasFilters}
              title="Number of Filters Applied"
            >
              <FilterListIcon sx={{ color: "black" }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {hasFilters ? (
          <Tooltip
            arrow={false}
            color="neutral"
            placement="bottom"
            size="sm"
            variant="plain"
            title="Clear Filter"
          >
            <IconButton
              size="small"
              variant="outlined"
              aria-label="clear filter"
              color="secondary"
              onClick={handelClearFitler}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        ) : (
          ""
        )} 
      </div>*/}
      <MenuItem>
        <ListItemIcon>
          <Tooltip
            arrow={false}
            color="neutral"
            placement="bottom"
            size="sm"
            variant="plain"
            title="Apply Filter"
          >
            <Badge
              badgeContent={filterCount}
              visiable={hasFilters}
              title="Number of Filters Applied"
            >
              <FilterListIcon onClick={handleClickOpen} />
            </Badge>
          </Tooltip>

          {hasFilters ? (
            <Tooltip
              arrow={false}
              color="neutral"
              placement="bottom"
              size="sm"
              variant="plain"
              title="Clear Filter"
            >
              <IconButton
                size="small"
                variant="outlined"
                aria-label="clear filter"
                color="secondary"
                onClick={handelClearFitler}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
        </ListItemIcon>
        <ListItemText onClick={handleClickOpen} primary="Filter" />
      </MenuItem>
      <Dialog
        sx={{ minHeight: "50vh", padding: "10px" }}
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography
            sx={{ padding: "10px", fontWeight: "bold", fontSize: "1.2rem" }}
          >
            Organization Unit
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "50vh", padding: "10px" }} dividers>
          {data ? (
            <OrgUnitFilter
              data={data}
              orgUnitGroups={orgUnitGroups}
              orgUnitLevels={orgUnitLevels}
              selected={selected}
              setSelected={setSelected}
              selectedOrgUnitGroup={selectedOrgUnitGroup}
              setSelectedOrgUnitGroup={setSelectedOrgUnitGroup}
              selectedOrgUnitLevel={selectedOrgUnitLevel}
              setSelectedOrgUnitLevel={setSelectedOrgUnitLevel}
              hideEmptyCharts={hideEmptyCharts}
              setHideEmptyCharts={setHideEmptyCharts}
              settings={settings}
            />
          ) : (
            <CircularProgress size={24} />
          )}
        </DialogContent>
        <DialogActions>
          <Button color={"primary"} autoFocus onClick={handleConfirm}>
            Confirm
          </Button>
          <Button color={"inherit"} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrgUnitFilterModal;
