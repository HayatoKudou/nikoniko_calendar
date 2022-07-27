import { AccountCircle } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import * as React from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import StyleSetting from "../style_setting";
import MenuList from "./menuList";
import MenuList2 from "./menuList2";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar(props: { children: any }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = router.pathname;
  const me = useRecoilValue(useMe);
  const resetMe = useResetRecoilState(useMe);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openLogoutConfirm, setOpenLogoutConfirm] = React.useState<boolean>(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const logout = () => {
    resetMe();
    router.push("/sign-in");
  };

  const isMenuOpen = Boolean(anchorEl);
  const renderMenu = (
    <Menu anchorEl={anchorEl} color="inherit" open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem onClick={() => router.push(`/${me.clientId}/profile`)}>プロフィール設定</MenuItem>
      {me.role.is_client_manager && <MenuItem onClick={() => router.push(`/${me.clientId}/client-profile`)}>組織設定</MenuItem>}
      <MenuItem onClick={() => setOpenLogoutConfirm(true)}>ログアウト</MenuItem>
      <ConfirmDialog message={"ログアウトしますか？"} open={openLogoutConfirm} onClose={() => setOpenLogoutConfirm(false)} handleSubmit={logout} />
    </Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: theme.palette.mode === "light" ? "#455a64" : "" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            onClick={() => router.push(`/${me.clientId}/dashboard`)}
            sx={{ flexGrow: 1, alignSelf: "flex-end", margin: "auto 0" }}
          >
            Read Worth
          </Typography>
          {(pathname === "/sign-up" || pathname === "/sign-in") && (
            <Box sx={{ marginLeft: "auto" }}>
              <Button color="inherit" onClick={() => router.push("/sign-up")} sx={{ fontSize: "1rem" }}>
                新規登録
              </Button>
              <Button color="inherit" onClick={() => router.push("/sign-in")} sx={{ fontSize: "1rem" }}>
                ログイン
              </Button>
            </Box>
          )}
          <StyleSetting />
          {me.id && (
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <AccountCircle sx={{ fontSize: "30px" }} />
            </IconButton>
          )}
          {renderMenu}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>{theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
        </DrawerHeader>
        <MenuList open={open} />
        <Divider />
        <MenuList2 open={open} />
      </Drawer>
      <Box sx={{ width: "100%", margin: "72px auto 0 auto", padding: 2 }}>{props.children}</Box>
    </Box>
  );
}
