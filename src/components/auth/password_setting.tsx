import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import PasswordSettingApi, { PasswordSettingRequestErrors } from "../../api/auth/password_setting";
import ConfirmDialog from "../parts/confirm_dialog";
import FormError from "../parts/form_error";
import Spinner from "../parts/spinner";

const PasswordSetting = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
  const [resetPasswordRequestErrors, setResetPasswordRequestErrors] = React.useState<Partial<PasswordSettingRequestErrors>>({});
  const [formValues, setFormValues] = React.useState({
    password: "",
    password_confirmation: "",
  });

  if (loading) return <Spinner />;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    PasswordSettingApi({
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
        setOpenConfirm(false);
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
    <Container component="main">
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          <Button onClick={() => setOpenConfirm(true)} variant="contained" sx={{ marginTop: 2 }} fullWidth>
            {"パスワード設定"}
          </Button>
        </Box>
      </Box>
      <ConfirmDialog message={"パスワードを設定しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
    </Container>
  );
};

export default PasswordSetting;
