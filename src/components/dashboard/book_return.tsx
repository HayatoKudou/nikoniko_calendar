import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import BookReturn from "../../api/book/return";
import { useMe } from "../../store/me";
import Confirm_dialog from "../confirm_dialog";
import Spinner from "../spinner";

interface Props {
  bookInfo: Book;
  success: () => void;
}

const BookReturnForm = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [me] = useRecoilState(useMe);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpenConfirm(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  if (loading) return <Spinner />;

  const handleSubmit = () => {
    setLoading(true);
    BookReturn(me.clientId, props.bookInfo.id, {
      apiToken: me.apiToken,
    })
      .then(() => {
        props.success();
        enqueueSnackbar("返却しました。", {
          variant: "success",
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`返却に失敗しました`, { variant: "error" });
      });
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} sx={{ marginRight: 1 }}>
        返却
      </Button>
      <Confirm_dialog message={"本当に返却しますか？"} open={openConfirm} onClose={handleConfirmClose} handleSubmit={handleSubmit} />
    </>
  );
};

export default BookReturnForm;
