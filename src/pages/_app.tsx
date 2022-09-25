import "../styles/globals.css";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { Router } from "next/router";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { RecoilRoot } from "recoil";
import Spinner from "../components/parts/spinner";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  const [redirecting, setRedirecting] = React.useState<boolean>(false);

  React.useEffect(() => {
    Router.events.on("routeChangeStart", () => setRedirecting(true));
    Router.events.on("routeChangeComplete", () => setRedirecting(false));
    Router.events.on("routeChangeError", () => setRedirecting(false));
    return () => {
      Router.events.off("routeChangeStart", () => setRedirecting(true));
      Router.events.off("routeChangeComplete", () => setRedirecting(false));
      Router.events.off("routeChangeError", () => setRedirecting(false));
    };
  });
  return (
    <StyledEngineProvider injectFirst>
      <RecoilRoot>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <CssBaseline />
          {redirecting ? <Spinner /> : <Component {...pageProps} />}
        </SnackbarProvider>
      </RecoilRoot>
    </StyledEngineProvider>
  );
}

export default App;
