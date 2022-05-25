import Config from "../../config";

interface SignUpRequestPayload {
  name: string;
  email: string;
  password: string;
  client_name: string;
}

export interface SignUpRequestErrors {
  name: Array<string>;
  email: Array<string>;
  password: Array<string>;
  client_name: Array<string>;
}

interface SignUpResult {
  succeeded: boolean;
  client: Client | null;
  user: User | null;
  errors: Partial<SignUpRequestErrors>;
}

const signUp = async (payload: SignUpRequestPayload): Promise<SignUpResult> => {
  const endpoint = `${Config.apiOrigin}/api/signUp`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const response = await res.json();
  console.log(response);

  if (!res.ok) {
    if (500 <= res.status) {
      throw new Error("Failed to signUp");
    }

    return {
      succeeded: false,
      client: null,
      user: null,
      errors: response.errors,
    };
  }

  return {
    succeeded: true,
    client: response.client,
    user: response.me,
    errors: {},
  };
};

export default signUp;
