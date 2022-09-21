import FeedbackIcon from "@mui/icons-material/Feedback";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import Send, { FeedBackRequestErrors } from "../../api/feed_back/send";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";
import ListItemButton from "./listItemButton";
import Typography from "@mui/material/Typography";

const MenuList3 = (props: { open: boolean }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState({
    message: "",
  });
  const [feedBackRequestErrors, setFeedBackRequestErrors] = React.useState<Partial<FeedBackRequestErrors>>({});

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    Send({
      message: formValues.message,
    })
      .then((res) => {
        if (res.succeeded) {
          setFeedBackRequestErrors({});
          enqueueSnackbar("フィードバックを送信しました。ありがとうございます。", {
            variant: "success",
          });
        } else {
          setFeedBackRequestErrors(res.errors);
          enqueueSnackbar(`フィードバックの送信に失敗しました。`, {
            variant: "error",
          });
        }
        setOpenConfirm(false);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`フィードバックの送信に失敗しました。`, { variant: "error" });
      });
  };

  return (
    <>
      <List component="div">
        <ListItemButton
          open={props.open}
          listItemText={"フィードバック"}
          selected={false}
          icon={<FeedbackIcon />}
          handleSelect={() => setDialogOpen(true)}
        />
      </List>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth={"sm"}>
        <DialogTitle>フィードバック</DialogTitle>
        <DialogContent>
          <Typography>※ フォローバックは匿名で送信されます。</Typography>
          <TextField
            onChange={handleChange}
            value={formValues.message}
            name="message"
            label="メッセージ"
            variant="outlined"
            rows={4}
            fullWidth
            multiline
            required
            margin={"dense"}
            helperText={feedBackRequestErrors?.message}
            error={feedBackRequestErrors?.message !== undefined}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="contained" color={"error"}>
            キャンセル
          </Button>
          <Button onClick={() => setOpenConfirm(true)} variant="contained" endIcon={<SendIcon />}>
            送信
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        message={"フィードバックを送信しますか？"}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default MenuList3;
