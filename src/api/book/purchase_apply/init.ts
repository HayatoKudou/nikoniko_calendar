import Config from "../../../../config";
interface BookPurchaseDoneRequestPayload {
  apiToken: string;
}

const InitBookPurchase = async (clientId: string, bookId: number, payload: BookPurchaseDoneRequestPayload) => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/${bookId}/purchase/init`;
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

export default InitBookPurchase;
