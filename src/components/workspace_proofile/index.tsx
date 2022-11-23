import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { WorkspaceUpdateValidateErrorResponse } from "../../../api_client";
import Config from "../../../app-config";
import ApiClient from "../../lib/apiClient";
import { useChoseWorkspace } from "../../store/choseWorkspace";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";

interface Props {
  open: boolean;
  onClose: () => void;
}

const tabList = [{ label: "基本情報" }, { label: "プラン選択" }, { label: "通知設定" }];

const WorkspaceProfile = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseWorkspace = useRecoilValue(useChoseWorkspace);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    id: 0,
    name: "",
    plan: "",
  });
  const [updateRequestErrors, setUpdateRequestErrors] = React.useState<WorkspaceUpdateValidateErrorResponse>({});
  const [openTabValue, setOpenTabValue] = React.useState("基本情報");
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    fetchWorkspace();
  }, [choseWorkspace]);

  if (loading) return <Spinner />;

  const fetchWorkspace = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdWorkspaceGet(choseWorkspace.workspaceId)
      .then((res) => {
        setLoading(false);
        setFormValues(res.data);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("エラーが発生しました", {
          variant: "error",
        });
      });
  };

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
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdWorkspacePut(choseWorkspace.workspaceId, {
        name: formValues.name,
        plan: formValues.plan,
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("更新に成功しました。", { variant: "success" });
        fetchWorkspace();
        setOpenConfirm(false);
        setUpdateRequestErrors({});
      })
      .catch((res) => {
        setLoading(false);
        enqueueSnackbar(`更新に失敗しました`, { variant: "error" });
        setUpdateRequestErrors(res.response.data.errors);
      });
  };

  const connectSlack = () => {
    ApiClient(me.apiToken)
      .apiSlackWorkspaceIdConnectGet(choseWorkspace.workspaceId)
      .then(() => {
        open(
          `https://slack.com/oauth/v2/authorize?client_id=3812085668740.3835544940032&scope=incoming-webhook,users:read,users:read.email,chat:write&redirect_uri=${Config.oauthSlackRedirectUri}`,
          "_blank"
        );
      })
      .catch(() => {
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
        setLoading(false);
      });
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"md"}>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Grid container sx={{ display: "block", margin: "0 auto" }}>
          <Box sx={{ padding: 2 }}>
            <Tabs value={openTabValue} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
              {tabList.map((tab, index: number) => (
                <Tab label={tab.label} key={index} value={tab.label} />
              ))}
            </Tabs>

            {openTabValue === "基本情報" && (
              <TextField
                value={formValues.name}
                fullWidth
                onChange={handleChange}
                name={"name"}
                label={"ワークスペース名"}
                required
                inputProps={{ minLength: 1, maxLength: 255 }}
                variant="standard"
                margin={"normal"}
                helperText={updateRequestErrors?.name}
                error={updateRequestErrors?.name !== undefined}
              />
            )}

            {openTabValue === "プラン選択" && (
              <>
                <Grid item xs={12} md={12}></Grid>
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

            {openTabValue === "通知設定" && (
              <>
                <Typography sx={{ margin: 2 }}>
                  購入申請通知・入荷通知で利用するSlackチャンネルと連携
                  <br />※ 連携後、チャンネルにアプリを追加してください
                </Typography>
                <img
                  style={{ cursor: "pointer" }}
                  onClick={connectSlack}
                  alt="Add to Slack"
                  height="40"
                  width="139"
                  src="https://platform.slack-edge.com/img/add_to_slack.png"
                  srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
                />
              </>
            )}
            <ConfirmDialog message={"本当に更新しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        {openTabValue !== "通知設定" && (
          <Button type={"submit"} variant={"contained"} onClick={() => setOpenConfirm(true)} sx={{ marginBottom: 1, marginRight: 1 }}>
            更新する
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WorkspaceProfile;
