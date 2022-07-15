import Config from "../../../config";

interface ResetPasswordRequestPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordRequestErrors {
  email: Array<string>;
  password: Array<string>;
  password_confirmation: Array<string>;
}

interface ResetPasswordResult {
  succeeded: boolean;
  errors: Partial<ResetPasswordRequestErrors>;
}

const resetPassword = async (payload: ResetPasswordRequestPayload): Promise<ResetPasswordResult> => {
  const endpoint = `${Config.apiOrigin}/api/reset-password`;
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
    errors: {},
  };
};

export default resetPassword;
