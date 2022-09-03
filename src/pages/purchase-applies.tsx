import Layout from "../components/layout";
import PurchaseApplies from "../components/purchase_applies";
import type { NextPage } from "next";

const Index: NextPage = () => {
  return (
    <Layout>
      <PurchaseApplies />
    </Layout>
  );
};

export default Index;
