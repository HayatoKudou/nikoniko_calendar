import { useRecoilValue } from "recoil";
import Config from "../../config";
import { useMe } from "../store/me";

const AuthenticatedAccount = async () => {
  const me = useRecoilValue(useMe);
  const endpoint = `${Config.apiOrigin}/api/${me.clientId}/user`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${me.apiToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`failed to request. url=${endpoint} status=${res.status}`);
  }

  return await res.json();
};

export default AuthenticatedAccount;
