import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";

const BookRentalApply = () => {
  const initDate = new Date();
  initDate.setDate(initDate.getDate() + 7);
  const [formValues, setFormValues] = React.useState({
    reason: "",
    date: initDate,
  });

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <DialogTitle sx={{ textAlign: "center" }}>貸出申請</DialogTitle>
      <Box sx={{ padding: 2 }}>
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
        {/*<FormError errors={bookApplyRequestErrors["title"]} />*/}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="返却予定日"
            inputFormat="yyyy/MM/dd"
            value={formValues.date}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} sx={{ marginTop: 2 }} />}
          />
        </LocalizationProvider>
      </Box>
      <DialogActions>
        <Button variant="contained">申請する</Button>
      </DialogActions>
    </>
  );
};

export default BookRentalApply;
