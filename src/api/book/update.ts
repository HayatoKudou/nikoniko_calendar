import Config from "../../../config";

export interface UpdateBookRequestErrors {
  status: Array<string>;
  category: Array<string>;
  title: Array<string>;
  description: Array<string>;
  url: Array<string>;
}

interface UpdateBookResult {
  succeeded: boolean;
  errors: Partial<UpdateBookRequestErrors>;
}

export interface UpdateBookRequestPayload {
  id: number;
  category: string;
  status: number;
  title: string;
  description: string;
  image: any | null;
  url: string | null;
  apiToken: string;
}

const Update = async (clientId: string, payload: UpdateBookRequestPayload): Promise<UpdateBookResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/book`;
  const res = await fetch(endpoint, {
    method: "PUT",
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

export default Update;
