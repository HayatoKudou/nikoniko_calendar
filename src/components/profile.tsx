import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import * as React from "react";
import FormField from "./form_field";

const Profile = () => {
  const [formValues, setFormValues] = React.useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  });
  const [createRequestErrors, setCreateRequestErrors] = React.useState<Partial<any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid container sx={{ display: "block", width: "70%", margin: "0 auto" }}>
      <Grid item xl={12}>
        <Paper>
          <Box sx={{ padding: 2 }}>
            <Box sx={{ display: "flex" }}>
              <FormField errors={createRequestErrors["lastName"]}>
                <TextField
                  value={formValues.lastName}
                  fullWidth
                  onChange={handleChange}
                  name={"lastName"}
                  label={"性"}
                  required
                  inputProps={{ minLength: 1, maxLength: 100 }}
                />
              </FormField>

              <FormField errors={createRequestErrors["firstName"]}>
                <TextField
                  value={formValues.firstName}
                  fullWidth
                  onChange={handleChange}
                  name={"firstName"}
                  label={"名"}
                  required
                  inputProps={{ minLength: 1, maxLength: 100 }}
                />
              </FormField>
            </Box>

            <FormField errors={createRequestErrors["email"]}>
              <TextField
                value={formValues.email}
                fullWidth
                onChange={handleChange}
                name={"email"}
                label={"メールアドレス"}
                required
                inputProps={{ minLength: 1, maxLength: 100 }}
              />
            </FormField>

            <FormField errors={createRequestErrors["password"]}>
              <TextField
                type={"password"}
                value={formValues.password}
                fullWidth
                onChange={handleChange}
                name={"password"}
                label={"パスワード"}
                required
                inputProps={{ minLength: 1, maxLength: 100 }}
              />
            </FormField>

            <Box sx={{ textAlign: "right", margin: 2 }}>
              <Button type={"submit"} startIcon={<SaveIcon />} variant={"contained"}>
                作成
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
