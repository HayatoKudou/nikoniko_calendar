import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useMe = atom({
  key: "me",
  default: {
    id: null,
    name: "",
    email: "",
    apiToken: "",
    role: {
      isAccountManager: false,
      isBookManager: false,
      isClientManager: false,
    },
    clients: [
      {
        id: null,
        name: "",
      },
    ],
  },
  effects_UNSTABLE: [persistAtom],
});
