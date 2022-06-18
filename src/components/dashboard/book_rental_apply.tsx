import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import CreateBookRentalApply, { BookRentalApplyRequestErrors } from "../../api/book/rental_apply/create";
import { useMe } from "../../store/me";
import FormError from "../form_error";
import Spinner from "../spinner";

interface Props {
  bookInfo: Book;
  success: () => void;
}

const BookRentalApply = (props: Props) => {
  const initDate = new Date();
  initDate.setDate(initDate.getDate() + 7);
  const { enqueueSnackbar } = useSnackbar();
  const [me] = useRecoilState(useMe);
  const [loading, setLoading] = React.useState(false);
  const [expectedReturnDate, setExpectedReturnDate] = React.useState<Date>(initDate);
  const [formValues, setFormValues] = React.useState({
    reason: "",
  });
  const [bookRentalApplyRequestErrors, setBookRentalApplyRequestErrors] = React.useState<Partial<BookRentalApplyRequestErrors>>({});

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    CreateBookRentalApply(me.clientId, props.bookInfo.id, {
      reason: formValues.reason,
      expected_return_date: expectedReturnDate,
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
        enqueueSnackbar(`申請に失敗しました`, {variant: "error"});
      });
  };

  return (
    <>
      <DialogTitle sx={{ textAlign: "center" }}>貸出申請</DialogTitle>
      <Box sx={{ padding: 2 }}>
        <Box>
          <TextField
            onChange={handleChange}
            value={formValues.reason}
            name="reason"
            autoFocus
            fullWidth
            label="申請理由"
            variant="standard"
            margin={"dense"}
            multiline
          />
          <FormError errors={bookRentalApplyRequestErrors.reason} />
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="返却予定日"
            inputFormat="yyyy/MM/dd"
            value={expectedReturnDate}
            onChange={(e) => {
              e && setExpectedReturnDate(e);
            }}
            renderInput={(params) => <TextField {...params} sx={{ marginTop: 2 }} />}
          />
          <Box>
            <FormError errors={bookRentalApplyRequestErrors.expected_return_date} />
          </Box>
        </LocalizationProvider>
      </Box>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          申請する
        </Button>
      </DialogActions>
    </>
  );
};

export default BookRentalApply;
