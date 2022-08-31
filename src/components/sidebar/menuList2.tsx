import List from "@mui/material/List";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import ApiClient from "../../lib/apiClient";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import Spinner from "../parts/spinner";

const MenuList = (props: { open: boolean }) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    fetchClient();
  }, []);

  if (loading) return <Spinner />;

  const fetchClient = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiClientIdClientsGet(choseClient.clientId)
      .then((res) => {
        console.log(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("エラーが発生しました", {
          variant: "error",
        });
      });
  };

  return (
    <List component="div">
      {/*{menuList.map((menu, index) => (*/}
      {/*  <ListItemButton onClick={() => handleSelect(menu.path)} key={index}>*/}
      {/*    <ListItemIcon*/}
      {/*      sx={{*/}
      {/*        minWidth: 0,*/}
      {/*        mr: props.open ? 3 : "auto",*/}
      {/*        justifyContent: "center",*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <MenuListIcon name={menu.name} />*/}
      {/*    </ListItemIcon>*/}
      {/*    <ListItemText primary={menu.title} sx={{ opacity: props.open ? 1 : 0 }} />*/}
      {/*  </ListItemButton>*/}
      {/*))}*/}
    </List>
  );
};

export default MenuList;
