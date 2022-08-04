import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import * as React from "react";
import { useRecoilState } from "recoil";
import AuthenticatedAccount from "../api/me";
import { useMe } from "../store/me";
import { useColorMode } from "../store/styles/color_mode";
import Sidebar from "./sidebar";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const [me, setMe] = useRecoilState(useMe);
  const [colorMode] = useRecoilState(useColorMode);
  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });

  const authenticatedAccount = () => {
    AuthenticatedAccount()
      .then((res) => {
        setMe(res.user);
      })
      .catch(() => {
        router.push("/sign-in");
      });
  };

  const authExclusionPath = ["/sign-up", "/sign-in", "/forget-password", "/password-setting"];
  const pathname = router.pathname;
  if (!authExclusionPath.includes(pathname) && !pathname.match(/reset-password/)) {
    authenticatedAccount();
    if (me && me.clientId && pathname === "/") {
      router.push(`/${me.clientId}/dashboard`);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Sidebar>{children}</Sidebar>
    </ThemeProvider>
  );
};

// @ts-ignore
export default Layout;
