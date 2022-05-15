import Config from "../../config";

interface SignUpRequestPayload {
  clientId: number;
  name: string;
  email: string;
  password: string;
}

export interface SignUpRequestErrors {
  name: Array<string>;
  email: Array<string>;
  password: Array<string>;
}

interface SignUpResult {
  succeeded: boolean;
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
    if (500 <= res.status) {
      throw new Error("Failed to signUp");
    }

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

export default signUp;
