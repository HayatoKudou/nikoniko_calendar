import Config from "../../../config";

interface SignUpRequestPayload {
  plan: string;
  name: string;
  email: string;
  password: string;
  client_name: string;
}

export interface SignUpRequestErrors {
  name: Array<string>;
  email: Array<string>;
  password: Array<string>;
  custom: string;
}

interface SignUpResult {
  succeeded: boolean;
  userId?: number;
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

  if (!res.ok) {
    return {
      succeeded: false,
      errors: response.errors,
    };
  }

  return {
    succeeded: true,
    userId: response.userId,
    errors: {},
  };
};

export default signUp;
