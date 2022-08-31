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
import { useChoseClient } from "../../store/choseClient";
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
  const choseClient = useRecoilValue(useChoseClient);
  const [selectedPath, setSelectedPath] = React.useState<string>("");
  const menuList = [
    { name: "dashboard", title: "ダッシュボード", path: `/${choseClient.clientId}/dashboard` },
    { name: "books", title: "書籍管理", path: `/${choseClient.clientId}/books` },
    { name: "users", title: "ユーザー管理", path: `/${choseClient.clientId}/users` },
    me.role.isBookManager && { name: "purchaseApplies", title: "書籍購入申請", path: `/${choseClient.clientId}/purchase-applies` },
  ];

  React.useEffect(() => {
    setSelectedPath(router.asPath);
  }, [router]);

  const handleSelect = (path: string) => {
    router.push(path).then(() => setSelectedPath(path));
  };

  return (
    <List component="div">
      {menuList.map((menu, index) => (
        <ListItemButton
          onClick={() => handleSelect(menu.path)}
          key={index}
          sx={{
            minHeight: 48,
            justifyContent: props.open ? "initial" : "center",
            px: 2.5,
            "&.Mui-selected": {
              backgroundColor: theme.palette.mode === "light" ? "#455a6478" : "",
            },
          }}
          selected={selectedPath == menu.path}
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
