import { useCallback, useEffect, useState } from "react";
import { createChangeHandler } from "../../util/createOnChangeHandler";
import { addNewCase, CaseType, updateCase } from "../../store/Slice/case.slice";
import { AppDispatch, RootState } from "../../store/store";
import {
  ClientFormType,
  fetchClientById,
} from "../../store/Slice/client.slice";
import { useToast } from "../useToast";
import { useSelector } from "react-redux";
import {
  decodeInputDateAndTimeToDate,
  formatDateToDateInputString,
} from "../../util/DateDecoder";

const initialCaseInput: CaseType = {
  concern: "",
  opposing_party: "",
  description: "",
  paid: "no",
  status: "ongoing",
  client_name: "",
  consultation_date: "",
};

const initialClientInput: ClientFormType = {
  client_name: "",
  address: "",
  contact_number: null,
  email: "",
};

export const useCaseFormModal = (dispatch: AppDispatch) => {
  const addLoading = useSelector((state: RootState) => state.case.addLoading);
  const { successToast, errorToast } = useToast();

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

      const { formattedDate, formattedTime } = formatDateToDateInputString(
        selectedCase.consultation_date
      );

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

  const onNewCaseSubmit = async () => {
    try {
      const check = validateCaseForm();
      if (!check.valid) return errorToast(check.message);

      setIsSubmitting(true);
      await dispatch(
        addNewCase({
          clientData: newClientInput,
          caseData: {
            ...newCaseInput,
            consultation_date: decodeInputDateAndTimeToDate(
              dateForm.consultationDate,
              dateForm.contultationTime
            ),
            client_name: newClientInput.client_name,
          },
        })
      ).unwrap();
      setIsSubmitting(false);
      successToast("Case successfully added");
      closeCaseFormModal();
    } catch (error) {
      console.error(error);
    }
  };

  const onEditCaseSubmit = async () => {
    try {
      const check = validateCaseForm();
      if (!check.valid) return errorToast(check.message);

      setIsSubmitting(true);
      await dispatch(
        updateCase({
          id: selectedCase?.id!,
          caseUpdate: {
            ...selectedCase!,
            consultation_date: decodeInputDateAndTimeToDate(
              dateForm.consultationDate,
              dateForm.contultationTime
            ),
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

  const validateCaseForm = newFunction(
    selectedCase,
    newCaseInput,
    selectedClient,
    newClientInput,
    dateForm
  );

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

function newFunction(
  selectedCase: CaseType | undefined,
  newCaseInput: CaseType,
  selectedClient: ClientFormType | undefined,
  newClientInput: ClientFormType,
  dateForm: { consultationDate: string; contultationTime: string }
) {
  return useCallback(() => {
    const caseData = selectedCase ?? newCaseInput;
    const clientData = selectedClient ?? newClientInput;

    // --- 1. Check required client fields ---
    if (
      !clientData.client_name.trim() ||
      !clientData.client_name.trim() ||
      !clientData.address.trim() ||
      !clientData.email.trim() ||
      clientData.contact_number === null
    ) {
      return { valid: false, message: "Please fill in all client fields." };
    }

    // --- 2. Check required case fields ---
    if (
      !caseData.concern.trim() ||
      !caseData.description.trim() ||
      !caseData.opposing_party.trim()
    ) {
      return { valid: false, message: "Please fill in all case fields." };
    }

    // --- 3. Check date and time selections ---
    if (!dateForm.consultationDate || !dateForm.contultationTime) {
      return {
        valid: false,
        message: "Please select consultation date and time.",
      };
    }

    // Build date for comparison
    const combinedDate = new Date(
      `${dateForm.consultationDate} ${dateForm.contultationTime}`
    );

    if (isNaN(combinedDate.getTime())) {
      return { valid: false, message: "Invalid consultation date/time." };
    }

    const now = new Date();
    if (combinedDate < now) {
      return {
        valid: false,
        message: "Consultation date/time cannot be in the past.",
      };
    }

    return { valid: true, message: "" };
  }, [newCaseInput, newClientInput, selectedCase, selectedClient, dateForm]);
}
