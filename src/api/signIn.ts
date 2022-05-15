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
  errors: Partial<SignInRequestErrors>;
  user: User;
}

const signUp = async (payload: SignInRequestPayload): Promise<SignInResult> => {
  const endpoint = `${Config.apiOrigin}/api/signIn`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to signIn");
  }

  return await res.json();
};

export default signUp;
