import Config from "../../../../config";

export interface BookApplicationRequestErrors {
  bookCategoryName: Array<string>;
  title: Array<string>;
  reason: Array<string>;
  description: Array<string>;
}

interface BookApplicationResult {
  succeeded: boolean;
  books: Array<Book> | null;
  errors: Partial<BookApplicationRequestErrors>;
}

interface BookApplicationRequestPayload {
  bookCategoryName: string;
  title: string;
  reason: string;
  description: string;
  image: any | null;
  apiToken: string;
}

const CreateBookApplication = async (
  clientId: string,
  payload: BookApplicationRequestPayload
): Promise<BookApplicationResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/bookApplication`;
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

export default CreateBookApplication;
