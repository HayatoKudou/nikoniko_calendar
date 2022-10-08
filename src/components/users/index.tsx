import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { UsersListResponseUsersInner } from "../../../api_client";
import ApiClient from "../../lib/apiClient";
import { useChoseWorkspace } from "../../store/choseWorkspace";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";
import CreateUser from "./create";
import CustomTable from "./table";
import UpdateUser from "./update";

const Users = () => {
  const me = useRecoilValue(useMe);
  const choseWorkspace = useRecoilValue(useChoseWorkspace);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [users, setUsers] = React.useState<Array<UsersListResponseUsersInner>>([]);
  const [selectUser, setSelectUser] = React.useState<UsersListResponseUsersInner>();
  const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState<boolean>(false);
  const [openCreateConfirm, setOpenCreateConfirm] = React.useState<boolean>(false);

  React.useEffect(() => {
    fetchUsers();
  }, [choseWorkspace]);

  const fetchUsers = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiWorkspaceIdUsersGet(choseWorkspace.workspaceId)
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

  const handleEditUser = (e: { stopPropagation: any }, user: UsersListResponseUsersInner) => {
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
    ApiClient(me.apiToken)
      .apiWorkspaceIdUserDelete(choseWorkspace.workspaceId, {
        userIds: selectedUserIds,
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("削除しました", { variant: "success" });
        fetchUsers();
        setOpenDeleteConfirm(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`エラーが発生しました`, { variant: "error" });
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
