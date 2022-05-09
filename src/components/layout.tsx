import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import ColorModeContext from "../context/colorModeContext";
import Sidebar from "./sidebar";

type PaletteMode = "light" | "dark";

const Layout = ({ children }: any) => {
  const [mode, setMode] = useState<PaletteMode>("dark");
  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    },
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Sidebar>{children}</Sidebar>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Layout;
