import Config from "../../../config";

interface BookReturnResult {
  succeeded: boolean;
}

interface BookReturnRequestPayload {
  apiToken: string;
}

const BookReturn = async (clientId: string, bookId: number, payload: BookReturnRequestPayload): Promise<BookReturnResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/${bookId}/bookReturn`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${payload.apiToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return {
      succeeded: false,
    };
  }

  return {
    succeeded: true,
  };
};

export default BookReturn;
