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
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useSetRecoilState } from "recoil";
import signUp, { SignUpRequestErrors } from "../../api/auth/sign_up";
import signUpGoogle from "../../api/auth/sign_up_google_oauth";
import CreateClient from "../../api/client/create";
import { useMe } from "../../store/me";
import Spinner from "../parts/spinner";

const steps = ["プロフィール設定", "プラン選択", "組織設定"];

const SignUp = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const setMe = useSetRecoilState(useMe);
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
  const [userId, setUserId] = React.useState<number | undefined>();

  React.useEffect(() => {
    if (activeStep === 0 && session && session.user) {
      setLoading(true);
      signUpGoogle({
        name: session.user.name as string,
        email: session.user.email as string,
        accessToken: session.accessToken as string,
      })
        .then((res) => {
          setLoading(false);
          if (res.succeeded) {
            setActiveStep(1);
            setUserId(res.userId);
          } else {
            enqueueSnackbar(res.errors.custom ? res.errors.custom : "登録に失敗しました", { variant: "error" });
          }
        })
        .catch(() => {
          setLoading(false);
          enqueueSnackbar(`登録に失敗しました`, { variant: "error" });
        });
    }
  }, [session]);

  if (loading) return <Spinner />;
  console.log(process.env.GOOGLE_CLIENT_ID)
  console.log(process.env.GOOGLE_CLIENT_SECRET)

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateClient = () => {
    setLoading(true);
    CreateClient({
      plan: formValues.plan,
      name: formValues.clientName,
      userId: userId as number,
    })
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (res.succeeded) {
          setSignUpRequestErrors({});
          enqueueSnackbar("登録に成功しました。", { variant: "success" });
          setMe(res.me);
          router.push(`/${res!.me!.clientId}/dashboard`);
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
          setActiveStep(1);
          setUserId(res.userId);
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
              <Grid container spacing={2} component="form" onSubmit={handleSignUpEmail}>
                <Grid item xs={12}>
                  {/*@ts-ignore*/}
                  <GoogleLoginButton onClick={() => signIn("google")} style={{ fontSize: "1rem" }}>
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
                <Button onClick={() => setActiveStep(activeStep - 1)} variant="contained" sx={{ float: "left", width: "120px" }}>
                  {"戻る"}
                </Button>
                <Button onClick={handleSignUpEmail} variant="contained" sx={{ float: "right", width: "120px" }}>
                  {"登録"}
                </Button>
              </Grid>
            </>
          ) : activeStep === 1 ? (
            <>
              <Box sx={{ justifyContent: "center", display: "flex" }}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ margin: 1, minWidth: "200px" }}>
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
                          ユーザー上限: 30
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
                  <Card variant="outlined" sx={{ margin: 1, minWidth: "200px" }}>
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
                          ユーザー上限: 無制限
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
          ) : activeStep === 2 ? (
            <>
              <Grid container spacing={2} component="form" onSubmit={() => setActiveStep(activeStep + 1)}>
                <Grid item xs={12}>
                  <TextField
                    onChange={handleChange}
                    value={formValues.clientName}
                    name="clientName"
                    label="組織名"
                    fullWidth
                    required
                    helperText={signUpRequestErrors?.name}
                    error={signUpRequestErrors?.name !== undefined}
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
              <Box sx={{ marginTop: 2 }}>
                <Button onClick={() => setActiveStep(activeStep - 1)} variant="contained" sx={{ float: "left", width: "120px" }}>
                  {"戻る"}
                </Button>
                <Button onClick={handleCreateClient} variant="contained" sx={{ float: "right", width: "120px" }}>
                  {"登録"}
                </Button>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
