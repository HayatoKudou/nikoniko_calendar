import { useRecoilState } from "recoil";
import useSWR from "swr";
import Config from "../../../config";
import { useMe } from "../../store/me";

const useUsers = () => {
  const [me] = useRecoilState(useMe);
  const endpoint = `${Config.apiOrigin}/api/book/list`;
  const { data, error, isValidating } = useSWR(
    endpoint,
    (url: string) =>
      fetch(url, {
        headers: { Accept: "application/json", Authorization: `Bearer ${me.apiToken}` },
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

export default useUsers;
