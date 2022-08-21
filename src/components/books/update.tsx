import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import AmazonImage from "../../api/book/amazon_image";
import UpdateBook, { UpdateBookRequestErrors, UpdateBookRequestPayload } from "../../api/book/update";
import { useBookCategories } from "../../store/book/categories";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import FormError from "../parts/form_error";
import ImageForm from "../parts/image_form";
import Spinner from "../parts/spinner";

interface Props {
  open: boolean;
  book: Book;
  onSuccess: () => void;
  onClose: () => void;
}

const Update = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const bookCategories = useRecoilValue(useBookCategories);
  const [loading, setLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<Blob | null>(props.book.image);
  const [formValues, setFormValues] = React.useState<UpdateBookRequestPayload>({
    id: 0,
    category: "",
    status: 0,
    title: "",
    description: "",
    image: null,
    url: "",
    apiToken: "",
  });
  const [UpdateBookRequestErrors, setUpdateUserRequestErrors] = React.useState<Partial<UpdateBookRequestErrors>>({});
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);

  React.useEffect(() => {
    setFormValues({
      id: props.book.id,
      category: props.book.category,
      status: props.book.status,
      title: props.book.title,
      description: props.book.description || "",
      image: props.book.image,
      url: props.book.url,
      apiToken: me.apiToken,
    });
    setSelectedImage(props.book.image);
  }, [props.open]);

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <Spinner />;

  const handleUpdate = (image: string | ArrayBuffer | null) => {
    setLoading(true);
    UpdateBook(choseClient.clientId, {
      id: formValues.id,
      category: formValues.category,
      status: formValues.status,
      title: formValues.title,
      description: formValues.description,
      image: image,
      url: formValues.url,
      apiToken: formValues.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setUpdateUserRequestErrors({});
          enqueueSnackbar("書籍の更新に成功しました。", {
            variant: "success",
          });
          props.onSuccess();
          props.onClose();
        } else {
          setUpdateUserRequestErrors(res.errors);
          enqueueSnackbar(`書籍の更新に失敗しました`, {
            variant: "error",
          });
        }
        setOpenConfirm(false);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`書籍の更新に失敗しました`, { variant: "error" });
      });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (selectedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = function () {
        handleUpdate(reader.result);
      };
    } else {
      handleUpdate(null);
    }
  };

  const fetchBookImage = () => {
    if (formValues.url && formValues.url.match(/www.amazon.co.jp/)) {
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
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"md"}>
      <DialogTitle>書籍編集</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", width: "40%" }}>
          <ImageForm selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
        </Box>
        <Box sx={{ width: "55%" }}>
          <FormControl fullWidth margin={"dense"} required>
            <InputLabel sx={{ left: "-15px" }}>カテゴリ</InputLabel>
            <Select onChange={handleChange} value={formValues.category} name="category" label="role" variant="standard">
              {bookCategories?.map((bookCategory: BookCategory, index: number) => (
                <MenuItem key={index} value={bookCategory.name}>
                  {bookCategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin={"dense"}
            autoFocus
            label="タイトル"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <FormError errors={UpdateBookRequestErrors?.title} />
          <TextField
            margin={"dense"}
            label="本の説明"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <FormError errors={UpdateBookRequestErrors?.description} />
          <TextField
            onBlur={fetchBookImage}
            margin={"dense"}
            label="URL"
            name="url"
            value={formValues.url}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <FormError errors={UpdateBookRequestErrors?.url} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} variant="contained" color={"error"}>
          キャンセル
        </Button>
        <Button onClick={() => setOpenConfirm(true)} variant="contained">
          更新する
        </Button>
        <ConfirmDialog message={"更新しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default Update;
