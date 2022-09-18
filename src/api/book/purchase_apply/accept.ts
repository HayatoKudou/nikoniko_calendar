import Config from "../../../../config";

interface BookPurchaseAcceptRequestPayload {
  apiToken: string;
}

const AcceptBookPurchase = async (workspaceId: string, bookId: number, payload: BookPurchaseAcceptRequestPayload) => {
  const endpoint = `${Config.apiOrigin}/api/${workspaceId}/${bookId}/purchase/accept`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${payload.apiToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`failed to request. url=${endpoint} status=${res.status}`);
  }

  return res.json();
};

export default AcceptBookPurchase;
