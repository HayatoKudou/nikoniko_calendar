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
import signUp, { SignUpRequestErrors } from "../../api/signUp";
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
  const [signUpRequestErrors, setSignUpRequestErrors] = React.useState<Partial<SignUpRequestErrors>>({});
  const [formValues, setFormValues] = React.useState({
    plan: "free",
    name: "",
    email: "",
    password: "",
    clientName: "",
  });
  const [activeStep, setActiveStep] = React.useState(0);

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = (e: any) => {
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
          enqueueSnackbar("登録に成功しました。", {
            variant: "success",
          });
          setMe(res.user);
          setClientInfo(res.client);
          router.push(`/${res.client!.id}/dashboard`);
        } else {
          if (res.errors.client_name) {
            setActiveStep(1);
          }
          setSignUpRequestErrors(res.errors);
          enqueueSnackbar(`登録に失敗しました`, {
            variant: "error",
          });
        }
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`登録に失敗しました`, {
          variant: "error",
        });
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

        <Stepper activeStep={activeStep} sx={{ margin: "10px 0", width: "100%" }}>
          {steps.map((label, index) => {
            return (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Box sx={{ mt: 3, width: "100%" }}>
          {activeStep === 0 ? (
            <>
              <Box sx={{ justifyContent: "center", display: "flex" }}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ margin: 1 }}>
                    <CardHeader title={"FREE"}></CardHeader>
                    <CardContent>
                      <Box px={1}>
                        <Typography variant="h3" component="h2" gutterBottom={true}>
                          ¥0
                          <Typography variant="h6" color="textSecondary" component="span">
                            / 月
                          </Typography>
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1" component="p">
                          メンバー上限: 30
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1" component="p">
                          書籍上限: 100
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        name="plan"
                        value="free"
                        onClick={handleChange}
                        endIcon={formValues.plan === "free" && <CheckIcon />}
                      >
                        Select plan
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ margin: 1 }}>
                    <CardHeader title={"BETA"}></CardHeader>
                    <CardContent>
                      <Box px={1}>
                        <Typography variant="h3" component="h2" gutterBottom={true}>
                          ¥0
                          <Typography variant="h6" color="textSecondary" component="span">
                            / 月
                          </Typography>
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1" component="p">
                          メンバー上限: 無制限
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1" component="p">
                          書籍上限: 無制限
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        name="plan"
                        value="beta"
                        onClick={handleChange}
                        endIcon={formValues.plan === "beta" && <CheckIcon />}
                      >
                        Select plan
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Box>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href={"/sign-in"} variant="body2">
                    すでにアカウントをお持ちですか？
                  </Link>
                </Grid>
              </Grid>
              <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained" fullWidth sx={{ mt: 3, mb: 2 }}>
                {"次へ"}
              </Button>
            </>
          ) : activeStep === 1 ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField onChange={handleChange} value={formValues.clientName} name="clientName" label="組織名" autoFocus fullWidth required />
                  <FormError errors={signUpRequestErrors?.client_name} />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href={"/sign-in"} variant="body2">
                    すでにアカウントをお持ちですか？
                  </Link>
                </Grid>
              </Grid>
              <Box sx={{ marginTop: 2 }}>
                <Button onClick={() => setActiveStep(activeStep - 1)} variant="contained" sx={{ float: "left", width: "120px" }}>
                  {"戻る"}
                </Button>
                <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained" sx={{ float: "right", width: "120px" }}>
                  {"次へ"}
                </Button>
              </Box>
            </>
          ) : activeStep === 2 ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField onChange={handleChange} value={formValues.name} label="名前" name="name" autoFocus fullWidth required />
                  <FormError errors={signUpRequestErrors?.name} />
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
                  />
                  <FormError errors={signUpRequestErrors?.email} />
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
                  />
                  <FormError errors={signUpRequestErrors?.password} />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href={"/sign-in"} variant="body2">
                    すでにアカウントをお持ちですか？
                  </Link>
                </Grid>
              </Grid>
              <Box sx={{ marginTop: 2 }}>
                <Button onClick={() => setActiveStep(activeStep - 1)} variant="contained" sx={{ float: "left", width: "120px" }}>
                  {"戻る"}
                </Button>
                <Button onClick={handleProfileSubmit} variant="contained" sx={{ float: "right", width: "120px" }}>
                  {"登録"}
                </Button>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default SignUp;
