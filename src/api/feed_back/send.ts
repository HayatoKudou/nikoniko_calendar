import Config from "../../../config";

export interface FeedBackRequestErrors {
  message: Array<string>;
}

interface FeedBackResult {
  succeeded: boolean;
  errors: Partial<FeedBackRequestErrors>;
}

interface FeedBackRequestPayload {
  message: string;
}

const Send = async (payload: FeedBackRequestPayload): Promise<FeedBackResult> => {
  const endpoint = `${Config.apiOrigin}/api/feedBack/send`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
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

export default Send;
