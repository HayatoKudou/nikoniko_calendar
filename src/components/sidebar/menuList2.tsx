import ApartmentIcon from "@mui/icons-material/Apartment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ClientsResponseInner } from "../../../api_client";
import ApiClient from "../../lib/apiClient";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import Spinner from "../parts/spinner";

const MenuList = (props: { open: boolean }) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const theme = useTheme();
  const [choseClient, setChoseClient] = useRecoilState(useChoseClient);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [clients, setClients] = React.useState<null | Array<ClientsResponseInner>>(null);

  React.useEffect(() => {
    fetchClient();
  }, []);

  if (loading) return <Spinner />;

  const fetchClient = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiClientIdClientsGet(choseClient.clientId)
      .then((res) => {
        setClients(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("エラーが発生しました", {
          variant: "error",
        });
      });
  };

  const handleSelect = (clientId: number) => {
    setChoseClient({ clientId: clientId });
  };

  console.log(clients);

  return (
    <List component="div">
      {clients?.map((client, index) => (
        <Tooltip title={client.name} key={index} placement={"right"}>
          <ListItemButton
            onClick={() => handleSelect(client.id)}
            selected={choseClient.clientId == client.id}
            sx={{
              minHeight: 48,
              justifyContent: props.open ? "initial" : "center",
              px: 2.5,
              "&.Mui-selected": {
                backgroundColor: theme.palette.mode === "light" ? "#455a6478" : "",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: props.open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <ApartmentIcon />
            </ListItemIcon>
            <ListItemText primary={client.name} sx={{ opacity: props.open ? 1 : 0 }} />
          </ListItemButton>
        </Tooltip>
      ))}
    </List>
  );
};

export default MenuList;
