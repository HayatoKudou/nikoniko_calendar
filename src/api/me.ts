import { useRecoilValue } from "recoil";
import useSWR from "swr";
import Config from "../../config";
import { useMe } from "../store/me";

const useAuthenticatedAccount = () => {
  const me = useRecoilValue(useMe);
  const endpoint = `${Config.apiOrigin}/api/${me.clientId}/user`;
  const { data, error, isValidating } = useSWR(
    endpoint,
    (url: string) =>
      fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${me.apiToken}`,
          "Access-Control-Allow-Origin": "*",
        },
      }).then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`failed to request. url=${endpoint} status=${res.status} body=${body}`);
        }
        return res.json();
      }),
    {
      revalidateOnFocus: false,
      // onErrorRetry: (error) => {
      //   // 403では再試行しない。
      //   if (error.status === 403) return
      // }
    }
  );

  const loading = isValidating || (!data && !error);
  const response = !loading && !error ? (data as any) : null;

  return {
    loading,
    error,
    response,
  };
};

export default useAuthenticatedAccount;
