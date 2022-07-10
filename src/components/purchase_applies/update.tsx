import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { useMe } from "../../store/me";
import styles from "../../styles/components/purchase_applies/update.module.scss";
import { base64ToBlob } from "../../util/image";
import Spinner from "../parts/spinner";

interface Props {
  open: boolean;
  purchaseApply: any;
  onSuccess: () => void;
  onClose: () => void;
}

const steps = ["申請許可", "購入", "通知"];

const Update = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const [loading, setLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedImage, setSelectedImage] = React.useState<Blob | null>(props.purchaseApply.book.image);

  React.useEffect(() => {
    if (props.purchaseApply.book.image && typeof props.purchaseApply.book.image === "string") {
      setSelectedImage(base64ToBlob(props.purchaseApply.book.image));
    }
  }, []);

  if (loading) return <Spinner />;

  const CustomStepper = () => {
    return (
      <Stepper activeStep={activeStep} sx={{ margin: 2 }}>
        {steps.map((label, index) => {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    );
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"md"}>
      <DialogTitle>申請許可</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <CustomStepper />
          </Grid>
          <Grid item xs={4} className={styles.dialog__imageContainer}>
            {selectedImage && selectedImage instanceof Blob ? (
              <img className={styles.dialog__image} src={URL.createObjectURL(selectedImage)} alt={"書籍画像"} />
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
        <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained" sx={{ width: "120px" }} color={"error"}>
          {"却下"}
        </Button>
        <Button onClick={() => setActiveStep(activeStep + 1)} variant="contained" sx={{ width: "120px" }}>
          {"承認"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Update;
