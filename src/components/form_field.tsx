import { Box, FormHelperText } from "@mui/material";
import * as React from "react";

const FormField = (props: { errors?: Array<string>; children: any }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        minWidth: "50%",
      }}
    >
      <Box sx={{ marginLeft: 1, flexGrow: 1 }}>
        {props.children}
        {props.errors?.map((error: string, key: number) => {
          return (
            <FormHelperText error={true} key={key}>
              {error}
            </FormHelperText>
          );
        })}
      </Box>
    </Box>
  );
};

export default FormField;
