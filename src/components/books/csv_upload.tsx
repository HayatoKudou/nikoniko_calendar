import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";

interface Props {
  open: boolean;
  handleClose: any;
}

interface CSV {
  タイトル: string;
}

export default function AlertDialog(props: Props) {
  const [csvData, setCsvData] = React.useState<Array<CSV> | null>(null);
  const fileReader = new FileReader();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    if (e.target.files) {
      fileReader.onload = function (event) {
        // @ts-ignore
        csvFileToArray(event.target.result);
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const csvFileToArray = (csvString: string) => {
    const csvHeader = csvString.slice(0, csvString.indexOf("\n")).split(",");
    const csvRows = csvString.slice(csvString.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      return csvHeader.reduce((object, header, index) => {
        // @ts-ignore
        object[header] = values[index];
        return object;
      }, {});
    }) as Array<CSV>;
    setCsvData(array);
  };
  console.log(csvData);

  return (
    <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth={"md"}>
      <DialogTitle id="alert-dialog-title">{"CSV一括登録"}</DialogTitle>
      <DialogContent>
        <input type={"file"} accept={".csv"} onChange={handleOnChange} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">タイトル</TableCell>
                <TableCell align="center">Amazon URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {csvData?.map((csv, index) => (
                <TableRow key={index}>
                  <TableCell align="right">{csv.タイトル}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="contained">
          キャンセル
        </Button>
        <Button onClick={props.handleClose} variant="contained">
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
}
