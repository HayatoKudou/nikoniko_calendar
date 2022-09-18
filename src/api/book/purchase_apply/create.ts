import { BooksResponse } from "../../../../api_client";
import Config from "../../../../config";

export interface BookPurchaseApplyRequestErrors {
  bookCategoryName: Array<string>;
  title: Array<string>;
  reason: Array<string>;
  price: Array<string>;
  url: Array<string>;
  description: Array<string>;
}

interface BookPurchaseApplyResult {
  succeeded: boolean;
  books: BooksResponse | null;
  errors: Partial<BookPurchaseApplyRequestErrors>;
}

interface BookPurchaseApplyRequestPayload {
  bookCategoryName: string;
  title: string;
  reason: string;
  price: number;
  description: string;
  url: string;
  image: any | null;
  apiToken: string;
}

const CreateBookPurchaseApply = async (workspaceId: string, payload: BookPurchaseApplyRequestPayload): Promise<BookPurchaseApplyResult> => {
  const endpoint = `${Config.apiOrigin}/api/${workspaceId}/bookPurchaseApply`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${payload.apiToken}`,
    },
    body: JSON.stringify(payload),
  });
  const response = await res.json();

  if (!res.ok) {
    return {
      succeeded: false,
      books: response.books,
      errors: response.errors,
    };
  }

  return {
    succeeded: true,
    books: null,
    errors: {},
  };
};

export default CreateBookPurchaseApply;
