import Config from "../../../config";

export interface CreateUserRequestErrors {
  name: Array<string>;
  email: Array<string>;
  password: Array<string>;
  password_confirmation: Array<string>;
  roles: Array<string>;
}

interface RegisterBookResult {
  succeeded: boolean;
  errors: Partial<CreateUserRequestErrors>;
}

interface CreateUserRequestPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  roles: Array<string>;
  apiToken: string;
}

const Create = async (clientId: string, payload: CreateUserRequestPayload): Promise<RegisterBookResult> => {
  const endpoint = `${Config.apiOrigin}/api/${clientId}/user`;
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

export default Create;
