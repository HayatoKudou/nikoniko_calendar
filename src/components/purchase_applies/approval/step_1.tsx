import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Allow from "../../../api/book/purchase_apply/allow";
import { useMe } from "../../../store/me";
import styles from "../../../styles/components/purchase_applies/approval/index.module.scss";
import ConfirmDialog from "../../parts/confirm_dialog";
import Spinner from "../../parts/spinner";

interface Props {
  bookImage: Blob | null;
  purchaseApply: any;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const Step1 = (props: Props) => {
  const me = useRecoilValue(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);

  if (loading) return <Spinner />;

  const handleReject = () => {
    console.log("handleReject");
  };

  const handleSubmit = () => {
    setLoading(true);
    Allow(me.clientId, props.purchaseApply.book.id, {
      apiToken: me.apiToken,
    })
      .then((res) => {
        enqueueSnackbar("承認しました", { variant: "success" });
        setOpenConfirm(false);
        props.setActiveStep(2);
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar(`承認に失敗しました`, { variant: "error" });
        setLoading(false);
      });
  };

  return (
    <>
      <ConfirmDialog message={"本当に承認しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
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
            {props.purchaseApply.book.url && (
              <Box className={styles.dialog__detailContainer}>
                <Typography className={styles.dialog__detailItem}>URL</Typography>
                <Link target="_blank" className={styles.dialog__detailUrl} href={props.purchaseApply.book.url}>
                  {props.purchaseApply.book.url}
                </Link>
              </Box>
            )}
            <Box className={styles.dialog__detailContainer}>
              <Typography className={styles.dialog__detailItem}>申請理由</Typography>
              <Typography>{props.purchaseApply.reason}</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReject} variant="contained" sx={{ width: "100px" }} color={"error"}>
          {"却下"}
        </Button>
        <Button onClick={() => setOpenConfirm(true)} variant="contained" sx={{ width: "100px" }}>
          {"承認"}
        </Button>
      </DialogActions>
    </>
  );
};

export default Step1;
