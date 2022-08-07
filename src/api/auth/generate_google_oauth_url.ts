import Config from "../../../config";

interface GenerateGoogleOauthUrlResult {
  connectUrl: string;
}

const GenerateGoogleOauthUrl = async (): Promise<GenerateGoogleOauthUrlResult> => {
  const endpoint = `${Config.apiOrigin}/connect/google`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const response = await res.json();

  if (!res.ok) {
    throw new Error(`failed to request. url=${endpoint} status=${res.status}`);
  }

  return response;
};

export default GenerateGoogleOauthUrl;
