import { useCallback, useEffect, useState } from "react";
import { createChangeHandler } from "../../util/createOnChangeHandler";
import { addNewCase, CaseState, CaseType } from "../../store/Slice/case.slice";
import { AppDispatch } from "../../store/store";
import { ClientType } from "../../store/Slice/client.slice";

const initialCaseInput: CaseType = {
  concern: "",
  description: "",
  paid: "no",
  status: "ongiong",
  client_name: "",
  consultation_date: null,
};

const initialClientInput: ClientType = {
  client_name: "",
  address: "",
  contact_number: null,
  email: "",
};

export const useAddNewConsultCase = (
  dispatch: AppDispatch,
  caseState: CaseState
) => {
  const [newCaseInput, setNewCaseInput] = useState<CaseType>(initialCaseInput);
  const [newClientInput, setNewClientInput] =
    useState<ClientType>(initialClientInput);

  const [isAddNewCaseModal, setIsAddNewCaseModal] = useState(false);
  const [dateForm, setDateForm] = useState({
    consultationDate: "",
    contultationTime: "",
  });

  const onCaseChangeInput = createChangeHandler<CaseType>(setNewCaseInput);
  const onClientChangeInput =
    createChangeHandler<ClientType>(setNewClientInput);

  const openAddNewCaseModal = () => {
    setIsAddNewCaseModal(true);
  };

  const closeAddNewCaseModal = () => {
    setIsAddNewCaseModal(false);
    setNewCaseInput(initialCaseInput);
    setNewClientInput(initialClientInput);
  };

  const getObjectDateTime = useCallback(() => {
    const consultationDate = `${dateForm.consultationDate}T${
      dateForm.contultationTime || "00:00"
    }:00`;

    return new Date(consultationDate);
  }, [dateForm]);

  const onSubmit = async () => {
    try {
      await dispatch(
        addNewCase({
          clientData: newClientInput,
          caseData: {
            ...newCaseInput,
            consultation_date: getObjectDateTime(),
            client_name: newClientInput.client_name,
          },
        })
      ).unwrap();

      closeAddNewCaseModal();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    newCaseInput,
    isAddNewCaseModal,
    openAddNewCaseModal,
    closeAddNewCaseModal,
    onCaseChangeInput,
    onClientChangeInput,
    onSubmit,
    addLoading: caseState.addLoading,
    setDateForm,
    newClientInput,
    dateForm,
  };
};
