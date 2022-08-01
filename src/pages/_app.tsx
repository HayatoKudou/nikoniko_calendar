import "../styles/globals.css";
import { StyledEngineProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <StyledEngineProvider injectFirst>
        <RecoilRoot>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Component {...pageProps} />
          </SnackbarProvider>
        </RecoilRoot>
      </StyledEngineProvider>
    </SessionProvider>
  );
}

export default App;
