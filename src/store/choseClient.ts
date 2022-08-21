import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useChoseClient = atom({
  key: "choseClient",
  default: {
    clientId: null,
  },
  effects_UNSTABLE: [persistAtom],
});
