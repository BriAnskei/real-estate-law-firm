import { useViewConsultCaseModal } from "./useViewConsultCaseModal";

import { useAddNewConsultCase } from "./useAddNewConsultCaseModal";

export const useCases = () => {
  const viewCaseModalState = useViewConsultCaseModal();
  const addNewCaseModalState = useAddNewConsultCase();

  return {
    viewCaseModalState,
    addNewCaseModalState,
  };
};
