import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useSetRecoilState } from "recoil";
import signInEmail, { SignInRequestErrors } from "../../api/auth/sign_in_email";
import { useMe } from "../../store/me";
import Spinner from "../parts/spinner";

const SignIn = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const setMe = useSetRecoilState(useMe);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    email: "",
    password: "",
  });
  const [signInRequestErrors, setSignInRequestErrors] = React.useState<Partial<SignInRequestErrors>>({});

  if (loading) return <Spinner />;

  const handleSignInEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    signInEmail({
      email: formValues.email,
      password: formValues.password,
    })
      .then((res) => {
        if (res.succeeded) {
          setMe(res.user);
          router.push(`/${res.user.clientId}/dashboard`);
          enqueueSnackbar("ログインしました。", { variant: "success" });
        } else {
          setSignInRequestErrors(res.errors);
          enqueueSnackbar(res.errors.custom ? res.errors.custom : "ログインに失敗しました", { variant: "error" });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`ログインに失敗しました`, { variant: "error" });
      });
  };

  const handleSignInGoogle = () => {
    console.log("callbackSignInGoogle");
    // signInGoogle({
    //   email: session.user.email as string,
    //   accessToken: session.accessToken as string,
    // })
    //   .then((res) => {
    //     if (res.succeeded) {
    //       router.push(`/${res.user.clientId}/dashboard`);
    //       enqueueSnackbar("ログインしました。", { variant: "success" });
    //     } else {
    //       enqueueSnackbar(res.errors.custom ? res.errors.custom : "ログインに失敗しました", { variant: "error" });
    //     }
    //   })
    //   .catch(() => {
    //     enqueueSnackbar(`登録に失敗しました`, { variant: "error" });
    //   });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Grid container spacing={2} component="form" onSubmit={handleSignInEmail}>
          <Grid item xs={12}>
            {/*@ts-ignore*/}
            <GoogleLoginButton onClick={handleSignInGoogle} style={{ fontSize: "1rem" }}>
              <span>Google連携</span>
            </GoogleLoginButton>
          </Grid>

          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Divider>or</Divider>
          </Grid>

          <TextField
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            helperText={signInRequestErrors?.email}
            error={signInRequestErrors?.email !== undefined}
          />
          <TextField
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            label="パスワード"
            name="password"
            type="password"
            helperText={signInRequestErrors?.password}
            error={signInRequestErrors?.password !== undefined}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            ログイン
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forget-password" variant="body2">
                {"パスワードを忘れましたか？"}
              </Link>
            </Grid>
            <Grid item xs>
              <Link href={"/sign-up"} variant="body2">
                {"アカウントをお持ちではありませんか？"}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignIn;
