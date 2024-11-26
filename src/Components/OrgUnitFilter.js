import React, { useState, useMemo } from "react";
import { Box, Checkbox, CircularProgress, Typography } from "@mui/material";
import { SimpleTreeView, TreeItem, treeItemClasses } from "@mui/x-tree-view";
import { styled, alpha } from "@mui/material/styles";
import FolderIcon from "@mui/icons-material/Folder";
import LevelGroupOrgUnitFilter from "./LevelGroupOrgUnitFilter";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const OrgUnitFilter = (props) => {
  const [expanded, setExpanded] = useState([]);
  const { selected, setSelected, settings } = props;
  const [data, setData] = useState({ ...props.data });
  const apiBase = process.env.REACT_APP_BASE_URI;

  // cache object to store fetched data
  const dataCache = useMemo(() => ({}), []);

  const fetchData = async (nodeId) => {
    if (dataCache[nodeId]) {
      return dataCache[nodeId];
    }

    const url = `${apiBase}api/organisationUnits/${nodeId}?fields=displayName,level,path,id,children%5Bid%2Cpath%2CdisplayName%5D ${
      settings?.orgUnitLimit?.level
        ? `&filter=children.level:lt:${settings?.orgUnitLimit?.level}&filter=level:lt:${settings?.orgUnitLimit?.level}`
        : ""
    }`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const dataLoaded = await response.text();

    if ("" === dataLoaded) {
      dataCache[nodeId] = {};
      return dataCache[nodeId];
    } else {
      const fetchedData = JSON.parse(dataLoaded);
      dataCache[nodeId] = fetchedData; // Cache the fetched data
      return fetchedData;
    }
  };

  const handleToggle = async (event, nodeIds) => {
    setExpanded(nodeIds);

    const nodeId = nodeIds;
    const fetchedData = await fetchData(nodeId);

    if (
      fetchedData &&
      fetchedData?.children &&
      fetchedData?.children?.length > 0
    ) {
      const updatedDataChildren = await hasChildren(fetchedData.children);
      const updatedData = { ...fetchedData, children: updatedDataChildren };
      const paths = updatedData?.path?.split("/")?.slice(2);
      const newData = updateData(paths, updatedData);

      setData(newData);
    }
  };

  const updateData = (path, updatedData) => {
    let tempData = { ...data };

    const addChildren = (node, i) => {
      if (i === path.length) {
        return { ...node, children: updatedData.children };
      }

      if (!node.children || node.hasChildren === false) {
        return node;
      }

      const updatedChildren = node.children.map((child) => {
        if (child.id === path[i]) {
          return addChildren(child, i + 1);
        }
        return child;
      });

      return { ...node, children: updatedChildren };
    };

    tempData = addChildren(tempData, 0);
    return tempData;
  };

  const hasChildren = async (nodes) => {
    const updatedNodes = [];

    for (const node of nodes) {
      const urlChildren = `${apiBase}api/organisationUnits/${node.id}?fields=path,level,children%3A%3Asize`;
      const response = await fetch(urlChildren);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const dataLoaded = await response.text();

      const updatedNode = { ...node };
      if ("" === dataLoaded) {
        updatedNode.hasChildren = false;
      } else {
        const data = JSON.parse(dataLoaded);
        updatedNode.hasChildren =
          parseInt(data.children) > 0 &&
          data.level < settings?.orgUnitLimit?.level - 1;
      }

      updatedNodes.push(updatedNode);
    }
    return updatedNodes;
  };

  const handleSelect = (event, nodeId) => {
    const isChecked = event.target.checked;
    setSelected((prevSelected) =>
      isChecked
        ? [...prevSelected, nodeId]
        : prevSelected.filter((id) => id !== nodeId)
    );
  };

  const renderTree = (nodes) => {
    return (
      <CustomTreeItem
        key={nodes.id}
        itemId={nodes.id}
        label={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={selected.includes(nodes.id)}
              onChange={(event) => handleSelect(event, nodes.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <FolderIcon />
            <Typography variant="body2" ml={1}>
              {nodes.displayName}
            </Typography>
          </Box>
        }
      >
        {Array.isArray(nodes.children) ? (
          nodes.children
            .sort((a, b) => (a?.displayName > b?.displayName ? 1 : -1))
            .map((node) => renderTree(node))
        ) : nodes.hasChildren ? (
          <CircularProgress size={24} />
        ) : null}
      </CustomTreeItem>
    );
  };

  const handleHideEmptyCharts = (event) => {
    props.setHideEmptyCharts(event.target.checked);
  };

  return (
    <Box>
      <SimpleTreeView
        onItemExpansionToggle={handleToggle}
        multiSelect
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          overflow: "auto",
        }}
      >
        {renderTree(data)}
      </SimpleTreeView>
      <LevelGroupOrgUnitFilter
        orgUnitGroups={props.orgUnitGroups}
        orgUnitLevels={props.orgUnitLevels}
        selectedOrgUnitGroup={props.selectedOrgUnitGroup}
        selectedOrgUnitLevel={props.selectedOrgUnitLevel}
        setSelectedOrgUnitGroup={props.setSelectedOrgUnitGroup}
        setSelectedOrgUnitLevel={props.setSelectedOrgUnitLevel}
      />

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={
          <Switch
            checked={props.hideEmptyCharts}
            onChange={handleHideEmptyCharts}
          />
        }
        label="Hide empty charts"
        sx={{ mx: 1 }}
      />
    </Box>
  );
};

export default OrgUnitFilter;
