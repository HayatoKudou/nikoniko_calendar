import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import * as React from "react";

interface Props {
  open: boolean;
  selected: boolean;
  listItemText?: string;
  icon: any;
  handleSelect: () => void;
}

const Index = (props: Props) => {
  const theme = useTheme();
  return (
    <ListItemButton
      onClick={props.handleSelect}
      sx={{
        minHeight: 48,
        justifyContent: props.open ? "initial" : "center",
        px: 2.5,
        "&.Mui-selected": {
          backgroundColor: theme.palette.mode === "light" ? "#455a6478" : "",
        },
      }}
      selected={props.selected}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: props.open ? 3 : "auto",
          justifyContent: "center",
        }}
      >
        {props.icon}
      </ListItemIcon>
      <ListItemText primary={props.listItemText} sx={{ opacity: props.open ? 1 : 0 }} />
    </ListItemButton>
  );
};

export default Index;
