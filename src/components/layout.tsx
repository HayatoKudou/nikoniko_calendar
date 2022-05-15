import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import ClientContext from "../context/clientContext";
import ColorModeContext from "../context/colorModeContext";
import UserContext from "../context/userContext";
import Sidebar from "./sidebar";

type PaletteMode = "light" | "dark";

const Layout = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [mode, setMode] = useState<PaletteMode>("dark");
  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const clientContext = {
    client: client,
    setClient: setClient,
  };

  const userContext = {
    user: user,
    setUser: setUser,
  };

  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    },
  };

  return (
    <ClientContext.Provider value={clientContext}>
      <UserContext.Provider value={userContext}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <Sidebar>{children}</Sidebar>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </UserContext.Provider>
    </ClientContext.Provider>
  );
};

export default Layout;
