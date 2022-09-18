import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { UserCreateValidateErrorResponse, UserCreateRequest } from "../../../api_client";
import ApiClient from "../../lib/apiClient";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import FormError from "../parts/form_error";
import Spinner from "../parts/spinner";

interface Props {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const CreateUser = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const [loading, setLoading] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<UserCreateRequest>({
    name: "",
    email: "",
    roles: [],
  });
  const [createUserRequestErrors, setCreateUserRequestErrors] = React.useState<UserCreateValidateErrorResponse>({});

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleMultiSelectChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFormValues({
      ...formValues,
      ["roles"]: typeof value === "string" ? value.split(",") : value,
    });
  };

  if (loading) return <Spinner />;

  const handleSubmit = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdUserPost(choseClient.clientId, {
        name: formValues.name,
        email: formValues.email,
        roles: formValues.roles,
      })
      .then((res) => {
        setLoading(false);
        setOpenConfirm(false);
        setCreateUserRequestErrors({});
        enqueueSnackbar("登録に成功しました", { variant: "success" });
        props.onSuccess();
        props.onClose();
      })
      .catch((res) => {
        setLoading(false);
        setOpenConfirm(false);
        setCreateUserRequestErrors(res.response.data.errors);
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
      });
  };

  const roles = ["isAccountManager", "isBookManager", "isClientManager"];
  const displayRoleName = (roleValue: string) => {
    switch (roleValue) {
      case "isAccountManager":
        return "アカウント管理";
      case "isBookManager":
        return "書籍管理";
      case "isClientManager":
        return "ワークスペース管理";
      default:
        return "unknown";
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth>
      <DialogTitle>ユーザー追加</DialogTitle>
      <DialogContent>
        <TextField margin={"dense"} autoFocus label="名前" name="name" value={formValues.name} onChange={handleChange} fullWidth variant="standard" />
        <FormError errors={createUserRequestErrors?.name} />
        <TextField
          margin={"dense"}
          label="メールアドレス"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <FormError errors={createUserRequestErrors?.email} />

        <FormControl sx={{ minWidth: 300, display: "block", marginTop: 1 }}>
          <InputLabel sx={{ left: "-15px" }}>ロール</InputLabel>
          <Select
            variant="standard"
            fullWidth
            multiple
            value={formValues.roles}
            onChange={handleMultiSelectChange}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value, index: number) => (
                  <Chip key={index} label={value} />
                ))}
              </Box>
            )}
          >
            {roles.map((role, index: number) => (
              <MenuItem key={index} value={displayRoleName(role)}>
                {displayRoleName(role)}
              </MenuItem>
            ))}
          </Select>
          <FormError errors={createUserRequestErrors?.roles} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} variant="contained" color={"error"}>
          キャンセル
        </Button>
        <Button onClick={() => setOpenConfirm(true)} variant="contained">
          登録する
        </Button>
        <ConfirmDialog message={"ユーザー登録しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default CreateUser;
