import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useColorMode = atom({
  key: "colorMode",
  default: {
    color: "light",
  },
  effects_UNSTABLE: [persistAtom],
});
