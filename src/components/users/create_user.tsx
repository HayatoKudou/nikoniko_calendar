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
import { useRecoilState } from "recoil";
import Create, { CreateUserRequestErrors } from "../../api/user/create";
import { useMe } from "../../store/me";
import FormError from "../form_error";
import Spinner from "../spinner";

interface Props {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const CreateUser = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [me] = useRecoilState(useMe);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles: [],
  });
  const [createUserRequestErrors, setCreateUserRequestErrors] = React.useState<Partial<CreateUserRequestErrors>>({});

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
    Create(me.clientId, {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      password_confirmation: formValues.password_confirmation,
      roles: formValues.roles,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setCreateUserRequestErrors({});
          enqueueSnackbar("ユーザーの登録に成功しました。", {
            variant: "success",
          });
          props.onSuccess();
          props.onClose();
        } else {
          setCreateUserRequestErrors(res.errors);
          enqueueSnackbar(`ユーザー登録に失敗しました`, {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`ユーザーの登録に失敗しました`, { variant: "error" });
      });
  };

  const roles = ["is_account_manager", "is_book_manager", "is_client_manager"];
  const displayRoleName = (roleValue: string) => {
    switch (roleValue) {
      case "is_account_manager":
        return "アカウント管理";
      case "is_book_manager":
        return "書籍管理";
      case "is_client_manager":
        return "組織管理";
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
          variant="standard"
          margin={"dense"}
        />
        <FormError errors={createUserRequestErrors?.password} />

        <TextField
          type={"password"}
          value={formValues.password_confirmation}
          fullWidth
          onChange={handleChange}
          name={"password_confirmation"}
          label={"パスワード確認"}
          inputProps={{ minLength: 1, maxLength: 255 }}
          required
          variant="standard"
          margin={"dense"}
        />
        <FormError errors={createUserRequestErrors?.password_confirmation} />

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
                {selected.map((value) => (
                  <Chip key={value} label={value} />
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
        <Button onClick={props.onClose} variant="contained">
          キャンセル
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          登録する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUser;
