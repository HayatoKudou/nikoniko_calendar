import Layout from "../../components/layout";
import ClientProfile from "../../components/client_profile";
import type { NextPage } from "next";

const Index: NextPage = () => {
  return (
    <Layout>
      <ClientProfile />
    </Layout>
  );
};

export default Index;
