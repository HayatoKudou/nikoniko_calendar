import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Notification, { BookPurchaseNotificationRequestErrors } from "../../../api/book/purchase_apply/notification";
import Refuse from "../../../api/book/purchase_apply/refuse";
import { useChoseClient } from "../../../store/choseClient";
import { useMe } from "../../../store/me";
import styles from "../../../styles/components/purchase_applies/approval/index.module.scss";
import ConfirmDialog from "../../parts/confirm_dialog";
import Spinner from "../../parts/spinner";

interface Props {
  canNotification: boolean;
  bookImage: Blob | null;
  purchaseApply: PurchaseApply;
  onSuccess: () => void;
  onClose: () => void;
}

const Step3 = (props: Props) => {
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
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

  const handleRefuse = () => {
    setLoading(true);
    Refuse(choseClient.clientId, props.purchaseApply.book.id, {
      apiToken: me.apiToken,
    })
      .then((res) => {
        enqueueSnackbar("却下しました", { variant: "success" });
        setLoading(false);
        props.onSuccess();
        props.onClose();
      })
      .catch(() => {
        enqueueSnackbar(`却下に失敗しました`, { variant: "error" });
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    setLoading(true);
    Notification(choseClient.clientId, props.purchaseApply.book.id, {
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
          enqueueSnackbar(res.errors.slack ? res.errors.slack : "通知に失敗しました", { variant: "error" });
          setBookPurchaseNotificationRequestErrors(res.errors);
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
        handleSubmit={handleRefuse}
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
            {props.canNotification ? (
              <>
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
              </>
            ) : (
              <>
                <Typography sx={{ marginBottom: 2 }}>
                  購入申請通知・入荷通知を利用するにはSlackチャンネルとの連携が必要です。
                  <br />
                  下記ボタンから連携後、チャンネルにアプリを追加してください。
                </Typography>
                <a
                  target={"_blank"}
                  href="https://slack.com/oauth/v2/authorize?client_id=3812085668740.3835544940032&scope=incoming-webhook,users:read,users:read.email,chat:write&user_scope="
                  rel="noreferrer"
                >
                  <img
                    alt="Add to Slack"
                    height="40"
                    width="139"
                    src="https://platform.slack-edge.com/img/add_to_slack.png"
                    srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
                  />
                </a>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenRefuseConfirm(true)} variant="contained" sx={{ width: "100px" }} color={"error"}>
          {"却下"}
        </Button>
        {props.canNotification && (
          <Button onClick={() => setOpenNotificationConfirm(true)} variant="contained" sx={{ width: "100px" }}>
            {"通知"}
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export default Step3;
