import { useRouter } from "next/router";
import React from "react";
import { useSetRecoilState } from "recoil";
import Spinner from "../components/parts/spinner";
import { useMe } from "../store/me";

const Index = () => {
  const router = useRouter();
  const setMe = useSetRecoilState(useMe);

  React.useEffect(() => {
    if (router.query.id !== undefined) {
      setMe({
        id: router.query.id,
        clientId: Number(router.query.clientId),
        name: router.query.name,
        email: router.query.email,
        apiToken: router.query.apiToken,
        purchase_balance: router.query.purchase_balance,
        role: {
          is_account_manager: Boolean(router.query.is_account_manager),
          is_book_manager: Boolean(router.query.is_book_manager),
          is_client_manager: Boolean(router.query.is_client_manager),
        },
      });
      router.push(`/${router.query.clientId}/dashboard`);
    }
  }, [router.query]);

  return <Spinner />;
};

export default Index;
