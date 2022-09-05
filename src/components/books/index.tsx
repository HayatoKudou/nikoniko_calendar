import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { BooksResponseBooksInner } from "../../../api_client";
import DeleteBook from "../../api/book/delete";
import ApiClient from "../../lib/apiClient";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import Update from "../books/update";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";
import Create from "./create";
import CsvUpload from "./csv_upload";
import CustomTable from "./table";

const Books = () => {
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const chosenClient = useRecoilValue(useChoseClient);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedEditBook, setSelectedEditBook] = React.useState<Book>();
  const [selectedBookIds, setSelectedBookIds] = React.useState<number[]>([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(false);
  const [csvUploadDialogOpen, setCsvUploadDialogOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(false);
  const [books, setBooks] = React.useState<Array<BooksResponseBooksInner>>([]);

  React.useEffect(() => {
    fetchBooks();
  }, [chosenClient]);

  if (loading) return <Spinner />;

  const fetchBooks = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiClientIdBooksGet(choseClient.clientId)
      .then((res) => {
        setBooks(res.data.books);
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
        setLoading(false);
      });
  };

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
    fetchBooks();
  };

  const handleDeleteBook = () => {
    DeleteBook(choseClient.clientId, {
      book_ids: selectedBookIds,
      apiToken: me.apiToken,
    })
      .then(() => {
        enqueueSnackbar("削除しました", {
          variant: "success",
        });
        setOpenDeleteConfirm(false);
        handleSuccess();
      })
      .catch(() => {
        enqueueSnackbar(`削除に失敗しました`, { variant: "error" });
      });
  };

  return (
    <>
      <CsvUpload open={csvUploadDialogOpen} handleClose={() => setCsvUploadDialogOpen(false)} handleSuccess={handleSuccess} />
      <Create open={createDialogOpen} setClose={() => setCreateDialogOpen(false)} success={handleSuccess} />
      {selectedEditBook && (
        <Update
          book={selectedEditBook}
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          // onSuccess={() => mutate(`${Config.apiOrigin}/api/${choseClient.clientId}/user/list`)}
          onSuccess={fetchBooks}
        />
      )}
      <ConfirmDialog message={"本当に削除しますか？"} open={openDeleteConfirm} onClose={handleConfirmClose} handleSubmit={handleDeleteBook} />
      <CustomTable
        books={books}
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
