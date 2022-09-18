import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const useChoseWorkspace = atom({
  key: "choseWorkspace",
  default: {
    workspaceId: null,
  },
  effects_UNSTABLE: [persistAtom],
});
