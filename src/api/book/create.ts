import { BooksResponse } from "../../../api_client";
import Config from "../../../config";

export interface RegisterBookRequestErrors {
  bookCategoryName: Array<string>;
  title: Array<string>;
  description: Array<string>;
  url: Array<string>;
}

interface RegisterBookResult {
  succeeded: boolean;
  books: BooksResponse | null;
  errors: Partial<RegisterBookRequestErrors>;
}

interface RegisterBookRequestPayload {
  bookCategoryName: string;
  title: string;
  description: string;
  image: any | null;
  url: string | null;
  apiToken: string;
}

const Create = async (clientId: string, payload: RegisterBookRequestPayload): Promise<RegisterBookResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/book`;
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

export default Create;
