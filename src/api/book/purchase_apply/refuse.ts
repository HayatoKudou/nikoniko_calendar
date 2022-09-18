import Config from "../../../../config";

interface BookPurchaseRefuseRequestPayload {
  apiToken: string;
}

const RefuseBookPurchase = async (workspaceId: string, bookId: number, payload: BookPurchaseRefuseRequestPayload) => {
  const endpoint = `${Config.apiOrigin}/api/${workspaceId}/${bookId}/purchase/refuse`;
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

export default RefuseBookPurchase;
