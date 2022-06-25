import Config from "../../../config";

export interface DeleteBookRequestPayload {
  book_id: number;
  apiToken: string;
}

const Delete = async (clientId: string, payload: DeleteBookRequestPayload) => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/book`;
  const res = await fetch(endpoint, {
    method: "DELETE",
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

export default Delete;
