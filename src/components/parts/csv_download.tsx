import DownloadIcon from "@mui/icons-material/Download";
import Chip from "@mui/material/Chip";
import * as React from "react";
import { CSVDownload as CSVDownloadModule } from "react-csv";

interface CsvDownload {
  csvDataGenerator: () => Array<{ [key: string]: string | number }>;
}

const CsvDownload = ({ csvDataGenerator }: CsvDownload) => {
  const [csvData, setCsvData] = React.useState<Array<{ [key: string]: string | number }>>([]);

  const handleClick = () => {
    setCsvData(csvDataGenerator());
  };

  return (
    <>
      <Chip label="CSVダウンロード" icon={<DownloadIcon />} onClick={handleClick} sx={{ margin: "2px" }} />
      {csvData.length > 0 && <CSVDownloadModule data={csvData} target="_blank" />}
    </>
  );
};

export default CsvDownload;
