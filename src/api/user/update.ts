import Config from "../../../config";

export interface UpdateUserRequestErrors {
  name: Array<string>;
  email: Array<string>;
  roles: Array<string>;
}

interface UpdateUserResult {
  succeeded: boolean;
  errors: Partial<UpdateUserRequestErrors>;
}

export interface UpdateUserRequestPayload {
  name: string;
  email: string;
  roles: Array<string>;
  apiToken: string;
}

const Update = async (clientId: string, payload: UpdateUserRequestPayload): Promise<UpdateUserResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/user`;
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
