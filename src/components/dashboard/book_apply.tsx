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
import * as React from "react";
import AmazonImage from "../../api/book/amazon_image";
import Spinner from "../spinner";

interface Props {
  open: boolean;
  setClose: () => void;
}

const BookApply = (props: Props) => {
  const [formValues, setFormValues] = React.useState({
    category: "",
    url: "",
    reason: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | undefined>("/no_image.png");

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

  const fetchBookImage = () => {
    if (formValues.url) {
      const dpStartIndexOf = formValues.url.indexOf("dp/") + 3;
      const dp = formValues.url.substring(dpStartIndexOf, dpStartIndexOf + 10);

      AmazonImage(dp)
        .then((blob) => {
          setImageUrl(URL.createObjectURL(blob));
        })
        .catch((e) => {
          setLoading(false);
          // enqueueSnackbar(`書籍の登録に失敗しました`, {
          //   variant: "error",
          // });
        });
    }
  };

  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth maxWidth={"md"}>
      <DialogTitle>書籍申請</DialogTitle>
      <DialogContent sx={{ display: "flex", padding: "0px 20px" }}>
        <Box sx={{ textAlign: "center", width: "40%" }}>
          <img src={imageUrl} alt={selectedImage?.name} style={{ maxHeight: "300px", maxWidth: "250px" }} />
          <input
            accept="image/*"
            type="file"
            id="select-image"
            style={{ display: "none" }}
            onChange={(e) => setSelectedImage(e.target.files !== null ? e.target.files[0] : null)}
          />
          <label
            htmlFor="select-image"
            style={{
              position: "absolute",
              bottom: "5%",
              left: "13%",
            }}
          >
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
        </Box>
        <Box sx={{ width: "55%" }}>
          <FormControl fullWidth margin={"dense"}>
            <InputLabel sx={{ left: "-15px" }}>カテゴリ</InputLabel>
            <Select onChange={handleChange} value={formValues.category} name="role" label="role" variant="standard">
              <MenuItem value={"member"}>メンバー</MenuItem>
              <MenuItem value={20}>管理者</MenuItem>
              <MenuItem value={30}>オーナー</MenuItem>
            </Select>
          </FormControl>
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
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.setClose}>キャンセル</Button>
        <Button onClick={props.setClose}>申請する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookApply;
