import useSWR from "swr";
import Config from "../../config";
import useLocalStorage from "../util/use_local_storage";

const useAuthenticatedAccount = () => {
  const [user, _] = useLocalStorage("user", null);
  const endpoint = `${Config.apiOrigin}/api/me`;
  const { data, error, isValidating } = useSWR(
    endpoint,
    (url: string) =>
      fetch(url, {
        headers: { Accept: "application/json", Authorization: `Bearer ${user.apiToken}` },
      }).then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`failed to request. url=${endpoint} status=${res.status} body=${body}`);
        }
        return res.json();
      }),
    {
      revalidateOnFocus: false,
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
