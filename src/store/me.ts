import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useMe = atom({
  key: "me",
  default: {
    clientId: null,
    name: "",
    email: "",
    apiToken: "",
  },
  effects_UNSTABLE: [persistAtom],
});
