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

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "ステータス",
  },
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "カテゴリ",
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "タイトル",
  },
  {
    id: "description",
    numeric: true,
    disablePadding: false,
    label: "本の説明",
  },
];

const Books = () => {
  const me = useRecoilValue(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const [deleting, setDeleting] = React.useState<boolean>(false);
  const [selectBook, setSelectBook] = React.useState<Book>();
  const [selectedDeleteBook, setSelectedDeleteBook] = React.useState<Book | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(false);
  const { loading, error, response, mutate } = useBooks();
  if (loading || deleting) return <Spinner />;
  if (error) {
    return <Spinner />;
  }

  const handleEditBook = (book: Book) => {
    setSelectBook(book);
    setUpdateDialogOpen(true);
  };

  const handleClickDeleteButton = (book: Book) => {
    setOpenDeleteConfirm(true);
    setSelectedDeleteBook(book);
  };

  const handleConfirmClose = () => {
    setOpenDeleteConfirm(false);
    setSelectedDeleteBook(null);
  };

  const handleDeleteBook = () => {
    if (!selectedDeleteBook) {
      return enqueueSnackbar(`削除に失敗しました`, {
        variant: "error",
      });
    }
    setDeleting(true);
    DeleteBook(me.clientId, {
      book_id: selectedDeleteBook.id,
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
      {selectBook && (
        <Update
          book={selectBook}
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          onSuccess={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/user/list`)}
        />
      )}
      <ConfirmDialog message={"本当に削除しますか？"} open={openDeleteConfirm} onClose={handleConfirmClose} handleSubmit={handleDeleteBook} />
      <CustomTable headCells={headCells} books={response.books} handleEdit={handleEditBook} handleDelete={handleClickDeleteButton} />
    </>
  );
};

export default Books;
