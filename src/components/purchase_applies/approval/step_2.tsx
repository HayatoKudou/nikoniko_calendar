import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { BookPurchaseAppliesListResponseBookPurchaseAppliesInner } from "../../../../api_client";
import Done, { BookPurchaseDoneRequestErrors } from "../../../api/book/purchase_apply/done";
import Refuse from "../../../api/book/purchase_apply/refuse";
import { useChoseWorkspace } from "../../../store/choseWorkspace";
import { useMe } from "../../../store/me";
import styles from "../../../styles/components/purchase_applies/approval/index.module.scss";
import ConfirmDialog from "../../parts/confirm_dialog";
import Spinner from "../../parts/spinner";

interface Props {
  bookImage: Blob | null;
  purchaseApply: BookPurchaseAppliesListResponseBookPurchaseAppliesInner;
  onSuccess: () => void;
  onClose: () => void;
}

const Step2 = (props: Props) => {
  const me = useRecoilValue(useMe);
  const choseWorkspace = useRecoilValue(useChoseWorkspace);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [openDoneConfirm, setOpenDoneConfirm] = React.useState<boolean>(false);
  const [openRefuseConfirm, setOpenRefuseConfirm] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState({
    location: "",
  });
  const [bookPurchaseDoneRequestErrors, setBookPurchaseDoneRequestErrors] = React.useState<Partial<BookPurchaseDoneRequestErrors>>({});

  if (loading) return <Spinner />;

  const handleRefuse = () => {
    setLoading(true);
    Refuse(choseWorkspace.workspaceId, props.purchaseApply.book.id, {
      apiToken: me.apiToken,
    })
      .then((res) => {
        enqueueSnackbar("却下しました", { variant: "success" });
        setOpenDoneConfirm(false);
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
    Done(choseWorkspace.workspaceId, props.purchaseApply.book.id, {
      location: formValues.location,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          enqueueSnackbar("記録しました", { variant: "success" });
          setOpenDoneConfirm(false);
          props.onSuccess();
        } else {
          setBookPurchaseDoneRequestErrors(res.errors);
          enqueueSnackbar(`記録に失敗しました`, { variant: "error" });
        }
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar(`記録に失敗しました`, { variant: "error" });
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
        message={"購入が完了しましたか？"}
        open={openDoneConfirm}
        onClose={() => setOpenDoneConfirm(false)}
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
            <Box className={styles.dialog__detailContainer}>
              <Typography className={styles.dialog__detailItem}>申請者</Typography>
              <Typography>{props.purchaseApply.user.name}</Typography>
            </Box>
            <Box className={styles.dialog__detailContainer}>
              <Typography className={styles.dialog__detailItem}>価格</Typography>
              <Typography>{"¥ " + props.purchaseApply.price}</Typography>
            </Box>
            <Box className={styles.dialog__detailContainer}>
              <Typography className={styles.dialog__detailItem}>タイトル</Typography>
              <Typography>{props.purchaseApply.book.title}</Typography>
            </Box>
            <Box className={styles.dialog__detailContainer}>
              <Typography className={styles.dialog__detailItem}>URL</Typography>
              {props.purchaseApply.book.url && (
                <Link target="_blank" className={styles.dialog__detailUrl} href={props.purchaseApply.book.url}>
                  {props.purchaseApply.book.url}
                </Link>
              )}
            </Box>
            <Box className={styles.dialog__detailContainer}>
              <Typography className={styles.dialog__detailItem}>申請理由</Typography>
              <Typography>{props.purchaseApply.reason}</Typography>
            </Box>
            <TextField
              onChange={handleChange}
              value={formValues.location}
              name="location"
              label="置き場所"
              fullWidth
              variant="standard"
              required
              helperText={bookPurchaseDoneRequestErrors?.location}
              error={bookPurchaseDoneRequestErrors?.location !== undefined}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenRefuseConfirm(true)} variant="contained" sx={{ width: "100px" }} color={"error"}>
          {"却下"}
        </Button>
        <Button onClick={() => setOpenDoneConfirm(true)} variant="contained" sx={{ width: "100px" }}>
          {"購入済み"}
        </Button>
      </DialogActions>
    </>
  );
};

export default Step2;
