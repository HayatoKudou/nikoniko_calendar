import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import useUsers from "../../api/user/list";
import Spinner from "../spinner";

const Users = () => {
  const { loading, error, response, mutate } = useUsers();
  if (loading) return <Spinner />;
  if (error) {
    return <Spinner />;
  }

  const handleEditUser = (user: User) => {
    console.log("handleEditUser");
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>名前</TableCell>
              <TableCell align="right">メールアドレス</TableCell>
              <TableCell align="center">ロール</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.users?.map((user: User, index: number) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>
                  <IconButton onClick={() => handleEditUser(user)}>
                    <ModeEditIcon />
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="center">
                  {user.role.is_account_manager ? <Chip label="アカウント管理" /> : null}
                  {user.role.is_book_manager ? <Chip label="書籍管理" /> : null}
                  {user.role.is_client_manager ? <Chip label="組織管理" /> : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Users;
