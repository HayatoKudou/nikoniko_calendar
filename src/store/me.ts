import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useMe = atom({
  key: "me",
  default: {
    id: null,
    clientId: null,
    name: "",
    email: "",
    apiToken: "",
    role: {
      isAccountManager: false,
      isBookManager: false,
      isClientManager: false,
    },
  },
  effects_UNSTABLE: [persistAtom],
});
