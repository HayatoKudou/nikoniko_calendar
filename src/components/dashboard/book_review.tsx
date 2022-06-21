import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import CreateBookReview, { CreateBookReviewRequestErrors } from "../../api/book/review/create";
import { useMe } from "../../store/me";
import FormError from "../form_error";
import Spinner from "../spinner";

interface Props {
  bookInfo: Book;
  success: () => void;
}

const BookReview = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [me] = useRecoilState(useMe);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    rate: null,
    review: "",
  });
  const [bookReviewRequestErrors, setBookRentalApplyRequestErrors] = React.useState<Partial<CreateBookReviewRequestErrors>>({});

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    CreateBookReview(me.clientId, {
      review: formValues.review,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setBookRentalApplyRequestErrors({});
          props.success();
          enqueueSnackbar("申請しました。", {
            variant: "success",
          });
        } else {
          setBookRentalApplyRequestErrors(res.errors);
          enqueueSnackbar(`申請に失敗しました`, {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setBookRentalApplyRequestErrors({});
        enqueueSnackbar(`申請に失敗しました`, { variant: "error" });
      });
  };

  return (
    <>
      <DialogTitle sx={{ textAlign: "center" }}>返却 & レビュー</DialogTitle>
      <Box sx={{ padding: 2 }}>
        <Rating name="rate" value={formValues.rate} onChange={handleChange} />
        <TextField
          onChange={handleChange}
          value={formValues.review}
          name="review"
          fullWidth
          label="レビュー"
          variant="standard"
          margin={"dense"}
          multiline
        />
        <FormError errors={bookReviewRequestErrors.review} />
      </Box>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          返却
        </Button>
      </DialogActions>
    </>
  );
};

export default BookReview;
