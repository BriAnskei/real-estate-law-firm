import { useState } from "react";
import { createChangeHandler } from "../../util/createOnChangeHandler";

export const useAddNewConsultCase = () => {
  const [newCaseInput, setNewCaseInput] = useState<any>(null);
  const [isAddNewCaseModal, setIsAddNewCaseModal] = useState(false);

  const newCaseOnChnangeInput = createChangeHandler<any>(setNewCaseInput);

  const openAddNewCaseModal = () => {
    setIsAddNewCaseModal(true);
  };

  const closeAddNewCaseModal = () => {
    setIsAddNewCaseModal(false);
  };

  return {
    newCaseInput,
    isAddNewCaseModal,
    openAddNewCaseModal,
    closeAddNewCaseModal,
    newCaseOnChnangeInput,
  };
};
