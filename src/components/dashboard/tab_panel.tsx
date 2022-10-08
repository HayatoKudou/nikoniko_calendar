import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";

export const TabPanel = (props: { children?: React.ReactNode; index: string; value: string }) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography component="div" sx={{ display: "flex", flexWrap: "wrap" }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
};
