import Config from "../../../config";

interface SignInGoogleRequestPayload {
  email: string;
  accessToken: string;
}

export interface SignInGoogleRequestErrors {
  email: Array<string>;
  accessToken: Array<string>;
  custom: string;
}

interface SignInGoogleResult {
  succeeded: boolean;
  errors: Partial<SignInGoogleRequestErrors>;
  user: User;
}

const signIn = async (payload: SignInGoogleRequestPayload): Promise<SignInGoogleResult> => {
  const endpoint = `${Config.apiOrigin}/api/signInGoogle`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const response = await res.json();

  if (!res.ok) {
    return {
      succeeded: false,
      user: response.me,
      errors: response.errors,
    };
  }

  return {
    succeeded: true,
    user: response.me,
    errors: {},
  };
};

export default signIn;
