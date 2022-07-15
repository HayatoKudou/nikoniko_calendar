import Config from "../../../config";

interface EmailResendVerifyRequestPayload {
  email: string;
}

export interface EmailResendVerifyRequestErrors {
  email: Array<string>;
}

interface EmailResendVerifyResult {
  succeeded: boolean;
  errors: Partial<EmailResendVerifyRequestErrors>;
}

const emailResendVerify = async (payload: EmailResendVerifyRequestPayload): Promise<EmailResendVerifyResult> => {
  const endpoint = `${Config.apiOrigin}/api/email/verify/resend`;
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

export default emailResendVerify;
