import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import * as React from "react";
import { useRecoilState } from "recoil";
import { useBookCardStyle } from "../../store/styles/book_card_style";
import { useImageSize } from "../../store/styles/image_size";

const StyleSetting = () => {
  const [open, setOpen] = React.useState(false);
  const [imageSize, setImageSize] = useRecoilState(useImageSize);
  const [bookCardStyle, setBookCardStyle] = useRecoilState(useBookCardStyle);

  const handleImageSizeSlider = (e: any) => {
    const value = e.target.value;
    const size = {
      height: value * 1.5 * 10,
      width: value * 10,
    };
    setImageSize(size);
  };

  return (
    <div>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          right: "10px",
          "z-index": 2,
          top: "50%",
        }}
      >
        <SettingsIcon sx={{ fontSize: "10vh" }} />
      </IconButton>
      <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
        <Box sx={{ width: 300, marginTop: 10 }}>
          <Box sx={{ padding: 2 }}>
            <FormLabel>画像サイズ</FormLabel>
            <Slider
              key={`slider-${imageSize.width}`}
              onChange={handleImageSizeSlider}
              defaultValue={imageSize.width / 10}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={10}
              max={20}
            />
          </Box>
          <Box sx={{ padding: 2 }}>
            <FormControl>
              <FormLabel>スタイル</FormLabel>
              <RadioGroup value={bookCardStyle}>
                <FormControlLabel value="simple" onChange={() => setBookCardStyle("simple")} control={<Radio />} label="シンプル" />
                <FormControlLabel value="rich" onChange={() => setBookCardStyle("rich")} control={<Radio />} label="リッチ" />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default StyleSetting;
