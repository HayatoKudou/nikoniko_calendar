import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import useUsers from "../../api/user/list";
import Spinner from "../spinner";
import AddUser from "./add_user";

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const Users = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { loading, error, response } = useUsers();
  if (loading) return <Spinner />;
  if (error) {
    return <Spinner />;
  }
  console.log(response);

  return (
    <>
      <AddUser open={dialogOpen} setClose={() => setDialogOpen(false)} />
      <Box sx={{ display: "flex", alignItems: "center", height: "80px" }}>
        <Typography variant="h4">ユーザー管理</Typography>
        <Button variant="contained" sx={{ marginLeft: "auto" }} onClick={() => setDialogOpen(true)}>
          ユーザー追加
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名前</TableCell>
              <TableCell align="right">メールアドレス</TableCell>
              <TableCell align="right">権限</TableCell>
              <TableCell align="right">パスワード</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.users.map((user: User, index: number) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.role}</TableCell>
                <TableCell align="right">{user.password}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Users;
