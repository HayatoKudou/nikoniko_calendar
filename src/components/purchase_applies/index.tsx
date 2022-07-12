import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Config from "../../../config";
import usePurchaseApplies from "../../api/book/purchase_apply/list";
import { useBookCategories } from "../../store/book/categories";
import { useMe } from "../../store/me";
import Spinner from "../parts/spinner";
import Approval from "./approval/index";
import CustomTable from "./table";

const Books = () => {
  const me = useRecoilValue(useMe);
  const [, setBookCategory] = useRecoilState(useBookCategories);
  const [selectedEditPurchaseApply, setSelectedEditPurchaseApply] = React.useState<Book>();
  const [selectedBookIds, setSelectedBookIds] = React.useState<number[]>([]);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(false);
  const { loading, error, response, mutate } = usePurchaseApplies();

  React.useEffect(() => {
    if (response) {
      setBookCategory(response.bookCategories);
    }
  }, [response]);

  if (loading || error) return <Spinner />;

  const handleEditBook = (e: { stopPropagation: any }, purchaseApply: any) => {
    e.stopPropagation();
    setSelectedEditPurchaseApply(purchaseApply);
    setUpdateDialogOpen(true);
  };

  return (
    <>
      {selectedEditPurchaseApply && (
        <Approval
          purchaseApply={selectedEditPurchaseApply}
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
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

export default Books;
