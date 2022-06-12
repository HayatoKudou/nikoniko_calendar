import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Update, { UpdateClientRequestErrors } from "../api/client/update";
import { useMe } from "../store/me";
import { useClientInfo } from "../store/clientInfo";
import FormError from "./form_error";
import Spinner from "./spinner";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const clientInfo = useRecoilValue(useClientInfo);
  const [loading, setLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    id: 0,
    name: "",
    plan: "",
  });
  const [createRequestErrors, setCreateRequestErrors] = React.useState<Partial<UpdateClientRequestErrors>>({});

  React.useEffect(() => {
    setFormValues({
      id: clientInfo.id,
      name: clientInfo.name,
      plan: "",
    });
  }, []);

  if (loading) return <Spinner />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    Update(me.clientId, {
      id: formValues.id,
      name: formValues.name,
      plan: formValues.plan,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setCreateRequestErrors({});
          enqueueSnackbar("ユーザーの更新に成功しました。", {
            variant: "success",
          });
        } else {
          setCreateRequestErrors(res.errors);
          enqueueSnackbar(`ユーザー登録に失敗しました`, {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`ユーザーの登録に失敗しました`, {
          variant: "error",
        });
      });
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", height: "80px" }}>
        <Typography variant="h4">組織設定</Typography>
      </Box>
      <Grid container sx={{ display: "block", width: "70%", margin: "0 auto" }}>
        <Paper>
          <Box sx={{ padding: 2 }}>
            <TextField
              value={formValues.name}
              fullWidth
              onChange={handleChange}
              name={"name"}
              label={"組織名"}
              required
              inputProps={{ minLength: 1, maxLength: 255 }}
              variant="standard"
              margin={"normal"}
            />
            <FormError errors={createRequestErrors?.name} />

            <Box sx={{justifyContent: 'center', display: "flex"}}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{margin: 1}}>
                  <CardHeader title={"FREE"}></CardHeader>
                  <CardContent>
                    <Box px={1}>
                      <Typography variant="h3" component="h2" gutterBottom={true}>
                        ¥0<Typography variant="h6" color="textSecondary" component="span">/ 月</Typography>
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle1" component="p">メンバー: 30</Typography>
                      <Typography color="textSecondary" variant="subtitle1" component="p">書籍: 100</Typography>
                    </Box>
                    <Button variant="outlined" color="primary">Select plan</Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{margin: 1}}>
                  <CardHeader title={"BETA"}></CardHeader>
                  <CardContent>
                    <Box px={1}>
                      <Typography variant="h3" component="h2" gutterBottom={true}>
                        ¥0<Typography variant="h6" color="textSecondary" component="span">/ 月</Typography>
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle1" component="p">メンバー: 無制限</Typography>
                      <Typography color="textSecondary" variant="subtitle1" component="p">書籍: 無制限</Typography>
                    </Box>
                    <Button variant="outlined" color="primary">Select plan</Button>
                  </CardContent>
                </Card>
              </Grid>
            </Box>

            <Box sx={{ textAlign: "right", margin: 2 }}>
              <Button type={"submit"} variant={"contained"} onClick={handleSubmit}>
                更新する
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default Profile;
