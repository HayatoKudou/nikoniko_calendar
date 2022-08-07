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
import GenerateGoogleOauthUrl from "../../api/auth/generate_google_oauth_url";
import signUp, { SignUpRequestErrors } from "../../api/auth/sign_up_email";
import Spinner from "../parts/spinner";

const SignUp = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [signUpRequestErrors, setSignUpRequestErrors] = React.useState<Partial<SignUpRequestErrors>>({});
  const [formValues, setFormValues] = React.useState({
    plan: "free",
    name: "",
    email: "",
    password: "",
    clientName: "",
  });

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUpGoogle = () => {
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

  const handleSignUpEmail = (e: any) => {
    e.preventDefault();
    setLoading(true);
    signUp({
      plan: formValues.plan,
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      client_name: formValues.clientName,
    })
      .then((res) => {
        setLoading(false);
        if (res.succeeded) {
          setSignUpRequestErrors({});
          enqueueSnackbar("登録に成功しました。", { variant: "success" });
          router.push("/need-email-verify");
        } else {
          setSignUpRequestErrors(res.errors);
          enqueueSnackbar(res.errors.custom ? res.errors.custom : "登録に失敗しました", { variant: "error" });
        }
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`登録に失敗しました`, { variant: "error" });
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

        <Box sx={{ mt: 3, width: "100%" }}>
          <Grid container spacing={2} component="form" onSubmit={handleSignUpEmail}>
            <Grid item xs={12}>
              {/*@ts-ignore*/}
              <GoogleLoginButton onClick={handleSignUpGoogle} style={{ fontSize: "1rem" }}>
                <span>Google連携</span>
              </GoogleLoginButton>
            </Grid>

            <Grid item xs={12}>
              <Divider>or</Divider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={formValues.name}
                label="名前"
                name="name"
                fullWidth
                required
                helperText={signUpRequestErrors?.name}
                error={signUpRequestErrors?.name !== undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={formValues.email}
                fullWidth
                label="メールアドレス"
                name="email"
                autoComplete="email"
                required
                helperText={signUpRequestErrors?.email}
                error={signUpRequestErrors?.email !== undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                required
                fullWidth
                value={formValues.password}
                label="パスワード"
                type="password"
                name="password"
                helperText={signUpRequestErrors?.password}
                error={signUpRequestErrors?.password !== undefined}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href={"/sign-in"} variant="body2">
                すでにアカウントをお持ちですか？
              </Link>
            </Grid>
          </Grid>
          <Grid sx={{ marginTop: 2 }}>
            <Button onClick={handleSignUpEmail} variant="contained" fullWidth>
              {"登録"}
            </Button>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
