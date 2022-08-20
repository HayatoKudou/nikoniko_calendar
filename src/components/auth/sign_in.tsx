import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import GenerateGoogleOauthUrl from "../../api/auth/generate_google_oauth_url";
import Spinner from "../parts/spinner";

const SignIn = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  if (loading) return <Spinner />;

  const handleSignInGoogle = () => {
    setLoading(true);
    GenerateGoogleOauthUrl()
      .then((res) => {
        setLoading(false);
        router.push(res.connectUrl);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`エラーが発生しました`, { variant: "error" });
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <Button variant="outlined" onClick={handleSignInGoogle}>
        Google連携
      </Button>
    </Box>
  );
};

export default SignIn;
