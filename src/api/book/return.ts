import Config from "../../../config";

interface BookReturnRequestPayload {
  apiToken: string;
}

const BookReturn = async (workspaceId: string, bookId: number, payload: BookReturnRequestPayload) => {
  const endpoint = `${Config.apiOrigin}/api/${workspaceId}/${bookId}/bookReturn`;
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
    throw new Error(`failed to request. url=${endpoint} status=${res.status}`);
  }

  return res.json();
};

export default BookReturn;
