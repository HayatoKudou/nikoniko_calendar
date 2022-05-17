import { Box, FormHelperText } from "@mui/material";
import * as React from "react";

const FormField = (props: { errors?: Array<string>; children: any }) => {
  return (
    <Box>
      {props.children}
      {props.errors?.map((error: string, key: number) => {
        return (
          <FormHelperText error={true} key={key}>
            {error}
          </FormHelperText>
        );
      })}
    </Box>
  );
};

export default FormField;
