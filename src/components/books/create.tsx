import { FormHelperText } from "@mui/material";
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
import { BookCreateValidateErrorResponse } from "../../../api_client";
import AmazonImage from "../../api/book/amazon_image";
import ApiClient from "../../lib/apiClient";
import { useBookCategories } from "../../store/book/categories";
import { useChoseWorkspace } from "../../store/choseWorkspace";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import FormError from "../parts/form_error";
import ImageForm from "../parts/image_form";
import Spinner from "../parts/spinner";

const Create = (props: { open: boolean; setClose: () => void; success: () => void }) => {
  const me = useRecoilValue(useMe);
  const choseWorkspace = useRecoilValue(useChoseWorkspace);
  const { enqueueSnackbar } = useSnackbar();
  const bookCategories = useRecoilValue(useBookCategories);
  const [loading, setLoading] = React.useState(false);
  const [registerBookRequestErrors, setRegisterBookRequestErrors] = React.useState<BookCreateValidateErrorResponse>({});
  const [title, setTitle] = React.useState("");
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState({
    category: "",
    title: "",
    description: "",
    url: "",
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
    ApiClient(me.apiToken)
      .apiWorkspaceIdBookPost(choseWorkspace.workspaceId, {
        category: formValues.category,
        title: title,
        description: formValues.description,
        image: image as string,
        url: formValues.url,
      })
      .then(() => {
        setRegisterBookRequestErrors({});
        setLoading(false);
        setOpenConfirm(false);
        enqueueSnackbar("書籍の登録に成功しました。", { variant: "success" });
        props.success();
        props.setClose();
      })
      .catch((res) => {
        setLoading(false);
        setOpenConfirm(false);
        setRegisterBookRequestErrors(res.response.data.errors);
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
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
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  console.log(registerBookRequestErrors)

  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <DialogTitle>書籍登録</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", width: "40%" }}>
          <ImageForm selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
        </Box>
        <Box sx={{ width: "55%" }}>
          <FormControl fullWidth margin={"dense"} required>
            <InputLabel sx={{ left: "-15px" }}>カテゴリ</InputLabel>
            <Select onChange={handleChange} value={formValues.category} name="category" label="role" variant="standard">
              {bookCategories?.map((bookCategory, index: number) => (
                <MenuItem key={index} value={bookCategory.name}>
                  {bookCategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormError errors={registerBookRequestErrors?.category} />
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            name="title"
            label="タイトル"
            fullWidth
            variant="standard"
            margin={"dense"}
            required
            helperText={registerBookRequestErrors?.title}
            error={registerBookRequestErrors?.title !== undefined}
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
        <Button onClick={props.setClose} variant="contained" color={"error"}>
          キャンセル
        </Button>
        <Button onClick={() => setOpenConfirm(true)} variant="contained">
          登録する
        </Button>
        <ConfirmDialog message={"書籍登録しますか？"} open={openConfirm} onClose={() => setOpenConfirm(false)} handleSubmit={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default Create;
