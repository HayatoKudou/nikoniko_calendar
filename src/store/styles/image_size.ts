import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useImageSize = atom({
  key: "imageSize",
  default: {
    height: 195,
    width: 130,
  },
  effects_UNSTABLE: [persistAtom],
});
