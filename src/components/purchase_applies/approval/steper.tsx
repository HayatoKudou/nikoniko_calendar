import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import * as React from "react";

interface Props {
  activeStep: number;
}

const steps = ["申請許可", "購入", "通知"];

const CustomStepper = (props: Props) => {
  return (
    <Stepper activeStep={props.activeStep} sx={{ margin: 2 }}>
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

export default CustomStepper;
