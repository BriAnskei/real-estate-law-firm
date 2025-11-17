import { useState } from "react";
import { AppDispatch } from "../../store/store";
import { deleteCase } from "../../store/Slice/case.slice";
import { useToast } from "../useToast";

export const useDeleteCase = (dispatch: AppDispatch) => {
  const { successToast } = useToast();
  const [isCaseDeleteOpen, setIsCaseDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [caseDetials, setCaseDetials] = useState<
    { caseId: string; concern: string } | undefined
  >(undefined);

  const onConfirm = async () => {
    try {
      setIsDeleting(true);
      const caseId = caseDetials?.caseId;

      if (!caseId) throw new Error("No selected case id to delete");

      await dispatch(deleteCase(caseId));
      successToast("Case successfully deleted");
      closeDeleteCase();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteCase = (payload: { caseId: string; concern: string }) => {
    setIsCaseDeleteOpen(true);
    setCaseDetials(payload);
  };

  const closeDeleteCase = () => {
    setIsCaseDeleteOpen(false);
    setCaseDetials(undefined);
  };

  return {
    isDeleting,
    onConfirm,
    caseDetials,
    openDeleteCase,
    closeDeleteCase,
    isCaseDeleteOpen,
  };
};
