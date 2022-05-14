import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";

interface Props {
  open: boolean;
  setClose: any;
}

const BookApplication = (props: Props) => {
  const [formValues, setFormValues] = React.useState({
    url: "",
    category: "",
    reason: "",
  });

  return (
    <Dialog open={props.open} onClose={props.setClose}>
      <DialogTitle>書籍申請</DialogTitle>
      <DialogContent>
        <TextField autoFocus label="URL" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.setClose}>キャンセル</Button>
        <Button onClick={props.setClose}>申請する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookApplication;
