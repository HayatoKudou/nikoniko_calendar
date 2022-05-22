import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleIcon from "@mui/icons-material/People";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import * as React from "react";
import { useRecoilState } from "recoil";
import { useMe } from "../../store/me";
import { useColorMode } from "../../store/styles/color_mode";

const MenuListIcon = (props: { name: string }) => {
  const [colorMode, setColorMode] = useRecoilState(useColorMode);
  const theme = useTheme();

  const handleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return props.name === "dashboard" ? (
    <DashboardIcon />
  ) : props.name === "users" ? (
    <PeopleIcon />
  ) : props.name === "profile" ? (
    <ManageAccountsIcon />
  ) : props.name === "paletteMode" ? (
    theme.palette.mode === "dark" ? (
      <Brightness7Icon onClick={handleColorMode} />
    ) : (
      <Brightness4Icon onClick={handleColorMode} />
    )
  ) : (
    <></>
  );
};

const MenuList = (props: { open: boolean }) => {
  const theme = useTheme();
  const router = useRouter();
  const [me] = useRecoilState(useMe);

  const colorModeName = () => {
    if (theme.palette.mode === "dark") {
      return "ライトモード";
    } else if (theme.palette.mode === "light") {
      return "ダークモード";
    }
  };
  const name = colorModeName();

  const routePush = (path: string | null) => {
    if (path) {
      router.push(path);
    }
  };

  let menuList = [];

  if (me) {
    menuList = [
      { name: "dashboard", title: "ダッシュボード", path: `/${me.clientId}/dashboard` },
      { name: "users", title: "ユーザー管理", path: `/${me.clientId}/users` },
      { name: "profile", title: "プロフィール", path: `/${me.clientId}/profile` },
      { name: "paletteMode", title: name, path: null },
    ];
  } else {
    menuList = [{ name: "paletteMode", title: name, path: null }];
  }

  return (
    <List>
      {menuList.map((menu, index) => (
        <ListItemButton
          onClick={() => routePush(menu.path)}
          key={index}
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
            <MenuListIcon name={menu.name} />
          </ListItemIcon>
          <ListItemText primary={menu.title} sx={{ opacity: props.open ? 1 : 0 }} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default MenuList;
