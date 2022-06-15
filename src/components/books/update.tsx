import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilState } from "recoil";
import UpdateBook, { UpdateBookRequestErrors, UpdateBookRequestPayload } from "../../api/book/update";
import { useMe } from "../../store/me";
import FormError from "../form_error";
import ImageForm from "../image_form";
import Spinner from "../spinner";

interface Props {
  open: boolean;
  book: Book;
  onSuccess: () => void;
  onClose: () => void;
}

const Update = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [me] = useRecoilState(useMe);
  const [loading, setLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<Blob | null>(props.book.image);
  const [formValues, setFormValues] = React.useState<UpdateBookRequestPayload>({
    id: 0,
    category: "",
    status: 0,
    title: "",
    description: "",
    image: null,
    apiToken: "",
  });
  const [UpdateBookRequestErrors, setUpdateUserRequestErrors] = React.useState<Partial<UpdateBookRequestErrors>>({});

  React.useEffect(() => {
    setFormValues({
      id: props.book.id,
      category: props.book.category,
      status: props.book.status,
      title: props.book.title,
      description: props.book.description || "",
      image: props.book.image,
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
    UpdateBook(me.clientId, {
      id: formValues.id,
      category: formValues.category,
      status: formValues.status,
      title: formValues.title,
      description: formValues.description,
      image: image,
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
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`書籍の更新に失敗しました`, {
          variant: "error",
        });
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

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"md"}>
      <DialogTitle>書籍編集</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", width: "40%" }}>
          <ImageForm selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
        </Box>
        <Box sx={{ width: "55%" }}>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} variant="contained">キャンセル</Button>
        <Button onClick={handleSubmit} variant="contained">更新する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Update;
