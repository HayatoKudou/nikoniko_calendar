import "../styles/globals.css";
import { SnackbarProvider } from "notistack";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";
import {StyledEngineProvider} from "@mui/material";

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
