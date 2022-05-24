import Config from "../../../config";

export interface EditUserRequestErrors {
  name: Array<string>;
  email: Array<string>;
  roles: Array<string>;
}

interface EditUserResult {
  succeeded: boolean;
  errors: Partial<EditUserRequestErrors>;
}

interface EditUserRequestPayload {
  name: string;
  email: string;
  roles: Array<string>;
  apiToken: string;
}

const Edit = async (clientId: string, payload: EditUserRequestPayload): Promise<EditUserResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/user/Edit`;
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

export default Edit;
