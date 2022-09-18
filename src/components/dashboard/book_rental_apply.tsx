import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { BooksResponseBooksInner } from "../../../api_client";
import CreateBookRentalApply, { BookRentalApplyRequestErrors } from "../../api/book/rental_apply/create";
import { useChoseWorkspace } from "../../store/choseWorkspace";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import FormError from "../parts/form_error";
import Spinner from "../parts/spinner";

interface Props {
  bookInfo: BooksResponseBooksInner;
  success: () => void;
}

const BookRentalApply = (props: Props) => {
  const initDate = new Date();
  initDate.setDate(initDate.getDate() + 7);
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseWorkspace = useRecoilValue(useChoseWorkspace);
  const [loading, setLoading] = React.useState(false);
  const [expectedReturnDate, setExpectedReturnDate] = React.useState<Date>(initDate);
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
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
    setOpenConfirm(false);
    CreateBookRentalApply(choseWorkspace.workspaceId, props.bookInfo.id, {
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
        enqueueSnackbar(`申請に失敗しました`, { variant: "error" });
      });
  };

  return (
    <Box sx={{ position: "absolute", bottom: "16px", width: "90%" }}>
      <Box>
        <TextField
          onChange={handleChange}
          value={formValues.reason}
          name="reason"
          autoFocus
          fullWidth
          label="貸出理由"
          variant="outlined"
          rows={2}
          margin={"dense"}
          multiline
          required
          helperText={bookRentalApplyRequestErrors?.reason}
          error={bookRentalApplyRequestErrors?.reason !== undefined}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="返却予定日"
            inputFormat="yyyy/MM/dd"
            value={expectedReturnDate}
            onChange={(e) => {
              e && setExpectedReturnDate(e);
            }}
            renderInput={(params) => <TextField required {...params} sx={{ marginTop: 2 }} />}
          />
          <Box>
            <FormError errors={bookRentalApplyRequestErrors.expected_return_date} />
          </Box>
        </LocalizationProvider>
        <Button variant="contained" onClick={() => setOpenConfirm(true)} sx={{ margin: "16px 0px 16px auto", whiteSpace: "nowrap" }}>
          貸出申請
        </Button>
        <ConfirmDialog message={"本当に貸出申請しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default BookRentalApply;
