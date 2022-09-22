import "../styles/globals.css";
import {CssBaseline, StyledEngineProvider} from "@mui/material";
import {SnackbarProvider} from "notistack";
import * as React from "react";
import {RecoilRoot} from "recoil";
import type {AppProps} from "next/app";

function App({Component, pageProps}: AppProps) {
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
          <CssBaseline/>
          <Component {...pageProps} />
        </SnackbarProvider>
      </RecoilRoot>
    </StyledEngineProvider>
  );
}

export default App;
