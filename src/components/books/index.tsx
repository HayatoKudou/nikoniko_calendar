import CircleIcon from "@mui/icons-material/Circle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useRecoilState } from "recoil";
import Config from "../../../config";
import useBooks from "../../api/book/list";
import { useMe } from "../../store/me";
import { bookStatusColor, bookStatusName } from "../../util/book";
import Update from "../books/update";
import Spinner from "../spinner";

const Books = () => {
  const [me] = useRecoilState(useMe);
  const [selectBook, setSelectBook] = React.useState<Book>();
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const { loading, error, response, mutate } = useBooks();
  if (loading) return <Spinner />;
  if (error) {
    return <Spinner />;
  }

  const handleEditBook = (book: Book) => {
    setSelectBook(book);
    setUpdateDialogOpen(true);
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ステータス</TableCell>
              <TableCell align="right">カテゴリ</TableCell>
              <TableCell align="center" sx={{ width: "30%" }}>
                タイトル
              </TableCell>
              <TableCell align="center" sx={{ width: "40%" }}>
                説明
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.books?.map((book: Book, index: number) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>
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
