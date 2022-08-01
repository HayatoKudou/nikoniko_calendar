import Config from "../../../config";

export interface CreateClientRequestErrors {
  name: Array<string>;
  custom: string;
  userId: number;
}

interface CreateClientResult {
  succeeded: boolean;
  me?: User;
  errors: Partial<CreateClientRequestErrors>;
}

interface CreateClientRequestPayload {
  plan: string;
  name: string;
  userId: number;
}

const Create = async (payload: CreateClientRequestPayload): Promise<CreateClientResult> => {
  const endpoint = `${Config.apiOrigin}/api/client`;
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
    me: response.me,
    errors: {},
  };
};

export default Create;
