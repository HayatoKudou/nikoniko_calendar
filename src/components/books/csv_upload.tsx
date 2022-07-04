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
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import BulkCreate from "../../api/book/bulk_create";
import { useMe } from "../../store/me";
import Spinner from "../spinner";

interface Props {
  open: boolean;
  handleClose: any;
  handleSuccess: () => void;
}

interface CSV {
  カテゴリ: string;
  タイトル: string;
  本の説明: string;
  URL: string;
}

const CsvUpload = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const [csvData, setCsvData] = React.useState<Array<CSV> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const fileReader = new FileReader();

  if (loading) return <Spinner />;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      fileReader.onload = function (event) {
        const csvString = event.target!.result as string;
        const replacedResult = csvString.replace(/['"]+/g, "");
        // @ts-ignore
        csvFileToArray(replacedResult);
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const csvFileToArray = (csvString: string) => {
    const csvHeader = csvString.slice(0, csvString.indexOf("\n")).slice(0, csvString.indexOf("\r")).split(",");
    const csvRows = csvString.slice(csvString.indexOf("\n") + 1).split("\n");
    const csvArray = csvRows.map((row) => {
      const values = row.split(",");
      return csvHeader.reduce((object, header, index) => {
        // @ts-ignore
        object[header] = values[index];
        return object;
      }, {});
    }) as Array<CSV>;
    setCsvData(csvArray);
  };

  const handleSubmit = () => {
    if (csvData === null) {
      return enqueueSnackbar("CSVファイルが選択されていません", { variant: "error" });
    }
    setLoading(true);
    BulkCreate(me.clientId, {
      books: csvData,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          enqueueSnackbar("一括登録に成功しました", { variant: "success" });
          props.handleSuccess();
        } else {
          enqueueSnackbar(res.errors, { variant: "error" });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`一括登録に失敗しました`, { variant: "error" });
      });
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth={"xl"}>
      <DialogTitle>{"CSV一括登録"}</DialogTitle>
      <DialogContent>
        <input type={"file"} accept={".csv"} onChange={handleOnChange} />
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table sx={{ tableLayout: "fixed" }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: "10%" }}>
                  カテゴリ
                </TableCell>
                <TableCell align="center" sx={{ width: "30%" }}>
                  タイトル
                </TableCell>
                <TableCell align="center" sx={{ width: "30%" }}>
                  本の説明
                </TableCell>
                <TableCell align="center" sx={{ width: "30%" }}>
                  URL
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {csvData?.map((csv, index) => (
                <TableRow key={index}>

                  <TableCell align="center">{csv.カテゴリ}</TableCell>
                  <TableCell align="left">{csv.タイトル}</TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "break-word" }}>
                    {csv.本の説明}
                  </TableCell>
                  <TableCell align="left" sx={{ overflowWrap: "break-word" }}>
                    {csv.URL}
                  </TableCell>
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
        <Button onClick={handleSubmit} variant="contained">
          登録
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CsvUpload;
