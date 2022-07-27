import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
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
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { useRecoilState } from "recoil";
import { useBookCardStyle } from "../store/styles/book_card_style";
import { useColorMode } from "../store/styles/color_mode";
import { useImageSize } from "../store/styles/image_size";
import FeedBack from "./feed_back";

const StyleSetting = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [imageSize, setImageSize] = useRecoilState(useImageSize);
  const [bookCardStyle, setBookCardStyle] = useRecoilState(useBookCardStyle);
  const [colorMode, setColorMode] = useRecoilState(useColorMode);
  const [openFeedBackDialog, setOpenFeedBackDialog] = React.useState<boolean>(false);

  const handleImageSizeSlider = (e: any) => {
    const value = e.target.value;
    const size = {
      height: value * 1.5 * 10,
      width: value * 10,
    };
    setImageSize(size);
  };

  const handleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <>
      <FeedBack />
      <Tooltip title="レイアウト設定">
        <IconButton onClick={() => setOpen(true)} color="inherit">
          <SettingsIcon sx={{ fontSize: "30px" }} />
        </IconButton>
      </Tooltip>
      <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)} sx={{ zIndex: 1201 }}>
        <Box sx={{ width: 300, marginTop: 3 }}>
          <Box sx={{ padding: 2 }}>
            <ToggleButtonGroup value={colorMode} onChange={handleColorMode}>
              <ToggleButton value="light" color={"primary"}>
                <Brightness4Icon />
                ライトモード
              </ToggleButton>
              <ToggleButton value="dark" color={"primary"}>
                <Brightness7Icon />
                ダークモード
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
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
              <FormLabel>カードスタイル</FormLabel>
              <RadioGroup value={bookCardStyle}>
                <FormControlLabel value="rich" onChange={() => setBookCardStyle("rich")} control={<Radio />} label="リッチ" />
                <FormControlLabel value="simple" onChange={() => setBookCardStyle("simple")} control={<Radio />} label="シンプル" />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default StyleSetting;
