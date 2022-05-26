import { atom } from "recoil";

export const useBookCategories = atom({
  key: "bookCategories",
  default: [{ name: "" }],
});
