import { useCallback, useState } from "react";
import { createChangeHandler } from "../../util/createOnChangeHandler";
import { addNewCase, CaseType, updateCase } from "../../store/Slice/case.slice";
import { AppDispatch } from "../../store/store";
import {
  ClientFormType,
  fetchClientById,
} from "../../store/Slice/client.slice";
import { useToast } from "../useToast";

const initialCaseInput: CaseType = {
  concern: "",
  description: "",
  paid: "no",
  status: "ongiong",
  client_name: "",
  consultation_date: "",
};

const initialClientInput: ClientFormType = {
  client_name: "",
  address: "",
  contact_number: null,
  email: "",
};

export const useCaseFormModal = (
  dispatch: AppDispatch,
  addLoading: boolean
) => {
  const { successToast } = useToast();

  // modal opner hook
  const [isCaseFormModal, setIsCaseFormModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // new case state
  const [newCaseInput, setNewCaseInput] = useState<CaseType>(initialCaseInput);
  const [newClientInput, setNewClientInput] =
    useState<ClientFormType>(initialClientInput);

  // edit case state
  const [selectedCase, setSelectedCase] = useState<CaseType | undefined>(
    undefined
  );
  const [selectedClient, setSelectedClient] = useState<
    ClientFormType | undefined
  >(undefined);
  const [fetchingClient, setFetchingClient] = useState(false);

  // reusable date/time state
  const [dateForm, setDateForm] = useState({
    consultationDate: "",
    contultationTime: "",
  });

  // on change handlers
  const onCaseChangeInput = createChangeHandler<CaseType>(
    !selectedCase
      ? setNewCaseInput
      : (setSelectedCase as React.Dispatch<React.SetStateAction<CaseType>>)
  );
  const onClientChangeInput = createChangeHandler<ClientFormType>(
    !selectedClient
      ? setNewClientInput
      : (setSelectedClient as React.Dispatch<
          React.SetStateAction<ClientFormType>
        >)
  );

  // modal functions
  const openCaseFormModal = (selectedCase?: CaseType) => {
    if (selectedCase) {
      setEditCaseData(selectedCase);
    }

    setIsCaseFormModal(true);
  };

  const closeCaseFormModal = () => {
    setIsCaseFormModal(false);
    setNewCaseInput(initialCaseInput);
    setNewClientInput(initialClientInput);

    setSelectedCase(undefined);
    setSelectedClient(undefined);
    setDateForm((prev) => ({
      ...prev,
      consultationDate: "",
      contultationTime: "",
    }));
  };

  const setEditCaseData = async (selectedCase: CaseType) => {
    try {
      setFetchingClient(true);
      setSelectedCase(selectedCase);

      // setSelectedClient
      const fetchedClient = await dispatch(
        fetchClientById(selectedCase.client_id!)
      ).unwrap();

      setSelectedClient(fetchedClient);

      const date = new Date(selectedCase.consultation_date);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      // Format as readable strings for the consultation input
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      setDateForm((prev) => ({
        ...prev,
        consultationDate: formattedDate,
        contultationTime: formattedTime,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingClient(false);
    }
  };

  const decodeDateTimeInput = useCallback(() => {
    // Build a literal string, not a Date object
    return `${dateForm.consultationDate} ${
      dateForm.contultationTime || "00:00"
    }:00`;
  }, [dateForm]);

  const onNewCaseSubmit = async () => {
    try {
      setIsSubmitting(true);
      await dispatch(
        addNewCase({
          clientData: newClientInput,
          caseData: {
            ...newCaseInput,
            consultation_date: decodeDateTimeInput(),
            client_name: newClientInput.client_name,
          },
        })
      ).unwrap();
      successToast("Case successfully added");
      closeCaseFormModal();
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onEditCaseSubmit = async () => {
    try {
      setIsSubmitting(true);
      await dispatch(
        updateCase({
          id: selectedCase?.id!,
          caseUpdate: {
            ...selectedCase!,
            consultation_date: decodeDateTimeInput(),
            client_name: selectedClient?.client_name,
          },
          clientUpdate: selectedClient!,
        })
      ).unwrap();
      successToast("Case successfully updated");
      closeCaseFormModal();
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const mode: "edit" | "new" = selectedCase ? "edit" : "new";

  return {
    caseInputValue: selectedCase ?? newCaseInput,
    clientInputValue: selectedClient ?? newClientInput,
    isCaseFormModal,
    openCaseFormModal,
    closeCaseFormModal,
    onCaseChangeInput,
    onClientChangeInput,
    onNewCaseSubmit,
    addLoading: addLoading || isSubmitting,
    setDateForm,
    mode,
    onEditCaseSubmit,
    dateForm,

    fetchingClient,
  };
};
