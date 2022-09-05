import { atom } from "recoil";
import { BooksResponseBookCategoriesInner } from "../../../api_client";

export const useBookCategories = atom({
  key: "bookCategories",
  default: <Array<BooksResponseBookCategoriesInner>>[{ name: "ALL" }],
});
