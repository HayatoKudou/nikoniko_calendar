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
    purchase_balance: 0,
    role: {
      is_account_manager: false,
      is_book_manager: false,
      is_client_manager: false,
    },
  },
  effects_UNSTABLE: [persistAtom],
});
