import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import * as React from "react";
import styles from "../../../styles/components/purchase_applies/approval/index.module.scss";

interface Props {
  bookImage: Blob | null;
  purchaseApply: any;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const Step1 = (props: Props) => {
  const handleReject = () => {
    console.log("handleReject");
  };

  return (
    <>
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
        <Button onClick={() => props.setActiveStep(2)} variant="contained" sx={{ width: "100px" }}>
          {"承認"}
        </Button>
      </DialogActions>
    </>
  );
};

export default Step1;
