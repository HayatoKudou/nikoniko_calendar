import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useClientInfo = atom({
  key: "clientInfo",
  default: {
    id: null,
    name: ""
  },
  effects_UNSTABLE: [persistAtom],
});
