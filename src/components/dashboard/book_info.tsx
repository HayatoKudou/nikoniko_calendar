import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { BooksResponseBooksInner } from "../../../api_client";
import { useMe } from "../../store/me";
import styles from "../../styles/components/dashboards/book_info.module.scss";
import { bookStatusName, BOOK_STATUS } from "../../util/book";
import BookHistoryTimeline from "./book_history_timeline";
import BookRentalApply from "./book_rental_apply";
import BookReturn from "./book_return";
import BookReviews from "./book_reviews";

const BookInfo = (props: { open: boolean; bookInfo: BooksResponseBooksInner; setClose: () => void; success: () => void }) => {
  const me = useRecoilValue(useMe);

  const handleClose = () => {
    props.setClose();
  };

  let rateAverage = 0;
  if (props.bookInfo.reviews.length > 0) {
    const rateSum = props.bookInfo.reviews
      .map((review) => review.rate)
      .reduce((a: number, b: number) => {
        return a + b;
      });
    rateAverage = rateSum / props.bookInfo.reviews.length;
  }

  const BookInfoDetail = (props: { title: string; value: string }) => {
    return (
      <Box className={styles.bookInfo__dialogContentBookInfo}>
        <Typography className={styles.bookInfo__dialogContentBookInfoTitle}>{props.title}</Typography>
        <Typography className={styles.bookInfo__dialogContentBookDetail}>{props.value}</Typography>
      </Box>
    );
  };

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth={"lg"} scroll={"paper"}>
      <DialogTitle className={styles.bookInfo__dialogTitle}>{props.bookInfo.title}</DialogTitle>
      <DialogContent>
        <Box className={styles.bookInfo__dialogContentBookInfoContainer}>
          {props.bookInfo.image ? (
            <Box className={styles.bookInfo__dialogContentBookImage} component="img" src={`data:image/png;base64, ${props.bookInfo.image}`} />
          ) : (
            <Box className={styles.bookInfo__dialogContentBookNonImage}>
              <ImageNotSupportedIcon fontSize="large" />
            </Box>
          )}
          <Box className={styles.bookInfo__dialogContentBookInfo__center}>
            <Box className={styles.bookInfo__dialogContentBookRate}>
              <Rating name="rate" value={rateAverage} readOnly precision={0.5} />
              <Typography component="span" color="primary">
                {props.bookInfo.reviews.length}
              </Typography>
            </Box>
            <BookInfoDetail title={"カテゴリ"} value={props.bookInfo.category} />
            <BookInfoDetail title={"本の説明"} value={props.bookInfo.description ? props.bookInfo.description : "なし"} />
            <BookInfoDetail title={"ステータス"} value={bookStatusName(props.bookInfo.status)} />

            {props.bookInfo.status === BOOK_STATUS.STATUS_CAN_NOT_LEND && (
              <>
                <BookInfoDetail title={"貸出者"} value={props.bookInfo.rentalApplicant.name ?? ""} />
                <BookInfoDetail title={"返却予定日"} value={props.bookInfo.rentalApplicant.expectedReturnDate ?? ""} />
                {props.bookInfo.rentalApplicant?.id === me.id && <BookReturn bookInfo={props.bookInfo} success={props.success} />}
              </>
            )}

            {props.bookInfo.status === BOOK_STATUS.STATUS_APPLYING && (
              <BookInfoDetail title={"購入申請者"} value={props.bookInfo.purchaseApplicant.name ?? ""} />
            )}

            {props.bookInfo.status === BOOK_STATUS.STATUS_CAN_LEND && <BookRentalApply bookInfo={props.bookInfo} success={props.success} />}
          </Box>

          <Box sx={{ width: "350px", maxWidth: "40%", padding: 2 }}>
            <BookHistoryTimeline bookId={props.bookInfo.id} />
          </Box>
        </Box>
        <BookReviews bookInfo={props.bookInfo} onSuccess={() => props.success()} />
      </DialogContent>
    </Dialog>
  );
};

export default BookInfo;
