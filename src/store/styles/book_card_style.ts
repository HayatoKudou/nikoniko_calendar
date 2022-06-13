import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useBookCardStyle = atom({
  key: "bookCardStyle",
  default: "rich",
  effects_UNSTABLE: [persistAtom],
});
