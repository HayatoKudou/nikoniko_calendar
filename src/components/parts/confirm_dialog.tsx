import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
  handleSubmit: any;
}

const ConfirmDialog = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.message}</DialogTitle>
      <DialogActions>
        <Button onClick={props.onClose}>いいえ</Button>
        <Button onClick={props.handleSubmit} autoFocus>
          はい
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
