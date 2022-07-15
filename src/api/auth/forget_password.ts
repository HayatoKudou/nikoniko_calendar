import Config from "../../../config";

interface ForgetPasswordRequestPayload {
  email: string;
}

export interface ForgetPasswordRequestErrors {
  email: Array<string>;
}

interface ForgetPasswordResult {
  succeeded: boolean;
  errors: Partial<ForgetPasswordRequestErrors>;
}

const forgetPassword = async (payload: ForgetPasswordRequestPayload): Promise<ForgetPasswordResult> => {
  const endpoint = `${Config.apiOrigin}/api/forgot-password`;
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

export default forgetPassword;
