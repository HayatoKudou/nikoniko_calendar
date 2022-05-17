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
    categoryId: null,
    title: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | undefined>("/no_image.png");

  React.useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const reader = new FileReader();
    // @ts-ignore
    reader.readAsDataURL(selectedImage);
    reader.onload = function () {
      register({
        categoryId: formValues.categoryId,
        title: formValues.title,
        description: formValues.description,
        image: reader.result,
        apiToken: user.apiToken,
      })
        .then((res) => {
          if (res.succeeded) {
            setRegisterBookRequestErrors({});
            setLoading(false);
            enqueueSnackbar("登録に成功しました。", {
              variant: "success",
            });
            props.setClose;
          } else {
            setRegisterBookRequestErrors(res.errors);
            enqueueSnackbar(`登録に失敗しました`, {
              variant: "error",
            });
          }
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          enqueueSnackbar(`登録に失敗しました`, {
            variant: "error",
          });
        });
    };
  };

  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth>
      <DialogTitle>書籍登録</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px" }}>
        <Box sx={{ textAlign: "center" }}>
          <img src={imageUrl} alt={selectedImage?.name} style={{ maxHeight: "300px", maxWidth: "250px" }} />
          <input
            accept="image/*"
            type="file"
            id="select-image"
            style={{ display: "none" }}
            onChange={(e) => setSelectedImage(e.target.files !== null ? e.target.files[0] : null)}
          />
          <label htmlFor="select-image">
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
        </Box>
        <Box>
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
