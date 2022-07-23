import BusinessIcon from "@mui/icons-material/Business";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleIcon from "@mui/icons-material/People";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { useMe } from "../../store/me";

const MenuListIcon = (props: { name: string }) => {
  switch (props.name) {
    case "dashboard":
      return <DashboardIcon />;
    case "books":
      return <LibraryBooksIcon />;
    case "purchaseApplies":
      return <LocalPostOfficeIcon />;
    case "users":
      return <PeopleIcon />;
    case "profile":
      return <ManageAccountsIcon />;
    case "clientProfile":
      return <BusinessIcon />;
    default:
      return <></>;
  }
};

const MenuList = (props: { open: boolean }) => {
  const theme = useTheme();
  const router = useRouter();
  const me = useRecoilValue(useMe);
  const [selected, setSelected] = React.useState<string>();

  React.useEffect(() => {
    setSelected(router.asPath);
  }, []);

  const handleSelect = (path: string | null) => {
    if (path) {
      setSelected(path);
      router.push(path);
    }
  };

  let menuList: { name: string; title: string | undefined; path: string | null }[] = [];

  if (me) {
    menuList = [
      { name: "dashboard", title: "ダッシュボード", path: `/${me.clientId}/dashboard` },
      { name: "books", title: "書籍管理", path: `/${me.clientId}/books` },
      { name: "purchaseApplies", title: "書籍購入申請", path: `/${me.clientId}/purchase-applies` },
      { name: "users", title: "ユーザー管理", path: `/${me.clientId}/users` },
      { name: "profile", title: "プロフィール", path: `/${me.clientId}/profile` },
    ];
    if (me.role.is_client_manager) menuList.push({ name: "clientProfile", title: "組織設定", path: `/${me.clientId}/client-profile` });
  }

  return (
    <List>
      {menuList.map((menu, index) => (
        <ListItemButton
          onClick={() => handleSelect(menu.path)}
          key={index}
          sx={{
            minHeight: 48,
            justifyContent: props.open ? "initial" : "center",
            px: 2.5,
            "&.Mui-selected": {
              backgroundColor: theme.palette.mode === "light" ? "#455a6494" : "",
            },
          }}
          selected={selected == menu.path}
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
