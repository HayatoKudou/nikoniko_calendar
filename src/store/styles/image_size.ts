import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useImageSize = atom({
  key: "imageSize",
  default: {
    height: 225,
    width: 150,
  },
  effects_UNSTABLE: [persistAtom],
});
