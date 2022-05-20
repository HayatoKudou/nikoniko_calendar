import "../styles/globals.css";
import { SnackbarProvider } from "notistack";
import { RecoilRoot } from "recoil";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default App;
