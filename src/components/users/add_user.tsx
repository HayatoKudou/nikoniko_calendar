import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import * as React from "react";

interface Props {
  open: boolean;
  setClose: any;
}

const AddUser = (props: Props) => {
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  console.log(formValues);
  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth>
      <DialogTitle>ユーザー追加</DialogTitle>
      <DialogContent>
        <TextField
          margin={"dense"}
          autoFocus
          label="名前"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <TextField
          margin={"dense"}
          label="メールアドレス"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <FormControl fullWidth margin={"dense"}>
          <InputLabel sx={{ left: "-10px" }}>権限</InputLabel>
          <Select
            value={formValues.role}
            name="role"
            label="role"
            // @ts-ignore
            onChange={handleChange}
            variant="standard"
          >
            <MenuItem value={"member"}>メンバー</MenuItem>
            <MenuItem value={20}>管理者</MenuItem>
            <MenuItem value={30}>オーナー</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.setClose}>キャンセル</Button>
        <Button onClick={props.setClose}>登録する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;
