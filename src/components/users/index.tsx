import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import Config from "../../../config";
import DeleteUser from "../../api/user/delete";
import useUsers from "../../api/user/list";
import { useMe } from "../../store/me";
import ConfirmDialog from "../confirm_dialog";
import Spinner from "../spinner";
import CreateUser from "./create_user";
import CustomTable from "./table";
import UpdateUser from "./update_user";

const Users = () => {
  const [me] = useRecoilState(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [selectUser, setSelectUser] = React.useState<User>();
  const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState<boolean>(false);
  const [openCreateConfirm, setOpenCreateConfirm] = React.useState<boolean>(false);
  const { loading, error, response, mutate } = useUsers();

  if (deleting || loading || error) return <Spinner />;

  const handleEditUser = (user: User) => {
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
    setDeleting(true);
    DeleteUser(me.clientId, {
      user_ids: selectedUserIds,
      apiToken: me.apiToken,
    })
      .then(() => {
        enqueueSnackbar("削除しました", {
          variant: "success",
        });
        mutate(`${Config.apiOrigin}/api/${me.clientId}/books`);
        setOpenDeleteConfirm(false);
        setDeleting(false);
      })
      .catch(() => {
        setDeleting(false);
        enqueueSnackbar(`削除に失敗しました`, { variant: "error" });
      });
  };

  return (
    <>
      <CreateUser
        open={openCreateConfirm}
        onClose={() => setOpenCreateConfirm(false)}
        onSuccess={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/user/list`)}
      />
      {selectUser && (
        <UpdateUser
          user={selectUser}
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          onSuccess={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/user/list`)}
        />
      )}
      <ConfirmDialog message={"本当に削除しますか？"} open={openDeleteConfirm} onClose={handleDeleteConfirmClose} handleSubmit={handleDeleteUser} />
      <CustomTable
        users={response.users}
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
