import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import forgetPassword, { ForgetPasswordRequestErrors } from "../../api/forget_password";
import FormError from "../form_error";
import Spinner from "../spinner";

const SignUp = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [forgetPasswordRequestErrors, setForgetPasswordRequestErrors] = React.useState<Partial<ForgetPasswordRequestErrors>>({});
  const [formValues, setFormValues] = React.useState({
    email: "",
  });

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    forgetPassword({
      email: formValues.email,
    })
      .then((res) => {
        setLoading(false);
        if (res.succeeded) {
          setForgetPasswordRequestErrors({});
          enqueueSnackbar("リセットメールを送信しました", {
            variant: "success",
          });
        } else {
          setForgetPasswordRequestErrors(res.errors);
          enqueueSnackbar(`リセットメール送信に失敗しました`, {
            variant: "error",
          });
        }
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`リセットメール送信に失敗しました`, { variant: "error" });
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
                required
              />
              <FormError errors={forgetPasswordRequestErrors?.email} />
            </Grid>
          </Grid>
          <Button onClick={handleSubmit} variant="contained" sx={{ float: "right", marginTop: 2 }}>
            {"パスワードリセットメール送信"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
