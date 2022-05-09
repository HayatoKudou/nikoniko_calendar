import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import signUp, { SignUpRequestErrors } from "../../api/signUp";
import FormField from "../form_field";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const SignUp = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [signUpRequestErrors, setSignUpRequestErrors] = React.useState<Partial<SignUpRequestErrors>>({});
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp({
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
    })
      .then((res) => {
        if (res.succeeded) {
          setSignUpRequestErrors({});
          enqueueSnackbar("登録に成功しました。", {
            variant: "success",
          });
        } else {
          setSignUpRequestErrors(res.errors);
          enqueueSnackbar(`登録に失敗しました`, {
            variant: "error",
          });
        }
      })
      .catch(() => {
        enqueueSnackbar(`登録に失敗しました`, {
          variant: "error",
        });
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormField errors={signUpRequestErrors["name"]}>
                <TextField
                  onChange={handleChange}
                  value={formValues.name}
                  label="名前"
                  name="name"
                  autoFocus
                  fullWidth
                  required
                />
              </FormField>
            </Grid>
            <Grid item xs={12}>
              <FormField errors={signUpRequestErrors["email"]}>
                <TextField
                  onChange={handleChange}
                  value={formValues.email}
                  fullWidth
                  label="メールアドレス"
                  name="email"
                  autoComplete="email"
                  required
                />
              </FormField>
            </Grid>
            <Grid item xs={12}>
              <FormField errors={signUpRequestErrors["password"]}>
                <TextField
                  onChange={handleChange}
                  required
                  fullWidth
                  value={formValues.password}
                  name="password"
                  label="パスワード"
                  type="password"
                  autoComplete="new-password"
                />
              </FormField>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            新規登録
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href={"/signIn"} variant="body2">
                すでにアカウントをお持ちですか？
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default SignUp;
