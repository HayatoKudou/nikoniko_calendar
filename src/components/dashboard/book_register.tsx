import { FormHelperText } from "@mui/material";
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
import { useRecoilState } from "recoil";
import AmazonImage from "../../api/book/amazon_image";
import register, { RegisterBookRequestErrors } from "../../api/book/register";
import { useMe } from "../../store/me";
import FormError from "../form_error";
import Spinner from "../spinner";

interface Props {
  open: boolean;
  setClose: any;
  success: any;
}

const BookRegister = (props: Props) => {
  const [me] = useRecoilState(useMe);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [registerBookRequestErrors, setRegisterBookRequestErrors] = React.useState<Partial<RegisterBookRequestErrors>>(
    {}
  );
  const [title, setTitle] = React.useState("");
  const [formValues, setFormValues] = React.useState({
    categoryId: 0,
    title: "",
    description: "",
    url: "",
  });
  const [selectedImage, setSelectedImage] = React.useState<File | Blob | null>(null);
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
    register(me.clientId, {
      categoryId: formValues.categoryId,
      title: title,
      description: formValues.description,
      image: image,
      apiToken: me.apiToken,
    })
      .then((res) => {
        if (res.succeeded) {
          setRegisterBookRequestErrors({});
          enqueueSnackbar("書籍の登録に成功しました。", {
            variant: "success",
          });
          props.success();
          props.setClose();
        } else {
          setRegisterBookRequestErrors(res.errors);
          enqueueSnackbar(`書籍の登録に失敗しました`, {
            variant: "error",
          });
        }
        setLoading(false);
      })
      .catch(() => {
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
          setImageUrl(URL.createObjectURL(blob));
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  };

  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <DialogTitle>書籍登録</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", width: "40%" }}>
          <img src={imageUrl} style={{ maxHeight: "300px", maxWidth: "250px", marginBottom: "10px" }} />
          <input
            accept="image/*"
            type="file"
            id="select-image"
            style={{ display: "none" }}
            onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
          />
          {imageUrl === "/no_image.png" ? (
            <label
              htmlFor="select-image"
              style={{
                position: "absolute",
                bottom: "5%",
                left: "15%",
              }}
            >
              <Button variant="contained">Upload Image</Button>
            </label>
          ) : (
            <label
              style={{
                position: "absolute",
                bottom: "5%",
                left: "15%",
              }}
            >
              <Button variant="contained" onClick={() => setImageUrl("/no_image.png")}>
                Delete Image
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
            onChange={(e) => setTitle(e.target.value)}
            value={title}
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
          <TextField
            onChange={handleChange}
            onBlur={fetchBookImage}
            value={formValues.url}
            name="url"
            autoFocus
            label="URL"
            fullWidth
            variant="standard"
            margin={"dense"}
          />
          <FormHelperText>URLを入力することで、タイトルとイメージを自動補完します</FormHelperText>
          <FormHelperText error={true}>* Amazonのみ対応しています</FormHelperText>
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
