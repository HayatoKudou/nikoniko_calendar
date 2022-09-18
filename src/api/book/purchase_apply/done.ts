import Config from "../../../../config";

export interface BookPurchaseDoneRequestErrors {
  location: Array<string>;
}

interface BookPurchaseDoneResult {
  succeeded: boolean;
  errors: Partial<BookPurchaseDoneRequestErrors>;
}

interface BookPurchaseDoneRequestPayload {
  location: string;
  apiToken: string;
}

const DoneBookPurchase = async (workspaceId: string, bookId: number, payload: BookPurchaseDoneRequestPayload): Promise<BookPurchaseDoneResult> => {
  const endpoint = `${Config.apiOrigin}/api/${workspaceId}/${bookId}/purchase/done`;
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
      errors: response.errors,
    };
  }

  return {
    succeeded: true,
    errors: {},
  };
};

export default DoneBookPurchase;
