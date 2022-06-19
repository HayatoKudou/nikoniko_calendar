import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import signIn from "../../api/signIn";
import { useClientInfo } from "../../store/clientInfo";
import { useMe } from "../../store/me";
import Copyright from "../copyright";
import Spinner from "../spinner";

const SignIn = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [, setMe] = useRecoilState(useMe);
  const [, setClientInfo] = useRecoilState(useClientInfo);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    email: "",
    password: "",
  });

  if (loading) return <Spinner />;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    signIn({
      email: formValues.email,
      password: formValues.password,
    })
      .then((res) => {
        setLoading(false);
        enqueueSnackbar("ログインしました。", { variant: "success" });
        setMe(res.user);
        setClientInfo(res.client);
        router.push(`/${res.user.clientId}/dashboard`);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`ログインに失敗しました`, { variant: "error" });
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField onChange={handleChange} margin="normal" required fullWidth label="メールアドレス" name="email" autoComplete="email" autoFocus />
          <TextField
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            label="パスワード"
            name="password"
            type="password"
            autoComplete="current-password"
          />
          {/*<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="パスワードを記録する" />*/}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            ログイン
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/resend-email-verify" variant="body2">
                {"パスワードを忘れましたか？"}
              </Link>
            </Grid>
            <Grid item xs>
              <Link href={"/sign-up"} variant="body2">
                {"アカウントをお持ちではありませんか？"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};

export default SignIn;
