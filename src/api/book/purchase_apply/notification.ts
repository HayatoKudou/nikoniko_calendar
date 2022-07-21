import Config from "../../../../config";

export interface BookPurchaseNotificationRequestErrors {
  title: Array<string>;
  message: Array<string>;
}

interface BookPurchaseNotificationResult {
  succeeded: boolean;
  errors: Partial<BookPurchaseNotificationRequestErrors>;
}

interface BookPurchaseNotificationRequestPayload {
  title: string;
  message: string;
  apiToken: string;
}

const NotificationBookPurchase = async (
  clientId: string,
  bookId: number,
  payload: BookPurchaseNotificationRequestPayload
): Promise<BookPurchaseNotificationResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/${bookId}/purchase/notification`;
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

export default NotificationBookPurchase;
