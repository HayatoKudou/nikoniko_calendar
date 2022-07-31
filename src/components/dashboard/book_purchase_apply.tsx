import { FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import AmazonImage from "../../api/book/amazon_image";
import CreateBookPurchaseApply, { BookPurchaseApplyRequestErrors } from "../../api/book/purchase_apply/create";
import { useBookCategories } from "../../store/book/categories";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import FormError from "../parts/form_error";
import ImageForm from "../parts/image_form";
import Spinner from "../parts/spinner";

interface Props {
  open: boolean;
  client: Client;
  setClose: () => void;
  success: () => void;
}

const BookPurchaseApply = (props: Props) => {
  const me = useRecoilValue(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const [bookCategories] = useRecoilState(useBookCategories);
  const [loading, setLoading] = React.useState(false);
  const [bookPurchaseApplyRequestErrors, setBookPurchaseApplyRequestErrors] = React.useState<Partial<BookPurchaseApplyRequestErrors>>({});
  const [title, setTitle] = React.useState("");
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState({
    bookOwner: "team",
    bookCategoryName: "ALL",
    title: "",
    description: "",
    url: "",
    reason: "",
    price: 0,
  });
  const [selectedImage, setSelectedImage] = React.useState<Blob | null>(null);

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (image: string | ArrayBuffer | null) => {
    setLoading(true);
    CreateBookPurchaseApply(me.clientId, {
      bookCategoryName: formValues.bookCategoryName,
      title: title,
      reason: formValues.reason,
      price: formValues.price,
      description: formValues.description,
      url: formValues.url,
      image: image,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setBookPurchaseApplyRequestErrors({});
          enqueueSnackbar("申請しました。", {
            variant: "success",
          });
          props.success();
          props.setClose();
        } else {
          setBookPurchaseApplyRequestErrors(res.errors);
          enqueueSnackbar(`申請に失敗しました`, {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setBookPurchaseApplyRequestErrors({});
        enqueueSnackbar(`申請に失敗しました`, { variant: "error" });
      });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setOpenConfirm(false);
    if (selectedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = function () {
        handleRegister(reader.result);
      };
    } else {
      handleRegister(null);
    }
  };

  const fetchBookImage = () => {
    if (formValues.url && formValues.url.match(/www.amazon.co.jp/)) {
      const decodedUrl = decodeURI(formValues.url).match(/www.amazon.co.jp\/(.*)\/dp/);
      if (decodedUrl) {
        setTitle(decodedUrl![1]);
      }
      const dpStartIndexOf = formValues.url.indexOf("dp/") + 3;
      const dp = formValues.url.substring(dpStartIndexOf, dpStartIndexOf + 10);

      AmazonImage(dp)
        .then((blob) => {
          setSelectedImage(blob);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <ConfirmDialog message={"本当に申請しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
      <DialogTitle>書籍申請</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", width: "40%" }}>
          <ImageForm selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
        </Box>
        <Box sx={{ width: "55%" }}>
          <FormControl fullWidth margin={"dense"} required>
            <InputLabel sx={{ left: "-15px" }}>カテゴリ</InputLabel>
            <Select onChange={handleChange} value={formValues.bookCategoryName} name="bookCategoryName" label="role" variant="standard">
              {bookCategories?.map((bookCategory: BookCategory, index: number) => (
                <MenuItem key={index} value={bookCategory.name}>
                  {bookCategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormError errors={bookPurchaseApplyRequestErrors?.bookCategoryName} />
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            name="title"
            autoFocus
            label="タイトル"
            fullWidth
            variant="standard"
            margin={"dense"}
            required
            helperText={bookPurchaseApplyRequestErrors?.title}
            error={bookPurchaseApplyRequestErrors?.title !== undefined}
          />

          <TextField
            onChange={handleChange}
            value={formValues.description}
            name="description"
            label="本の説明"
            fullWidth
            variant="standard"
            multiline
            margin={"dense"}
            helperText={bookPurchaseApplyRequestErrors?.description}
            error={bookPurchaseApplyRequestErrors?.description !== undefined}
          />

          <TextField
            onChange={handleChange}
            value={formValues.reason}
            name="reason"
            autoFocus
            label="申請理由"
            fullWidth
            variant="standard"
            multiline
            margin={"dense"}
            required
            helperText={bookPurchaseApplyRequestErrors?.reason}
            error={bookPurchaseApplyRequestErrors?.reason !== undefined}
          />

          <FormControl sx={{ display: "block", marginTop: 1 }}>
            <FormLabel sx={{ marginRight: 2 }}>所有者</FormLabel>
            <RadioGroup value={formValues.bookOwner} sx={{ display: "inline" }}>
              <FormControlLabel name="bookOwner" value="team" onChange={handleChange} control={<Radio />} label="組織" />
              <FormControlLabel
                name="bookOwner"
                value="private"
                onChange={handleChange}
                control={<Radio disabled={!props.client.privateOwnershipAllow} />}
                label="個人"
              />
            </RadioGroup>
            <TextField
              onChange={handleChange}
              value={formValues.price}
              name="price"
              autoFocus
              label="価格"
              variant="standard"
              required
              helperText={bookPurchaseApplyRequestErrors?.price}
              error={bookPurchaseApplyRequestErrors?.price !== undefined}
            />
          </FormControl>

          {props.client.enablePurchaseLimit ? (
            <Box sx={{ margin: "16px 32px", padding: 1, border: "solid 1px" }}>
              <Box sx={{ display: "flex" }}>
                現在の購入補助上限：<Box sx={{ marginLeft: "auto" }}>{"¥" + me.purchase_balance}</Box>
              </Box>
              <Box sx={{ display: "flex" }}>
                書籍の価格：<Box sx={{ marginLeft: "auto" }}>{"¥" + formValues.price}</Box>
              </Box>
              <Box sx={{ display: "flex" }}>
                購入補助残高：<Box sx={{ marginLeft: "auto" }}>{"¥" + (me.purchase_balance - formValues.price)}</Box>
              </Box>
              {me.purchase_balance - formValues.price < 0 && <Box sx={{ color: "red", textAlign: "right" }}>※ 購入補助残高を超えています</Box>}
              {isNaN(me.purchase_balance - formValues.price) && <Box sx={{ color: "red", textAlign: "right" }}>※ 無効な値が入力されました</Box>}
            </Box>
          ) : (
            <></>
          )}

          <TextField
            onChange={handleChange}
            onBlur={fetchBookImage}
            value={formValues.url}
            name="url"
            autoFocus
            label="URL"
            fullWidth
            variant="standard"
          />

          <FormHelperText>URLを入力することで、タイトルとイメージを自動補完します</FormHelperText>
          <FormHelperText error={true}>* Amazonのみ対応しています</FormHelperText>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.setClose} variant="contained" color={"error"}>
          キャンセル
        </Button>
        <Button onClick={() => setOpenConfirm(true)} variant="contained">
          申請する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookPurchaseApply;
