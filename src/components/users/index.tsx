import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { Configuration, DefaultApi } from "../../../api_client";
import appConfig from "../../../app-config";
import DeleteUser from "../../api/user/delete";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";
import CreateUser from "./create";
import CustomTable from "./table";
import UpdateUser from "./update";

const Users = () => {
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [selectUser, setSelectUser] = React.useState<User>();
  const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState<boolean>(false);
  const [openCreateConfirm, setOpenCreateConfirm] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<Array<User>>([]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    new DefaultApi(
      new Configuration({
        basePath: appConfig.apiOrigin,
        baseOptions: {
          headers: { Authorization: `Bearer ${me.apiToken}` },
        },
      })
    )
      .apiClientIdUsersGet(choseClient.clientId)
      .then((res) => {
        setLoading(false);
        setUsers(res.data.users);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("エラーが発生しました", {
          variant: "error",
        });
      });
  };

  if (loading) return <Spinner />;

  const handleEditUser = (e: { stopPropagation: any }, user: User) => {
    e.stopPropagation();
    setUpdateDialogOpen(true);
    setSelectUser(user);
  };

  const handleDeleteConfirmClose = () => {
    setOpenDeleteConfirm(false);
  };

  const handleClickDeleteButton = () => {
    setOpenDeleteConfirm(true);
  };

  const handleClickCreateButton = () => {
    setOpenCreateConfirm(true);
  };

  const handleDeleteUser = () => {
    setLoading(true);
    DeleteUser(choseClient.clientId, {
      user_ids: selectedUserIds,
      apiToken: me.apiToken,
    })
      .then(() => {
        enqueueSnackbar("削除しました", {
          variant: "success",
        });
        fetchUsers();
        setOpenDeleteConfirm(false);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`削除に失敗しました`, { variant: "error" });
      });
  };

  return (
    <>
      <CreateUser open={openCreateConfirm} onClose={() => setOpenCreateConfirm(false)} onSuccess={() => fetchUsers()} />
      {selectUser && (
        <UpdateUser user={selectUser} open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} onSuccess={() => fetchUsers()} />
      )}
      <ConfirmDialog message={"本当に削除しますか？"} open={openDeleteConfirm} onClose={handleDeleteConfirmClose} handleSubmit={handleDeleteUser} />
      <CustomTable
        users={users}
        handleEdit={handleEditUser}
        handleDelete={handleClickDeleteButton}
        handleCreate={handleClickCreateButton}
        selected={selectedUserIds}
        setSelected={setSelectedUserIds}
      />
    </>
  );
};

export default Users;
