import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import CreateBookReview, { CreateBookReviewRequestErrors } from "../../api/book/review/create";
import { useMe } from "../../store/me";
import Confirm_dialog from "../confirm_dialog";
import FormError from "../form_error";
import Spinner from "../spinner";

interface Props {
  bookInfo: Book;
  onSuccess: () => void;
}

const BookReviews = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
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
    CreateBookReview(me.clientId, props.bookInfo.id, {
      rate: formValues.rate,
      review: formValues.review,
      apiToken: me.apiToken,
    })
      .then((res) => {
        setOpenConfirm(false);
        if (res.succeeded) {
          props.onSuccess();
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
        enqueueSnackbar(`レビューの投稿に失敗しました`, { variant: "error" });
      });
  };

  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Rating name="rate" value={formValues.rate} onChange={handleChange} sx={{ display: "flex" }} />
        <FormError errors={bookCreateReviewRequestErrors?.rate} />
        <TextField
          onChange={handleChange}
          value={formValues.review}
          name="review"
          fullWidth
          label="レビュー"
          variant="standard"
          margin={"dense"}
          multiline
          required
        />
        <FormError errors={bookCreateReviewRequestErrors?.review} />
      </Box>
      <DialogActions>
        <Button variant="contained" onClick={handleClickOpen}>
          レビュー投稿
        </Button>
      </DialogActions>
      <Confirm_dialog message={"レビューを投稿しますか？"} open={openConfirm} onClose={handleConfirmClose} handleSubmit={handleSubmit} />
      {props.bookInfo.reviews.map((review: Review, index: number) => (
        <Box key={index} sx={{ padding: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Rating value={review.rate} sx={{ fontSize: "20px" }} readOnly />
            <Box sx={{ color: "text.secondary", marginLeft: "50px" }}>
              {review.reviewer}
              <br />
              {review.reviewedAt}
            </Box>
          </Box>
          <Box sx={{ whiteSpace: "pre-wrap" }}>{review.review}</Box>
        </Box>
      ))}
    </>
  );
};

export default BookReviews;
