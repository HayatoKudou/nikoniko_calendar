import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ApiClient from "../lib/apiClient";
import { useChoseWorkspace } from "../store/choseWorkspace";
import { useMe } from "../store/me";
import { useColorMode } from "../store/styles/color_mode";
import Sidebar from "./sidebar";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const [me, setMe] = useRecoilState(useMe);
  const choseWorkspace = useRecoilValue(useChoseWorkspace);
  const colorMode = useRecoilValue(useColorMode);
  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    const authExclusionPath = ["/sign-in"];
    const pathname = router.pathname;
    if (!authExclusionPath.includes(pathname)) {
      if (!me || me.id === null) {
        router.push("/sign-in");
      }
      authenticatedAccount();
      if (me.id && choseWorkspace.workspaceId && pathname === "/") {
        router.push(`/dashboard`);
      }
    }
  }, []);

  const authenticatedAccount = () => {
    ApiClient(me.apiToken)
      .apiWorkspaceIdMeGet(choseWorkspace.workspaceId)
      .then((res) => {
        setMe(res.data);
      })
      .catch(() => {
        enqueueSnackbar("エラーが発生しました", {
          variant: "error",
        });
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sidebar>{children}</Sidebar>
      {/*{children}*/}
    </ThemeProvider>
  );
};

// @ts-ignore
export default Layout;
