import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Config from "../../../config";
import DeleteBook from "../../api/book/delete";
import useBooks from "../../api/book/list";
import { useMe } from "../../store/me";
import Update from "../books/update";
import ConfirmDialog from "../confirm_dialog";
import Spinner from "../spinner";
import CustomTable from "./table";

const Books = () => {
  const me = useRecoilValue(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const [selectedEditBook, setSelectedEditBook] = React.useState<Book>();
  const [selectedBookIds, setSelectedBookIds] = React.useState<number[]>([]);
  const [selectedDeleteBook, setSelectedDeleteBook] = React.useState<Book | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(false);
  const { loading, error, response, mutate } = useBooks();
  if (loading || deleting) return <Spinner />;
  if (error) {
    return <Spinner />;
  }

  const handleEditBook = (e: { stopPropagation: any }, book: Book) => {
    e.stopPropagation();
    setSelectedEditBook(book);
    setUpdateDialogOpen(true);
  };

  const handleClickDeleteButton = () => {
    setOpenDeleteConfirm(true);
  };

  const handleConfirmClose = () => {
    setOpenDeleteConfirm(false);
    setSelectedDeleteBook(null);
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
        mutate(`${Config.apiOrigin}/api/${me.clientId}/books`);
        setOpenDeleteConfirm(false);
        setDeleting(false);
      })
      .catch((e) => {
        console.log(e.message);
        setDeleting(false);
        enqueueSnackbar(`削除に失敗しました`, { variant: "error" });
      });
  };

  return (
    <>
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
        handleEdit={handleEditBook}
        handleDelete={handleClickDeleteButton}
        selected={selectedBookIds}
        setSelected={setSelectedBookIds}
      />
    </>
  );
};

export default Books;
