import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import emailResendVerify, { EmailResendVerifyRequestErrors } from "../../api/email_resend_verify";
import { useClientInfo } from "../../store/clientInfo";
import { useMe } from "../../store/me";
import Copyright from "../copyright";
import FormError from "../form_error";
import Spinner from "../spinner";

const steps = ["プラン選択", "組織設定", "プロフィール設定"];

const SignUp = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [, setMe] = useRecoilState(useMe);
  const [, setClientInfo] = useRecoilState(useClientInfo);
  const [loading, setLoading] = React.useState(false);
  const [emailResendVerifyRequestErrors, setEmailResendVerifyRequestErrors] = React.useState<Partial<EmailResendVerifyRequestErrors>>({});
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
    emailResendVerify({
      email: formValues.email,
    })
      .then((res) => {
        setLoading(false);
        if (res.succeeded) {
          setEmailResendVerifyRequestErrors({});
          enqueueSnackbar("リセットメールを送信しました", {
            variant: "success",
          });
        } else {
          setEmailResendVerifyRequestErrors(res.errors);
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
              <FormError errors={emailResendVerifyRequestErrors?.email} />
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
