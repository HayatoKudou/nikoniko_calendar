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

interface Props {
  open: boolean;
  setClose: any;
}

const BookApply = (props: Props) => {
  const [formValues, setFormValues] = React.useState({
    category: "",
    url: "",
    reason: "",
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

  const fetchBookImage = () => {
    console.log("fetchBookImage");
  };

  return (
    <Dialog open={props.open} onClose={props.setClose} fullWidth>
      <DialogTitle>書籍申請</DialogTitle>
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
