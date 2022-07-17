import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { base64ToBlob } from "../../../util/image";
import Step1 from "./step_1";
import Steper from "./steper";

interface Props {
  open: boolean;
  purchaseApply: any;
  onSuccess: () => void;
  onClose: () => void;
}

const Approval = (props: Props) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [bookImage, setBookImage] = React.useState<Blob | null>(props.purchaseApply.book.image);

  React.useEffect(() => {
    if (props.purchaseApply.book.image && typeof props.purchaseApply.book.image === "string") {
      setBookImage(base64ToBlob(props.purchaseApply.book.image));
    }
    setActiveStep(props.purchaseApply.step);
  }, [props.purchaseApply]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"md"}>
      <DialogTitle>申請許可</DialogTitle>
      <Steper activeStep={activeStep} />
      {activeStep === 0 ? <Step1 bookImage={bookImage} purchaseApply={props.purchaseApply} setActiveStep={setActiveStep} /> : <></>}
    </Dialog>
  );
};

// @ts-ignore
export default Approval;
