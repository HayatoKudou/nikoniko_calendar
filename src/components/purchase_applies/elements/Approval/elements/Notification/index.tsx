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
import { BookPurchaseAppliesListResponseBookPurchaseAppliesInner, PurchaseNotificationValidateErrorResponse } from "../../../../../../../api_client";
import Refuse from "../../../../../../api/book/purchase_apply/refuse";
import ApiClient from "../../../../../../lib/apiClient";
import { useChoseWorkspace } from "../../../../../../store/choseWorkspace";
import { useMe } from "../../../../../../store/me";
import ConfirmDialog from "../../../../../parts/confirm_dialog";
import Spinner from "../../../../../parts/spinner";
import styles from "./styles.module.scss";

interface Props {
  canNotification: boolean;
  bookImage: Blob | null;
  purchaseApply: BookPurchaseAppliesListResponseBookPurchaseAppliesInner;
  onSuccess: () => void;
  onClose: () => void;
}

export const Notification = (props: Props) => {
  const me = useRecoilValue(useMe);
  const choseWorkspace = useRecoilValue(useChoseWorkspace);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [openNotificationConfirm, setOpenNotificationConfirm] = React.useState<boolean>(false);
  const [openRefuseConfirm, setOpenRefuseConfirm] = React.useState<boolean>(false);
  const [notificationSkipConfirm, setNotificationSkipConfirm] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState({
    title: `書籍追加のお知らせ`,
    message: `【タイトル】${props.purchaseApply.book.title}\n【本の置き場所】${props.purchaseApply.location}`,
  });
  const [bookPurchaseNotificationRequestErrors, setBookPurchaseNotificationRequestErrors] = React.useState<PurchaseNotificationValidateErrorResponse>(
    {}
  );

  if (loading) return <Spinner />;

  const handleRefuse = () => {
    setLoading(true);
    Refuse(choseWorkspace.workspaceId, props.purchaseApply.book.id, {
      apiToken: me.apiToken,
    })
      .then(() => {
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

  const handleNotification = (skip: boolean) => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdBookIdPurchaseNotificationPost(choseWorkspace.workspaceId, props.purchaseApply.book.id, {
        title: formValues.title,
        message: formValues.message,
        skip: skip,
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar(skip ? "通知に成功しました" : "通知をスキップしました", { variant: "success" });
        props.onSuccess();
        props.onClose();
      })
      .catch((res) => {
        setLoading(false);
        enqueueSnackbar(`エラーが発生しました`, { variant: "error" });
        setBookPurchaseNotificationRequestErrors(res.response.data.errors);
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
        handleSubmit={() => handleNotification(false)}
      />
      <ConfirmDialog
        message={"本当に却下しますか？"}
        open={openRefuseConfirm}
        onClose={() => setOpenRefuseConfirm(false)}
        handleSubmit={handleRefuse}
      />
      <ConfirmDialog
        message={"本当にスキップしますか？"}
        open={notificationSkipConfirm}
        onClose={() => setNotificationSkipConfirm(false)}
        handleSubmit={() => handleNotification(true)}
      />
      <DialogContent>
        <Grid container>
          <Grid item xs={4} className={styles.notification__imageContainer}>
            {props.bookImage && props.bookImage instanceof Blob ? (
              <img className={styles.notification__image} src={URL.createObjectURL(props.bookImage)} alt={"書籍画像"} />
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
                  <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" />
                </a>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button className={styles.notification__button} onClick={() => setOpenRefuseConfirm(true)} variant="contained" color={"error"}>
          {"却下"}
        </Button>
        <Button className={styles.notification__button} onClick={() => setNotificationSkipConfirm(true)} variant="contained">
          {"スキップ"}
        </Button>
        {props.canNotification && (
          <Button className={styles.notification__button} onClick={() => setOpenNotificationConfirm(true)} variant="contained">
            {"通知"}
          </Button>
        )}
      </DialogActions>
    </>
  );
};
