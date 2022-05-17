import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import * as React from "react";
import createClient, { CreateClientRequestErrors } from "../../api/createClient";
import signUp, { SignUpRequestErrors } from "../../api/signUp";
import ClientContext from "../../context/clientContext";
import Copyright from "../copyright";
import FormError from "../form_error";
import Spinner from "../spinner";

const steps = ["プラン選択", "チーム設定", "プロフィール設定"];

const SignUp = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const clientContext = React.useContext(ClientContext);
  const [loading, setLoading] = React.useState(false);
  const [signUpRequestErrors, setSignUpRequestErrors] = React.useState<Partial<SignUpRequestErrors>>({});
  const [createClientRequestErrors, setCreateClientRequestErrors] = React.useState<Partial<CreateClientRequestErrors>>(
    {}
  );
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    password: "",
    clientName: "",
  });
  const [activeStep, setActiveStep] = React.useState(0);

  if (loading) return <Spinner />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleClientProfileSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    createClient({
      name: formValues.clientName,
    })
      .then((res) => {
        setLoading(false);
        if (res.succeeded) {
          setCreateClientRequestErrors({});
          enqueueSnackbar("組織の登録に成功しました。", {
            variant: "success",
          });
          setActiveStep(activeStep + 1);
          clientContext.setClient(res.client);
        } else {
          setCreateClientRequestErrors(res.errors);
          enqueueSnackbar(`組織の登録に失敗しました`, {
            variant: "error",
          });
        }
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`組織の登録に失敗しました`, {
          variant: "error",
        });
      });
  };

  const handleProfileSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    signUp({
      clientId: clientContext.client!.id,
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
    })
      .then((res) => {
        setLoading(false);
        if (res.succeeded) {
          setSignUpRequestErrors({});
          enqueueSnackbar("登録に成功しました。", {
            variant: "success",
          });
          router.push(`/${clientContext.client!.id}/dashboard`);
        } else {
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
            <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained" fullWidth sx={{ mt: 3, mb: 2 }}>
              {"次へ"}
            </Button>
          ) : activeStep === 1 ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    onChange={handleChange}
                    value={formValues.clientName}
                    name="clientName"
                    label="組織名"
                    autoFocus
                    fullWidth
                    required
                  />
                  <FormError errors={createClientRequestErrors["name"]} />
                </Grid>
              </Grid>
              <Box sx={{ marginTop: 2 }}>
                <Button
                  onClick={() => setActiveStep(activeStep - 1)}
                  variant="contained"
                  sx={{ float: "left", width: "120px" }}
                >
                  {"戻る"}
                </Button>
                <Button onClick={handleClientProfileSubmit} variant="contained" sx={{ float: "right", width: "120px" }}>
                  {"登録"}
                </Button>
              </Box>
            </>
          ) : activeStep === 2 ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    onChange={handleChange}
                    value={formValues.name}
                    label="名前"
                    name="name"
                    autoFocus
                    fullWidth
                    required
                  />
                  <FormError errors={signUpRequestErrors["name"]} />
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
                  <FormError errors={signUpRequestErrors["email"]} />
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
                  <FormError errors={signUpRequestErrors["password"]} />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href={"/signIn"} variant="body2">
                    すでにアカウントをお持ちですか？
                  </Link>
                </Grid>
              </Grid>
              <Box sx={{ marginTop: 2 }}>
                <Button
                  onClick={() => setActiveStep(activeStep - 1)}
                  variant="contained"
                  sx={{ float: "left", width: "120px" }}
                >
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
