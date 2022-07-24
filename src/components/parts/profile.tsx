import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import Update, { UpdateUserRequestErrors } from "../../api/user/update";
import { useMe } from "../../store/me";
import ConfirmDialog from "./confirm_dialog";
import FormError from "./form_error";
import Spinner from "./spinner";

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [me] = useRecoilState(useMe);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    id: 0,
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    apiToken: "",
  });
  const [createRequestErrors, setCreateRequestErrors] = React.useState<Partial<UpdateUserRequestErrors>>({});
  const [openUpdateConfirm, setOpenUpdateConfirm] = React.useState<boolean>(false);

  React.useEffect(() => {
    setFormValues({
      id: me.id,
      name: me.name,
      email: me.email,
      password: "",
      passwordConfirmation: "",
      apiToken: me.apiToken,
    });
  }, []);

  if (loading) return <Spinner />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    Update(me.clientId, {
      id: formValues.id,
      name: formValues.name,
      email: formValues.email,
      roles: [],
      password: formValues.password,
      password_confirmation: formValues.passwordConfirmation,
      apiToken: formValues.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setCreateRequestErrors({});
          enqueueSnackbar("ユーザーの更新に成功しました。", {
            variant: "success",
          });
        } else {
          setCreateRequestErrors(res.errors);
          enqueueSnackbar(`ユーザー登録に失敗しました`, {
            variant: "error",
          });
        }
        setOpenUpdateConfirm(false);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`ユーザーの登録に失敗しました`, { variant: "error" });
      });
  };

  return (
    <Grid container sx={{ display: "block", width: "80%", margin: "0 auto" }}>
      <Paper>
        <Box sx={{ padding: 2 }}>
          <TextField
            value={formValues.name}
            fullWidth
            onChange={handleChange}
            name={"name"}
            label={"名前"}
            required
            inputProps={{ minLength: 1, maxLength: 255 }}
            variant="standard"
            margin={"normal"}
          />
          <FormError errors={createRequestErrors?.name} />

          <TextField
            value={formValues.email}
            fullWidth
            onChange={handleChange}
            name={"email"}
            label={"メールアドレス"}
            required
            inputProps={{ minLength: 1, maxLength: 255 }}
            variant="standard"
            margin={"normal"}
          />
          <FormError errors={createRequestErrors?.email} />

          <TextField
            type={"password"}
            value={formValues.password}
            fullWidth
            onChange={handleChange}
            name={"password"}
            label={"パスワード"}
            required
            inputProps={{ minLength: 1, maxLength: 255 }}
            variant="standard"
            margin={"normal"}
          />
          <FormError errors={createRequestErrors?.password} />

          <TextField
            type={"password"}
            value={formValues.passwordConfirmation}
            fullWidth
            onChange={handleChange}
            name={"passwordConfirmation"}
            label={"パスワード確認"}
            required
            inputProps={{ minLength: 1, maxLength: 255 }}
            variant="standard"
            margin={"normal"}
          />
          <FormError errors={createRequestErrors?.password_confirmation} />

          <Box sx={{ textAlign: "right", margin: 2 }}>
            <Button type={"submit"} variant={"contained"} onClick={() => setOpenUpdateConfirm(true)}>
              更新する
            </Button>
            <ConfirmDialog
              message={"本当に更新しますか？"}
              open={openUpdateConfirm}
              onClose={() => setOpenUpdateConfirm(false)}
              handleSubmit={handleSubmit}
            />
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Profile;
