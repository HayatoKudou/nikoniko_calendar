import SignIn from "../components/auth/signIn";
import Layout from "../components/layout";
import type { NextPage } from "next";

const Index: NextPage = () => {
  return (
    <Layout>
      <SignIn />
    </Layout>
  );
};

export default Index;
