import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { bookStatusName } from "../../util/book";
import BookRentalApply from "./book_rental_apply";

interface Props {
  open: boolean;
  bookInfo: Book | null;
  setClose: () => void;
  success: () => void;
}

const BookInfo = (props: Props) => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);

  return props.bookInfo ? (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <DialogTitle sx={{ textAlign: "center" }}>{props.bookInfo.title}</DialogTitle>
      <DialogContent sx={{ display: "flex" }}>
        {props.bookInfo.image ? (
          <Box
            sx={{ padding: 2, textAlign: "center", maxWidth: "30%" }}
            component="img"
            src={`data:image/png;base64, ${props.bookInfo.image}`}
          />
        ) : (
          <Box sx={{ height: "200px", width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ImageNotSupportedIcon fontSize="large" />
          </Box>
        )}
        <Box>
          <Box sx={{ margin: 2 }}>カテゴリ: {props.bookInfo.category}</Box>
          <Box sx={{ margin: 2 }}>説明: {props.bookInfo.description ? props.bookInfo.description : "なし"}</Box>
          <Box sx={{ margin: 2 }}>ステータス: {bookStatusName(props.bookInfo.status)}</Box>
          {props.bookInfo.status === 2 && props.bookInfo.rentalApplicant && (
            <Box sx={{ margin: 2 }}>貸出者: {props.bookInfo.rentalApplicant.name}</Box>
          )}
          {props.bookInfo.status === 3 && props.bookInfo.purchaseApplicant && (
            <Box sx={{ margin: 2 }}>購入申請者: {props.bookInfo.purchaseApplicant.name}</Box>
          )}
        </Box>
        <Box sx={{ marginLeft: "auto", marginTop: "auto" }}>
          {openForm ? (
            <Button variant="contained" onClick={() => setOpenForm(false)}>
              閉じる
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setOpenForm(true)} disabled={props.bookInfo.status !== 1}>
              {bookStatusName(props.bookInfo.status)}
            </Button>
          )}
        </Box>
      </DialogContent>
      {openForm && <BookRentalApply bookInfo={props.bookInfo} success={props.success} />}
    </Dialog>
  ) : (
    <></>
  );
};

export default BookInfo;
