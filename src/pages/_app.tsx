import "../styles/globals.css";
import { StyledEngineProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
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
          <Component {...pageProps} />
        </SnackbarProvider>
      </RecoilRoot>
    </StyledEngineProvider>
  );
}

export default App;
