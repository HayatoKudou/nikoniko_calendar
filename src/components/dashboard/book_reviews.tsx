import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { BooksResponseBooksInner } from "../../../api_client";
import CreateBookReview, { CreateBookReviewRequestErrors } from "../../api/book/review/create";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import styles from "../../styles/components/dashboards/book_review.module.scss";
import ConfirmDialog from "../parts/confirm_dialog";
import FormError from "../parts/form_error";
import Spinner from "../parts/spinner";

interface Props {
  bookInfo: BooksResponseBooksInner;
  onSuccess: () => void;
}

const BookReviews = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const [loading, setLoading] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    rate: 0,
    review: "",
  });
  const [bookCreateReviewRequestErrors, setBookCreateRentalApplyRequestErrors] = React.useState<Partial<CreateBookReviewRequestErrors>>({});

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickOpen = () => {
    setOpenConfirm(true);
  };

  const handleSubmit = () => {
    setLoading(true);
    CreateBookReview(choseClient.clientId, props.bookInfo.id, {
      rate: formValues.rate,
      review: formValues.review,
      apiToken: me.apiToken,
    })
      .then((res) => {
        setOpenConfirm(false);
        if (res.succeeded) {
          props.onSuccess();
          setBookCreateRentalApplyRequestErrors({});
          enqueueSnackbar("レビューを投稿しました。", {
            variant: "success",
          });
        } else {
          setBookCreateRentalApplyRequestErrors(res.errors);
          enqueueSnackbar(`レビューの投稿に失敗しました`, {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setBookCreateRentalApplyRequestErrors({});
        enqueueSnackbar(`レビューの投稿に失敗しました`, { variant: "error" });
      });
  };

  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <Box className={styles.review__formContainer}>
        <Rating name="rate" value={formValues.rate} onChange={handleChange} className={styles.review__ratingForm} />
        <FormError errors={bookCreateReviewRequestErrors?.rate} />
        <Box className={styles.review__form}>
          <TextField
            onChange={handleChange}
            value={formValues.review}
            name="review"
            fullWidth
            label="レビュー"
            variant="standard"
            multiline
            required
            helperText={bookCreateReviewRequestErrors?.review}
            error={bookCreateReviewRequestErrors?.review !== undefined}
          />
          <Button variant="contained" onClick={handleClickOpen} className={styles.review__postButton} endIcon={<SendIcon />}>
            投稿
          </Button>
        </Box>
      </Box>
      <ConfirmDialog message={"レビューを投稿しますか？"} open={openConfirm} onClose={handleConfirmClose} handleSubmit={handleSubmit} />
      {props.bookInfo.reviews.map((review, index: number) => (
        <Box key={index} className={styles.review__listContainer}>
          <Box className={styles.review__valueContainer}>
            <Rating value={review.rate} className={styles.review__ratingReview} readOnly />
            <Box sx={{ color: "text.secondary" }} className={styles.review__reviewer}>
              {review.reviewer}
              <br />
              {review.reviewedAt}
            </Box>
          </Box>
          <Box className={styles.review__valueReview}>{review.review}</Box>
        </Box>
      ))}
    </>
  );
};

export default BookReviews;
