import Config from "../../../config";

export interface UpdateClientRequestErrors {
  name: Array<string>;
  purchase_limit: Array<string>;
  purchase_limit_unit: Array<string>;
}

interface UpdateClientResult {
  succeeded: boolean;
  errors: Partial<UpdateClientRequestErrors>;
}

interface UpdateClientRequestPayload {
  name: string;
  purchase_limit: number;
  purchase_limit_unit: string;
  apiToken: string;
}

const Update = async (clientId: string, payload: UpdateClientRequestPayload): Promise<UpdateClientResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/client`;
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
