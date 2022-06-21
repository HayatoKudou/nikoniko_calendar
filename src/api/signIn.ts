import Config from "../../config";

interface SignInRequestPayload {
  email: string;
  password: string;
}

export interface SignInRequestErrors {
  email: Array<string>;
  password: Array<string>;
}

interface SignInResult {
  succeeded: boolean;
  errors: Partial<SignInRequestErrors>;
  user: User;
  client: Client;
}

const signUp = async (payload: SignInRequestPayload): Promise<SignInResult> => {
  const endpoint = `${Config.apiOrigin}/api/signIn`;

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
      user: response.me,
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
