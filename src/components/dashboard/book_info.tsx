import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

interface Props {
  open: boolean;
  bookInfo: any;
  setClose: any;
}

const BookInfo = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <DialogTitle>{props.bookInfo?.title}</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px", justifyContent: "center", alignItems: "center" }}>
        test
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default BookInfo;
