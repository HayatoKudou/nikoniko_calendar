import * as React from "react";

interface ColorModeContext {
  colorMode: string | null;
  setColorMode: (next: any) => void;
}

const ColorModeContext = React.createContext<ColorModeContext>({
  colorMode: null,
  setColorMode: () => {},
});

export default ColorModeContext;
