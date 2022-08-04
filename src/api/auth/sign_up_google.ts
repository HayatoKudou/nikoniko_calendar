import Config from "../../../config";

interface SignUpGoogleRequestPayload {
  name: string;
  email: string;
  accessToken: string;
}

export interface SignUpGoogleRequestErrors {
  name: Array<string>;
  email: Array<string>;
  accessToken: Array<string>;
  custom: string;
}

interface SignUpGoogleResult {
  succeeded: boolean;
  userId?: number;
  errors: Partial<SignUpGoogleRequestErrors>;
}

const signUpGoogle = async (payload: SignUpGoogleRequestPayload): Promise<SignUpGoogleResult> => {
  const endpoint = `${Config.apiOrigin}/api/signUpGoogle`;

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

export default signUpGoogle;
