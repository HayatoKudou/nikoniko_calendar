import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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
          <TextField onChange={handleChange} value={formValues.email} fullWidth label="メールアドレス" name="email" autoComplete="email" required />
          <FormError errors={forgetPasswordRequestErrors?.email} />
          <Button type="submit" fullWidth onClick={handleSubmit} variant="contained" sx={{ mt: 3, mb: 2 }}>
            {"パスワードリセットメール送信"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
