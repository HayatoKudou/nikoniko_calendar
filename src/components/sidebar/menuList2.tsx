import LogoutIcon from "@mui/icons-material/Logout";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/router";
import * as React from "react";
import { useResetRecoilState } from "recoil";
import { useMe } from "../../store/me";

const MenuList2 = (props: { open: boolean }) => {
  const router = useRouter();
  const resetMe = useResetRecoilState(useMe);
  const logout = () => {
    resetMe();
    router.push("/sign-in");
  };
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
          onClick={logout}
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
