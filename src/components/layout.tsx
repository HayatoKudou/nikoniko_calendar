import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useState } from "react";
import * as React from "react";
import { useRecoilState } from "recoil";
import useAuthenticatedAccount from "../api/me";
import UserContext from "../context/userContext";
import { useMe } from "../store/me";
import { useColorMode } from "../store/styles/color_mode";
import Sidebar from "./sidebar";
import Spinner from "./spinner";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const [me] = useRecoilState(useMe);
  const [colorMode] = useRecoilState(useColorMode);
  const [user, setUser] = useState<User | null>(null);
  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });

  const { loading, error, response } = useAuthenticatedAccount();

  const pathname = router.pathname;
  if (pathname !== "/sign-up" && pathname !== "/sign-in" && pathname !== "/resend-email-verify") {
    if (loading) return <Spinner />;
    if (error || !response) {
      router.push("/sign-in");
      return <Spinner />;
    }
    if (me.clientId && pathname === "/") {
      router.push(`/${me.clientId}/dashboard`);
    }
  }

  const userContextValue = {
    user: user,
    setUser: setUser,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      <ThemeProvider theme={theme}>
        <Sidebar>{children}</Sidebar>
      </ThemeProvider>
    </UserContext.Provider>
  );
};

// @ts-ignore
export default Layout;
