import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import UpdateBook from "../../api/book/update";
import { useMe } from "../../store/me";
import { bookStatusName, BOOK_STATUS } from "../../util/book";
import Spinner from "../spinner";
import BookHistoryTimeline from "./book_history_timeline";
import BookRentalApply from "./book_rental_apply";
import BookReturn from "./book_return";
import BookReviews from "./book_reviews";

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
      url: props.bookInfo.url,
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
    props.setClose();
  };

  let rateAverage = 0;
  if (props.bookInfo.reviews.length > 0) {
    const rateSum = props.bookInfo.reviews
      .map((review: Review) => review.rate)
      .reduce((a: number, b: number) => {
        return a + b;
      });
    rateAverage = rateSum / props.bookInfo.reviews.length;
  }

  return (
    <Dialog open={props.open} onClose={handleClose}  maxWidth={"lg"} scroll={"paper"}>
      <DialogTitle sx={{ textAlign: "center" }}>{props.bookInfo.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex" }}>
          {props.bookInfo.image ? (
            <Box sx={{ padding: 2, textAlign: "center", maxWidth: "25%" }} component="img" src={`data:image/png;base64, ${props.bookInfo.image}`} />
          ) : (
            <Box sx={{ height: "200px", width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ImageNotSupportedIcon fontSize="large" />
            </Box>
          )}
          <Box sx={{ width: "40%", padding: 2 }}>
            <Box sx={{ margin: 1, display: "flex", alignItems: "center" }}>
              <Rating name="rate" value={rateAverage} readOnly precision={0.5} />
              <Typography component="span" color="primary">
                {props.bookInfo.reviews.length}
              </Typography>
            </Box>
            <Box sx={{ margin: 1 }}>カテゴリ: {props.bookInfo.category}</Box>
            <Box sx={{ margin: 1, whiteSpace: "pre-wrap", display: "flex" }}>
              <Box>本の説明: </Box>
              <Box>{props.bookInfo.description ? props.bookInfo.description : "なし"}</Box>
            </Box>
            <Box sx={{ margin: 1 }}>ステータス: {bookStatusName(props.bookInfo.status)}</Box>
            {props.bookInfo.status === BOOK_STATUS.STATUS_CAN_NOT_LEND && props.bookInfo.rentalApplicant && (
              <Box sx={{ margin: 1 }}>貸出者: {props.bookInfo.rentalApplicant.name}</Box>
            )}
            {props.bookInfo.status === BOOK_STATUS.STATUS_APPLYING && props.bookInfo.purchaseApplicant && (
              <Box sx={{ margin: 1 }}>購入申請者: {props.bookInfo.purchaseApplicant.name}</Box>
            )}
            {props.bookInfo.status === BOOK_STATUS.STATUS_CAN_NOT_LEND && props.bookInfo.rentalApplicant?.id === me.id && (
              <BookReturn bookInfo={props.bookInfo} success={props.success} />
            )}
            {props.bookInfo.status === BOOK_STATUS.STATUS_APPLYING && me.role.is_book_manager && (
              <Button variant="contained" onClick={() => availableBook(props)} sx={{ marginLeft: 2, marginTop: 2 }}>
                貸出可能にする
              </Button>
            )}
            {props.bookInfo.status === BOOK_STATUS.STATUS_CAN_LEND && <BookRentalApply bookInfo={props.bookInfo} success={props.success} />}
          </Box>

          <Box sx={{ width: "40%", padding: 2 }}>
            <BookHistoryTimeline bookId={props.bookInfo.id} />
          </Box>
        </Box>
        <BookReviews bookInfo={props.bookInfo} onSuccess={() => props.success()} />
      </DialogContent>
    </Dialog>
  );
};

export default BookInfo;
