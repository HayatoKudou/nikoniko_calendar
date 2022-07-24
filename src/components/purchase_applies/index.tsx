import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Config from "../../../config";
import InitBookPurchase from "../../api/book/purchase_apply/init";
import usePurchaseApplies from "../../api/book/purchase_apply/list";
import { useBookCategories } from "../../store/book/categories";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";
import Approval from "./approval/index";
import CustomTable from "./table";

const PurchaseApplies = () => {
  const me = useRecoilValue(useMe);
  const setBookCategory = useSetRecoilState(useBookCategories);
  const [selectedInitPurchaseApply, setSelectedInitPurchaseApply] = React.useState<PurchaseApply>();
  const [selectedEditPurchaseApply, setSelectedEditPurchaseApply] = React.useState<PurchaseApply>();
  const [approvalOpen, setApprovalOpen] = React.useState<boolean>(false);
  const [openInitConfirm, setOpenInitConfirm] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [initializing, setInitializing] = React.useState<boolean>(false);
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

  if (loading || error || initializing) return <Spinner />;

  const handleEdit = (e: { stopPropagation: any }, purchaseApply: any) => {
    e.stopPropagation();
    setSelectedEditPurchaseApply(purchaseApply);
    setApprovalOpen(true);
  };

  const handleInitClick = (purchaseApply: PurchaseApply) => {
    setOpenInitConfirm(true);
    setSelectedInitPurchaseApply(purchaseApply);
  };

  const handleInit = () => {
    if (!selectedInitPurchaseApply) {
      return;
    }
    setInitializing(true);
    InitBookPurchase(me.clientId, selectedInitPurchaseApply.book.id, {
      apiToken: me.apiToken,
    })
      .then(() => {
        enqueueSnackbar("申請却下を取り消しました", { variant: "success" });
        setInitializing(false);
        setOpenInitConfirm(false);
        mutate(`${Config.apiOrigin}/api/${me.clientId}/user/list`);
      })
      .catch(() => {
        enqueueSnackbar(`エラーが発生しました`, { variant: "error" });
        setInitializing(false);
        setOpenInitConfirm(false);
      });
  };

  return (
    <>
      <ConfirmDialog
        message={"申請却下を取り消しますか？"}
        open={openInitConfirm}
        onClose={() => setOpenInitConfirm(false)}
        handleSubmit={handleInit}
      />
      {selectedEditPurchaseApply && (
        <Approval
          canNotification={response.slackCredentialExists}
          purchaseApply={selectedEditPurchaseApply}
          open={approvalOpen}
          onClose={() => setApprovalOpen(false)}
          onSuccess={() => mutate(`${Config.apiOrigin}/api/${me.clientId}/user/list`)}
        />
      )}
      <CustomTable bookPurchaseApplies={response.bookPurchaseApplies} handleEdit={handleEdit} handleInit={handleInitClick} />
    </>
  );
};

export default PurchaseApplies;
