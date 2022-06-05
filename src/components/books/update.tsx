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
  const [imageUrl, setImageUrl] = React.useState<string>("/no_image.png");
  const [formValues, setFormValues] = React.useState<UpdateBookRequestPayload>({
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
      category: props.book.category,
      status: props.book.status,
      title: props.book.title,
      description: props.book.description,
      image: props.book.image,
      apiToken: me.apiToken,
    });
  }, [props.open]);

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <Spinner />;

  const handleSubmit = () => {
    setLoading(true);
    UpdateBook(me.clientId, {
      category: formValues.category,
      status: formValues.status,
      title: formValues.title,
      description: formValues.description,
      image: formValues.image,
      apiToken: formValues.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setUpdateUserRequestErrors({});
          enqueueSnackbar("ユーザーの更新に成功しました。", {
            variant: "success",
          });
          props.onSuccess();
          props.onClose();
        } else {
          setUpdateUserRequestErrors(res.errors);
          enqueueSnackbar(`ユーザー登録に失敗しました`, {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar(`ユーザーの登録に失敗しました`, {
          variant: "error",
        });
      });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.target.files) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth={"md"}>
      <DialogTitle>書籍編集</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", width: "40%" }}>
          <img src={imageUrl} style={{ maxHeight: "300px", maxWidth: "250px", marginBottom: "10px" }} alt={imageUrl} />
          <input
            accept="image/*"
            type="file"
            id="select-image"
            style={{ display: "none" }}
            onChange={handleChangeImage}
          />
          {imageUrl === "/no_image.png" ? (
            <label htmlFor="select-image" style={{ position: "absolute", bottom: "5%", left: "15%" }}>
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
          ) : (
            <label style={{ position: "absolute", bottom: "5%", left: "15%" }}>
              <Button variant="contained" onClick={() => setImageUrl("/no_image.png")}>
                Delete Image
              </Button>
            </label>
          )}
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
          <FormError errors={UpdateBookRequestErrors["title"]} />
          <TextField
            margin={"dense"}
            label="説明"
            name="email"
            value={formValues.description}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <FormError errors={UpdateBookRequestErrors["description"]} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>キャンセル</Button>
        <Button onClick={handleSubmit}>更新する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Update;
