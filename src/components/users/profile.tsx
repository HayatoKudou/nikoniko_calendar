import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Update, { UpdateUserRequestErrors } from "../../api/user/update";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MyProfile = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    id: 0,
    name: "",
    email: "",
    apiToken: "",
  });
  const [createRequestErrors, setCreateRequestErrors] = React.useState<Partial<UpdateUserRequestErrors>>({});
  const [openUpdateConfirm, setOpenUpdateConfirm] = React.useState<boolean>(false);

  React.useEffect(() => {
    setFormValues({
      id: me.id,
      name: me.name,
      email: me.email,
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
    Update(choseClient.clientId, {
      id: formValues.id,
      name: formValues.name,
      email: formValues.email,
      roles: [],
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
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"md"}>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Grid container sx={{ display: "block", margin: "0 auto" }}>
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
              helperText={createRequestErrors?.name}
              error={createRequestErrors?.name !== undefined}
            />

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
              helperText={createRequestErrors?.email}
              error={createRequestErrors?.email !== undefined}
            />

            <ConfirmDialog
              message={"本当に更新しますか？"}
              open={openUpdateConfirm}
              onClose={() => setOpenUpdateConfirm(false)}
              handleSubmit={handleSubmit}
            />
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type={"submit"} variant={"contained"} onClick={() => setOpenUpdateConfirm(true)}>
          更新する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyProfile;
