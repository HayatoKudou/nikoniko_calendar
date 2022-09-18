import { useRouter } from "next/router";
import React from "react";
import { useSetRecoilState } from "recoil";
import Spinner from "../components/parts/spinner";
import { useChoseWorkspace } from "../store/choseWorkspace";
import { useMe } from "../store/me";

const Index = () => {
  const router = useRouter();
  const setMe = useSetRecoilState(useMe);
  const setChoseClient = useSetRecoilState(useChoseWorkspace);

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
          isWorkspaceManager: Boolean(router.query.isWorkspaceManager),
        },
        clients: [
          {
            id: router.query.workspaceId,
            name: router.query.clientName,
          },
        ],
      });
      setChoseClient({ workspaceId: router.query.workspaceId });
      router.push(`/dashboard`);
    }
  }, [router.query]);

  return <Spinner />;
};

export default Index;
