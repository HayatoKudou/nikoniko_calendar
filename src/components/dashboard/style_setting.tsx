import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Slider from "@mui/material/Slider";
import * as React from "react";
import { useRecoilState } from "recoil";
import { useStyleSetting } from "../../store/style_settings";

const StyleSetting = () => {
  const [open, setOpen] = React.useState(false);
  const [style, setStyle] = useRecoilState(useStyleSetting);

  const handleImageSizeSlider = (e: any) => {
    const value = e.target.value;
    const size = {
      height: value * 1.25 * 10,
      width: value * 10,
    };
    setStyle({ imageSize: size });
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>{"open"}</Button>
      <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
        <Box sx={{ width: 300, marginTop: 10 }}>
          <Box sx={{ padding: 2 }}>
            画像サイズ
            <Slider
              key={`slider-${style.imageSize.width}`}
              onChange={handleImageSizeSlider}
              defaultValue={style.imageSize.width / 10}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={10}
              max={30}
            />
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default StyleSetting;
