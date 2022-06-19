import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BusinessIcon from "@mui/icons-material/Business";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
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

  switch (props.name) {
    case "dashboard":
      return <DashboardIcon />;
    case "books":
      return <LibraryBooksIcon />;
    case "users":
      return <PeopleIcon />;
    case "profile":
      return <ManageAccountsIcon />;
    case "clientProfile":
      return <BusinessIcon />;
    case "paletteMode":
      if (theme.palette.mode === "dark") {
        return <Brightness7Icon onClick={handleColorMode} />;
      } else {
        return <Brightness4Icon onClick={handleColorMode} />;
      }
    default:
      return <></>;
  }
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

  let menuList: { name: string; title: string | undefined; path: string | null }[] = [];

  if (me) {
    menuList = [
      { name: "dashboard", title: "ダッシュボード", path: `/${me.clientId}/dashboard` },
      { name: "books", title: "書籍管理", path: `/${me.clientId}/books` },
    ];
    if (me.role.is_account_manager) menuList.push({ name: "users", title: "ユーザー管理", path: `/${me.clientId}/users` });
    menuList.push({ name: "profile", title: "プロフィール", path: `/${me.clientId}/profile` });
    if (me.role.is_client_manager) menuList.push({ name: "clientProfile", title: "組織設定", path: `/${me.clientId}/client-profile` });
  }
  menuList.push({ name: "paletteMode", title: name, path: null });

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
