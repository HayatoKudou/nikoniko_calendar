import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import ApiClient from "../../lib/apiClient";
import { useMe } from "../../store/me";
import Spinner from "../parts/spinner";

const SignIn = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const [loading, setLoading] = React.useState(false);

  if (loading) return <Spinner />;

  const handleSignInGoogle = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .connectGoogleGet()
      .then((res) => {
        router.push(res.data.connectUrl).then(() => setLoading(false));
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
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
