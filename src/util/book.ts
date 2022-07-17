export const BOOK_STATUS = {
  STATUS_CAN_LEND: 1,
  STATUS_CAN_NOT_LEND: 2,
  STATUS_APPLYING: 3,
};

export const bookStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return "success";
    case 2:
      return "error";
    case 3:
      return "warning";
    default:
      return "success";
  }
};

export const bookStatusName = (status: number) => {
  switch (status) {
    case 1:
      return "貸出可能";
    case 2:
      return "貸出中";
    case 3:
      return "購入申請中";
    default:
      return "貸出可能";
  }
};

export const bookPurchaseAllowStep = (step: number) => {
  switch (step) {
    case 0:
      return "申請却下済み";
    case 1:
      return "申請許可";
    case 2:
      return "購入確認";
    case 3:
      return "入荷のお知らせ";
  }
};
