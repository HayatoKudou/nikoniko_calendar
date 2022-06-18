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
