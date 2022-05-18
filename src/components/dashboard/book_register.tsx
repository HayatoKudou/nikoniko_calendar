import Box from "@mui/material/BOx";
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
import register, { RegisterBookRequestErrors } from "../../api/book/register";
import useLocalStorage from "../../util/use_local_storage";
import FormError from "../form_error";
import Spinner from "../spinner";

interface Props {
  open: boolean;
  setClose: any;
}

const BookRegister = (props: Props) => {
  const [user, _] = useLocalStorage("user", null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [registerBookRequestErrors, setRegisterBookRequestErrors] = React.useState<Partial<RegisterBookRequestErrors>>(
    {}
  );
  const [formValues, setFormValues] = React.useState({
    categoryId: 0,
    title: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string>("/no_image.png");

  React.useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  if (loading) return <Spinner />;

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (image: string | ArrayBuffer | null) => {
    setLoading(true);
    register({
      categoryId: formValues.categoryId,
      title: formValues.title,
      description: formValues.description,
      image: image,
      apiToken: user.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setRegisterBookRequestErrors({});
          setLoading(false);
          enqueueSnackbar("書籍の登録に成功しました。", {
            variant: "success",
          });
          props.setClose;
        } else {
          setRegisterBookRequestErrors(res.errors);
          enqueueSnackbar(`書籍の登録に失敗しました`, {
            variant: "error",
          });
        }
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar(`書籍の登録に失敗しました`, {
          variant: "error",
        });
      });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

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

  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <DialogTitle>書籍登録</DialogTitle>
      <DialogContent
        sx={{ display: "flex", padding: "0px 20px", "justify-content": "center", "align-items": "center" }}
      >
        <Box sx={{ textAlign: "center", width: "40%" }}>
          <img src={imageUrl} alt={selectedImage?.name} style={{ maxHeight: "300px", maxWidth: "250px" }} />
          <input
            accept="image/*"
            type="file"
            id="select-image"
            style={{ display: "none" }}
            onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
          />
          {selectedImage ? (
            <label
              style={{
                position: "absolute",
                bottom: "5%",
                left: "13%",
              }}
            >
              <Button variant="contained" component="span">
                Delete Image
              </Button>
            </label>
          ) : (
            <label
              htmlFor="select-image"
              style={{
                position: "absolute",
                bottom: "5%",
                left: "13%",
              }}
            >
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
          )}
        </Box>
        <Box sx={{ width: "55%" }}>
          <FormControl fullWidth margin={"dense"}>
            <InputLabel sx={{ left: "-15px" }}>カテゴリ</InputLabel>
            <Select onChange={handleChange} value={formValues.categoryId} name="role" label="role" variant="standard">
              <MenuItem>unknown</MenuItem>
            </Select>
          </FormControl>
          <TextField
            onChange={handleChange}
            value={formValues.title}
            name="title"
            autoFocus
            label="タイトル"
            fullWidth
            variant="standard"
            margin={"dense"}
          />
          <FormError errors={registerBookRequestErrors["title"]} />

          <TextField
            onChange={handleChange}
            value={formValues.description}
            name="description"
            label="説明"
            fullWidth
            variant="standard"
            multiline
            margin={"dense"}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.setClose}>キャンセル</Button>
        <Button onClick={handleSubmit}>登録する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookRegister;
