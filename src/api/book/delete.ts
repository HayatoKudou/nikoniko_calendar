import Config from "../../../config";

export interface DeleteBookRequestPayload {
  book_ids: number[];
  apiToken: string;
}

const Delete = async (workspaceId: string, payload: DeleteBookRequestPayload) => {
  const endpoint = `${Config.apiOrigin}/api/${workspaceId}/book`;
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
