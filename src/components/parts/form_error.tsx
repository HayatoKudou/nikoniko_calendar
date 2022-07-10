import { FormHelperText } from "@mui/material";
import * as React from "react";

const FormError = (props: { errors?: Array<string> }) => {
  return (
    <>
      {props.errors?.map((error: string, key: number) => {
        return (
          <FormHelperText error={true} key={key} sx={{ display: "inline" }}>
            {error}
          </FormHelperText>
        );
      })}
    </>
  );
};

export default FormError;
