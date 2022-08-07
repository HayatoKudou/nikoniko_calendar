import Config from "../../../config";

interface SignUpGoogleRequestPayload {
  name: string;
  email: string;
  oauthToken: string;
}

interface SignUpGoogleResult {
  userId?: number;
}

const SignUpGoogle = async (payload: SignUpGoogleRequestPayload): Promise<SignUpGoogleResult> => {
  const endpoint = `${Config.apiOrigin}/google/auth/callback`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  const response = await res.json();

  if (!res.ok) {
    throw new Error(`failed to request. url=${endpoint} status=${res.status}`);
  }

  return {
    userId: response.userId,
  };
};

export default SignUpGoogle;
