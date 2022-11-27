import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { base64ToBlob } from "../../../../util/image";
import { Accept } from "./elements/Accept";
import { Done } from "./elements/Done";
import { Notification } from "./elements/Notification";
import { CustomStepper } from "./elements/Stepper";

interface Props {
  open: boolean;
  canNotification: boolean;
  purchaseApply: any;
  onSuccess: () => void;
  onClose: () => void;
}

export const Approval = (props: Props) => {
  const [activeStep, setActiveStep] = React.useState(1);
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
      <CustomStepper activeStep={activeStep - 1} />
      {activeStep === 1 ? (
        <Accept bookImage={bookImage} purchaseApply={props.purchaseApply} onSuccess={props.onSuccess} onClose={props.onClose} />
      ) : activeStep === 2 ? (
        <Done bookImage={bookImage} purchaseApply={props.purchaseApply} onSuccess={props.onSuccess} onClose={props.onClose} />
      ) : activeStep === 3 ? (
        <Notification
          bookImage={bookImage}
          purchaseApply={props.purchaseApply}
          onSuccess={props.onSuccess}
          onClose={props.onClose}
          canNotification={props.canNotification}
        />
      ) : (
        <></>
      )}
    </Dialog>
  );
};
