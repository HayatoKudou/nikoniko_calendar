import AddIcon from "@mui/icons-material/Add";
import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
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
import styles from "../../styles/components/books/table.module.scss";
import { bookStatusColor, bookStatusName } from "../../util/book";
import { getComparator, stableSort } from "../../util/table";
import CsvDownload from "../parts/csv_download";
import TableHead from "../parts/table_head";

type Order = "asc" | "desc";
interface TableToolbarProps {
  books: Array<Book>;
  numSelected: number;
  handleCreate: () => void;
  handleDelete: () => void;
  handleCsvUpload: () => void;
}

interface Props {
  books: Array<Book>;
  handleCreate: () => void;
  handleEdit: (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, book: Book) => void;
  handleDelete: () => void;
  handleCsvUpload: () => void;
  selected: Array<any>;
  setSelected: Dispatch<SetStateAction<any>>;
}

const headCells: readonly TableHeadCell[] = [
  {
    id: "status",
    numeric: false,
    label: "ステータス",
  },
  {
    id: "category",
    numeric: false,
    label: "カテゴリ",
  },
  {
    id: "title",
    numeric: false,
    label: "タイトル",
  },
  {
    id: "description",
    numeric: false,
    label: "本の説明",
  },
  {
    id: "createdAt",
    numeric: false,
    label: "登録日",
  },
];

const TableToolbar = (props: TableToolbarProps) => {
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
        <Typography className={styles.booksTable__toolBar} color="inherit">
          {numSelected} 選択中
        </Typography>
      ) : (
        <Typography className={styles.booksTable__toolBar} variant="h5">
          書籍管理
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="削除">
          <IconButton onClick={() => props.handleDelete()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="書籍登録">
            <IconButton onClick={props.handleCreate}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="CSVアップロード">
            <IconButton onClick={props.handleCsvUpload}>
              <UploadIcon />
            </IconButton>
          </Tooltip>
          <CsvDownload
            csvDataGenerator={() => {
              return props.books.map((book: Book) => {
                return {
                  カテゴリ: book.category,
                  タイトル: book.title,
                  本の説明: book.description,
                  URL: book.url || "",
                };
              });
            }}
          />
        </>
      )}
    </Toolbar>
  );
};

const CustomTable = (props: Props) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState("status");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = props.books.map((n: any) => n.id);
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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.books.length) : 0;

  return (
    <Paper>
      <TableToolbar
        books={props.books}
        numSelected={props.selected.length}
        handleCsvUpload={props.handleCsvUpload}
        handleCreate={props.handleCreate}
        handleDelete={props.handleDelete}
      />
      <TableContainer>
        <Table className={styles.booksTable} size="small">
          <TableHead
            numSelected={props.selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={props.books.length}
            headCells={headCells}
            showActionIcon={true}
            showCheckBox={true}
          />
          <TableBody>
            {/*@ts-ignore*/}
            {stableSort(props.books, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book: any, index) => {
                const isItemSelected = isSelected(book.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, book.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={book.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} inputProps={{ "aria-labelledby": labelId }} />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => props.handleEdit(e, book)}>
                        <ModeEditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Box className={styles.booksTable__actionIcon}>
                        <CircleIcon color={bookStatusColor(book.status)} fontSize={"small"} />
                        {bookStatusName(book.status)}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{book.category}</TableCell>
                    <TableCell className={styles.booksTable__title}>{book.title}</TableCell>
                    <TableCell className={styles.booksTable__title}>{book.description}</TableCell>
                    <TableCell align="left">{book.createdAt}</TableCell>
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
        count={props.books.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CustomTable;
