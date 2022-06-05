import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import Button from "@mui/material/Button";
import * as React from "react";
import { base64ToBlob } from "../util/image";

interface Props {
  selectedImage: any;
  setSelectedImage: any;
}

const ImageForm = (props: Props) => {
  React.useEffect(() => {
    if (props.selectedImage && typeof props.selectedImage === "string") {
      props.setSelectedImage(base64ToBlob(props.selectedImage));
    }
  }, []);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      props.setSelectedImage(e.target.files[0]);
    }
  };

  const handleDeleteImage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    props.setSelectedImage(null);
  };

  return (
    <>
      <input accept="image/*" type="file" id="select-image" style={{ display: "none" }} onChange={handleChangeImage} />
      {props.selectedImage && props.selectedImage instanceof Blob ? (
        <>
          <img
            src={URL.createObjectURL(props.selectedImage)}
            style={{ maxHeight: "300px", maxWidth: "250px", marginBottom: "10px" }}
            alt={"書籍画像"}
          />
          <label style={{ position: "absolute", bottom: "5%", left: "15%" }}>
            <Button variant="contained" onClick={handleDeleteImage}>
              Delete Image
            </Button>
          </label>
        </>
      ) : (
        <>
          <ImageNotSupportedIcon />
          <label htmlFor="select-image" style={{ position: "absolute", bottom: "5%", left: "15%" }}>
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
        </>
      )}
    </>
  );
};

export default ImageForm;
