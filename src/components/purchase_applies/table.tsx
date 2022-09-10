import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { BookPurchaseAppliesListResponseBookPurchaseAppliesInner } from "../../../api_client";
import styles from "../../styles/components/purchase_applies/table.module.scss";
import { bookPurchaseAcceptStep } from "../../util/book";
import { getComparator, stableSort } from "../../util/table";
import TableHead from "../parts/table_head";

type Order = "asc" | "desc";

interface Props {
  bookPurchaseApplies: Array<any>;
  handleEdit: (
    e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>,
    book: BookPurchaseAppliesListResponseBookPurchaseAppliesInner
  ) => void;
  handleInit: (purchaseApply: BookPurchaseAppliesListResponseBookPurchaseAppliesInner) => void;
}

const headCells: readonly TableHeadCell[] = [
  {
    id: "createdAt",
    label: "申請日",
  },
  {
    id: "step",
    label: "次のステップ",
  },
  {
    id: "userName",
    label: "申請者",
  },
  {
    id: "price",
    label: "価格",
  },
  {
    id: "title",
    label: "タイトル",
  },
  {
    id: "reason",
    label: "申請理由",
  },
  {
    id: "url",
    label: "URL",
  },
];

const CustomTable = (props: Props) => {
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState("createdAt");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <Typography className={styles.booksTable__toolBar} variant="h5">
        申請管理
      </Typography>
      <TableContainer>
        <Table className={styles.booksTable} size="small">
          <TableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            numSelected={0}
            rowCount={props.bookPurchaseApplies.length}
            headCells={headCells}
            showActionIcon={true}
            showCheckBox={false}
          />
          <TableBody>
            {stableSort(props.bookPurchaseApplies, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              //@ts-ignore
              .map((purchaseApply: BookPurchaseAppliesListResponseBookPurchaseAppliesInner) => {
                return (
                  <TableRow key={purchaseApply.book.id} sx={{ backgroundColor: purchaseApply.step === 0 ? "text.disabled" : "" }}>
                    <TableCell>
                      {purchaseApply.step === 0 ? (
                        <IconButton onClick={(e) => props.handleInit(purchaseApply)}>
                          <RefreshIcon />
                        </IconButton>
                      ) : (
                        <IconButton onClick={(e) => props.handleEdit(e, purchaseApply)}>
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell align="left">{purchaseApply.createdAt}</TableCell>
                    <TableCell align="left">{bookPurchaseAcceptStep(purchaseApply.step)}</TableCell>
                    <TableCell align="left">{purchaseApply.user.name}</TableCell>
                    <TableCell align="left">{"¥ " + purchaseApply.price}</TableCell>
                    <TableCell className={styles.booksTable__title}>{purchaseApply.book.title}</TableCell>
                    <TableCell className={styles.booksTable__title}>{purchaseApply.reason}</TableCell>
                    <TableCell className={styles.booksTable__title}>
                      {purchaseApply.book.url ? (
                        <Link href={purchaseApply.book.url} target={"__blank"}>
                          {decodeURI(purchaseApply.book.url)}
                        </Link>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={props.bookPurchaseApplies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

// @ts-ignore
export default CustomTable;
