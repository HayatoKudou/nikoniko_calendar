import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Config from "../../../config";
import useClientInfo from "../../api/client/info";
import Update, { UpdateClientRequestErrors } from "../../api/client/update";
import { useMe } from "../../store/me";
import ConfirmDialog from "../confirm_dialog";
import FormError from "./../form_error";
import Spinner from "./../spinner";

const purchaseLimitUnits = [
  {
    value: "everyYear",
    label: "年",
  },
  {
    value: "monthly",
    label: "月",
  },
  {
    value: "weekly",
    label: "週",
  },
];

const tabList = [{ label: "基本情報" }, { label: "プラン選択" }];

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    id: 0,
    name: "",
    plan: "",
    purchaseLimit: 0,
    purchaseLimitUnit: "monthly",
  });
  const [createRequestErrors, setCreateRequestErrors] = React.useState<Partial<UpdateClientRequestErrors>>({});
  const [openTabValue, setOpenTabValue] = React.useState("基本情報");
  const { loading, error, response, mutate } = useClientInfo();

  React.useEffect(() => {
    if (response) {
      setFormValues({
        id: response.client.id,
        name: response.client.name,
        plan: response.client.plan,
        purchaseLimit: response.client.purchaseLimit,
        purchaseLimitUnit: response.client.purchaseLimitUnit,
      });
    }
  }, [response]);

  if (loading || updating) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue !== undefined) {
      setOpenTabValue(newValue);
    }
  };

  const handleSubmit = () => {
    setUpdating(true);
    Update(me.clientId, {
      name: formValues.name,
      purchase_limit: formValues.purchaseLimit,
      purchase_limit_unit: formValues.purchaseLimitUnit,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setCreateRequestErrors({});
          enqueueSnackbar("更新に成功しました。", {
            variant: "success",
          });
          mutate(`${Config.apiOrigin}/api/${me.clientId}/client`);
        } else {
          setCreateRequestErrors(res.errors);
          enqueueSnackbar(`更新に失敗しました`, {
            variant: "error",
          });
        }
        setUpdating(false);
      })
      .catch(() => {
        setUpdating(false);
        enqueueSnackbar(`更新に失敗しました`, { variant: "error" });
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
            <Tabs value={openTabValue} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
              {tabList.map((tab, index: number) => (
                <Tab label={tab.label} key={index} value={tab.label} />
              ))}
            </Tabs>

            {openTabValue === "基本情報" && (
              <>
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

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    value={formValues.purchaseLimit}
                    fullWidth
                    onChange={handleChange}
                    name={"purchaseLimit"}
                    label={"購入補助金上限"}
                    required
                    variant="standard"
                    margin={"normal"}
                    type={"number"}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                    }}
                  />
                  <FormError errors={createRequestErrors?.purchase_limit} />
                  <Box sx={{ padding: 2 }}>/</Box>
                  <TextField select name={"purchaseLimitUnit"} value={formValues.purchaseLimitUnit} onChange={handleChange} sx={{ minWidth: "80px" }}>
                    {purchaseLimitUnits.map((purchaseLimitUnit) => (
                      <MenuItem key={purchaseLimitUnit.value} value={purchaseLimitUnit.value}>
                        {purchaseLimitUnit.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormError errors={createRequestErrors?.purchase_limit_unit} />
                </Box>
              </>
            )}

            {openTabValue === "プラン選択" && (
              <>
                <Grid item xs={12} md={12}>
                  <Box>{"現在の登録ユーザー人数： " + response.client.users + "人"}</Box>
                  <Box>{"現在の登録書籍数： " + response.client.books + "冊"}</Box>
                </Grid>
                <Box sx={{ justifyContent: "center", display: "flex" }}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ margin: 1, minWidth: "200px" }}>
                      <CardHeader title={"FREE"}></CardHeader>
                      <CardContent>
                        <Box px={1}>
                          <Typography variant="h3" component="h2" gutterBottom={true}>
                            ¥0
                            <Typography variant="h6" color="textSecondary" component="span">
                              / 月
                            </Typography>
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle1" component="p">
                            ユーザー上限: 30
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle1" component="p">
                            書籍上限: 100
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          name="plan"
                          value="free"
                          onClick={handleChange}
                          endIcon={formValues.plan === "free" && <CheckIcon />}
                        >
                          Select plan
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ margin: 1, minWidth: "200px" }}>
                      <CardHeader title={"BETA"}></CardHeader>
                      <CardContent>
                        <Box px={1}>
                          <Typography variant="h3" component="h2" gutterBottom={true}>
                            ¥0
                            <Typography variant="h6" color="textSecondary" component="span">
                              / 月
                            </Typography>
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle1" component="p">
                            ユーザー上限: 無制限
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle1" component="p">
                            書籍上限: 無制限
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          name="plan"
                          value="beta"
                          onClick={handleChange}
                          endIcon={formValues.plan === "beta" && <CheckIcon />}
                        >
                          Select plan
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Box>
              </>
            )}

            <Box sx={{ textAlign: "right", margin: 2 }}>
              <Button type={"submit"} variant={"contained"} onClick={() => setOpenConfirm(true)}>
                更新する
              </Button>
            </Box>
            <ConfirmDialog message={"本当に更新しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default Profile;
