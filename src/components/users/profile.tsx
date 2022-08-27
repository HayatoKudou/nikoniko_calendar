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
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";
import ApiClient from "../../lib/apiClient";
import {ApiClientIdUserPost422Response, ApiClientIdUserPostRequest} from "../../../api_client";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MyProfile = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState<ApiClientIdUserPostRequest>({
    id: 0,
    name: "",
    email: "",
    roles: [],
  });
  const [updateRequestErrors, setUpdateRequestErrors] = React.useState<ApiClientIdUserPost422Response>({});
  const [openUpdateConfirm, setOpenUpdateConfirm] = React.useState<boolean>(false);

  React.useEffect(() => {
    setFormValues({
      id: me.id,
      name: me.name,
      email: me.email,
      roles: me.role,
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
    ApiClient(me.apiToken)
      .apiClientIdUserPut(choseClient.clientId, {
        id: formValues.id,
        name: formValues.name,
        email: formValues.email,
        roles: formValues.roles,
      })
      .then((res) => {
        setLoading(false);
        setOpenUpdateConfirm(false);
        setUpdateRequestErrors({});
        enqueueSnackbar("更新に成功しました", { variant: "success" });
      })
      .catch((res) => {
        setLoading(false);
        setOpenUpdateConfirm(false);
        setUpdateRequestErrors(res.response.data.errors);
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
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
              helperText={updateRequestErrors?.name}
              error={updateRequestErrors?.name !== undefined}
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
              helperText={updateRequestErrors?.email}
              error={updateRequestErrors?.email !== undefined}
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
