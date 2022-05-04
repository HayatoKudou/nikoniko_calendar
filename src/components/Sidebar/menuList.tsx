import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

export const menuList = [
  { name: "dashboard", title: "ダッシュボード" },
  { name: "profile", title: "プロフィール" },
];

const MenuListIcon = (props: { name: string }) => {
  return props.name === "dashboard" ? (
    <DashboardIcon />
  ) : props.name === "profile" ? (
    <AccountBoxIcon />
  ) : (
    <></>
  );
};

export default MenuListIcon;
