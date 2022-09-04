import { useSnackbar } from "notistack";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { BookPurchaseAppliesListResponse } from "../../../api_client";
import InitBookPurchase from "../../api/book/purchase_apply/init";
import ApiClient from "../../lib/apiClient";
import { useChoseClient } from "../../store/choseClient";
import { useMe } from "../../store/me";
import ConfirmDialog from "../parts/confirm_dialog";
import Spinner from "../parts/spinner";
import Approval from "./approval/index";
import CustomTable from "./table";

const PurchaseApplies = () => {
  const me = useRecoilValue(useMe);
  const choseClient = useRecoilValue(useChoseClient);
  const [selectedInitPurchaseApply, setSelectedInitPurchaseApply] = React.useState<PurchaseApply>();
  const [selectedEditPurchaseApply, setSelectedEditPurchaseApply] = React.useState<PurchaseApply>();
  const [approvalOpen, setApprovalOpen] = React.useState<boolean>(false);
  const [openInitConfirm, setOpenInitConfirm] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState<null | BookPurchaseAppliesListResponse>(null);

  const fetchPurchaseApplies = () => {
    setLoading(true);
    ApiClient(me.apiToken)
      .apiClientIdBookPurchaseAppliesGet(choseClient.clientId)
      .then((res) => {
        setLoading(false);
        setResponse(res.data);
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("エラーが発生しました", { variant: "error" });
      });
  };

  React.useEffect(() => {
    fetchPurchaseApplies();
  }, [choseClient]);

  if (loading || !response) return <Spinner />;

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
    setLoading(true);
    InitBookPurchase(choseClient.clientId, selectedInitPurchaseApply.book.id, {
      apiToken: me.apiToken,
    })
      .then(() => {
        enqueueSnackbar("申請却下を取り消しました", { variant: "success" });
        setLoading(false);
        setOpenInitConfirm(false);
        fetchPurchaseApplies();
      })
      .catch(() => {
        enqueueSnackbar(`エラーが発生しました`, { variant: "error" });
        setLoading(false);
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
          onSuccess={() => fetchPurchaseApplies()}
        />
      )}
      <CustomTable bookPurchaseApplies={response.bookPurchaseApplies} handleEdit={handleEdit} handleInit={handleInitClick} />
    </>
  );
};

export default PurchaseApplies;
