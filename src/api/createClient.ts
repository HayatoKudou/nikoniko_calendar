import Config from "../../config";

interface CreateClientRequestPayload {
  name: string;
}

export interface CreateClientRequestErrors {
  name: Array<string>;
}

interface CreateClientResult {
  succeeded: boolean;
  client: Client;
  errors: Partial<CreateClientRequestErrors>;
}

const CreateClient = async (payload: CreateClientRequestPayload): Promise<CreateClientResult> => {
  const endpoint = `${Config.apiOrigin}/api/createClient`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const response = await res.json();

  if (!res.ok) {
    return {
      succeeded: false,
      client: response.client,
      errors: response.errors,
    };
  }

  return {
    succeeded: true,
    client: response.client,
    errors: {},
  };
};

export default CreateClient;
