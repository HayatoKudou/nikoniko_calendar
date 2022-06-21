import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import UpdateBook from "../../api/book/update";
import { useMe } from "../../store/me";
import { bookStatusName, BOOK_STATUS } from "../../util/book";
import Spinner from "../spinner";
import BookRentalApply from "./book_rental_apply";
import BookReview from "./book_review";

interface Props {
  open: boolean;
  bookInfo: Book;
  setClose: () => void;
  success: () => void;
}

const BookInfo = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [me] = useRecoilState(useMe);
  const [loading, setLoading] = React.useState(false);
  const [openRentalForm, setOpenRentalForm] = React.useState<boolean>(false);
  const [openReviewForm, setOpenReviewForm] = React.useState<boolean>(false);

  if (loading) return <Spinner />;

  const availableBook = (props: Props) => {
    setLoading(true);
    UpdateBook(me.clientId, {
      id: props.bookInfo.id,
      category: props.bookInfo.category,
      status: 1, // 1 = 貸出可能
      title: props.bookInfo.title,
      description: props.bookInfo.description,
      image: "data:image/png;base64," + props.bookInfo.image,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          enqueueSnackbar("ステータスを更新しました。", { variant: "success" });
          props.success();
          props.setClose();
        } else {
          enqueueSnackbar(`ステータス更新に失敗しました`, { variant: "error" });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`ステータス更新に失敗しました`, { variant: "error" });
      });
  };

  const handleClose = () => {
    setOpenRentalForm(false);
    setOpenReviewForm(false);
  };

  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <DialogTitle sx={{ textAlign: "center" }}>{props.bookInfo.title}</DialogTitle>
      <DialogContent sx={{ display: "flex" }}>
        {props.bookInfo.image ? (
          <Box sx={{ padding: 2, textAlign: "center", maxWidth: "30%" }} component="img" src={`data:image/png;base64, ${props.bookInfo.image}`} />
        ) : (
          <Box sx={{ height: "200px", width: "40%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ImageNotSupportedIcon fontSize="large" />
          </Box>
        )}
        <Box>
          <Box sx={{ margin: 2 }}>カテゴリ: {props.bookInfo.category}</Box>
          <Box sx={{ margin: 2, whiteSpace: "pre-wrap", display: "flex" }}>
            <Box>本の説明: </Box>
            <Box>{props.bookInfo.description ? props.bookInfo.description : "なし"}</Box>
          </Box>
          <Box sx={{ margin: 2 }}>ステータス: {bookStatusName(props.bookInfo.status)}</Box>
          {props.bookInfo.status === BOOK_STATUS.STATUS_CAN_NOT_LEND && props.bookInfo.rentalApplicant && (
            <Box sx={{ margin: 2 }}>貸出者: {props.bookInfo.rentalApplicant.name}</Box>
          )}
          {props.bookInfo.status === BOOK_STATUS.STATUS_APPLYING && props.bookInfo.purchaseApplicant && (
            <Box sx={{ margin: 2 }}>購入申請者: {props.bookInfo.purchaseApplicant.name}</Box>
          )}
        </Box>
        <Box sx={{ marginLeft: "auto", marginTop: "auto" }}>
          {openRentalForm ? (
            <Button variant="contained" onClick={handleClose}>
              閉じる
            </Button>
          ) : (
            <>
              {props.bookInfo.rentalApplicant?.id === me.id && (
                <Button variant="contained" onClick={() => setOpenReviewForm(true)}>
                  返却 & レビュー
                </Button>
              )}
              {props.bookInfo.status === BOOK_STATUS.STATUS_APPLYING && me.role.is_book_manager && (
                <Button variant="contained" onClick={() => availableBook(props)}>
                  貸出可能にする
                </Button>
              )}
              <Button variant="contained" onClick={() => setOpenRentalForm(true)} disabled={props.bookInfo.status !== 1} sx={{ marginLeft: 1 }}>
                {bookStatusName(props.bookInfo.status)}
              </Button>
            </>
          )}
        </Box>
      </DialogContent>
      {openRentalForm && <BookRentalApply bookInfo={props.bookInfo} success={props.success} />}
      {openReviewForm && <BookReview bookInfo={props.bookInfo} success={props.success} />}
    </Dialog>
  );
};

export default BookInfo;
