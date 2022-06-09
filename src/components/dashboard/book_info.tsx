import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

interface Props {
  open: boolean;
  bookInfo: Book | null;
  setClose: any;
}

const BookInfo = (props: Props) => {
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
          <Box sx={{ margin: 2 }}>
            ステータス: {props.bookInfo.applicant ? props.bookInfo.applicant.name + " 貸出中" : "貸出可能"}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  ) : (
    <></>
  );
};

export default BookInfo;
