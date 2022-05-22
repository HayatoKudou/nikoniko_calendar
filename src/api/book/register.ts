import Config from "../../../config";

export interface RegisterBookRequestErrors {
  categoryId: Array<string>;
  title: Array<string>;
  description: Array<string>;
}

interface RegisterBookResult {
  succeeded: boolean;
  books: Array<Book> | null;
  errors: Partial<RegisterBookRequestErrors>;
}

const RegisterBook = async (clientId: string, payload: RegisterBook): Promise<RegisterBookResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/book/register`;
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

export default RegisterBook;
