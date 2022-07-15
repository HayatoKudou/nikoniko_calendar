import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useState } from "react";
import * as React from "react";
import { useRecoilState } from "recoil";
import useAuthenticatedAccount from "../api/me";
import { useMe } from "../store/me";
import { useColorMode } from "../store/styles/color_mode";
import Spinner from "./parts/spinner";
import Sidebar from "./sidebar";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const [me, setMe] = useRecoilState(useMe);
  const [colorMode] = useRecoilState(useColorMode);
  const [user, setUser] = useState<User | null>(null);
  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });
  const { loading, error, response } = useAuthenticatedAccount();

  React.useEffect(() => {
    if (response) {
      setMe(response.user);
    }
  }, [response]);

  const authExclusionPath = ["/sign-up", "/sign-in", "/forget-password", "/password-setting"];

  const pathname = router.pathname;
  if (!authExclusionPath.includes(pathname) && !pathname.match(/reset-password/)) {
    if (loading) return <Spinner />;
    if (error || !response) {
      router.push("/sign-in");
      return <Spinner />;
    }
    if (me.clientId && pathname === "/") {
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
