import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useState } from "react";
import * as React from "react";
import useAuthenticatedAccount from "../api/me";
import ClientContext from "../context/clientContext";
import ColorModeContext from "../context/colorModeContext";
import UserContext from "../context/userContext";
import Sidebar from "./sidebar";
import Spinner from "./spinner";

type PaletteMode = "light" | "dark";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [colorMode, setColorMode] = useState<PaletteMode>("dark");
  let color = colorMode;
  // ssr対応
  if (typeof window !== "undefined") {
    color = JSON.parse(window!.localStorage.getItem("colorMode") ?? colorMode);
  }
  const theme = createTheme({
    palette: {
      mode: color,
    },
  });

  const { loading, error, response } = useAuthenticatedAccount();
  if (loading) return <Spinner />;

  const pathname = router.pathname;
  if (pathname !== "/signUp" && pathname !== "/signIn") {
    if (error) {
      router.push("/signIn");
      return <Spinner />;
    }
  }

  const clientContext = {
    client: client,
    setClient: setClient,
  };

  const userContextValue = {
    user: user,
    setUser: setUser,
  };

  const colorModeContext = {
    colorMode: colorMode,
    setColorMode: setColorMode,
  };

  return (
    <ClientContext.Provider value={clientContext}>
      <UserContext.Provider value={userContextValue}>
        <ColorModeContext.Provider value={colorModeContext}>
          <ThemeProvider theme={theme}>
            <Sidebar>{children}</Sidebar>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </UserContext.Provider>
    </ClientContext.Provider>
  );
};

// @ts-ignore
export default Layout;
