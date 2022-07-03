import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Config from "../../../config";
import DeleteBook from "../../api/book/delete";
import useBooks from "../../api/book/list";
import { useMe } from "../../store/me";
import Update from "../books/update";
import ConfirmDialog from "../confirm_dialog";
import Create from "../dashboard/book_register";
import Spinner from "../spinner";
import CsvUpload from "./csv_upload";
import CustomTable from "./table";

const Books = () => {
  const me = useRecoilValue(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const [selectedEditBook, setSelectedEditBook] = React.useState<Book>();
  const [selectedBookIds, setSelectedBookIds] = React.useState<number[]>([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(false);
  const [csvUploadDialogOpen, setCsvUploadDialogOpen] = React.useState<boolean>(false);
  const { loading, error, response, mutate } = useBooks();

  if (loading || deleting || error) return <Spinner />;

  const handleEditBook = (e: { stopPropagation: any }, book: Book) => {
    e.stopPropagation();
    setSelectedEditBook(book);
    setUpdateDialogOpen(true);
  };

  const handleClickCreateButton = () => {
    setCreateDialogOpen(true);
  };

  const handleClickCsvUploadButton = () => {
    setCsvUploadDialogOpen(true);
  };

  const handleClickDeleteButton = () => {
    setOpenDeleteConfirm(true);
  };

  const handleConfirmClose = () => {
    setOpenDeleteConfirm(false);
  };

  const handleSuccess = () => {
    mutate(`${Config.apiOrigin}/api/${me.clientId}/books`);
  };

  const handleDeleteBook = () => {
    setDeleting(true);
    DeleteBook(me.clientId, {
      book_ids: selectedBookIds,
      apiToken: me.apiToken,
    })
      .then(() => {
        enqueueSnackbar("削除しました", {
          variant: "success",
        });
        setOpenDeleteConfirm(false);
        setDeleting(false);
        handleSuccess();
      })
      .catch(() => {
        setDeleting(false);
        enqueueSnackbar(`削除に失敗しました`, { variant: "error" });
      });
  };

  return (
    <>
      <CsvUpload open={csvUploadDialogOpen} handleClose={() => setCsvUploadDialogOpen(false)} />
      <Create open={createDialogOpen} setClose={() => setCreateDialogOpen(false)} success={handleSuccess} />
      {selectedEditBook && (
        <Update
          book={selectedEditBook}
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          onSuccess={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/user/list`)}
        />
      )}
      <ConfirmDialog message={"本当に削除しますか？"} open={openDeleteConfirm} onClose={handleConfirmClose} handleSubmit={handleDeleteBook} />
      <CustomTable
        books={response.books}
        handleCsvUpload={handleClickCsvUploadButton}
        handleCreate={handleClickCreateButton}
        handleEdit={handleEditBook}
        handleDelete={handleClickDeleteButton}
        selected={selectedBookIds}
        setSelected={setSelectedBookIds}
      />
    </>
  );
};

export default Books;
