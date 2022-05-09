import "../styles/globals.css";
import { SnackbarProvider } from "notistack";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Component {...pageProps} />
    </SnackbarProvider>
  );
}

export default App;
