import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { useToast } from "../../useToast";
import { caseApi } from "../../../util/api/case.api";
import { updateCaseData } from "../../../store/Slice/case.slice";

export type MarkPaidCaseDetialsType = {
  caseId: string;
  clientName: string;
  concern: string;
};

const useMarkPaidModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { promiseToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const [caseDetails, setCaseDetails] = useState<
    MarkPaidCaseDetialsType | undefined
  >(undefined);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const open = (payload: MarkPaidCaseDetialsType) => {
    setCaseDetails(payload);
    setIsOpen(true);
  };

  const close = () => {
    setCaseDetails(undefined);
    setIsOpen(false);
  };

  const onConfirm = useCallback(async () => {
    if (!caseDetails) return;

    await promiseToast(
      async () => {
        setConfirmLoading(true);
        await caseApi.markAsPaid(caseDetails.caseId);
        dispatch(
          updateCaseData({ id: caseDetails.caseId, updates: { paid: "paid" } })
        );
      },
      {
        loading: "Marking case paid",
        success: () => {
          close();
          setConfirmLoading(false);
          return "Case successfully set to paid";
        },
        error: (err) =>
          `Failed to send request: ${
            err || "Something went wrong. Please try again."
          }`,
      }
    );
  }, [caseDetails]);

  return {
    isOpen,
    open,
    close,
    confirmLoading,
    onConfirm,
    caseDetails,
  };
};

export default useMarkPaidModal;
