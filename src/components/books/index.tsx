import CircleIcon from "@mui/icons-material/Circle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useRecoilValue } from "recoil";
import Config from "../../../config";
import useBooks from "../../api/book/list";
import { useMe } from "../../store/me";
import { bookStatusColor, bookStatusName } from "../../util/book";
import Update from "../books/update";
import Spinner from "../spinner";
import Confirm_dialog from "../confirm_dialog";
import DeleteBook from "../../api/book/delete";
import {useSnackbar} from "notistack";

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
    setOpenDeleteConfirm(true)
    setSelectedDeleteBook(book);
  }

  const handleConfirmClose = () => {
    setOpenDeleteConfirm(false)
    setSelectedDeleteBook(null);
  }

  const handleDeleteBook = () => {
    if(!selectedDeleteBook){
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
        mutate(`${Config.apiOrigin}/api/${me.clientId}/books`)
        setOpenDeleteConfirm(false);
        setDeleting(false);
      })
      .catch(() => {
        setDeleting(false);
        enqueueSnackbar(`削除に失敗しました`, { variant: "error" });
      });
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", height: "80px" }}>
        <Typography variant="h4">書籍管理</Typography>
      </Box>
      {selectBook && (
        <Update
          book={selectBook}
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          onSuccess={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/user/list`)}
        />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size={"small"}/>
              <TableCell>ステータス</TableCell>
              <TableCell align="right">カテゴリ</TableCell>
              <TableCell align="center" sx={{ width: "30%" }}>
                タイトル
              </TableCell>
              <TableCell align="center" sx={{ width: "40%" }}>
                本の説明
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.books?.map((book: Book, index: number) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>
                  <IconButton onClick={() => handleClickDeleteButton(book)}>
                    <DeleteForeverIcon />
                  </IconButton>
                  <Confirm_dialog message={"本当に削除しますか？"} open={openDeleteConfirm} onClose={handleConfirmClose} handleSubmit={handleDeleteBook} />
                  <IconButton onClick={() => handleEditBook(book)}>
                    <ModeEditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircleIcon color={bookStatusColor(book.status)} fontSize={"small"} />
                    {bookStatusName(book.status)}
                  </Box>
                </TableCell>
                <TableCell align="left">{book.category}</TableCell>
                <TableCell align="left">{book.title}</TableCell>
                <TableCell align="left">{book.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Books;
