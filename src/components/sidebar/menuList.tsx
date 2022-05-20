import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardIcon from "@mui/icons-material/Dashboard";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import * as React from "react";
import { useRecoilState } from "recoil";
import { useColorMode } from "../../store/styles/color_mode";
import useLocalStorage from "../../util/use_local_storage";

const MenuListIcon = (props: { name: string }) => {
  const [colorMode, setColorMode] = useRecoilState(useColorMode);
  const theme = useTheme();

  const handleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return props.name === "dashboard" ? (
    <DashboardIcon />
  ) : props.name === "users" ? (
    <AccountBoxIcon />
  ) : props.name === "profile" ? (
    <AccountBoxIcon />
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
  const [user] = useLocalStorage("user", null);

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

  if (user) {
    menuList = [
      { name: "dashboard", title: "ダッシュボード", path: `/${user.clientId}/dashboard` },
      { name: "users", title: "ユーザー管理", path: `/${user.clientId}/users` },
      { name: "profile", title: "プロフィール", path: `/${user.clientId}/profile` },
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
