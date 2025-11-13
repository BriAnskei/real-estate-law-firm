import { useState } from "react";
import { createChangeHandler } from "../../util/createOnChangeHandler";
import { addNewCase, CaseType } from "../../store/Slice/case.slice";
import { AppDispatch } from "../../store/store";

const initialInput: CaseType = {
  client_id: "",
  concern: "",
  description: "",
  paid: "no",
  status: "ongiong",
};

export const useAddNewConsultCase = (dispatch: AppDispatch) => {
  const [newCaseInput, setNewCaseInput] = useState<CaseType>(initialInput);
  const [isAddNewCaseModal, setIsAddNewCaseModal] = useState(false);

  const newCaseOnChnangeInput = createChangeHandler<any>(setNewCaseInput);

  const openAddNewCaseModal = () => {
    setIsAddNewCaseModal(true);
  };

  const closeAddNewCaseModal = () => {
    setIsAddNewCaseModal(false);
  };

  const onSubmit = async () => {
    try {
      dispatch(addNewCase(newCaseInput)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const caseOnChangeHanlder = createChangeHandler<CaseType>(setNewCaseInput);

  return {
    newCaseInput,
    isAddNewCaseModal,
    openAddNewCaseModal,
    closeAddNewCaseModal,
    newCaseOnChnangeInput,
    onSubmit,
    caseOnChangeHanlder,
  };
};
