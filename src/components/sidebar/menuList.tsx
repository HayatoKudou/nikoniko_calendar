import BusinessIcon from "@mui/icons-material/Business";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleIcon from "@mui/icons-material/People";
import List from "@mui/material/List";
import { useRouter } from "next/router";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { useMe } from "../../store/me";
import ListItemButton from "./listItemButton";

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
  const router = useRouter();
  const me = useRecoilValue(useMe);
  const [selectedPath, setSelectedPath] = React.useState<string>("");
  const menuList = [
    { name: "dashboard", title: "ダッシュボード", path: `/dashboard` },
    { name: "books", title: "書籍管理", path: `/books` },
    { name: "users", title: "ユーザー管理", path: `/users` },
  ];
  if (me.role.isBookManager) {
    menuList.push({ name: "purchaseApplies", title: "書籍購入申請", path: `/purchase-applies` });
  }

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
          key={index}
          open={props.open}
          listItemText={menu.title}
          selected={selectedPath == menu.path}
          icon={<MenuListIcon name={menu.name} />}
          handleSelect={() => handleSelect(menu.path)}
        />
      ))}
    </List>
  );
};

export default MenuList;
