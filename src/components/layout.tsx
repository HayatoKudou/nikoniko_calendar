import Sidebar from "./Sidebar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "light", // dark
  },
});

const Layout = ({ children }: any) => {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Sidebar />
        {children}
      </ThemeProvider>
    </>
  );
};

export default Layout;
