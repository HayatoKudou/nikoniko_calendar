import Config from "../../../../config";

interface BookPurchaseRejectRequestPayload {
  apiToken: string;
}

const RejectBookPurchase = async (clientId: string, bookId: number, payload: BookPurchaseRejectRequestPayload) => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/${bookId}/purchase/reject`;
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

export default RejectBookPurchase;
