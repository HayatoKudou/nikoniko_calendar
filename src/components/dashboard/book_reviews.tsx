import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

interface Props {
  open: boolean;
  bookInfo: Book;
  setClose: () => void;
  success: () => void;
}

const BookReviews = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <DialogTitle sx={{ textAlign: "center" }}>返却 & レビュー</DialogTitle>
      <DialogActions>
        <Button variant="contained">戻る</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookReviews;
