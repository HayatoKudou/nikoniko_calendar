import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import {Tooltip, Typography} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {withStyles} from "@material-ui/styles";

type Order = "asc" | "desc";

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: any;
  showActionIcon: boolean;
  showCheckBox: boolean;
}

const CustomTooltip = withStyles({
  tooltip: {
    maxWidth: 500
  }
})(Tooltip);

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {props.showCheckBox && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {props.showActionIcon && <TableCell />}
        {props.headCells.map((headCell: TableHeadCell, index: number) => (
          <TableCell key={index} align={"center"} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {headCell.helpText && (
                <CustomTooltip sx={{fontSize: 17}} placement={"top"} title={<Typography sx={{fontSize: 13, whiteSpace: "pre-wrap"}}>{headCell.helpText}</Typography>}>
                  <HelpOutlineIcon  />
                </CustomTooltip>
              )}
              {orderBy === headCell.id && (
                <Box sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

// @ts-ignore
export default EnhancedTableHead;
