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
import GenerateGoogleOauthUrl from "../../api/auth/generate_google_oauth_url";
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

          <Grid item xs={12}>
            <Divider>or</Divider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              onChange={handleChange}
              required
              fullWidth
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              helperText={signInRequestErrors?.email}
              error={signInRequestErrors?.email !== undefined}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handleChange}
              required
              fullWidth
              label="パスワード"
              name="password"
              type="password"
              helperText={signInRequestErrors?.password}
              error={signInRequestErrors?.password !== undefined}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained">
              ログイン
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Link href="/forget-password" variant="body2">
              {"パスワードを忘れましたか？"}
            </Link>
          </Grid>

          <Grid item xs={6}>
            <Link href={"/sign-up"} variant="body2">
              {"アカウントをお持ちではありませんか？"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignIn;
