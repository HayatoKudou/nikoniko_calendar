import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Notification, { BookPurchaseNotificationRequestErrors } from "../../../api/book/purchase_apply/notification";
import { useMe } from "../../../store/me";
import styles from "../../../styles/components/purchase_applies/approval/index.module.scss";
import ConfirmDialog from "../../parts/confirm_dialog";
import Spinner from "../../parts/spinner";

interface Props {
  bookImage: Blob | null;
  purchaseApply: PurchaseApply;
  onSuccess: () => void;
  onClose: () => void;
}

const Step3 = (props: Props) => {
  const me = useRecoilValue(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [openNotificationConfirm, setOpenNotificationConfirm] = React.useState<boolean>(false);
  const [openRefuseConfirm, setOpenRefuseConfirm] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState({
    title: `書籍追加のお知らせ`,
    message: `【タイトル】${props.purchaseApply.book.title}\n【本の置き場所】${props.purchaseApply.location}`,
  });
  const [bookPurchaseNotificationRequestErrors, setBookPurchaseNotificationRequestErrors] = React.useState<
    Partial<BookPurchaseNotificationRequestErrors>
  >({});

  if (loading) return <Spinner />;

  const handleSubmit = () => {
    setLoading(true);
    Notification(me.clientId, props.purchaseApply.book.id, {
      title: formValues.title,
      message: formValues.message,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          enqueueSnackbar("通知しました", { variant: "success" });
          setOpenNotificationConfirm(false);
          props.onSuccess();
          props.onClose();
        } else {
          setBookPurchaseNotificationRequestErrors(res.errors);
          enqueueSnackbar(`通知に失敗しました`, { variant: "error" });
        }
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar(`通知に失敗しました`, { variant: "error" });
        setLoading(false);
      });
  };

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <ConfirmDialog
        message={"通知しますか？"}
        open={openNotificationConfirm}
        onClose={() => setOpenNotificationConfirm(false)}
        handleSubmit={handleSubmit}
      />
      <ConfirmDialog
        message={"本当に却下しますか？"}
        open={openRefuseConfirm}
        onClose={() => setOpenRefuseConfirm(false)}
        handleSubmit={handleSubmit}
      />
      <DialogContent>
        <Grid container>
          <Grid item xs={4} className={styles.dialog__imageContainer}>
            {props.bookImage && props.bookImage instanceof Blob ? (
              <img className={styles.dialog__image} src={URL.createObjectURL(props.bookImage)} alt={"書籍画像"} />
            ) : (
              <ImageNotSupportedIcon fontSize="large" />
            )}
          </Grid>
          <Grid item xs={8}>
            <TextField
              onChange={handleChange}
              value={formValues.title}
              name="title"
              label="タイトル"
              fullWidth
              variant="outlined"
              multiline
              margin={"dense"}
              helperText={bookPurchaseNotificationRequestErrors?.title}
              error={bookPurchaseNotificationRequestErrors?.title !== undefined}
            />
            <TextField
              onChange={handleChange}
              value={formValues.message}
              name="message"
              label="メッセージ"
              fullWidth
              variant="outlined"
              multiline
              rows={7}
              margin={"dense"}
              helperText={bookPurchaseNotificationRequestErrors?.message}
              error={bookPurchaseNotificationRequestErrors?.message !== undefined}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenRefuseConfirm(true)} variant="contained" sx={{ width: "100px" }} color={"error"}>
          {"却下"}
        </Button>
        <Button onClick={() => setOpenNotificationConfirm(true)} variant="contained" sx={{ width: "100px" }}>
          {"通知"}
        </Button>
      </DialogActions>
    </>
  );
};

export default Step3;
