import { useRouter } from "next/router";
import React from "react";
import { useSetRecoilState } from "recoil";
import Spinner from "../components/parts/spinner";
import { useChoseClient } from "../store/choseClient";
import { useMe } from "../store/me";

const Index = () => {
  const router = useRouter();
  const setMe = useSetRecoilState(useMe);
  const setChoseClient = useSetRecoilState(useChoseClient);

  React.useEffect(() => {
    if (router.query.id !== undefined) {
      setMe({
        id: router.query.id,
        name: router.query.name,
        email: router.query.email,
        apiToken: router.query.apiToken,
        role: {
          isAccountManager: Boolean(router.query.isAccountManager),
          isBookManager: Boolean(router.query.isBookManager),
          isClientManager: Boolean(router.query.isClientManager),
        },
        clients: [
          {
            id: router.query.clientId,
            name: router.query.clientName,
          },
        ],
      });
      setChoseClient({ clientId: router.query.clientId });
      router.push(`/dashboard`);
    }
  }, [router.query]);

  return <Spinner />;
};

export default Index;
