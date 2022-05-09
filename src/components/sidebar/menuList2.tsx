import LogoutIcon from "@mui/icons-material/Logout";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

const MenuList2 = (props: { open: boolean }) => {
  return (
    <List>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: props.open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: props.open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary={"ログアウト"} sx={{ opacity: props.open ? 1 : 0 }} />
      </ListItemButton>
    </List>
  );
};

export default MenuList2;
