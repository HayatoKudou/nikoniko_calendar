import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useStyleSetting = atom({
  key: "styles",
  default: {
    imageSize: {
      height: 250,
      width: 200,
    },
  },
  effects_UNSTABLE: [persistAtom],
});
