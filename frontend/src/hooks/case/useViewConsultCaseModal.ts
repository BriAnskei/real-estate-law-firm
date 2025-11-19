import { useCallback, useEffect, useState } from "react";
import { useToast } from "../useToast";
import { AppDispatch } from "../../store/store";
import { CaseType, markCaseAsOngoing } from "../../store/Slice/case.slice";

export const useViewConsultCaseModal = (dispatch: AppDispatch) => {
  const { errorToast, promiseToast } = useToast();
  const [isViewConsultCaseModalOpen, setIsViewConsultCaseModalOpen] =
    useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseType | undefined>(
    undefined
  );

  // payment inputs
  const [paymentType, setPaymentType] = useState("");
  const [promiseToPayDate, setPromiseToPayDate] = useState("");

  const openViewConsultCaseModal = useCallback((selectedCase: any) => {
    setSelectedCase(selectedCase);
    setIsViewConsultCaseModalOpen(true);
  }, []);

  const closeViewConsultCaseModal = useCallback(() => {
    setSelectedCase(undefined);
    setIsViewConsultCaseModalOpen(false);
  }, []);

  const confirmCase = useCallback(async () => {
    if (!paymentType) {
      return errorToast("Please select a payment type");
    }

    if (paymentType === "partial" && !promiseToPayDate) {
      return errorToast(
        "Please select a promise to pay date for partial payment"
      );
    }

    if (promiseToPayDate) {
      const inputDate = new Date(promiseToPayDate);
      const now = new Date();
      if (inputDate < now) {
        return errorToast("Promise to pay cannot be in the past.");
      }
    }

    await promiseToast(
      async () => {
        await dispatch(
          markCaseAsOngoing({
            id: selectedCase?.id!,
            paymentMode: paymentType,
            promiseToPay: promiseToPayDate,
          })
        );
      },
      {
        loading: "Processing...",
        success: () => {
          closeViewConsultCaseModal();
          return "Processing complete. The case is now marked as ongoing.";
        },
        error: (err) =>
          `Failed to register: ${
            err || "Something went wrong. Please try again."
          }`,
      }
    );
  }, [paymentType, promiseToPayDate]);

  return {
    openViewConsultCaseModal,
    closeViewConsultCaseModal,
    selectedCase,
    isViewConsultCaseModalOpen,
    confirmCase,
    paymentType,
    setPaymentType,
    promiseToPayDate,
    setPromiseToPayDate,
  };
};
