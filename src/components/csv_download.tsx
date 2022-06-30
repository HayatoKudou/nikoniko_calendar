import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
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
    <Tooltip title="CSVダウンロード">
      <IconButton onClick={handleClick}>
        <DownloadIcon />
        {csvData.length > 0 && <CSVDownloadModule data={csvData} target="_blank" />}
      </IconButton>
    </Tooltip>
  );
};

export default CsvDownload;
