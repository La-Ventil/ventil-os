"use client";

import * as React from "react";
import MuiBottomNavigation, {
  BottomNavigationProps as MuiBottomNavigationProps,
} from "@mui/material/BottomNavigation";
import { styled } from "@mui/material/styles";
import { BottomNavigationAction, Paper } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const StyledBottomNavigation = styled(
  MuiBottomNavigation,
)<MuiBottomNavigationProps>(({ theme }) => ({
  color: theme.palette.success.main,
}));

export default function BottomNavigation() {
  const [value, setValue] = React.useState("recents");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <StyledBottomNavigation
        sx={{ width: 500 }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction
          label="Folder"
          value="folder"
          icon={<FolderIcon />}
        />
      </StyledBottomNavigation>
    </Paper>
  );
}
