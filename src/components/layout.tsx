import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useMe } from "../store/me";
import { useColorMode } from "../store/styles/color_mode";
import Sidebar from "./sidebar";
import AuthenticatedAccount from "../api/me";
import {CssBaseline} from "@mui/material";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const [me, setMe] = useRecoilState(useMe);
  const colorMode = useRecoilValue(useColorMode);
  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });

  React.useEffect(() => {
    const authExclusionPath = ["/sign-in", "/forget-password", "/password-setting"];
    const pathname = router.pathname;
    if (!authExclusionPath.includes(pathname) && !pathname.match(/reset-password/)) {
      if (!me || me.id === null) {
        router.push("/sign-in");
      }
      authenticatedAccount();
      if (me && me.clientId && pathname === "/") {
        router.push(`/${me.clientId}/dashboard`);
      }
    }
  }, []);

  const authenticatedAccount = () => {
    AuthenticatedAccount(me.clientId, me.apiToken)
      .then((res) => {
        setMe(res.user);
      })
      .catch(() => {
        router.push("/sign-in");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sidebar>{children}</Sidebar>
    </ThemeProvider>
  );
};

// @ts-ignore
export default Layout;
