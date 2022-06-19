import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import resetPassword, { ResetPasswordRequestErrors } from "../../api/reset_password";
import FormError from "../form_error";
import Spinner from "../spinner";

const ResetPassword = () => {
  const router = useRouter();
  const token = router.query.token;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [resetPasswordRequestErrors, setResetPasswordRequestErrors] = React.useState<Partial<ResetPasswordRequestErrors>>({});
  const [formValues, setFormValues] = React.useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  if (loading) return <Spinner />;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    resetPassword({
      // @ts-ignore
      token: token,
      email: formValues.email,
      password: formValues.password,
      password_confirmation: formValues.password_confirmation,
    })
      .then((res) => {
        setLoading(false);
        if (res.succeeded) {
          setResetPasswordRequestErrors({});
          enqueueSnackbar("パスワードを更新しました", {
            variant: "success",
          });
          router.push("/sign-in");
        } else {
          setResetPasswordRequestErrors(res.errors);
          enqueueSnackbar(`パスワード更新に失敗しました`, {
            variant: "error",
          });
        }
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`パスワード更新に失敗しました`, { variant: "error" });
      });
  };

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Typography variant="h4">パスワードリセット</Typography>
      <Container component="main" maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={formValues.email}
                fullWidth
                label="メールアドレス"
                name="email"
                autoComplete="email"
                inputProps={{ minLength: 1, maxLength: 255 }}
                required
                margin={"dense"}
              />
              <FormError errors={resetPasswordRequestErrors?.email} />
              <TextField
                type={"password"}
                onChange={handleChange}
                value={formValues.password}
                fullWidth
                label="パスワード"
                name="password"
                autoComplete="password"
                inputProps={{ minLength: 1, maxLength: 255 }}
                required
                margin={"dense"}
              />
              <FormError errors={resetPasswordRequestErrors?.password} />
              <TextField
                type={"password"}
                value={formValues.password_confirmation}
                fullWidth
                onChange={handleChange}
                name={"password_confirmation"}
                label={"パスワード確認"}
                inputProps={{ minLength: 1, maxLength: 255 }}
                required
                margin={"dense"}
              />
              <FormError errors={resetPasswordRequestErrors?.password_confirmation} />
            </Grid>
          </Grid>
          <Button onClick={handleSubmit} variant="contained" sx={{ float: "right", marginTop: 2 }}>
            {"パスワードリセット"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ResetPassword;
