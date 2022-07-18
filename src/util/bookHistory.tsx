import ClearIcon from "@mui/icons-material/Clear";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import RefreshIcon from "@mui/icons-material/Refresh";
import StopCircleIcon from "@mui/icons-material/StopCircle";

export const historyActionName = (action: string) => {
  switch (action) {
    case "create book":
      return "登録";
    case "return book":
      return "返却";
    case "purchase book":
      return "購入申請";
    case "lend book":
      return "貸出";
    case "purchase accepted":
      return "申請許可";
    case "purchase done":
      return "購入完了";
    case "purchase refused":
      return "申請却下";
    case "purchase init":
      return "申請却下取消";
    default:
      return "その他";
  }
};

export const historyActionIcon = (action: string): JSX.Element => {
  switch (action) {
    case "create book":
      return <DoneIcon />;
    case "return book":
      return <KeyboardReturnIcon />;
    case "purchase book":
      return <LocalPostOfficeIcon />;
    case "lend book":
      return <StopCircleIcon />;
    case "purchase accepted":
      return <DoneIcon />;
    case "purchase done":
      return <DeliveryDiningIcon />;
    case "purchase refused":
      return <ClearIcon />;
    case "purchase init":
      return <RefreshIcon />;
    default:
      return <></>;
  }
};
