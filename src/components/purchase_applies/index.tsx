import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Config from "../../../config";
import usePurchaseApplies from "../../api/book/purchase_apply/list";
import { useBookCategories } from "../../store/book/categories";
import { useMe } from "../../store/me";
import Spinner from "../parts/spinner";
import Approval from "./approval/index";
import CustomTable from "./table";

const PurchaseApplies = () => {
  const me = useRecoilValue(useMe);
  const [, setBookCategory] = useRecoilState(useBookCategories);
  const [selectedEditPurchaseApply, setSelectedEditPurchaseApply] = React.useState<PurchaseApply>();
  const [selectedBookIds, setSelectedBookIds] = React.useState<number[]>([]);
  const [approvalOpen, setApprovalOpen] = React.useState<boolean>(false);
  const { loading, error, response, mutate } = usePurchaseApplies();

  React.useEffect(() => {
    if (response) {
      setBookCategory(response.bookCategories);
      // ステップ更新用
      if (selectedEditPurchaseApply) {
        response.bookPurchaseApplies.forEach((purchaseApply: any) => {
          if (purchaseApply.book.id === selectedEditPurchaseApply.book.id) {
            setSelectedEditPurchaseApply(purchaseApply);
          }
        });
      }
    }
  }, [response]);

  if (loading || error) return <Spinner />;

  const handleEditBook = (e: { stopPropagation: any }, purchaseApply: any) => {
    e.stopPropagation();
    setSelectedEditPurchaseApply(purchaseApply);
    setApprovalOpen(true);
  };

  return (
    <>
      {selectedEditPurchaseApply && (
        <Approval
          purchaseApply={selectedEditPurchaseApply}
          open={approvalOpen}
          onClose={() => setApprovalOpen(false)}
          onSuccess={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/user/list`)}
        />
      )}
      <CustomTable
        bookPurchaseApplies={response.bookPurchaseApplies}
        handleEdit={handleEditBook}
        selected={selectedBookIds}
        setSelected={setSelectedBookIds}
      />
    </>
  );
};

export default PurchaseApplies;
