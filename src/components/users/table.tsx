import DeleteIcon from "@mui/icons-material/Delete";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Dispatch, SetStateAction } from "react";
import styles from "../../styles/components/users/table.module.scss";
import { getComparator, stableSort } from "../../util/table";
import TableHead from "../parts/table_head";

type Order = "asc" | "desc";

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: any;
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleCreate: () => void;
  handleDelete: () => void;
}

interface Props {
  users: Array<User>;
  handleCreate: () => void;
  handleEdit: (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, user: User) => void;
  handleDelete: () => void;
  selected: Array<any>;
  setSelected: Dispatch<SetStateAction<any>>;
}

const headCells: readonly TableHeadCell[] = [
  {
    id: "name",
    numeric: false,
    label: "名前",
  },
  {
    id: "email",
    numeric: false,
    label: "メールアドレス",
  },
  {
    id: "role",
    numeric: false,
    label: "ロール",
  },
];

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography className={styles.booksTable__toolBar} component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={styles.booksTable__toolBar} component="div">
          ユーザー管理
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="ユーザー削除">
          <IconButton onClick={() => props.handleDelete()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="ユーザー追加">
          <IconButton onClick={props.handleCreate}>
            <GroupAddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const CustomTable = (props: Props) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = props.users.map((n: any) => n.id);
      props.setSelected(newSelecteds);
      return;
    }
    props.setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = props.selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(props.selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(props.selected.slice(1));
    } else if (selectedIndex === props.selected.length - 1) {
      newSelected = newSelected.concat(props.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(props.selected.slice(0, selectedIndex), props.selected.slice(selectedIndex + 1));
    }
    props.setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => props.selected.indexOf(id) !== -1;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.users.length) : 0;

  return (
    <Paper>
      <EnhancedTableToolbar numSelected={props.selected.length} handleCreate={props.handleCreate} handleDelete={props.handleDelete} />
      <TableContainer>
        <Table className={styles.booksTable} size="small">
          <TableHead
            numSelected={props.selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={props.users.length}
            headCells={headCells}
            showActionIcon={true}
            showCheckBox={true}
          />
          <TableBody>
            {/*@ts-ignore*/}
            {stableSort(props.users, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user: any, index) => {
                const isItemSelected = isSelected(user.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, user.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={user.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} inputProps={{ "aria-labelledby": labelId }} />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => props.handleEdit(e, user)}>
                        <ModeEditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">{user.name}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">
                      {user.role.is_account_manager ? <Chip label="アカウント管理" /> : null}
                      {user.role.is_book_manager ? <Chip label="書籍管理" /> : null}
                      {user.role.is_client_manager ? <Chip label="組織管理" /> : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={props.users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
export default CustomTable;
